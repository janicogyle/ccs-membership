# CCS Membership - Complete Web Application

A modern, full-stack web application for managing Computer Science Society (CCS) membership, built with Next.js, React, MongoDB, and Tailwind CSS.

## 🚀 Features

### Frontend

- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Atomic Design Pattern architecture (17 components)
- ✅ TypeScript type safety (25+ interfaces)
- ✅ Authentication system (Login/Register/Logout)
- ✅ Student directory with search and filtering
- ✅ Protected routes for authenticated users
- ✅ Global authentication context
- ✅ Contact form with validation
- ✅ About page with company information

### Backend

- ✅ Next.js API routes (RESTful)
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ User and student management
- ✅ Protected API endpoints
- ✅ Error handling and validation
- ✅ CORS ready

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd ccs-membership

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=ccs_membership

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**MongoDB Setup:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add your IP address to network access
4. Create a database user
5. Copy the connection string to `MONGODB_URI`

### 3. Database Seeding

Populate the database with sample data:

```bash
npm run seed
```

This creates:

- 3 test users (email: admin@ccs.edu, password: password123)
- 8 sample students

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📚 Available Scripts

```bash
# Development with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Seed database with sample data
npm run seed
```

## 🔐 Authentication

### Test Credentials

- **Email:** admin@ccs.edu
- **Password:** password123

### User Registration

1. Click "Sign Up" on the login page
2. Fill in name, email, and password
3. Password must be at least 6 characters
4. You'll be logged in automatically after registration

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/auth/login

Login with email and password

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: `{ success, message, user, token }`

#### POST /api/auth/register

Create a new user account

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response: `{ success, message, user, token }`

#### POST /api/auth/logout

Logout the current user

#### GET /api/auth/profile

Get current user profile (requires authentication)

```
Headers: Authorization: Bearer <token>
```

#### PUT /api/auth/profile

Update user profile (requires authentication)

```json
{
  "name": "New Name",
  "email": "new@example.com"
}
```

### Student Endpoints

#### GET /api/students

Get all students

#### POST /api/students

Create a new student (requires authentication)

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "major": "Computer Science",
  "gpa": 3.9,
  "enrollmentYear": 2023
}
```

#### GET /api/students/[id]

Get student by ID

#### PUT /api/students/[id]

Update student (requires authentication)

#### DELETE /api/students/[id]

Delete student (requires authentication)

## 🗂️ Project Structure

```
ccs-membership/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── students/             # Student management endpoints
│   ├── auth/                     # Authentication pages
│   ├── students/                 # Student pages
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   └── page.jsx                  # Home page
│
├── components/                   # React components (Atomic Design)
│   ├── atoms/                    # Basic components
│   ├── molecules/                # Simple combinations
│   ├── organisms/                # Complex sections
│   └── templates/                # Page layouts
│
├── contexts/                     # React Context
│   └── AuthContext.jsx          # Authentication state
│
├── lib/                          # Utilities
│   ├── mongodb.js               # MongoDB connection
│   └── auth.js                  # Auth helpers
│
├── services/                     # Business logic
│   └── authService.js           # Authentication service
│
├── hooks/                        # Custom hooks
│   └── useAuthRequest.js        # Auth request hook
│
├── types/                        # TypeScript interfaces
├── constants/                    # App constants
├── scripts/                      # Utility scripts
│   └── seed.js                  # Database seeding
│
└── public/                       # Static assets
```

## 🎨 Component Library

### Atoms (Basic Components)

- `Button` - Customizable button with variants
- `Input` - Form input with error handling
- `Label` - Form label with required indicator
- `Logo` - Application logo
- `Text` - Typography component

### Molecules (Combinations)

- `FormField` - Complete form field
- `NavLink` - Navigation link
- `AuthButtons` - Auth button group
- `Card` - Content card
- `FeatureItem` - Feature list item

### Organisms (Complex)

- `Header` - Main navigation
- `LoginForm` - Login form
- `RegisterForm` - Registration form
- `HeroSection` - Hero section
- `FeatureList` - Feature list

### Templates

- `AuthTemplate` - Auth page layout
- `PageTemplate` - General page layout

## 🔄 Component Usage Example

```jsx
import { Button, Input } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { LoginForm } from "@/components/organisms";
import { AuthTemplate } from "@/components/templates";
import { useAuth } from "@/contexts/AuthContext";

function MyPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <AuthTemplate title="Sign In">
      <LoginForm />
    </AuthTemplate>
  );
}
```

## 🛡️ Protected Routes

Use the `ProtectedRoute` component to require authentication:

```jsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function PrivatePage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to logged-in users</div>
    </ProtectedRoute>
  );
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

```bash
# Using Vercel CLI
vercel deploy
```

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:

- Netlify
- AWS
- Google Cloud
- Heroku
- DigitalOcean

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Students Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  major: String,
  gpa: Number,
  enrollmentYear: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User Registration (valid email, password confirmation)
- [ ] User Login (correct & incorrect credentials)
- [ ] Protected Routes (redirect to login when not authenticated)
- [ ] Student List (load all students)
- [ ] Create Student (requires authentication)
- [ ] View Student Details (edit & delete)
- [ ] Contact Form (submit message)
- [ ] Navigation (header links work)
- [ ] Logout (clear token, redirect to login)

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check `MONGODB_URI` in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### JWT Token Errors

- Verify `JWT_SECRET` is set in `.env.local`
- Check token is included in Authorization header
- Ensure token hasn't expired (7-day expiration)

### CORS Issues

- Check API endpoint configuration
- Verify headers are set correctly
- Ensure credentials are passed in fetch requests

### "Page not found" errors

- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Restart dev server: `npm run dev`

## 📝 Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `MONGODB_DB` - Database name
- [ ] `JWT_SECRET` - Strong random string for JWT signing
- [ ] `NEXT_PUBLIC_API_URL` - API URL (for CORS, can be relative)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review API documentation
3. Check console logs in browser and server
4. Create an issue on GitHub

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Atomic Design Pattern](https://atomicdesign.bradfrost.com/)

## ✅ Completion Checklist

- [x] Frontend UI with Atomic Design components
- [x] Authentication system (login/register/logout)
- [x] MongoDB integration
- [x] JWT authentication
- [x] Student management (CRUD)
- [x] Protected routes
- [x] Global auth context
- [x] Responsive design
- [x] Error handling
- [x] Database seeding
- [x] API documentation
- [x] Deployment ready

---

**Status:** ✅ Production Ready

Last Updated: December 2024
