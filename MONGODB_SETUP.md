# ⚠️ MongoDB Connection Error - Solutions

## Problem

```
❌ MongoServerSelectionError: connect ECONNREFUSED ::1:27017
```

**This means:** MongoDB is not running on your machine.

---

## ✅ Solution: Start MongoDB

### Option 1: MongoDB Community (Recommended)

#### On Windows with MongoDB Installed:

**Method A: Using Services (Easiest)**

```powershell
# Open PowerShell as Administrator and run:
net start MongoDB

# Verify it's running:
Get-Service MongoDB
```

**Method B: Using mongod command directly**

```powershell
# If MongoDB is installed, run:
mongod

# You should see:
# [initandlisten] Listening on 127.0.0.1:27017
```

**Method C: Using brew on Windows (if installed)**

```powershell
brew services start mongodb-community
```

---

### Option 2: Install MongoDB Community Edition

#### Windows Installation:

1. Download from: https://www.mongodb.com/try/download/community
2. Run the `.msi` installer
3. Choose "Install MongoDB as a Service" (checked by default)
4. Complete installation
5. MongoDB will auto-start as a service

**Verify Installation:**

```powershell
# Check if mongod.exe exists
Get-Command mongod

# Or check in Services:
# Press Win+R → services.msc
# Look for "MongoDB"
```

---

### Option 3: MongoDB Atlas (Cloud - No Installation)

If you don't want to install MongoDB locally:

#### Setup MongoDB Atlas:

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Get connection string
5. Update `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ccs_membership?retryWrites=true&w=majority
MONGODB_DB=ccs_membership
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

6. Run seed script again

---

### Option 4: Docker (If installed)

```bash
# Start MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running:
docker ps | grep mongodb
```

---

## 🔍 Verify MongoDB is Running

### Method 1: Test Connection with mongosh

```bash
# If mongosh is installed:
mongosh

# You should see the MongoDB shell prompt:
# test>
```

### Method 2: Check Port 27017

```powershell
# Windows - check if port 27017 is listening:
netstat -ano | findstr :27017

# You should see: LISTENING

# If nothing shows, MongoDB is not running
```

### Method 3: Check MongoDB Service Status

```powershell
# Open PowerShell as Administrator:
Get-Service MongoDB

# Should show:
# Status   Name           DisplayName
# ------   ----           -----------
# Running  MongoDB        MongoDB
```

---

## 🧪 Test MongoDB Connection

Once MongoDB is running, test the connection:

```bash
# Try the seed script again
npm run seed

# You should see:
# 🌱 Starting seed process...
# ✓ Cleared existing data
# ✓ Inserted 3 users
# ✓ Inserted 8 students
# ✓ Created database indexes
# ✅ Seed process completed successfully!
```

---

## 📝 Complete Testing Workflow

### Step 1: Start MongoDB

```bash
# Terminal 1 - Start MongoDB
mongod

# Or using service (Windows):
net start MongoDB
```

### Step 2: Install Dependencies (if not done)

```bash
# Terminal 2 - Install npm packages
npm install
```

### Step 3: Seed Database

```bash
# Terminal 2 - Populate test data
npm run seed

# Expected output:
# ✅ Seed process completed successfully!
# 📝 Test Credentials:
#   Email: admin@ccs.edu
#   Password: password123
```

### Step 4: Start Development Server

```bash
# Terminal 2 - Start Next.js dev server
npm run dev

# Expected output:
# > next dev --turbopack
# ▲ Next.js 15.5.6
# ✓ Ready in 2.1s
# ➜ Local: http://localhost:3000
```

### Step 5: Open Browser

```
Navigate to: http://localhost:3000
```

### Step 6: Start Testing

```
Follow the tests in TESTING_GUIDE.md
Login: admin@ccs.edu
Password: password123
```

---

## ⚠️ Common Issues

### Issue 1: "Cannot find mongod command"

```
Solution: MongoDB not installed or not in PATH

1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Restart terminal/PowerShell
4. Try: mongod
```

### Issue 2: "Permission denied running mongod"

```
Solution: Run as Administrator

# PowerShell as Administrator → Run:
mongod
```

### Issue 3: "Port 27017 already in use"

```
Solution: MongoDB is already running, or another service uses port 27017

# Kill the process:
netstat -ano | findstr :27017
# Note the PID, then:
taskkill /PID <PID> /F

# Or use different port:
mongod --port 27018
# Then update .env.local:
# MONGODB_URI=mongodb://localhost:27018
```

### Issue 4: "Service MongoDB not found"

```
Solution: MongoDB not installed as service

# Install MongoDB Community Edition
# Or start with: mongod

# If you want to install as service:
mongod --install
```

---

## 🆘 Need More Help?

### MongoDB Windows Installation Guide:

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

### MongoDB Troubleshooting:

https://docs.mongodb.com/manual/reference/log-messages/

### Check MongoDB Status:

```powershell
# View all services
Get-Service | grep -i mongo

# Start service
Start-Service MongoDB

# Stop service
Stop-Service MongoDB
```

---

## ✅ When MongoDB is Running

You should see:

```
[initandlisten] Listening on 127.0.0.1:27017
[initandlisten] Accepting connections
```

Then you can:

1. ✅ Run `npm run seed`
2. ✅ Run `npm run dev`
3. ✅ Access http://localhost:3000
4. ✅ Follow testing guide

---

## 🚀 Ready to Continue?

Once MongoDB is running and seed is complete, proceed with:

```bash
npm run dev
```

Then open browser to: **http://localhost:3000**

And follow the **TESTING_GUIDE.md** starting with TEST 1: Authentication Flow
