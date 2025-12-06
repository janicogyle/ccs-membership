# 🎯 CCS Membership - System Overview & Architecture

## Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Components                       │  │
│  ├────────────┬────────────┬────────────┬────────────────────┤  │
│  │  Atoms     │ Molecules  │ Organisms  │    Templates       │  │
│  │  (5)       │   (5)      │   (5)      │      (2)           │  │
│  └────────────┴────────────┴────────────┴────────────────────┘  │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Context & State                        │  │
│  │         ┌─────────────────────────────┐                   │  │
│  │         │    AuthContext (Global)     │                   │  │
│  │         │  - user info                │                   │  │
│  │         │  - isAuthenticated          │                   │  │
│  │         │  - token                    │                   │  │
│  │         └─────────────────────────────┘                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Services & HTTP Client                         │  │
│  │    ┌──────────────────────────────────────┐              │  │
│  │    │      authService                     │              │  │
│  │    │  - login()                           │              │  │
│  │    │  - register()                        │              │  │
│  │    │  - logout()                          │              │  │
│  │    │  - token management                  │              │  │
│  │    └──────────────────────────────────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                    │
└─────────────────────────────────────────────────────────────────┘
                            HTTP/REST
                    (JSON + Bearer Token)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ /api/auth/                                         │  │  │
│  │  │  • POST /login       → validate & issue JWT       │  │  │
│  │  │  • POST /register    → create user & issue JWT    │  │  │
│  │  │  • POST /logout      → invalidate session         │  │  │
│  │  │  • GET  /profile     → get user info (auth req)   │  │  │
│  │  │  • PUT  /profile     → update user (auth req)     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ /api/students/                                     │  │  │
│  │  │  • GET  /             → list all students         │  │  │
│  │  │  • POST /             → create student (auth req) │  │  │
│  │  │  • GET  /[id]         → get student by ID         │  │  │
│  │  │  • PUT  /[id]         → update student (auth req) │  │  │
│  │  │  • DELETE /[id]       → delete student (auth req) │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Request Handlers & Middleware                    │  │
│  │   ┌──────────────────────────────────────────────────┐   │  │
│  │   │ 1. Validate Request                             │   │  │
│  │   │ 2. Check Authentication (if required)           │   │  │
│  │   │ 3. Verify JWT Token                             │   │  │
│  │   │ 4. Process Business Logic                       │   │  │
│  │   │ 5. Query Database                               │   │  │
│  │   │ 6. Return Response                              │   │  │
│  │   └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Utilities & Libraries                        │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ bcryptjs          → Password hashing              │  │  │
│  │  │ jsonwebtoken      → JWT token creation/verify     │  │  │
│  │  │ MongoDB Driver    → Database client               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                    │
└─────────────────────────────────────────────────────────────────┘
                           TCP Connection
                              (Network)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB (Database)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────────────────┐   │
│  │  users collection │     │  students collection         │   │
│  │  ┌──────────────┐│     │  ┌──────────────────────────┐ │   │
│  │  │ _id          ││     │  │ _id                      │ │   │
│  │  │ name         ││     │  │ name                     │ │   │
│  │  │ email (idx)  ││     │  │ email (idx)              │ │   │
│  │  │ password     ││     │  │ major                    │ │   │
│  │  │ createdAt    ││     │  │ gpa                      │ │   │
│  │  │ updatedAt    ││     │  │ enrollmentYear           │ │   │
│  │  │              ││     │  │ createdAt                │ │   │
│  │  │ [documents]  ││     │  │ updatedAt                │ │   │
│  │  │              ││     │  │ [documents]              │ │   │
│  │  └──────────────┘│     │  └──────────────────────────┘ │   │
│  └──────────────────┘     └──────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow - User Registration

```
User Input (Name, Email, Password)
              ↓
        Signup Form
              ↓
    Validation (Client-side)
              ↓
    HTTP POST /api/auth/register
              ↓
    ┌─────────────────────────────┐
    │   Server: register handler  │
    │ 1. Extract data            │
    │ 2. Validate format         │
    │ 3. Check duplicate email   │
    │ 4. Hash password           │
    │ 5. Create user in DB       │
    │ 6. Generate JWT token      │
    │ 7. Return response         │
    └─────────────────────────────┘
              ↓
    Response: { user, token }
              ↓
    Store token in localStorage
              ↓
    Update AuthContext
              ↓
    Redirect to home
              ↓
    User logged in & authenticated
```

---

## 🔐 Data Flow - User Authentication

```
1. User Credentials
   ↓
2. LOGIN FLOW
   ├─ POST /api/auth/login
   ├─ Verify email exists
   ├─ Compare password hash
   ├─ Generate JWT token
   └─ Return user + token
   ↓
3. Token Storage
   ├─ Store in localStorage
   ├─ Add to request headers
   └─ Update React context
   ↓
4. Protected Route Access
   ├─ Check token in context
   ├─ Redirect if no token
   └─ Render protected content
   ↓
5. API Request with Auth
   ├─ Include "Authorization: Bearer <token>"
   ├─ Server verifies token
   ├─ Check token expiration
   ├─ Grant/deny access
   └─ Return response
   ↓
6. LOGOUT FLOW
   ├─ Clear localStorage
   ├─ Clear context
   ├─ Redirect to login
   └─ Session ended
```

---

## 🏗️ Component Hierarchy

```
App
├── AuthProvider (Context wrapper)
│   └── RootLayout
│       ├── Header (Organism)
│       │   ├── Logo (Atom)
│       │   ├── NavLink (Molecule) × 4
│       │   └── AuthButtons (Molecule)
│       │
│       └── Main Routes
│           ├── Home Page
│           │   └── PageTemplate
│           │       ├── HeroSection (Organism)
│           │       ├── FeatureList (Organism)
│           │       └── Card (Molecule) × 3
│           │
│           ├── Login Page
│           │   └── AuthTemplate
│           │       └── LoginForm (Organism)
│           │           └── FormField (Molecule) × 2
│           │
│           ├── Signup Page
│           │   └── AuthTemplate
│           │       └── RegisterForm (Organism)
│           │           └── FormField (Molecule) × 4
│           │
│           ├── Students Page
│           │   └── PageTemplate
│           │       ├── Button (Atom)
│           │       └── Card (Molecule) × N
│           │
│           ├── Student Detail Page
│           │   └── ProtectedRoute
│           │       └── Student detail form
│           │
│           ├── Create Student Page
│           │   └── ProtectedRoute
│           │       └── AuthTemplate
│           │           └── Student form
│           │
│           ├── About Page
│           │   └── PageTemplate
│           │       ├── HeroSection
│           │       └── Card × 3
│           │
│           └── Contact Page
│               └── PageTemplate
│                   └── Contact form
```

---

## 📊 Database Relationships

```
┌─────────────────────┐
│   users             │
├─────────────────────┤
│ _id (PK)            │
│ name                │
│ email (UNIQUE)      │◄─┐
│ password (hashed)   │  │ Authentication
│ createdAt           │  │ relationship
│ updatedAt           │  │
└─────────────────────┘  │
                         │
                         │
┌─────────────────────┐  │
│ students            │  │
├─────────────────────┤  │
│ _id (PK)            │  │
│ name                │  │
│ email (UNIQUE)      │◄─┘ Independent
│ major               │    (no direct FK)
│ gpa                 │
│ enrollmentYear      │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘

Note: No foreign key relationship
Users and Students are separate entities
Authenticated users can CRUD students
```

---

## 🔐 Authentication Flow Diagram

```
[User]
  │
  ├─→ Register (Create Account)
  │   └─→ POST /api/auth/register
  │       ├─ Validate input
  │       ├─ Hash password
  │       ├─ Create user
  │       └─ Issue JWT token
  │
  ├─→ Login (Get Access)
  │   └─→ POST /api/auth/login
  │       ├─ Verify credentials
  │       ├─ Compare password
  │       ├─ Generate JWT token
  │       └─ Return token + user info
  │
  ├─→ Store Token
  │   ├─ localStorage.setItem('auth_token', token)
  │   └─ Update React Context
  │
  ├─→ Request Protected Resource
  │   ├─ Add header: Authorization: Bearer <token>
  │   └─→ Server verifies token
  │       ├─ Token valid?
  │       │  Yes → Process request
  │       │  No  → Return 401 Unauthorized
  │       └─ Return response
  │
  └─→ Logout (End Session)
      ├─ Clear localStorage
      ├─ Clear React Context
      ├─ POST /api/auth/logout
      └─ Redirect to login
```

---

## 📱 Pages & Routes Structure

```
ccs-membership.com
│
├── / (Home)
│   └── Hero + Features + Cards
│
├── /auth/login
│   └── Login form
│
├── /auth/signup
│   └── Signup form
│
├── /about
│   └── About CCS + Values + Team
│
├── /contact
│   └── Contact form + Info
│
├── /students
│   └── Student directory (public)
│
├── /students/:id
│   └── Student details (public)
│
└── /students/create
    └── Create new student (protected - requires auth)

Protected Routes (Require Login):
- /students/create
- Any PUT/DELETE operations on students
```

---

## 🧩 Component Composition Example

```
LoginPage
  │
  ├── AuthTemplate
  │   │   Props:
  │   │   - title: "Sign In"
  │   │   - children: <LoginForm />
  │   │
  │   └── LoginForm (Organism)
  │       │   Props:
  │       │   - onSubmit
  │       │   - loading
  │       │   - error
  │       │
  │       ├── FormField (Molecule) × 2
  │       │   │   Props:
  │       │   │   - id
  │       │   │   - label
  │       │   │   - type
  │       │   │   - value
  │       │   │   - onChange
  │       │   │
  │       │   ├── Label (Atom)
  │       │   │   Props: htmlFor, children
  │       │   │
  │       │   └── Input (Atom)
  │       │       Props: type, value, onChange, placeholder
  │       │
  │       └── Button (Atom)
  │           Props: variant, type, loading, children
```

---

## ⚡ Request/Response Flow

```
CLIENT                          SERVER                       DATABASE
  │                               │                              │
  ├─ User fills login form        │                              │
  │                               │                              │
  └─ Click Login                  │                              │
      │                           │                              │
      ├─ POST /api/auth/login     │                              │
      │  {email, password}        │                              │
      │──────────────────────────→│                              │
      │                           │                              │
      │                           ├─ Validate input             │
      │                           │                              │
      │                           ├─ Query user by email        │
      │                           │───────────────────────────→│
      │                           │                              │
      │                           │← Return user document      │
      │                           │                              │
      │                           ├─ Compare passwords         │
      │                           │                              │
      │                           ├─ Generate JWT token        │
      │                           │                              │
      │← Response {user, token}   │                              │
      │←──────────────────────────┤                              │
      │                           │                              │
      ├─ Store token              │                              │
      │ in localStorage            │                              │
      │                           │                              │
      ├─ Update context           │                              │
      │                           │                              │
      └─ Redirect home            │                              │
```

---

## 🎯 State Management Overview

```
Global State (React Context)
│
└── AuthContext
    │
    ├── user: {
    │   _id: string,
    │   name: string,
    │   email: string
    │ }
    │
    ├── isAuthenticated: boolean
    │
    ├── isLoading: boolean
    │
    ├── token: string | null
    │
    ├── Functions:
    │   ├── login(userData, token)
    │   ├── logout()
    │   ├── updateUser(data)
    │   └── getToken()
    │
    └── Consumed by:
        ├── Header (show user menu)
        ├── ProtectedRoute (check auth)
        ├── LoginForm (update on success)
        ├── RegisterForm (update on success)
        └── Multiple pages (check access)
```

---

## 📈 Scalability & Extension Points

```
Ready to Extend:

API Endpoints
├── Add new collections
├── Add bulk operations
├── Add search/filter
└── Add pagination

Components
├── Add Avatar component
├── Add Modal component
├── Add Notification
└── Add DatePicker

Features
├── Email verification
├── Password reset
├── Social login
├── Two-factor auth

Database
├── Add indexes
├── Add relationships
├── Add aggregations
└── Add backups

UI
├── Dark mode
├── Theming
├── Internationalization
└── Animations
```

---

## 🚀 Deployment Architecture

```
Local Development
│
├─ npm run dev
├─ localhost:3000
└─ Hot reload enabled
│
│ (Commit & Push to GitHub)
│
Production (Vercel/Netlify/etc)
│
├─ npm run build
├─ Build optimization
├─ Next.js compilation
│
├─ Environment Variables
│ ├─ MONGODB_URI
│ ├─ JWT_SECRET
│ └─ NEXT_PUBLIC_API_URL
│
├─ Database (MongoDB Atlas)
│ ├─ Scalable cluster
│ ├─ Automatic backups
│ └─ Global distribution
│
└─ Deployment Complete
  ├─ HTTPS enabled
  ├─ CDN distributed
  ├─ Performance optimized
  └─ Ready for production
```

---

**This architecture ensures:**
✅ Security through JWT authentication
✅ Scalability with microservices-ready design
✅ Maintainability with clear component hierarchy
✅ Performance through optimized data flow
✅ Reliability through error handling

---

_Architecture Diagram Last Updated: December 2024_
