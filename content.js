// Initial setup
chrome.storage.sync.get(['itemsPerRow'], function (result) {
  updateGridLayout(result.itemsPerRow || 4);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateGrid') {
    updateGridLayout(request.itemsPerRow);
  }
});

// Function to update the grid layout
function updateGridLayout(itemsPerRow) {
  const style = document.createElement('style');
  style.id = 'yt-grid-customizer';

  // Remove any existing custom styles
  const existingStyle = document.getElementById('yt-grid-customizer');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Calculate the percentage widths
  const videoPercentageWidth = (100 / itemsPerRow) + '%';

  /* setTimeout(() => {
    const sideBarWidth = document.getElementsByTagName('tp-yt-app-drawer')?.[0]?.clientWidth;
    const miniSidebarWidth = document.getElementsByTagName('ytd-mini-guide-renderer')[0].clientWidth;

    const isSidebarOpened = document.getElementsByTagName('tp-yt-app-drawer')?.[0]?.opened;
    const sidebarStyles = document.createElement('style');
    sidebarStyles.id = 'yt-sider-customizer';
    sidebarStyles.textContent = `
      ytd-page-manager {
        margin-left: ${isSidebarOpened ? sideBarWidth : miniSidebarWidth}px !important;
      }
      tp-yt-app-drawer,
      ytd-mini-guide-renderer {
        background-color: var(--yt-spec-base-background);
      }
    `;
    document.head.appendChild(sidebarStyles);
  }, 1000) */

  style.textContent = `
    ytd-rich-item-renderer:not([is-slim-grid]) {
      width: ${videoPercentageWidth} !important;
      max-width: ${videoPercentageWidth} !important;
      min-width: ${videoPercentageWidth} !important;
    }
  `;

  document.head.appendChild(style);
}

// Observe DOM changes to handle dynamic loading
const observer = new MutationObserver(function (mutations) {
  chrome.storage.sync.get(['itemsPerRow'], function (result) {
    updateGridLayout(result.itemsPerRow || 4);
  });
});

// Start observing once the content is loaded
document.addEventListener('DOMContentLoaded', function () {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
