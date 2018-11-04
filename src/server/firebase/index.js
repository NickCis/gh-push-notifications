import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.RAZZLE_FIREBASE_PROJECT_ID,
    clientEmail: `${process.env.RAZZLE_FIREBASE_CLIENT_USERNAME}@${process.env.RAZZLE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
    privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.RAZZLE_FIREBASE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
  }),
  databaseURL: `https://${process.env.RAZZLE_FIREBASE_DATABASE_NAME}.firebaseio.com`,
});

export default admin;
