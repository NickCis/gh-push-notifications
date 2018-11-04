import firebase from 'firebase/app';
import 'firebase/messaging';

firebase.initializeApp({
  apiKey: process.env.RAZZLE_FIREBASE_API_KEY,
  authDomain: `${process.env.RAZZLE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.RAZZLE_FIREBASE_PROJECT_ID,
  databaseURL: `https://${process.env.RAZZLE_FIREBASE_DATABASE_NAME}.firebaseio.com`,
  storageBucket: `${process.env.RAZZLE_FIREBASE_BUCKET}.appspot.com`,
  messagingSenderId: process.env.RAZZLE_FIREBASE_MESSAGING_SENDER_ID,
});

const messaging = firebase.messaging();
messaging.usePublicVapidKey(process.env.RAZZLE_FIREBASE_PUBLIC_VAPID_KEY);

export default firebase;
export {
  messaging
};

messaging.onMessage(payload => {
  console.log('[firebase.js] Received message ', payload);
});
