document.addEventListener('DOMContentLoaded', function () {
  // Load saved values
  chrome.storage.sync.get(['itemsPerRow'], function (result) {
    document.getElementById('itemsPerRow').value = result.itemsPerRow || 4;
  });

  // Save new values when button is clicked
  document.getElementById('save').addEventListener('click', function () {
    const itemsPerRow = document.getElementById('itemsPerRow').value;
    chrome.storage.sync.set({
      itemsPerRow: parseInt(itemsPerRow),
    }, function () {
      // Notify content script to update the grid
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateGrid',
          itemsPerRow: parseInt(itemsPerRow),
        });
      });
    });
  });
});
