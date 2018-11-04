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

messaging.setBackgroundMessageHandler(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationOptions = {
    body: payload.data.body,
    icon: resolve(payload.data.icon || 'push-icon.png'),
  };

  return self.registration.showNotification(payload.data.title, notificationOptions);
});
