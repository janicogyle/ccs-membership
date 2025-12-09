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


## Architecture

This project follows the **Atomic Design Pattern** methodology:

### Component Structure
```
components/
├── atoms/       # Basic UI elements (Button, Input, Label, Logo, Text)
├── molecules/   # Simple component groups (FormField, NavLink, Card)
├── organisms/   # Complex UI sections (Header, LoginForm, HeroSection)
└── templates/   # Page layouts (AuthTemplate, PageTemplate)
```

### TypeScript Interfaces
```
types/
├── api.ts          # API response types
├── components.ts   # Component prop types
└── index.ts        # Barrel exports
```

**📚 See [ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md) for detailed documentation**
**📊 See [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md) for visual diagrams**
