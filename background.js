let activeTimes = {};
let currentTabId = null;
let currentActivationTime = null;

function updateActiveTime() {
    if (currentTabId !== null) {
        browser.tabs.get(currentTabId).then(tab => {
            const url = new URL(tab.url).hostname; // storing data by domain
            const now = Date.now();
            const timeSpent = now - currentActivationTime;
            
            if (!activeTimes[url]) {
                activeTimes[url] = 0;
            }

            activeTimes[url] += timeSpent;

            // Updating the current activation time for continuous tracking
            currentActivationTime = now;

            // Optionally, you can persist the data here or do it periodically
            browser.storage.local.set({ activeTimes: activeTimes });

            console.log(activeTimes);
        });
    }
}

browser.tabs.onActivated.addListener(activeInfo => {
    // Update time for the tab that was just deactivated
    updateActiveTime();

    // Set the new active tab
    currentTabId = activeInfo.tabId;
    currentActivationTime = Date.now();
});

// Handling window focus changes
browser.windows.onFocusChanged.addListener(windowId => {
    if (windowId === browser.windows.WINDOW_ID_NONE) {
        // Browser lost focus, update time for the current tab
        updateActiveTime();
    } else {
        // Browser got focus, set the activation time to now
        currentActivationTime = Date.now();
    }
});

// On startup, load saved data
browser.storage.local.get("activeTimes").then(data => {
    if (data.activeTimes) {
        activeTimes = data.activeTimes;
    }
});
