import * as React from 'react';
import {Fragment, useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import './styles.css';

interface Message {
  content: string;
  sender: string;
  timestamp: string;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages([
      {
        content: 'How do I implement a UI action?',
        sender: 'John Doe',
        timestamp: 'Today at 3:00 PM',
      },
      {
        content: 'Do the following...',
        sender: 'sn-companion',
        timestamp: 'Today at 3:01 PM',
      },
    ]);
  }, []);

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      if (event.data.action === 'toggleSidebarOpen') {
        console.log('toggleSidebarOpen');
        setOpen((prevOpen) => !prevOpen); // Toggle the open state
      }
    };

    window.addEventListener('message', messageListener);

    // Cleanup: remove the listener when the component unmounts
    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []); // Empty

  const handleSubmit = () => {
    if (input.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: input,
          sender: 'User',
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setInput('');
    }
  };

  return createPortal(
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="sticky z-[1000]" onClose={setOpen}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                  <div className="flex h-full flex-col bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          SN Companion
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      id="content"
                      className="relative mt-6 flex-1 px-4 sm:px-6 h-full"
                    >
                      <div
                        id="messages"
                        className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-auto h-full flex-col"
                      >
                        {messages.map((message) => {
                          return (
                            <div
                              key={message.timestamp}
                              className={
                                (message.sender === 'sn-companion'
                                  ? ''
                                  : 'bg-gray-400') + ' rounded-lg p-1 mb-2'
                              }
                            >
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{message.content}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div
                        id="input-section"
                        className="border-t border-gray-200 py-3 sticky bottom-0"
                      >
                        <div className="flex">
                          <div className="flex-grow">
                            <textarea
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none p-2"
                              placeholder="Type your message"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSubmit();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>,
    document.body
  );
};

export default Sidebar;
