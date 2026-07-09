/**
 * Construct the correct cookie URL for chrome.cookies operations based on domain and path.
 * @param {chrome.cookies.Cookie} cookie
 * @param {string} tabUrl
 * @returns {string}
 */
function getCookieUrl(cookie, tabUrl) {
  const protocol = tabUrl.startsWith('https') ? 'https://' : 'http://';
  const domain = cookie.domain.startsWith('.') ? cookie.domain.substring(1) : cookie.domain;
  return `${protocol}${domain}${cookie.path}`;
}

/**
 * Fetch all storage items (local, session, cookies) for the active tab.
 * @param {chrome.tabs.Tab} tab
 * @returns {Promise<Array<object>>}
 */
export async function fetchAllStorage(tab) {
  if (!tab || !tab.id || !tab.url) {
    throw new Error('No active tab found');
  }

  // Reject internal browser pages
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
    throw new Error('Restricted Page');
  }

  const items = [];

  // 1. Fetch Local & Session Storage via content script injection
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const local = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          local[k] = localStorage.getItem(k) || '';
        }
        
        const session = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          session[k] = sessionStorage.getItem(k) || '';
        }
        
        return { local, session };
      }
    });

    if (result) {
      // Local Storage processing
      Object.entries(result.local).forEach(([key, val]) => {
        const valStr = typeof val === 'string' ? val : JSON.stringify(val);
        items.push({
          key,
          value: valStr,
          type: 'Local Storage',
          size: new Blob([valStr]).size
        });
      });

      // Session Storage processing
      Object.entries(result.session).forEach(([key, val]) => {
        const valStr = typeof val === 'string' ? val : JSON.stringify(val);
        items.push({
          key,
          value: valStr,
          type: 'Session Storage',
          size: new Blob([valStr]).size
        });
      });
    }
  } catch (err) {
    console.warn('Script execution blocked or failed on this tab:', err);
    // Continue fetching cookies even if script execution fails (some pages might block scripting but allow cookie reading)
  }

  // 2. Fetch Cookies
  try {
    const cookiesList = await chrome.cookies.getAll({ url: tab.url });
    cookiesList.forEach(cookie => {
      items.push({
        key: cookie.name,
        value: cookie.value,
        type: 'Cookie',
        size: new Blob([cookie.value]).size,
        extra: {
          domain: cookie.domain,
          path: cookie.path,
          storeId: cookie.storeId
        }
      });
    });
  } catch (err) {
    console.error('Failed to retrieve cookies:', err);
  }

  return items;
}

/**
 * Delete a single storage item.
 * @param {chrome.tabs.Tab} tab
 * @param {object} item
 * @returns {Promise<void>}
 */
export async function deleteStorageItem(tab, item) {
  if (!tab || !tab.id) return;

  if (item.type === 'Local Storage' || item.type === 'Session Storage') {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (storageType, itemKey) => {
        if (storageType === 'Local Storage') {
          localStorage.removeItem(itemKey);
        } else {
          sessionStorage.removeItem(itemKey);
        }
      },
      args: [item.type, item.key]
    });
  } else if (item.type === 'Cookie') {
    const cookieUrl = getCookieUrl({
      domain: item.extra.domain,
      path: item.extra.path
    }, tab.url);

    await chrome.cookies.remove({
      url: cookieUrl,
      name: item.key,
      storeId: item.extra.storeId
    });
  }
}

/**
 * Clear an entire storage medium.
 * @param {chrome.tabs.Tab} tab
 * @param {'local' | 'session' | 'cookies'} type
 * @returns {Promise<void>}
 */
export async function clearAll(tab, type) {
  if (!tab || !tab.id || !tab.url) return;

  if (type === 'local' || type === 'session') {
    const targetStorage = type === 'local' ? 'Local Storage' : 'Session Storage';
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (storageType) => {
        if (storageType === 'Local Storage') {
          localStorage.clear();
        } else {
          sessionStorage.clear();
        }
      },
      args: [targetStorage]
    });
  } else if (type === 'cookies') {
    const cookiesList = await chrome.cookies.getAll({ url: tab.url });
    const deletePromises = cookiesList.map(cookie => {
      const cookieUrl = getCookieUrl(cookie, tab.url);
      return chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId
      });
    });
    await Promise.all(deletePromises);
  }
}

/**
 * Import and write state data into client-side storage.
 * @param {chrome.tabs.Tab} tab
 * @param {object} parsedData
 * @returns {Promise<{localCount: number, sessionCount: number, skippedCookies: number}>}
 */
export async function importStorage(tab, parsedData) {
  if (!tab || !tab.id) throw new Error('No active tab target');

  let localCount = 0;
  let sessionCount = 0;
  let skippedCookies = 0;

  if (Array.isArray(parsedData)) {
    for (const item of parsedData) {
      if (!item.key || item.value === undefined) continue;

      if (item.type === 'Local Storage' || item.type === 'Session Storage') {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (type, k, v) => {
            if (type === 'Local Storage') {
              localStorage.setItem(k, v);
            } else {
              sessionStorage.setItem(k, v);
            }
          },
          args: [item.type, item.key, item.value]
        });
        if (item.type === 'Local Storage') localCount++;
        else sessionCount++;
      } else if (item.type === 'Cookie') {
        skippedCookies++;
      }
    }
  }

  return { localCount, sessionCount, skippedCookies };
}
