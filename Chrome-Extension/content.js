// Content script for Cat-ify Chrome Extension

(function () {
  let isEnabled = false;
  let observer = null;
  
  // A local cache of cat image URLs to assign to web page images
  let catImagePool = [];
  let isFetchingPool = false;

  // Modern SVG placeholder for loading state
  const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" style="background-color:%23f3f4f6;"><rect width="100%" height="100%" fill="%23e5e7eb"/><path fill="%239ca3af" d="M30 60c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4s4 1.8 4 4v8c0 2.2-1.8 4-4 4zm40 0c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4s4 1.8 4 4v8c0 2.2-1.8 4-4 4zM50 72c-6.6 0-12-5.4-12-12 0-1.1.9-2 2-2s2 .9 2 2c0 4.4 3.6 8 8 8s8-3.6 8-8c0-1.1.9-2 2-2s2 .9 2 2c0 6.6-5.4 12-12 12zm25-32H25c-2.8 0-5-2.2-5-5s2.2-5 5-5c.6 0 1.2.1 1.7.3l8.6-13.8c.8-1.3 2.5-1.7 3.8-.9.7.4 1.1 1.2 1.2 2l2 11.2c1.7-.5 3.5-.8 5.7-.8s4 .3 5.7.8l2-11.2c.2-.8.6-1.6 1.2-2 1.3-.8 3-.4 3.8.9l8.6 13.8c.5-.2 1.1-.3 1.7-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5z"/></svg>`;

  // Primary API settings
  const CAT_APIS = [
    {
      url: 'https://api.thecatapi.com/v1/images/search?limit=25',
      parse: (data) => data.map(item => item.url)
    },
    {
      url: 'https://cataas.com/cat?json=true',
      parse: (data) => [ `https://cataas.com/cat/${data._id}` ]
    }
  ];

  // Secondary fallback URLs (static and reliable)
  const FALLBACK_CAT_IMAGES = [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=600&q=80'
  ];

  // Request the status of this tab from the background script
  chrome.runtime.sendMessage({ action: "getTabState" }, (response) => {
    // Silently ignore errors (e.g. service worker hasn't woken up yet)
    if (chrome.runtime.lastError) return;
    if (response && response.enabled) {
      enableCatification();
    }
  });

  // Listen for messages from background script or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleState") {
      if (message.enabled) {
        enableCatification();
      } else {
        disableCatification();
      }
      sendResponse({ status: "success" });
    } else if (message.action === "refreshCats") {
      if (isEnabled) {
        refreshAllImages(true);
      }
      sendResponse({ status: "refreshed" });
    }
  });

  // Enable the image replacement logic
  function enableCatification() {
    if (isEnabled) return;
    isEnabled = true;
    
    // Start tracking images and replace existing ones
    refreshAllImages(false);

    // Watch for dynamic DOM changes
    setupObserver();
  }

  // Disable replacement and restore original images
  function disableCatification() {
    if (!isEnabled) return;
    isEnabled = false;

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    restoreOriginalImages();
  }

  // Pre-fetch a pool of cat URLs
  async function fetchCatImages() {
    if (isFetchingPool) return;
    isFetchingPool = true;

    for (const api of CAT_APIS) {
      try {
        const res = await fetch(api.url);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        const urls = api.parse(data);
        if (urls && urls.length > 0) {
          catImagePool = [...catImagePool, ...urls];
          isFetchingPool = false;
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch from cat API, trying next source...", err);
      }
    }

    isFetchingPool = false;
  }

  // Retrieve one cat image from the pool, fetching more if empty
  async function getCatImageUrl() {
    if (catImagePool.length < 5) {
      // Fetch in background, don't await so we don't block
      fetchCatImages();
    }

    if (catImagePool.length > 0) {
      return catImagePool.shift();
    }

    // Secondary live fallback with timestamp cache-buster
    const cataasDirect = `https://cataas.com/cat?t=${Date.now()}-${Math.random()}`;
    return cataasDirect;
  }

  // Handle single image replacement
  async function replaceImage(img) {
    if (!isEnabled) return;
    
    // Skip if already processed or has our flags
    if (img.dataset.catified === "true" || img.src === PLACEHOLDER_SVG) return;

    // Avoid processing if it's already an inline SVG placeholder or a cat image we just set
    if (img.src && (img.src.startsWith('data:image/svg+xml') || img.src.includes('unsplash.com') || img.src.includes('cataas.com'))) {
      img.dataset.catified = "true";
      return;
    }

    // Save original src & srcset
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src || "";
    }
    if (img.srcset && !img.dataset.originalSrcset) {
      img.dataset.originalSrcset = img.srcset;
    }

    // Show inline loading placeholder first
    img.removeAttribute('srcset');
    img.src = PLACEHOLDER_SVG;
    img.dataset.catified = "true";

    try {
      const catUrl = await getCatImageUrl();
      
      // Create a temporary image object to preload the cat image and avoid flashing
      const loader = new Image();
      loader.onload = () => {
        if (isEnabled && img.dataset.catified === "true") {
          img.src = catUrl;
        }
      };
      loader.onerror = () => {
        // Fallback to static stable cat image URLs
        const randomFallback = FALLBACK_CAT_IMAGES[Math.floor(Math.random() * FALLBACK_CAT_IMAGES.length)];
        img.src = randomFallback;
      };
      loader.src = catUrl;

    } catch (err) {
      console.error("Error processing cat image:", err);
      // Revert to original if something completely fails
      revertSingleImage(img);
    }
  }

  // Process all images currently on the page
  // Snapshot the live HTMLCollection into a static array first so that DOM mutations
  // triggered by replaceImage don't affect the iteration order.
  function refreshAllImages(forceRefresh = false) {
    const images = Array.from(document.getElementsByTagName('img'));
    for (const img of images) {
      if (forceRefresh) {
        delete img.dataset.catified;
      }
      replaceImage(img);
    }
  }

  // Restore single image to its original state
  function revertSingleImage(img) {
    if (img.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
    }
    if (img.dataset.originalSrcset) {
      img.srcset = img.dataset.originalSrcset;
    } else {
      img.removeAttribute('srcset');
    }
    delete img.dataset.catified;
  }

  // Restore all images to their original state
  function restoreOriginalImages() {
    const images = document.getElementsByTagName('img');
    for (let img of images) {
      if (img.dataset.catified === "true") {
        revertSingleImage(img);
      }
    }
  }

  // Setup observer to detect newly added elements
  function setupObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      if (!isEnabled) return;
      
      for (const mutation of mutations) {
        // Process new nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
              replaceImage(node);
            } else {
              const nestedImages = node.getElementsByTagName('img');
              for (let img of nestedImages) {
                replaceImage(img);
              }
            }
          }
        });

        // Process attribute changes on existing images
        if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
          const img = mutation.target;
          // If the src changes and is not our placeholder or a cat image, re-catify
          if (img.dataset.catified === "true" && 
              img.src !== PLACEHOLDER_SVG && 
              !img.src.includes('cataas.com') && 
              !img.src.includes('unsplash.com') && 
              img.src !== img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
            replaceImage(img);
          }
        }
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
  }
})();
