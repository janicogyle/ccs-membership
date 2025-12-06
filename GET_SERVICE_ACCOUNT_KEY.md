# 🔑 Get Your Firebase Admin SDK Service Account Key

## Quick Steps

### Step 1: Go to Firebase Console

1. Visit: https://console.firebase.google.com/
2. Select your project: **ccs-membership-4a9de**

### Step 2: Open Project Settings

1. Click the **gear icon** ⚙️ at the top left
2. Click **"Project Settings"**

### Step 3: Go to Service Accounts

1. Click the **"Service Accounts"** tab at the top
2. You'll see "Firebase Admin SDK" section

### Step 4: Generate Private Key

1. Click the blue **"Generate New Private Key"** button
2. A dialog will appear asking to confirm
3. Click **"Generate Key"**
4. A JSON file will automatically download
   - Filename: `ccs-membership-4a9de-[random].json`
5. **Save this file securely!** (Don't commit to GitHub!)

### Step 5: Add to Your Project

**Option A: Save file in project**

1. Save the downloaded JSON file to your project root
2. Rename it to: `serviceAccountKey.json`
3. Update your code to use it

**Option B: Use environment variables (RECOMMENDED)**

1. Open the downloaded JSON file with a text editor
2. Copy the entire content
3. Add to `.env.local`:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={paste_entire_json_here}
```

Or split the values:

```env
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_PROJECT_ID=ccs-membership-4a9de
FIREBASE_ADMIN_PRIVATE_KEY_ID=xxxxx
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ccs-membership-4a9de.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=xxxxx
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_CERT_URL=xxxxx
```

---

## What You'll Get

The JSON file will look like:

```json
{
  "type": "service_account",
  "project_id": "ccs-membership-4a9de",
  "private_key_id": "xxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxxx@ccs-membership-4a9de.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/certificates/xxxxx"
}
```

---

## ⚠️ SECURITY WARNING

**NEVER commit this file to GitHub!**

If you accidentally commit it:

1. Go to Firebase Console
2. **Service Accounts** tab
3. Delete the compromised key
4. Generate a new one

---

## Next Steps

1. Download the JSON file
2. Choose Option A or B above
3. Share the values with me OR
4. Come back and tell me you've added them to `.env.local`

Then we can test: `npm run dev`

---

## Still Need Help?

Screenshots of each step:

1. Firebase Console: https://console.firebase.google.com/
2. Gear icon top left
3. "Service Accounts" tab
4. Blue "Generate New Private Key" button

**Let me know once you have the JSON file!** 🔑
