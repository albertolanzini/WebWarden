document.getElementById('toggleButton').addEventListener('click', function() {
    // Send a message to the background script to toggle the extension
    chrome.runtime.sendMessage({command: "toggle"});
});