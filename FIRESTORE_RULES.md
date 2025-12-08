# Firestore Security Rules

## Instructions

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: **ccs-membership-6dbc9**
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab
5. Replace all the rules with the code below
6. Click **Publish**

## Rules Code

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - users can read/write their own data
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // Allow admins to read all users
    match /users/{uid} {
      allow read: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Students collection - public read, authenticated write
    match /students/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Tickets collection
    match /tickets/{ticketId} {
      // Anyone authenticated can create a ticket
      allow create: if request.auth != null;
      
      // Users can read their own tickets (matched by email)
      allow read: if request.auth != null && 
                    (request.auth.token.email == resource.data.email ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      
      // Admins can read and update all tickets
      allow update: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      // Allow list queries for authenticated users
      allow list: if request.auth != null;
    }
  }
}
```

## What These Rules Do

### Users Collection
- ✅ Users can read and write their own profile data
- ✅ Admins can read all user profiles

### Students Collection
- ✅ Anyone can read (public)
- ✅ Authenticated users can write

### Tickets Collection
- ✅ Authenticated users can create tickets
- ✅ Users can read their own tickets (by email)
- ✅ Admins can read and update all tickets
- ✅ Supports queries/lists for authenticated users

## After Publishing

Test by:
1. Logging in as a student
2. Creating a ticket
3. Viewing your tickets list
4. Logging in as admin to see all tickets
