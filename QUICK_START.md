# Quick Start Guide - CCS Membership

Get your application running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy example to actual file
cp .env.local.example .env.local

# Edit .env.local with your MongoDB URI and JWT secret
# You need:
# - MONGODB_URI (from MongoDB Atlas)
# - MONGODB_DB (default: ccs_membership)
# - JWT_SECRET (any strong random string)
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

This creates test users and students. Use credentials:

- **Email:** admin@ccs.edu
- **Password:** password123

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📱 Try These Features

### 1. **Homepage**

- View hero section and features
- Explore the beautiful landing page

### 2. **Authentication**

- Click "Sign Up" to create account
- Use "Sign In" to log in
- View your profile after login

### 3. **Student Directory**

- Browse all students (no login required)
- Click on a student to see details
- **Authenticated users** can add new students

### 4. **Add a Student** (Requires Login)

1. Sign in with admin@ccs.edu / password123
2. Go to Students → Add Student
3. Fill in the form and submit

### 5. **Contact Us**

- Fill out the contact form
- Submit your message

### 6. **About Page**

- Learn about CCS Membership
- See our values and features

---

## 🔑 Key Credentials

If you ran `npm run seed`:

| Email         | Password    | Role  |
| ------------- | ----------- | ----- |
| admin@ccs.edu | password123 | Admin |
| john@ccs.edu  | password123 | User  |
| jane@ccs.edu  | password123 | User  |

---

## 📚 API Endpoints (for testing)

### Test with cURL or Postman

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ccs.edu","password":"password123"}'
```

#### Get All Students

```bash
curl http://localhost:3000/api/students
```

#### Get Student by ID

```bash
curl http://localhost:3000/api/students/{id}
```

#### Create Student (requires token)

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "major":"Computer Science",
    "gpa":3.8,
    "enrollmentYear":2023
  }'
```

---

## 🛠️ Common Tasks

### Clear All Data

```bash
npm run seed
```

Resets database and adds sample data

### Rebuild Frontend

```bash
npm run build
```

### Fix Linting Issues

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm start
```

---

## ✅ Checklist for First Run

- [ ] `npm install` - Install dependencies
- [ ] Created `.env.local` file
- [ ] Added MongoDB URI to `.env.local`
- [ ] Added JWT secret to `.env.local`
- [ ] Ran `npm run seed` (optional but recommended)
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:3000 in browser
- [ ] Tested login/signup
- [ ] Viewed students page
- [ ] Created a new student (after login)

---

## 🐛 Quick Troubleshooting

| Issue                    | Solution                                                      |
| ------------------------ | ------------------------------------------------------------- |
| "Cannot find module"     | Run `npm install`                                             |
| MongoDB connection error | Check `.env.local` MONGODB_URI                                |
| Port 3000 already in use | Run `npm run dev` on different port: `npm run dev -- -p 3001` |
| Login not working        | Run `npm run seed` to create test users                       |
| TypeScript errors        | Restart your IDE/terminal                                     |
| Blank page               | Check browser console for errors                              |

---

## 📖 Next Steps

1. **Read Full Documentation:** See `BACKEND_GUIDE.md`
2. **Explore Components:** Check `COMPONENT_STRUCTURE.md`
3. **Understand Architecture:** Read `ATOMIC_DESIGN.md`
4. **Check Code:** Browse `/components` and `/app/api`

---

## 🚀 Ready to Deploy?

### Deploy to Vercel (Easiest)

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Import your repository
# 4. Add environment variables
# 5. Deploy!
```

### Or Use Vercel CLI

```bash
npm install -g vercel
vercel deploy
```

---

**That's it! You now have a fully functional web application! 🎉**

Need help? Check `BACKEND_GUIDE.md` for detailed documentation.
