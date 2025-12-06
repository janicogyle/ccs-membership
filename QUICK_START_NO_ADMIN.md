# 🚀 Quick Start - No Admin SDK Needed Yet

Your app can work **without the Admin SDK** for basic testing!

## What Works Right Now ✅

- User Registration
- User Login
- View Students
- Create Students (if authenticated)
- User Profile (if authenticated)

## What Needs Admin SDK ❌

- Seeding test data
- Admin dashboard
- Admin user management
- Advanced stats

---

## Step 1: Fix the Error

The error was in `ToastContext.jsx` - already fixed! ✅

## Step 2: Test the App

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Test Without Admin SDK

### 1. Register a New User

1. Go to: http://localhost:3000/auth/signup
2. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"
4. Expected: Success message, redirected to home

### 2. Login

1. Go to: http://localhost:3000/auth/login
2. Use the email/password from registration
3. Click "Login"
4. Expected: Logged in, can see your name in header

### 3. View Students

1. Click "Students" in header
2. Go to: http://localhost:3000/students
3. Expected: Empty list (no test data yet)

### 4. Create a Student

1. Click "Add New Student" or go to: http://localhost:3000/students/create
2. Fill form:
   - Name: Alice Johnson
   - Email: alice@example.com
   - Major: Computer Science
   - GPA: 3.85
   - Year: 2024
3. Click "Create Student"
4. Expected: Student added to list

---

## Next: Get Admin SDK

Once you're ready to:

- Add admin dashboard
- Test with seeded data
- Use admin features

You'll need the Admin SDK. Follow: `GET_SERVICE_ACCOUNT_KEY.md`

---

## Troubleshooting

### "npm run dev" shows errors

Make sure `.env.local` has these values:

- ✅ NEXT_PUBLIC_FIREBASE_API_KEY
- ✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
- ✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- ✅ NEXT_PUBLIC_FIREBASE_APP_ID

### Registration fails

Check:

1. Firebase Console > Authentication is enabled
2. Email/Password provider is enabled
3. Firestore Database is created

### Can't see students

1. No students created yet (create one manually)
2. Check Firebase Console > Firestore Database

---

## Quick Command

```bash
npm run dev
```

Then open: http://localhost:3000

**Let's test!** 🚀
