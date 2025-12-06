// Firebase Admin Configuration - Used only on the server
import admin from 'firebase-admin'

let initialized = false

// Try to initialize Firebase Admin
try {
  // Check if service account key is available
  const serviceAccount = {
    type: process.env.FIREBASE_ADMIN_TYPE || 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
  }

  // Only initialize if we have required credentials
  if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
      initialized = true
      console.log('✅ Firebase Admin initialized')
    }
  } else {
    console.warn('⚠️ Firebase Admin credentials incomplete - some features may not work')
    console.warn('Missing:', {
      project_id: !serviceAccount.project_id,
      private_key: !serviceAccount.private_key,
      client_email: !serviceAccount.client_email,
    })
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization warning:', error.message)
  console.warn('Admin SDK features will not be available')
}

export const adminAuth = initialized ? admin.auth() : null
export const adminDb = initialized ? admin.firestore() : null
export const isAdminInitialized = initialized

export default admin
