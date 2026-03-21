const admin = require('firebase-admin');

const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      let privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;

      if (!privateKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY is not set!');
      }

      // Handle all escape variations from Render
      privateKey = privateKey.replace(/\\n/g, '\n').trim();

      // Verify key format
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        throw new Error('Private key format is invalid!');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
          project_id: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
          private_key_id: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
          private_key: privateKey,
          client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
          auth_uri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
          token_uri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
          auth_provider_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
          universe_domain: process.env.FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
        }),
      });

      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error.message);
      throw error; // This will show in Render logs
    }
  }
};

module.exports = { admin, initializeFirebaseAdmin };