import {browser} from 'webextension-polyfill-ts';

console.log('helloworld from content script');

// Listen for messages from page context
window.addEventListener(
  'message',
  (event) => {
    // We only accept messages from ourselves
    if (event.source !== window) return;

    if (event.data.type && event.data.type === 'FROM_PAGE') {
      // Send message to popup script
      browser.runtime.sendMessage({g_ck: event.data.text});
    }
  },
  false
);

// Inject script into the page
const script = document.createElement('script');
script.textContent = `
    window.postMessage({
      type: 'FROM_PAGE',
      text: window.g_ck
    }, '*');
  `;
(document.head || document.documentElement).appendChild(script);
script.remove();

export {};
