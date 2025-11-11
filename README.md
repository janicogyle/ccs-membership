# CCS Membership System

A Next.js authentication system with MongoDB integration.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create `.env.local` file (already created with default values):
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ccs_membership
JWT_SECRET=your-secret-key
```

3. **Start MongoDB** (locally or use MongoDB Atlas)

4. **Run development server:**
```bash
npm run dev
```

Visit http://localhost:3000

## Features

- 🔐 Authentication (Login/Signup)
- 🗄️ MongoDB integration
- 📄 Multiple pages (Home, About, Students, Contact)
- 🎨 Tailwind CSS styling
- ⚡ Next.js 15 with JavaScript
