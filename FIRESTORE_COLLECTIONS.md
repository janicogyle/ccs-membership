# Firestore Collections Setup & Verification

## 📊 Database Structure

Your application uses **Firebase Firestore** with the following collections:

### 1. **users** - User Profiles & Authentication Data
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,            // User email
  firstName: string,        // First name
  lastName: string,         // Last name
  phoneNumber: string,      // Phone number
  program: string,          // BSIT, BSCS, BSEMC
  year: number,             // 1, 2, 3, 4
  block: string,            // Block section
  role: string,             // 'student', 'admin'
  isAdmin: boolean,         // Admin flag
  createdAt: timestamp,     // Account creation date
  updatedAt: timestamp      // Last update date
}
```

### 2. **wallets** - User Wallet Balances
```javascript
{
  userId: string,           // References user UID
  balance: number,          // Current balance (₱)
  lastUpdated: timestamp,   // Last transaction date
  createdAt: timestamp      // Wallet creation date
}
```

### 3. **transactions** - Payment & Wallet History
```javascript
{
  userId: string,           // References user UID
  type: string,             // 'cash-in', 'payment', 'deduction'
  amount: number,           // Transaction amount (₱)
  description: string,      // Transaction description
  status: string,           // 'pending', 'completed', 'failed'
  paymentType: string,      // 'organization_half', 'organization_full', 'council_half', 'council_full'
  timestamp: timestamp,     // Transaction time
  reference: string         // Payment reference ID (optional)
}
```

### 4. **subscriptions** - Organization & Council Memberships
```javascript
{
  userId: string,           // References user UID
  type: string,             // 'organization', 'council'
  organization: string,     // 'ELITES', 'SPECS', 'IMAGES' (for organization type)
  paymentType: string,      // 'half', 'full'
  amount: number,           // Payment amount (₱)
  status: string,           // 'active', 'inactive', 'expired'
  startDate: timestamp,     // Membership start date
  endDate: timestamp,       // Membership expiry date
  createdAt: timestamp,     // Subscription creation date
  transactionId: string     // References transaction ID
}
```

### 5. **tickets** - Support Tickets
```javascript
{
  userId: string,           // References user UID
  name: string,             // User name
  email: string,            // Contact email
  phone: string,            // Contact phone (optional)
  subject: string,          // Ticket subject
  message: string,          // Ticket message/description
  status: string,           // 'pending', 'resolved', 'closed'
  createdAt: timestamp,     // Ticket creation time
  updatedAt: timestamp,     // Last update time
  resolvedAt: timestamp     // Resolution time (optional)
}
```

## 🔐 Firestore Security Rules

The security rules are defined in `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // All collections require authentication
    match /{collection}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**To deploy rules to Firebase:**
```bash
firebase deploy --only firestore:rules
```

## ✅ Verification Steps

### Option 1: Web-Based Verification (Recommended)
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to your account

3. Visit the verification page:
   ```
   http://localhost:3000/verify-firestore
   ```

4. The page will show:
   - ✅ Collection accessibility status
   - 📊 Document counts
   - 🧪 Test document creation
   - 📋 Real-time verification logs

### Option 2: Manual Testing
1. **Register a new user** → Creates `users` + `wallets` collections
2. **Cash in wallet** → Creates `transactions` collection
3. **Pay membership** → Creates `subscriptions` collection
4. **Submit ticket** → Creates `tickets` collection

## 🚀 Collection Auto-Creation

All collections are created automatically when needed:

| Collection | Auto-Created When |
|------------|-------------------|
| users | User registers |
| wallets | User registers |
| transactions | User makes payment/cash-in |
| subscriptions | User pays membership |
| tickets | User submits support ticket |

## 📝 Database Configuration

**Project ID:** `ccs-membership-6dbc9`

**Environment Variables (.env.local):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBnJ95B_KXitkjTXZYF-9630MG-Xh8z3lk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ccs-membership-6dbc9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ccs-membership-6dbc9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ccs-membership-6dbc9.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=177386511662
NEXT_PUBLIC_FIREBASE_APP_ID=1:177386511662:web:3522a2f4d33b7d84932ebf
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-581Q3NXJ95
```

## 🔄 Collection Initialization

Collections don't need manual initialization. They are created automatically through normal application usage:

1. **First User Registration** → Creates `users` and `wallets`
2. **First Payment** → Creates `transactions`
3. **First Membership** → Creates `subscriptions`
4. **First Support Request** → Creates `tickets`

## 📊 Monitoring & Management

### Firebase Console
Access your Firestore database:
```
https://console.firebase.google.com/project/ccs-membership-6dbc9/firestore
```

### View Collections:
- Navigate to Firestore Database
- View all collections and documents
- Monitor real-time updates
- Export/import data
- Set up indexes if needed

## 🛠️ Troubleshooting

### "Permission Denied" Errors
1. Check Firestore rules are deployed
2. Verify user is authenticated
3. Ensure `.env.local` has correct Firebase config

### Collections Not Appearing
1. Use the verification page: `/verify-firestore`
2. Perform actions that create documents (register, pay, etc.)
3. Check Firebase Console for any errors

### Data Not Syncing
1. Check browser console for errors
2. Verify Firebase project ID matches `.env.local`
3. Ensure internet connection is stable

## 📞 Support

If you encounter issues:
1. Check `/verify-firestore` page for detailed status
2. Review browser console for Firebase errors
3. Check Firebase Console for security rule violations
4. Verify authentication is working properly

---

**Status:** ✅ All collections configured and ready to use!
