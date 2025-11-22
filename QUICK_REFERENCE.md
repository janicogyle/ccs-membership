# Quick Reference Guide

## Import Cheat Sheet

```tsx
// Atoms
import { Button, Input, Label, Logo, Text } from '@/components/atoms';

// Molecules
import { FormField, NavLink, AuthButtons, Card, FeatureItem } from '@/components/molecules';

// Organisms
import { Header, LoginForm, RegisterForm, HeroSection, FeatureList } from '@/components/organisms';

// Templates
import { AuthTemplate, PageTemplate } from '@/components/templates';

// Types
import { ButtonProps, LoginCredentials, User, AuthResponse } from '@/types';

// All at once
import { Button, FormField, Header, AuthTemplate } from '@/components';
```

## Component Quick Reference

### Atoms

#### Button
```tsx
<Button 
  variant="primary" | "secondary" | "danger" | "ghost"
  size="sm" | "md" | "lg"
  fullWidth={boolean}
  loading={boolean}
  onClick={handler}
>
  Click Me
</Button>
```

#### Input
```tsx
<Input
  type="text" | "email" | "password"
  placeholder="Enter text"
  value={value}
  onChange={handler}
  error="Error message"
  disabled={boolean}
/>
```

#### Label
```tsx
<Label htmlFor="inputId" required={boolean}>
  Label Text
</Label>
```

#### Logo
```tsx
<Logo size="sm" | "md" | "lg" />
```

#### Text
```tsx
<Text 
  as="p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  variant="body" | "caption" | "title" | "subtitle"
>
  Content
</Text>
```

### Molecules

#### FormField
```tsx
<FormField
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required={boolean}
  disabled={boolean}
  placeholder="john@example.com"
/>
```

#### NavLink
```tsx
<NavLink href="/about" active={boolean}>
  About
</NavLink>
```

#### AuthButtons
```tsx
<AuthButtons
  isAuthenticated={boolean}
  onLogout={handleLogout}
/>
```

#### Card
```tsx
<Card
  href="/students"
  title="Students"
  description="View directory"
  icon="📚"
/>
```

#### FeatureItem
```tsx
<FeatureItem icon="✓" text="Feature description" />
```

### Organisms

#### Header
```tsx
<Header />
```

#### LoginForm
```tsx
<LoginForm
  onSubmit={(credentials) => handleLogin(credentials)}
  loading={boolean}
  error="Error message"
/>
```

#### RegisterForm
```tsx
<RegisterForm
  onSubmit={(data) => handleRegister(data)}
  loading={boolean}
  error="Error message"
/>
```

#### HeroSection
```tsx
<HeroSection
  title="Welcome"
  subtitle="Get started"
  logoSrc="/logo.svg"
/>
```

#### FeatureList
```tsx
<FeatureList
  title="Features"
  features={[
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]}
/>
```

### Templates

#### AuthTemplate
```tsx
<AuthTemplate
  title="Sign In"
  subtitle={<>Don't have an account? <a href="/signup">Sign up</a></>}
>
  {/* Auth form content */}
</AuthTemplate>
```

#### PageTemplate
```tsx
<PageTemplate>
  {/* Page content */}
</PageTemplate>
```

## Common Patterns

### Form with Validation
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

<FormField
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>

<FormField
  id="password"
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  error={errors.password}
  required
/>

<Button type="submit" variant="primary" fullWidth>
  Submit
</Button>
```

### Card Grid
```tsx
<div className="grid gap-6 md:grid-cols-3">
  <Card href="/page1" title="Title 1" description="Desc 1" icon="📚" />
  <Card href="/page2" title="Title 2" description="Desc 2" icon="ℹ️" />
  <Card href="/page3" title="Title 3" description="Desc 3" icon="📞" />
</div>
```

### Navigation Menu
```tsx
<nav className="flex space-x-4">
  <NavLink href="/">Home</NavLink>
  <NavLink href="/about">About</NavLink>
  <NavLink href="/contact">Contact</NavLink>
</nav>
```

### Feature List
```tsx
<FeatureList
  title="Why Choose Us"
  features={[
    "Fast and reliable",
    "Easy to use",
    "Great support",
    "Affordable pricing"
  ]}
/>
```

### Auth Page
```tsx
export default function LoginPage() {
  const { login, loading, error } = useAuthRequest();

  return (
    <AuthTemplate title="Sign In">
      <LoginForm
        onSubmit={login}
        loading={loading}
        error={error}
      />
    </AuthTemplate>
  );
}
```

### Content Page
```tsx
export default function HomePage() {
  return (
    <PageTemplate>
      <HeroSection
        title="Welcome"
        subtitle="Get started today"
      />
      
      <main className="grid gap-6 md:grid-cols-3">
        {/* Cards */}
      </main>
      
      <FeatureList features={features} />
    </PageTemplate>
  );
}
```

## TypeScript Interface Examples

### Component Props
```tsx
import { ButtonProps, FormFieldProps } from '@/types';

const MyButton: React.FC<ButtonProps> = (props) => {
  // Implementation
};

const MyFormField: React.FC<FormFieldProps> = (props) => {
  // Implementation
};
```

### API Types
```tsx
import { LoginCredentials, AuthResponse, User } from '@/types';

const handleLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  return response.json();
};

const user: User = {
  _id: '123',
  email: 'user@example.com',
  name: 'John Doe'
};
```

## Styling Tips

### Using Tailwind with Components
```tsx
// Add custom classes
<Button className="mt-4 shadow-lg">
  Custom Styled Button
</Button>

// Override default styles
<Card className="bg-blue-500 border-blue-700">
  Custom Card
</Card>
```

### Responsive Design
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>

<Text className="text-sm md:text-base lg:text-lg">
  Responsive text
</Text>
```

## File Structure Quick Lookup

```
Need a button? → components/atoms/Button.tsx
Need a form field? → components/molecules/FormField.tsx
Need a header? → components/organisms/Header.tsx
Need a page layout? → components/templates/PageTemplate.tsx
Need prop types? → types/components.ts
Need API types? → types/api.ts
```

## Common Tasks

### Adding a New Atom
1. Create `components/atoms/NewAtom.tsx`
2. Define props in `types/components.ts`
3. Export from `components/atoms/index.ts`
4. Use: `import { NewAtom } from '@/components/atoms'`

### Adding a New Page
1. Create page in `app/newpage/page.tsx`
2. Import template: `import { PageTemplate } from '@/components/templates'`
3. Import organisms/molecules as needed
4. Compose the page

### Creating a Form
1. Use `FormField` molecules for inputs
2. Use `Button` atom for submit
3. Wrap in form element
4. Handle validation and submission

### Building a Layout
1. Use `PageTemplate` or `AuthTemplate`
2. Add organisms (Header, HeroSection, etc.)
3. Add molecules (Cards, NavLinks, etc.)
4. Style with Tailwind classes

## Troubleshooting

### Import not found
- Check barrel exports in index.ts files
- Verify component name matches export
- Ensure path alias `@/` is configured

### TypeScript errors
- Verify props match interface definition
- Check for required vs optional props
- Ensure types are imported correctly

### Styling not applied
- Check Tailwind class names
- Verify className prop is passed
- Check for conflicting styles

## Resources

- **Full Documentation:** [ATOMIC_DESIGN.md](./ATOMIC_DESIGN.md)
- **Component Diagrams:** [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)
- **Implementation Details:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Project Setup:** [README.md](./README.md)
