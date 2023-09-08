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

interface Message {
  g_ck: string;
}

const Popup: React.FC = () => {
  // const [sessionToken, setSessionToken] = React.useState<string | null>(null);
  const [csfrToken, setCSFRToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleMessage = (message: Message): void => {
      console.log('Received message:', message);
      setCSFRToken(message.g_ck);
      browser.storage.local.set({csfrToken: message.g_ck});
    };

    // Listen for messages from content script
    browser.runtime.onMessage.addListener(handleMessage);

    // Load the token from the extension's storage when the popup is opened
    browser.storage.local.get('csfrToken').then((data) => {
      setCSFRToken(data.csfrToken);
    });

    // Clean up the event listener when the component unmounts
    return (): void => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // const handleGetToken = async (): Promise<void> => {
  //   const newSessionToken = await getToken();
  // setSessionToken(newSessionToken);
  // console.log(newSessionToken);
  // };

  const handlePerformApiQuery = async (): Promise<void> => {
    let token = csfrToken; // First, try to get the token from the state

    // If the state doesn't have the token, try to get it from the storage
    if (!token) {
      const data = await browser.storage.local.get('csfrToken');
      token = data.csfrToken;
    }

    if (token) {
      const url =
        'https://dev168935.service-now.com/api/now/table/incident/a83820b58f723300e7e16c7827bdeed2';
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'BasicCustom',
          'X-UserToken': token,
        },
      });
      const data = await response.json();
      console.log(data);
    }
  };

  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = (): void => {
    console.log('WebSocket is connected');
  };

  ws.onmessage = (event): void => {
    console.log('Received data from server:', event.data);
  };

  ws.onerror = (error): void => {
    console.error('WebSocket encountered an error:', error);
  };

  ws.onclose = (): void => {
    console.log('WebSocket is closed');
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
