// Popup script for Cat-ify Chrome Extension

document.addEventListener("DOMContentLoaded", async () => {
  const toggleStateInput = document.getElementById("toggleState");
  const statusTextSpan = document.getElementById("statusText");
  const refreshBtn = document.getElementById("refreshBtn");
  const refreshIcon = refreshBtn.querySelector(".btn-icon");

  // Helper to retrieve the current active tab
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  const activeTab = await getActiveTab();
  if (!activeTab) return;

  const tabId = activeTab.id;
  const storageKey = `tab_state_${tabId}`;

  // Read initial state
  chrome.storage.local.get([storageKey], (result) => {
    // Default to enabled (true) if not set
    const isEnabled = result[storageKey] !== undefined ? result[storageKey] : true;
    toggleStateInput.checked = isEnabled;
    updateStatusUI(isEnabled);
  });

  // Handle status toggle changes
  toggleStateInput.addEventListener("change", () => {
    const isEnabled = toggleStateInput.checked;
    
    // Save to storage
    chrome.storage.local.set({ [storageKey]: isEnabled }, () => {
      updateStatusUI(isEnabled);

      // Send state update to content script on the tab
      chrome.tabs.sendMessage(tabId, { action: "toggleState", enabled: isEnabled }, (response) => {
        // If content script wasn't ready/loaded yet, handle error silently
        if (chrome.runtime.lastError) {
          console.log("Content script not active on this page yet.");
        }
      });
    });
  });

  // Handle refresh cats button click
  refreshBtn.addEventListener("click", () => {
    // Trigger CSS spin transition manually
    refreshIcon.style.transform = "rotate(360deg)";
    setTimeout(() => {
      refreshIcon.style.transform = "";
    }, 400);

    // Send reload command to content script
    chrome.tabs.sendMessage(tabId, { action: "refreshCats" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Cannot refresh cats: content script not active.");
      }
    });
  });

  // Update Status labels
  function updateStatusUI(isEnabled) {
    if (isEnabled) {
      statusTextSpan.textContent = "Active";
      statusTextSpan.className = "status-value enabled";
      refreshBtn.disabled = false;
      refreshBtn.style.opacity = "1";
      refreshBtn.style.cursor = "pointer";
    } else {
      statusTextSpan.textContent = "Inactive";
      statusTextSpan.className = "status-value disabled";
      refreshBtn.disabled = true;
      refreshBtn.style.opacity = "0.5";
      refreshBtn.style.cursor = "not-allowed";
    }
  }
});
