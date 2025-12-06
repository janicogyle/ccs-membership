# ⚡ Get Your Firebase Admin SDK Credentials

## Quick Steps

### 1. Go to Firebase Console

- Visit: https://console.firebase.google.com/
- Select your project: **ccs-membership-4a9de**

### 2. Go to Project Settings

- Click the gear icon ⚙️ at the top left
- Click "Project Settings"

### 3. Go to Service Accounts Tab

- Click the "Service Accounts" tab
- You should see "Firebase Admin SDK" section

### 4. Generate Private Key

- Click "Generate New Private Key"
- A JSON file will download
- **Keep this file secret! Do NOT commit it to GitHub!**

### 5. Copy the Values

Open the JSON file and copy these fields:

```json
{
  "type": "service_account",
  "project_id": "ccs-membership-4a9de",
  "private_key_id": "COPY_THIS",
  "private_key": "COPY_THIS_ENTIRE_KEY_WITH_\\n",
  "client_email": "COPY_THIS",
  "client_id": "COPY_THIS",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "COPY_THIS"
}
```

### 6. Add to .env.local

Replace these lines in your `.env.local`:

```env
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_PROJECT_ID=ccs-membership-4a9de
FIREBASE_ADMIN_PRIVATE_KEY_ID=<paste_private_key_id_here>
FIREBASE_ADMIN_PRIVATE_KEY=<paste_private_key_here_with_escaped_newlines>
FIREBASE_ADMIN_CLIENT_EMAIL=<paste_client_email_here>
FIREBASE_ADMIN_CLIENT_ID=<paste_client_id_here>
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_CERT_URL=<paste_client_x509_cert_url_here>
```

### ⚠️ Important: Escape the Private Key

If your private key looks like:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...
...more characters...
-----END PRIVATE KEY-----
```

Format it as:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n...more characters...\n-----END PRIVATE KEY-----\n
```

Replace all newlines with `\n`

---

## Next Steps

1. Download the private key JSON file
2. Copy the values into `.env.local`
3. Restart your dev server (`npm run dev`)
4. Run the seed script to create test users

---

## 🚀 Quick Command

After updating `.env.local`, run:

```bash
npm run dev
```

Then test at: http://localhost:3000
