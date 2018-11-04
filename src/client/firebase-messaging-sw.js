/* eslint-disable no-restricted-globals */
/* global importScripts, firebase, self */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: process.env.RAZZLE_FIREBASE_MESSAGING_SENDER_ID
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

function resolve(text) {
  if (text.match(/^https?:\/\/./))
    return text;
  return `${self.location.protocol}//${self.location.host}/${text}`;
}

function resolveObject(options) {
  return Object.keys(options)
    .reduce((opt, key) => {
      const hasTransformed = Object.keys(transformKeys)
        .some(transformKey => {
          if (key.startsWith(transformKey)) {
            opt[key.substring(transformKey.length)] = transformKeys[transformKey](options[key]);
            return true;
          }

          return false;
        });

      if (! hasTransformed)
        opt[key] = options[key];

      return opt;
    }, {});
}

const transformKeys = {
  'resolve-': resolve,
  'object-': resolveObject,
  'parse-object-': str => resolveObject(JSON.parse(str)),
  'array-': arr => arr.map(resolveObject),
};

messaging.setBackgroundMessageHandler(payload => {
  const data = resolveObject(payload.data);
  data.options.data = data;

  return self.registration.showNotification(data.title, data.options);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data = event.notification.data;
  const link = data.links[event.action] || data.link;

  if (!link.type)
    return event.waitUntil(clients.openWindow(link));

  switch (link.type) {
    case 'fetch':
      return event.waitUntil(fetch(link.href));
    default:
      return event.waitUntil(clients.openWindow(link.href));
  }
});
