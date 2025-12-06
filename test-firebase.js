// Test Firebase Connection - CommonJS version
// Run with: node test-firebase.js

require('dotenv').config({ path: '.env.local' })

const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

console.log('🔥 Testing Firebase Connection...\n')

// Check if environment variables are set
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
]

const missingVars = requiredVars.filter((v) => !process.env[v])

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:')
  missingVars.forEach((v) => console.error(`   - ${v}`))
  console.error('\n✏️ Update .env.local with your Firebase credentials\n')
  
  console.log('Current values in .env.local:')
  console.log(`   NEXT_PUBLIC_FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   NEXT_PUBLIC_FIREBASE_APP_ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ SET' : '❌ MISSING'}`)
  
  process.exit(1)
}

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  console.log('✅ Firebase initialized')

  // Test Auth
  const auth = getAuth(app)
  console.log('✅ Firebase Auth initialized')

  // Test Firestore
  const db = getFirestore(app)
  console.log('✅ Firestore initialized')

  console.log('\n🎉 Firebase connection successful!')
  console.log('\nYour configuration:')
  console.log(`   Project: ${firebaseConfig.projectId}`)
  console.log(`   Auth Domain: ${firebaseConfig.authDomain}`)
  console.log(`   Storage Bucket: ${firebaseConfig.storageBucket}`)
  
  console.log('\n✅ You can now run: npm run dev')

  process.exit(0)
} catch (error) {
  console.error('❌ Firebase connection failed:')
  console.error(`   Error: ${error.message}\n`)
  
  console.log('Troubleshooting steps:')
  console.log('1. Check that .env.local has correct Firebase values')
  console.log('2. Verify Firebase project exists: https://console.firebase.google.com/')
  console.log('3. Make sure Firestore is created in Firebase Console')
  console.log('4. Check your internet connection')
  console.log('5. Ensure all values in .env.local are on one line (no line breaks)\n')
  
  console.log('Your current .env.local values:')
  console.log(`   API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'MISSING'}`)
  console.log(`   Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING'}`)
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING'}`)
  
  process.exit(1)
}
