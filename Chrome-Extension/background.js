// Background Service Worker for Cat-ify Chrome Extension

// Listen for tab closure to clean up its configuration and state
chrome.tabs.onRemoved.addListener((tabId) => {
  const key = `tab_state_${tabId}`;
  chrome.storage.local.remove(key);
});

// Handle messages from content scripts and popup UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabState") {
    // If sent from a tab's content script, determine its ID
    const tabId = sender.tab ? sender.tab.id : null;
    if (!tabId) {
      sendResponse({ enabled: false });
      return true;
    }

    const key = `tab_state_${tabId}`;
    chrome.storage.local.get([key], (result) => {
      // Default to enabled (true) if never configured before
      const isEnabled = result[key] !== undefined ? result[key] : true;
      sendResponse({ enabled: isEnabled });
    });

    return true; // Keep message channel open for asynchronous response
  }
});
