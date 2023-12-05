import * as React from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';

import './styles.scss';

// async function getToken(): Promise<string | null> {
//   const url =
//     'https://dev168935.service-now.com/sn_devstudio_/v1/get_publish_info.do';
//   const response = await fetch(url, {
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: 'BasicCustom',
//     },
//   });
//   const data = await response.json();

//   return data.ck as string | null;
// }

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

async function getCk(): Promise<string | null> {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const currentUrl = tabs[0]?.url;

  if (!currentUrl) {
    console.error('No active tab or the URL is undefined');
    return null;
  }

  // Extract the hostname from the current URL
  const {hostname} = new URL(currentUrl);

  const url = `https://${hostname}/sn_devstudio_/v1/get_publish_info.do`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  return data.ck as string | null;
}

// interface Message {
//   g_ck: string;
// }

const Popup: React.FC = () => {
  // const [sessionToken, setSessionToken] = React.useState<string | null>(null);
  // const [csfrToken, setCSFRToken] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const handleMessage = (message: Message): void => {
  //     console.log('Received message:', message);
  //     setCSFRToken(message.g_ck);
  //     browser.storage.local.set({csfrToken: message.g_ck});
  //   };

  //   // Listen for messages from content script
  //   browser.runtime.onMessage.addListener(handleMessage);

  //   // Load the token from the extension's storage when the popup is opened
  //   browser.storage.local.get('csfrToken').then((data) => {
  //     setCSFRToken(data.csfrToken);
  //   });

  //   // Clean up the event listener when the component unmounts
  //   return (): void => {
  //     browser.runtime.onMessage.removeListener(handleMessage);
  //   };
  // }, []);

  // const handleGetToken = async (): Promise<void> => {
  //   const newSessionToken = await getToken();
  // setSessionToken(newSessionToken);
  // console.log(newSessionToken);
  // };

  const handlePerformApiQuery = async (): Promise<void> => {
    let token = await getCk(); // Get the token from the server

    // If the state doesn't have the token, try to get it from the storage
    if (!token) {
      const data = await browser.storage.local.get('csfrToken');
      token = data.csfrToken;
    }

    console.log(`token: ${JSON.stringify(token, null, 2)}`);

    let url: string | undefined;

    if (token) {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const currentUrl = tabs[0]?.url;
      if (currentUrl) {
        const {hostname} = new URL(currentUrl);
        url = `https://${hostname}/api/now/table/incident`;
      } else {
        console.error('No active tab or the URL is undefined');
      }

      if (url) {
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Authorization: 'BasicCustom',
            'X-UserToken': token,
            credentials: 'include',
          },
        });
        const data = await response.json();
        console.log(data);
      } else {
        console.error('URL is undefined');
      }
    }
  };

  return (
    <section id="popup">
      <h2>WEB-EXTENSION-STARTER</h2>
      <button
        id="options__button"
        type="button"
        onClick={(): Promise<Tabs.Tab> => {
          return openWebPage('options.html');
        }}
      >
        Options Page
      </button>
      {/* <button id="options__button" type="button" onClick={handleGetToken}>
        Get Token
      </button> */}
      <button
        id="options__button"
        type="button"
        onClick={handlePerformApiQuery}
      >
        Perform API Query
      </button>
    </section>
  );
};

export default Popup;
