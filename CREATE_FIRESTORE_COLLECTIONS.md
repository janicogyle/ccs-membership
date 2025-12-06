# 🔥 Firebase Firestore Setup - Create Collections

## Step 1: Create Firestore Database

### 1.1 Open Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select your project: **ccs-membership-4a9de**

### 1.2 Create Database

1. Click **"Firestore Database"** in the left menu
2. Click **"Create Database"** button
3. Choose settings:
   - **Location:** us-central1 (or closest to you)
   - **Mode:** Start in production mode
4. Click **"Create"**
5. Wait for database to be created (~2 minutes)

---

## Step 2: Create Collections

Firestore will auto-create collections when you add documents, but we can create them manually first.

### 2.1 Create "users" Collection

1. In Firestore Console, click **"Start collection"**
2. Collection ID: `users`
3. Document ID: Leave as "Auto ID" for now
4. Add a test field:
   - Field: `email`
   - Type: `string`
   - Value: `test@example.com`
5. Click **"Save"**

### 2.2 Create "students" Collection

1. Click **"Start collection"** again
2. Collection ID: `students`
3. Document ID: Leave as "Auto ID"
4. Add a test field:
   - Field: `name`
   - Type: `string`
   - Value: `Test Student`
5. Click **"Save"**

---

## Step 3: Delete Test Documents (Optional)

You can delete the test documents if you want:

1. In Firestore Console, go to **"students"** collection
2. Click the test document
3. Click the **"Delete"** button (trash icon)

---

## Step 4: Set Security Rules

### 4.1 Go to Rules

1. Click **"Rules"** tab in Firestore
2. Replace the default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - users can read/write their own
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Students collection - public read, authenticated write
    match /students/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

## Step 5: Test Your Setup

### 5.1 Start Dev Server

```bash
npm run dev
```

### 5.2 Test Students API

Visit: http://localhost:3000/api/students

You should see:

```json
{
  "success": true,
  "students": []
}
```

### 5.3 Create a Student

1. Go to: http://localhost:3000
2. Register a new user (if not logged in)
3. Click **"Students"** in header
4. Click **"Add New Student"** or **"Create New Student"**
5. Fill the form:
   - Name: Alice Johnson
   - Email: alice@example.com
   - Major: Computer Science
   - GPA: 3.85
   - Year: 2024
6. Click **"Create Student"**
7. Expected: Student appears in the list

### 5.4 Check Firestore

1. Go to Firebase Console
2. **Firestore Database** → **Data**
3. Click **"students"** collection
4. Should see your new student document

---

## Troubleshooting

### Error: "PERMISSION_DENIED"

**Solution:**

1. Check Firestore Rules are published
2. Verify collections are created
3. Check that you're authenticated (logged in)

### Error: "Failed to fetch students"

**Solution:**

1. Verify Firestore Database is created (green checkmark)
2. Check that collections exist in Firestore Console
3. Check security rules

### Can't see students in list

**Solution:**

1. Make sure students were created
2. Check Firestore Console to verify documents exist
3. Reload the page (Cmd+Shift+R or Ctrl+Shift+R)

---

## Quick Checklist

- [ ] Firestore Database created
- [ ] Collections created (users, students)
- [ ] Security rules published
- [ ] Dev server running
- [ ] Can register user
- [ ] Can create student
- [ ] Student appears in Firestore

---

## Next Steps

Once collections are created:

1. Create test students manually via UI
2. Or set up Admin SDK to seed data
3. Test all CRUD operations

**You're almost there!** 🚀
