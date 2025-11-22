import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, AnchorHTMLAttributes } from 'react';

// Base Component Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Atom Props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export interface LabelProps extends BaseComponentProps {
  htmlFor?: string;
  required?: boolean;
}

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface TextProps extends BaseComponentProps {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'body' | 'caption' | 'title' | 'subtitle';
}

// Molecule Props
export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export interface AuthButtonsProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export interface FeatureItemProps {
  icon: string;
  text: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  href?: string;
  icon?: string;
}

// Organism Props
export interface HeaderProps {
  className?: string;
}

export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string;
}

export interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  loading?: boolean;
  error?: string;
}

export interface FeatureListProps {
  features: string[];
  title?: string;
}

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  logoSrc?: string;
}

// Template Props
export interface AuthTemplateProps {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

export interface PageTemplateProps {
  children: ReactNode;
  className?: string;
}
