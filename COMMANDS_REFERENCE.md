# 📋 CCS Membership - Command Reference Guide

Quick reference for all important commands and procedures.

---

## 🚀 Getting Started Commands

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment file
cp .env.local.example .env.local

# 3. Edit .env.local with your settings
# Add your MongoDB URI and JWT secret

# 4. Seed database with sample data
npm run seed

# 5. Start development server
npm run dev
```

### Access Application

```
Open in browser: http://localhost:3000
```

---

## 🛠️ Development Commands

### Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Development on different port
npm run dev -- -p 3001

# Production build
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Database

```bash
# Seed database
npm run seed

# Note: This will:
# - Clear existing data
# - Create 3 test users
# - Create 8 sample students
```

---

## 🧪 Testing Commands

### Manual Testing

#### Test Registration

```bash
1. Visit http://localhost:3000/auth/signup
2. Fill in name, email, password
3. Click "Create account"
4. Should redirect to home
```

#### Test Login

```bash
1. Visit http://localhost:3000/auth/login
2. Email: admin@ccs.edu
3. Password: password123
4. Click "Sign in"
5. Should show user menu in header
```

#### Test Protected Routes

```bash
1. Logout (click logout button)
2. Try to visit http://localhost:3000/students/create
3. Should redirect to login
4. Login again
5. Should be able to access /students/create
```

#### Test Student CRUD

```bash
1. Login as admin@ccs.edu
2. Click "Students" in header
3. Click "Add Student" button
4. Fill in student form
5. Click "Create Student"
6. Should appear in student list
7. Click on student to view details
8. Can edit or delete
```

### API Testing with cURL

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ccs.edu",
    "password": "password123"
  }'

# Will return: { success, message, user, token }
# Save the token for use in other requests
```

#### Get All Students

```bash
curl http://localhost:3000/api/students \
  -H "Content-Type: application/json"
```

#### Get Single Student

```bash
# Replace {id} with actual student ID
curl http://localhost:3000/api/students/{id} \
  -H "Content-Type: application/json"
```

#### Create Student (Requires Auth)

```bash
# Replace {token} with JWT token from login
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "major": "Computer Science",
    "gpa": 3.8,
    "enrollmentYear": 2024
  }'
```

#### Update Student (Requires Auth)

```bash
curl -X PUT http://localhost:3000/api/students/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Jane Doe",
    "gpa": 3.9
  }'
```

#### Delete Student (Requires Auth)

```bash
curl -X DELETE http://localhost:3000/api/students/{id} \
  -H "Authorization: Bearer {token}"
```

#### Get User Profile (Requires Auth)

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer {token}"
```

---

## 📦 Building & Deployment

### Local Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Open in browser
# http://localhost:3000
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy

# Or: Login and deploy through vercel.com
```

### Deploy to Other Platforms

#### Netlify

```bash
# Build
npm run build

# Deploy the .next directory to Netlify
# Add environment variables in Netlify settings
```

#### AWS

```bash
# Setup AWS CLI
aws configure

# Build Next.js project
npm run build

# Deploy to AWS Amplify or EC2
```

#### Docker

```bash
# Build Docker image
docker build -t ccs-membership .

# Run container
docker run -p 3000:3000 ccs-membership

# Push to registry
docker push your-registry/ccs-membership
```

---

## 🔧 Maintenance Commands

### Clear Build Cache

```bash
# Remove Next.js build
rm -rf .next

# Remove node modules
rm -rf node_modules

# Reinstall
npm install

# Rebuild
npm run build
```

### Database Management

#### Reset Database

```bash
# Re-seed with fresh data
npm run seed
```

#### Backup Data

```bash
# Using MongoDB Tools
mongoexport --uri "mongodb+srv://user:pass@cluster.mongodb.net/ccs_membership" \
  --collection users \
  --out users.json

mongoexport --uri "mongodb+srv://user:pass@cluster.mongodb.net/ccs_membership" \
  --collection students \
  --out students.json
```

#### Restore Data

```bash
mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/ccs_membership" \
  --collection users \
  --file users.json

mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/ccs_membership" \
  --collection students \
  --file students.json
```

---

## 📝 Environment Setup

### Create .env.local

```bash
cp .env.local.example .env.local
```

### Edit .env.local

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=ccs_membership

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting Commands

### Check Node Version

```bash
node --version
# Required: v18 or higher
```

### Check npm Version

```bash
npm --version
# Required: v9 or higher
```

### Check Port 3000 (Linux/Mac)

```bash
lsof -i :3000
```

### Check Port 3000 (Windows)

```bash
netstat -ano | findstr :3000
```

### Kill Process on Port 3000 (Linux/Mac)

```bash
kill -9 $(lsof -t -i:3000)
```

### Clear npm Cache

```bash
npm cache clean --force
```

### Reset npm

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Check Git Status

```bash
git status
```

### View Recent Commits

```bash
git log --oneline -10
```

---

## 📊 Monitoring Commands

### View Application Logs

```bash
# Development
npm run dev
# Watch console for output

# Production
npm start
# Check stdout for logs
```

### Monitor Database

```bash
# MongoDB Atlas
# Go to: https://cloud.mongodb.com
# Select your cluster → Collections
# View real-time data
```

### Check Performance

```bash
# Use Chrome DevTools
# F12 → Performance → Record
# Perform actions and analyze
```

---

## 🚀 Continuous Deployment

### GitHub Workflow Example

```bash
# Make changes
git add .
git commit -m "Feature: Add new component"
git push origin main

# Vercel automatically deploys on push
# Check deployment status at vercel.com dashboard
```

### Pre-deployment Checklist

```bash
# 1. Run tests
npm run lint

# 2. Build locally
npm run build

# 3. Start production build
npm start

# 4. Test all features
# Manually test key flows

# 5. Commit and push
git add .
git commit -m "Release v1.0"
git push origin main

# 6. Monitor deployment
# Watch vercel.com dashboard
```

---

## 📞 Getting Help

### View Documentation

```bash
# Open any documentation file
cat QUICK_START.md
cat BACKEND_GUIDE.md
cat ARCHITECTURE.md
```

### Check Component API

```bash
# View component props (in files)
# components/atoms/Button.jsx
# components/organisms/LoginForm.jsx
```

### Review API Documentation

```bash
# See BACKEND_GUIDE.md
# Section: API Endpoints
```

---

## 🎯 Common Workflows

### Adding a New Page

```bash
# 1. Create page file
touch app/mypage/page.jsx

# 2. Add route
# Edit app/layout.jsx to add navigation

# 3. Create components
# Use atomic design components

# 4. Test locally
npm run dev

# 5. Build and deploy
npm run build
npm start
```

### Adding a New API Endpoint

```bash
# 1. Create route file
touch app/api/myroute/route.js

# 2. Write handler
# export async function GET/POST/PUT/DELETE(request)

# 3. Test with curl
curl http://localhost:3000/api/myroute

# 4. Commit and deploy
git add .
git commit -m "API: Add new endpoint"
git push
```

### Adding Authentication to Route

```bash
# 1. Import verifyToken
import { verifyToken } from '@/lib/auth'

# 2. Check token
const decoded = verifyToken(request)
if (!decoded) return unauthorized response

# 3. Use user info
const userId = decoded.userId

# 4. Test protected route
```

---

## 📈 Performance Optimization

### Analyze Build Size

```bash
# Next.js built-in analyzer
npm install --save-dev @next/bundle-analyzer

# Run analysis (after setup in next.config.js)
npm run build
```

### Cache Management

```bash
# Clear browser cache
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

# Or use Network tab in DevTools
# Settings → Disable cache
```

---

## 💾 Backup & Recovery

### Backup Current Work

```bash
# Commit all changes
git add .
git commit -m "Backup: Current state"
git push

# Tag release
git tag -a v1.0 -m "Version 1.0"
git push origin v1.0
```

### Rollback Changes

```bash
# Undo last commit (keep files)
git reset --soft HEAD~1

# Undo last commit (discard files)
git reset --hard HEAD~1

# Checkout specific version
git checkout v1.0
```

---

## 🎓 Quick Reference

### Most Used Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Populate database
npm run lint         # Check code quality
```

### Essential URLs

```
http://localhost:3000/              # Home page
http://localhost:3000/auth/login    # Login
http://localhost:3000/students      # Students
http://localhost:3000/about         # About
http://localhost:3000/contact       # Contact
```

### Test Credentials

```
Email:    admin@ccs.edu
Password: password123
```

---

## 📝 Documentation Quick Links

| Command         | File to Check    |
| --------------- | ---------------- |
| Setup help      | QUICK_START.md   |
| API details     | BACKEND_GUIDE.md |
| Components      | ATOMIC_DESIGN.md |
| Architecture    | ARCHITECTURE.md  |
| Troubleshooting | BACKEND_GUIDE.md |
| Deployment      | BACKEND_GUIDE.md |

---

**Happy coding! 🚀**

_For more detailed information, see the documentation files._
