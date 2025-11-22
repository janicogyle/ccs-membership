# Component Structure Diagram

## Atomic Design Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                         PAGES                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Home (/)   │  │ Login Page   │  │ Signup Page  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                       TEMPLATES                              │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  PageTemplate    │         │  AuthTemplate    │          │
│  │  - Layout        │         │  - Auth Layout   │          │
│  │  - Footer        │         │  - Title/Subtitle│          │
│  └────────┬─────────┘         └────────┬─────────┘          │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       ORGANISMS                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Header     │  │  LoginForm   │  │ RegisterForm │      │
│  │  - Logo      │  │  - Fields    │  │  - Fields    │      │
│  │  - NavLinks  │  │  - Submit    │  │  - Submit    │      │
│  │  - AuthBtns  │  │  - Error     │  │  - Error     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│                            │                  │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ HeroSection  │  │ FeatureList  │  │              │      │
│  │  - Image     │  │  - Items     │  │              │      │
│  │  - Title     │  │  - Title     │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                       MOLECULES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  FormField   │  │   NavLink    │  │ AuthButtons  │      │
│  │  - Label     │  │  - Link      │  │  - Buttons   │      │
│  │  - Input     │  │  - Active    │  │  - Links     │      │
│  │  - Error     │  │              │  │              │      │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘      │
│                                              │              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Card     │  │ FeatureItem  │  │              │      │
│  │  - Title     │  │  - Icon      │  │              │      │
│  │  - Desc      │  │  - Text      │  │              │      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘      │
└─────────┼──────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                         ATOMS                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Button    │  │    Input     │  │    Label     │      │
│  │  - Variants  │  │  - Types     │  │  - Required  │      │
│  │  - Sizes     │  │  - Error     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │     Logo     │  │     Text     │                        │
│  │  - Sizes     │  │  - Variants  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│  TypeScript  │
│  Interfaces  │◄─────────────────┐
│  (types/)    │                  │
└──────┬───────┘                  │
       │                          │
       │ Props Definition         │ Type Safety
       ▼                          │
┌──────────────┐                  │
│  Components  │──────────────────┘
│  (Atoms to   │
│   Templates) │
└──────┬───────┘
       │
       │ Composition
       ▼
┌──────────────┐
│    Pages     │
│  (app/)      │
└──────┬───────┘
       │
       │ Render
       ▼
┌──────────────┐
│     UI       │
└──────────────┘
```

## Component Relationships

### Home Page
```
PageTemplate
├── HeroSection
│   ├── Image (Next.js)
│   ├── Text (Atom)
│   └── Text (Atom)
├── Card (Molecule) × 3
│   ├── Link (Next.js)
│   ├── Text (Atom)
│   └── Text (Atom)
└── FeatureList (Organism)
    ├── Text (Atom)
    └── FeatureItem (Molecule) × n
        ├── Text (Atom)
        └── Text (Atom)
```

### Login/Signup Pages
```
AuthTemplate
├── Text (Atom) - Title
├── Text (Atom) - Subtitle
└── LoginForm/RegisterForm (Organism)
    ├── FormField (Molecule) × n
    │   ├── Label (Atom)
    │   ├── Input (Atom)
    │   └── Text (Atom) - Error
    ├── Text (Atom) - Error Message
    └── Button (Atom) - Submit
```

### Header (All Pages)
```
Header (Organism)
├── Logo (Atom)
├── NavLink (Molecule) × 4
│   └── Link (Next.js)
└── AuthButtons (Molecule)
    ├── Button (Atom) - Logout
    └── Link + Button - Login/Signup
```

## File Organization

```
ccs-membership/
├── types/
│   ├── api.ts              # API response interfaces
│   ├── components.ts       # Component prop interfaces
│   └── index.ts            # Barrel export
│
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   ├── Logo.tsx
│   │   ├── Text.tsx
│   │   └── index.ts
│   │
│   ├── molecules/
│   │   ├── FormField.tsx
│   │   ├── NavLink.tsx
│   │   ├── AuthButtons.tsx
│   │   ├── Card.tsx
│   │   ├── FeatureItem.tsx
│   │   └── index.ts
│   │
│   ├── organisms/
│   │   ├── Header.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeatureList.tsx
│   │   └── index.ts
│   │
│   ├── templates/
│   │   ├── AuthTemplate.tsx
│   │   ├── PageTemplate.tsx
│   │   └── index.ts
│   │
│   └── index.ts            # Main barrel export
│
└── app/
    ├── layout.jsx          # Uses Header
    ├── page.jsx            # Uses PageTemplate, organisms, molecules
    └── auth/
        ├── login/
        │   └── page.tsx    # Uses AuthTemplate, LoginForm
        └── signup/
            └── page.tsx    # Uses AuthTemplate, RegisterForm
```

## Interface Usage Example

```typescript
// Define interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

// Use in component
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  // Component logic
}

// Use in page
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>
```

## Benefits Summary

✅ **Reusability** - Components used across multiple pages
✅ **Type Safety** - TypeScript interfaces prevent errors
✅ **Maintainability** - Clear structure, easy to find components
✅ **Scalability** - Easy to add new components
✅ **Consistency** - Unified design system
✅ **Testability** - Isolated components, easy to test
