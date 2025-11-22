# Atomic Design Pattern Implementation

This project follows the **Atomic Design Pattern** methodology for organizing UI components.

## Structure Overview

```
components/
├── atoms/           # Basic building blocks
├── molecules/       # Simple component groups
├── organisms/       # Complex UI sections
└── templates/       # Page-level layouts
```

## Component Hierarchy

### 🔹 Atoms
Basic, indivisible UI elements that serve as the foundation.

- **Button** - Reusable button with variants (primary, secondary, danger, ghost)
- **Input** - Form input field with error handling
- **Label** - Form label with required indicator
- **Logo** - Application logo/brand component
- **Text** - Typography component with variants

**Usage:**
```tsx
import { Button, Input, Label } from '@/components/atoms';

<Button variant="primary" size="md">Click Me</Button>
<Input type="email" placeholder="Enter email" />
<Label htmlFor="email" required>Email</Label>
```

### 🔸 Molecules
Simple groups of atoms functioning together as a unit.

- **FormField** - Complete form field (Label + Input + Error)
- **NavLink** - Navigation link with active state
- **AuthButtons** - Authentication button group (Login/Signup or Logout)
- **Card** - Content card with title, description, and optional link
- **FeatureItem** - Feature list item with icon

**Usage:**
```tsx
import { FormField, Card, NavLink } from '@/components/molecules';

<FormField
  id="email"
  label="Email"
  value={email}
  onChange={setEmail}
  required
/>

<Card
  href="/students"
  title="Students"
  description="View student directory"
  icon="📚"
/>

<NavLink href="/about">About</NavLink>
```

### 🔶 Organisms
Complex components composed of molecules and atoms.

- **Header** - Main navigation header with logo and auth buttons
- **LoginForm** - Complete login form with validation
- **RegisterForm** - Complete registration form with validation
- **HeroSection** - Hero section with logo, title, and subtitle
- **FeatureList** - List of features with styling

**Usage:**
```tsx
import { Header, LoginForm, HeroSection } from '@/components/organisms';

<Header />

<LoginForm
  onSubmit={handleLogin}
  loading={loading}
  error={error}
/>

<HeroSection
  title="Welcome"
  subtitle="Get started"
  logoSrc="/logo.svg"
/>
```

### 🔷 Templates
Page-level layouts that define structure.

- **AuthTemplate** - Layout for authentication pages
- **PageTemplate** - General page layout with footer

**Usage:**
```tsx
import { AuthTemplate, PageTemplate } from '@/components/templates';

<AuthTemplate title="Sign In" subtitle={<>Don't have an account?</>}>
  {/* Auth form content */}
</AuthTemplate>

<PageTemplate>
  {/* Page content */}
</PageTemplate>
```

## TypeScript Interfaces

All components use TypeScript interfaces defined in `/types`:

### API Types (`types/api.ts`)
- `ApiResponse<T>` - Generic API response
- `LoginCredentials` - Login form data
- `RegisterData` - Registration form data
- `User` - User object
- `AuthResponse` - Authentication response

### Component Props (`types/components.ts`)
- Props for all atoms, molecules, organisms, and templates
- Extends native HTML element props where applicable
- Includes custom props for component-specific functionality

**Example:**
```tsx
import { ButtonProps, FormFieldProps } from '@/types';

const MyButton: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  // Component implementation
};
```

## Benefits

### ✅ Reusability
Components can be reused across different pages and contexts.

### ✅ Consistency
Unified design system ensures consistent UI/UX.

### ✅ Maintainability
Clear hierarchy makes it easy to locate and update components.

### ✅ Scalability
New features can be built by composing existing components.

### ✅ Type Safety
TypeScript interfaces provide compile-time type checking.

### ✅ Testing
Isolated components are easier to test independently.

## Best Practices

1. **Keep atoms simple** - They should be as basic as possible
2. **Molecules should be focused** - Each should serve a single purpose
3. **Organisms can be complex** - But should still be reusable
4. **Templates define layout** - Not specific content
5. **Use TypeScript** - Always define proper interfaces
6. **Follow naming conventions** - Clear, descriptive names
7. **Document props** - Add JSDoc comments for complex props

## File Naming Convention

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Types: `camelCase.ts` (e.g., `components.ts`)
- Index files: `index.ts` for barrel exports

## Import Pattern

Use barrel exports for cleaner imports:

```tsx
// ✅ Good
import { Button, Input } from '@/components/atoms';
import { FormField, Card } from '@/components/molecules';

// ❌ Avoid
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
```

## Pages Using Atomic Components

- **Home** (`/`) - Uses PageTemplate, HeroSection, Card, FeatureList
- **Login** (`/auth/login`) - Uses AuthTemplate, LoginForm
- **Signup** (`/auth/signup`) - Uses AuthTemplate, RegisterForm
- **Layout** - Uses Header organism

## Future Enhancements

- Add more atom variants (badges, avatars, icons)
- Create more molecule combinations
- Build page-specific organisms
- Add animation components
- Implement theme system
- Add Storybook for component documentation
