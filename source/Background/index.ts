import 'emoji-log';
import {browser} from 'webextension-polyfill-ts';

console.log('Background script running');

browser.browserAction.onClicked.addListener((tab) => {
  if (tab.id === undefined) return;
  console.log('button clicked');
  browser.tabs.sendMessage(tab.id, {action: 'toggleSidebar'});
});
