console.log('helloworld from content script');

const sidebarRoot = document.createElement('div');
sidebarRoot.id = 'sidebar-root';
sidebarRoot.classList.add('transition-all', 'transform'); // Add transition and transform
document.body.appendChild(sidebarRoot);

let scriptLoaded = false; // flag to check if script is loaded

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleSidebar') {
    if (!scriptLoaded) {
      console.log('toggleSidebar message received');
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('js/sidebar.bundle.js');
      document.body.appendChild(script);
      scriptLoaded = true;
    } else {
      // Toggle the visibility of the sidebar
      window.postMessage({action: 'toggleSidebarOpen'}, '*');
      const sidebar = document.getElementById('sidebar-root');
      if (sidebar) {
        if (sidebar.style.display === 'none') {
          sidebar.style.display = 'block';
        } else {
          sidebar.style.display = 'none';
        }
      }
    }
  }
});

export {};
