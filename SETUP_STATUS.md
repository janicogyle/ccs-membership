# ✅ Firebase Setup Progress

## Your Configuration is Set! 🎉

Your Firebase project is already created and your client configuration is ready.

**Project Details:**

- 🔑 **Project ID:** ccs-membership-4a9de
- 🌐 **Auth Domain:** ccs-membership-4a9de.firebaseapp.com
- 📦 **Storage Bucket:** ccs-membership-4a9de.firebasestorage.app
- 📨 **Messaging Sender ID:** 678025592244

---

## ✅ What's Done

- ✅ Firebase project created
- ✅ Client configuration added to `.env.local`
- ✅ Firebase packages installed (`npm install firebase firebase-admin`)
- ✅ Firebase config files created:
  - `lib/firebase.js` - Client config
  - `lib/firebaseAuthService.js` - Auth functions
  - `lib/firestoreService.js` - Database functions
- ✅ API routes updated:
  - `/api/auth/login` - Uses Firebase
  - `/api/auth/register` - Uses Firebase

---

## 📋 Next Steps

### Step 1: Enable Firestore Database

1. Go to: https://console.firebase.google.com/
2. Select project: **ccs-membership-4a9de**
3. Go to **Firestore Database**
4. Click "Create Database"
5. Choose location: **us-central1** (or closest to you)
6. Start in **Production mode**
7. Click "Create"

### Step 2: Enable Authentication

1. In Firebase Console, go to: **Authentication** → **Sign-in method**
2. Click "Email/Password"
3. Toggle "Enable" ON
4. Click "Save"

### Step 3: Get Admin SDK Credentials

1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click "Generate New Private Key"
4. A JSON file downloads - **keep it secret!**
5. See: `GET_ADMIN_CREDENTIALS.md` for instructions

### Step 4: Update .env.local with Admin Credentials

Add these values from the downloaded JSON:

```env
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_PROJECT_ID=ccs-membership-4a9de
FIREBASE_ADMIN_PRIVATE_KEY_ID=<from_json>
FIREBASE_ADMIN_PRIVATE_KEY=<from_json>
FIREBASE_ADMIN_CLIENT_EMAIL=<from_json>
FIREBASE_ADMIN_CLIENT_ID=<from_json>
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_CERT_URL=<from_json>
```

### Step 5: Update Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace with these rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - users can read/write their own data, admins can read/write all
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read, write: if request.auth.token.isAdmin == true;
    }

    // Students collection - public read, authenticated write
    match /students/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Wallets collection - users can read/write their own wallet, admins can read/write all
    match /wallets/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
      allow read, write: if request.auth.token.isAdmin == true;
    }

    // Transactions collection - users can read their own transactions, create new ones
    match /transactions/{transactionId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow read, write: if request.auth.token.isAdmin == true;
    }

    // Subscriptions collection - users can read their own subscriptions, create new ones
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow read, write: if request.auth.token.isAdmin == true;
    }

    // Tickets collection
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      allow read, write: if request.auth.token.isAdmin == true;
    }
  }
}
```

3. Click "Publish"

### Step 6: Test Your Setup

```bash
npm run dev
```

Then visit: http://localhost:3000

---

## 🧪 Test Connection

```bash
node test-firebase.js
```

This will verify your Firebase connection is working.

---

## 📝 Files to Edit

1. **`.env.local`** - Add admin credentials (most important!)

   - `FIREBASE_ADMIN_PRIVATE_KEY_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_CLIENT_ID`
   - `FIREBASE_ADMIN_CLIENT_CERT_URL`

2. **Firestore Rules** - Copy the rules above
3. **Authentication** - Enable Email/Password

---

## 🚀 Quick Checklist

- [ ] Firestore database created
- [ ] Authentication enabled (Email/Password)
- [ ] Admin SDK private key downloaded
- [ ] `.env.local` updated with admin credentials
- [ ] Firestore security rules updated
- [ ] `npm run dev` works
- [ ] Can register at `/auth/signup`
- [ ] Can login at `/auth/login`

---

## 📚 Resources

- **Firebase Console:** https://console.firebase.google.com/
- **Your Project:** https://console.firebase.google.com/project/ccs-membership-4a9de
- **Get Admin Credentials:** See `GET_ADMIN_CREDENTIALS.md`
- **Full Setup Guide:** See `FIREBASE_SETUP.md`

---

## 💡 Tips

- **Never commit `.env.local` to GitHub** - It contains secret keys!
- **Private key needs escaped newlines** - Replace `\n` with literal `\n` text
- **Test connection** - Run `node test-firebase.js` to verify setup
- **Restart dev server** - After updating `.env.local`, restart with `npm run dev`

---

## ❌ Troubleshooting

**"Permission denied" errors:**

- Check Firestore security rules are published
- Make sure you're using correct email/password

**"Missing FIREBASE variables":**

- Verify `.env.local` has all values
- Check for typos in environment variable names

**"Auth/user-not-found":**

- Make sure user is created in Firebase Auth
- Check Firestore users collection

---

## 🎯 Next Command

```bash
npm run dev
```

Then open: http://localhost:3000

You're almost there! 🚀
