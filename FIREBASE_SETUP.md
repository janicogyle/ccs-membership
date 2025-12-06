# 🔥 Firebase Setup Guide

## Overview

We've migrated your CCS Membership application from MongoDB to **Firebase**! This guide will help you set up Firebase and get your app running.

---

## ✅ Prerequisites

- Google Account (for Firebase Console)
- Node.js 18+
- npm or yarn

---

## 🚀 Step 1: Create a Firebase Project

### 1.1 Go to Firebase Console

1. Visit: https://console.firebase.google.com/
2. Click "Add Project"
3. Enter Project Name: `ccs-membership`
4. Accept the terms and click "Continue"
5. (Optional) Disable Google Analytics
6. Click "Create Project"
7. Wait for project to be created (~5 minutes)

---

## 🔧 Step 2: Enable Authentication

### 2.1 Enable Email/Password Authentication

1. In Firebase Console, go to: **Authentication** → **Sign-in method**
2. Click "Email/Password"
3. Toggle "Enable" ON
4. Toggle "Email link (passwordless sign-in)" OFF (optional)
5. Click "Save"

### 2.2 Enable Anonymous Authentication (Optional)

This allows unauthenticated reads if needed.

---

## 📦 Step 3: Create Firestore Database

### 3.1 Create Database

1. In Firebase Console, go to: **Firestore Database**
2. Click "Create Database"
3. Choose Location: Select closest to you (e.g., `us-central1`)
4. Start in **Production mode** (we'll set up security rules)
5. Click "Create"

### 3.2 Create Collections Structure

Firestore will auto-create collections when you add documents, but here's the structure:

```
firestore/
├── users/
│   ├── [uid]
│   │   ├── uid: string
│   │   ├── email: string
│   │   ├── name: string
│   │   ├── isAdmin: boolean
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
└── students/
    ├── [documentId]
    │   ├── name: string
    │   ├── email: string
    │   ├── major: string
    │   ├── gpa: number
    │   ├── enrollmentYear: number
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
```

---

## 🔐 Step 4: Get Your Firebase Config

### 4.1 Get Client Config (Public)

1. In Firebase Console, go to: **Project Settings** (gear icon)
2. Click "Your apps" section
3. If no app exists, click "Add app" → "Web"
4. Enter App nickname: `ccs-membership-web`
5. Register app
6. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc...",
};
```

### 4.2 Update `.env.local` with Client Config

Edit `.env.local` in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

---

## 🔑 Step 5: Get Firebase Admin SDK

### 5.1 Create Service Account

1. In Firebase Console, go to: **Project Settings** (gear icon)
2. Go to **Service Accounts** tab
3. Click "Generate New Private Key"
4. Save the JSON file (keep it secret!)
5. Open the JSON file and note these values:

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### 5.2 Add to `.env.local`

Add these to your `.env.local` file:

```env
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY_WITH_ESCAPED_NEWLINES\n-----END PRIVATE KEY-----\n
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=your_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_CERT_URL=your_cert_url
```

> ⚠️ **Important:** The `FIREBASE_ADMIN_PRIVATE_KEY` needs escaped newlines. If your key is:
>
> ```
> -----BEGIN PRIVATE KEY-----
> ABC123
> -----END PRIVATE KEY-----
> ```
>
> Format it as:
>
> ```
> -----BEGIN PRIVATE KEY-----\nABC123\n-----END PRIVATE KEY-----\n
> ```

---

## 🔒 Step 6: Set Up Firestore Security Rules

### 6.1 Go to Firestore Rules

1. In Firebase Console, go to: **Firestore Database** → **Rules**
2. Replace the default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{uid} {
      // Users can read their own document
      allow read: if request.auth.uid == uid;
      // Users can write their own document
      allow write: if request.auth.uid == uid &&
                      !request.resource.data.isAdmin;
      // Admin can do anything
      allow read, write: if request.auth.token.isAdmin == true;
    }

    // Students collection (public read, authenticated write)
    match /students/{document=**} {
      // Anyone can read
      allow read: if true;
      // Authenticated users can write
      allow write: if request.auth != null;
      // Admin can do everything
      allow read, write: if request.auth.token.isAdmin == true;
    }
  }
}
```

3. Click "Publish"

---

## 📥 Step 7: Seed Initial Data (Optional)

Create a script to add initial data to Firestore:

```javascript
// scripts/seedFirebase.js
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const serviceAccount = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function seed() {
  try {
    console.log("🌱 Starting Firebase seed...");

    // Create admin user
    const adminUser = await auth.createUser({
      email: "admin@ccs.edu",
      password: "password123",
      displayName: "Admin User",
    });

    await db.collection("users").doc(adminUser.uid).set({
      uid: adminUser.uid,
      email: "admin@ccs.edu",
      name: "Admin User",
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin user created: admin@ccs.edu");

    // Create regular users
    const user1 = await auth.createUser({
      email: "student1@ccs.edu",
      password: "password123",
      displayName: "Student One",
    });

    await db.collection("users").doc(user1.uid).set({
      uid: user1.uid,
      email: "student1@ccs.edu",
      name: "Student One",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user2 = await auth.createUser({
      email: "student2@ccs.edu",
      password: "password123",
      displayName: "Student Two",
    });

    await db.collection("users").doc(user2.uid).set({
      uid: user2.uid,
      email: "student2@ccs.edu",
      name: "Student Two",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Regular users created");

    // Create sample students
    const students = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        major: "Computer Science",
        gpa: 3.85,
        enrollmentYear: 2022,
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        major: "Computer Science",
        gpa: 3.92,
        enrollmentYear: 2023,
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        major: "Data Science",
        gpa: 3.78,
        enrollmentYear: 2022,
      },
      {
        name: "Diana Prince",
        email: "diana@example.com",
        major: "Cybersecurity",
        gpa: 3.95,
        enrollmentYear: 2023,
      },
      {
        name: "Eve Wilson",
        email: "eve@example.com",
        major: "Computer Science",
        gpa: 3.88,
        enrollmentYear: 2024,
      },
      {
        name: "Frank Miller",
        email: "frank@example.com",
        major: "Data Science",
        gpa: 3.72,
        enrollmentYear: 2024,
      },
      {
        name: "Grace Lee",
        email: "grace@example.com",
        major: "Cybersecurity",
        gpa: 3.81,
        enrollmentYear: 2023,
      },
      {
        name: "Henry Davis",
        email: "henry@example.com",
        major: "Computer Science",
        gpa: 3.76,
        enrollmentYear: 2022,
      },
    ];

    for (const student of students) {
      await db.collection("students").add({
        ...student,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("✅ Sample students created");
    console.log("🎉 Firebase seed completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Firebase:", error);
    process.exit(1);
  }
}

seed();
```

Run it with:

```bash
npm install dotenv
node scripts/seedFirebase.js
```

---

## 🧪 Step 8: Test Your Setup

### 8.1 Start Development Server

```bash
npm install
npm run dev
```

### 8.2 Test Registration

1. Go to: http://localhost:3000/auth/signup
2. Register with a new email
3. Expected: User created, redirected to home

### 8.3 Test Login

1. Go to: http://localhost:3000/auth/login
2. Login with: admin@ccs.edu / password123
3. Expected: Logged in, see admin link in header

### 8.4 Check Firestore

1. In Firebase Console, go to: **Firestore Database** → **Data**
2. You should see `users` and `students` collections
3. Click on documents to view data

---

## 📁 New Project Structure

```
ccs-membership/
├── lib/
│   ├── firebase.js              # Client Firebase config
│   ├── firebaseAdmin.js         # Admin Firebase config
│   ├── firebaseAuthService.js   # Auth functions
│   └── firestoreService.js      # Database functions
├── app/
│   └── api/
│       └── auth/
│           ├── login/route.js
│           └── register/route.js
├── .env.local                   # Your Firebase keys (DON'T COMMIT!)
└── scripts/
    └── seedFirebase.js          # Data seeding script
```

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Client config added to `.env.local`
- [ ] Admin SDK config added to `.env.local`
- [ ] Security rules updated
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Initial data seeded (optional)
- [ ] Registration/Login working
- [ ] Data visible in Firebase Console

---

## 🐛 Troubleshooting

### Issue: "Missing FIREBASE\_\* variables"

**Solution:** Check that all environment variables are set correctly in `.env.local`

### Issue: "Permission denied" errors

**Solution:** Check Firestore security rules, make sure they're published

### Issue: "Auth/user-not-found"

**Solution:** Make sure the user exists in Firebase Auth and Firestore

### Issue: ".env.local not loading"

**Solution:** Restart dev server after updating `.env.local`

---

## 🚀 Next Steps

1. Update remaining API routes to use Firestore
2. Update frontend components to use Firebase Auth
3. Create Firebase Cloud Functions for admin operations
4. Set up Firebase Hosting for deployment
5. Enable Firebase Emulator for local development

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Your Firebase setup is complete! Happy coding! 🎉**
