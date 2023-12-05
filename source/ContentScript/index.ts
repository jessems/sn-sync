import {browser} from 'webextension-polyfill-ts';

console.log('helloworld from content script');

const sidebarRoot = document.createElement('div');
sidebarRoot.id = 'sidebar-root';
document.body.appendChild(sidebarRoot);

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleSidebar') {
    console.log('toggleSidebar message received');
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/sidebar.bundle.js');
    document.body.appendChild(script);
  }
});

export {};
