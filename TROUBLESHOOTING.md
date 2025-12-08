# 🐛 Troubleshooting Guide

## Common Errors and Solutions

### Error 1: "Cannot find module 'firebase'" or "'firebase/auth'"

**Cause:** Firebase packages not installed

**Solution:**

```bash
npm install firebase firebase-admin
```

---

### Error 2: "NEXT_PUBLIC_FIREBASE_API_KEY is undefined"

**Cause:** Environment variables not loaded

**Solution:**

1. Check `.env.local` exists and has values
2. Restart dev server after editing `.env.local`:
   ```bash
   npm run dev
   ```

---

### Error 3: "Permission denied" or "PERMISSION_DENIED"

**Cause:** Firestore security rules not set or too restrictive

**Solution:**

1. Go to Firebase Console
2. **Firestore Database** → **Rules**
3. Replace with these rules:
   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth.uid == uid;
         allow read, write: if request.auth.token.isAdmin == true;
       }
       match /students/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /wallets/{uid} {
         allow read: if request.auth.uid == uid;
         allow write: if request.auth.uid == uid;
         allow read, write: if request.auth.token.isAdmin == true;
       }
       match /transactions/{transactionId} {
         allow read: if request.auth.uid == resource.data.userId;
         allow create: if request.auth.uid == request.resource.data.userId;
         allow read, write: if request.auth.token.isAdmin == true;
       }
       match /subscriptions/{subscriptionId} {
         allow read: if request.auth.uid == resource.data.userId;
         allow create: if request.auth.uid == request.resource.data.userId;
         allow read, write: if request.auth.token.isAdmin == true;
       }
       match /tickets/{ticketId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
         allow read, write: if request.auth.token.isAdmin == true;
       }
     }
   }
   ```
4. Click "Publish"

---

### Error 4: "Cannot read property 'signInWithEmailAndPassword'"

**Cause:** Firebase Auth not initialized

**Solution:**

1. Check `lib/firebase.js` imports are correct
2. Verify `.env.local` has all FIREBASE values
3. Check Firebase Console > Authentication is enabled

---

### Error 5: "User not found" or "Invalid credentials"

**Cause:** User doesn't exist in Firebase Auth

**Solution:**

1. Go to Firebase Console
2. **Authentication** → **Users**
3. Create a test user manually, or
4. Register a new user at `/auth/signup`

---

## Quick Diagnostics

### Check Environment Variables

Visit: http://localhost:3000/api/debug

You should see all Firebase configs marked as ✅ SET

### Check Firebase Connection

```bash
node test-firebase.js
```

### Check Browser Console

Press **F12** in browser and look for:

- Red errors in Console tab
- Network requests failing in Network tab

### Check Dev Server Logs

Look at terminal where you ran `npm run dev` for error messages

---

## Step-by-Step Verification

### 1. Firebase Project Exists

- Go to: https://console.firebase.google.com/
- Select **ccs-membership-4a9de**
- Should see Overview page

### 2. Firestore Database Created

- Click **Firestore Database** in left menu
- Should see database status (green checkmark)
- If not, create it: Production mode, us-central1

### 3. Authentication Enabled

- Click **Authentication** in left menu
- Click **Sign-in method** tab
- Should see "Email/Password" enabled
- If not, enable it

### 4. Environment Variables Set

In `.env.local`:

```
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ NEXT_PUBLIC_FIREBASE_APP_ID
```

Admin variables (optional for now):

```
⚠️ FIREBASE_ADMIN_PRIVATE_KEY_ID
⚠️ FIREBASE_ADMIN_PRIVATE_KEY
⚠️ FIREBASE_ADMIN_CLIENT_EMAIL
⚠️ FIREBASE_ADMIN_CLIENT_ID
⚠️ FIREBASE_ADMIN_CLIENT_CERT_URL
```

### 5. Dev Server Running

```bash
npm run dev
```

Should see:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
```

---

## Testing Workflow

### Test 1: Load Homepage

1. Go to: http://localhost:3000
2. Page loads without errors
3. Header visible

### Test 2: Try Login

1. Go to: http://localhost:3000/auth/login
2. Enter: admin@ccs.edu / password123
3. Should show: "User not found" (because no users created yet)

### Test 3: Register New User

1. Go to: http://localhost:3000/auth/signup
2. Fill form with new email
3. Click "Sign Up"
4. Should show success or error

### Test 4: Check Firebase Console

1. Go to Firebase Console
2. **Firestore Database** → **Data**
3. Should see `users` collection with registered user

---

## Still Having Issues?

### 1. Clear Everything and Start Fresh

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -r node_modules

# Reinstall
npm install

# Restart server
npm run dev
```

### 2. Check Node/npm Versions

```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

### 3. Check for Port Conflicts

If port 3000 is in use:

```bash
npm run dev -- -p 3001
```

### 4. Check Firebase Console Status

- No red alerts
- All services active
- Quotas not exceeded

---

## Getting Detailed Error Info

### Browser Console (F12)

- Click **Console** tab
- Look for red error messages
- Copy full error text

### Dev Server Terminal

- Look for error stack traces
- Note any database errors
- Check API response status

### Network Tab (F12)

- Click **Network** tab
- Make a login/register request
- Click the request
- Check **Response** tab for error details

---

## What Error Are You Seeing?

Please share:

1. **Where?** (Browser console, terminal, page error)
2. **What?** (Full error message)
3. **When?** (On startup, on register, on login)

---

**Need more help? Check:**

- `SETUP_STATUS.md` - Setup checklist
- `GET_ADMIN_CREDENTIALS.md` - Admin SDK setup
- `FIREBASE_SETUP.md` - Complete guide
