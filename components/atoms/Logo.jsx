import Link from 'next/link';
import { APP_NAME } from '@/constants';

export default function Logo({ className = '', size = 'md' }) {
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };
  
  return (
    <Link 
      href="/" 
      className={`font-bold text-gray-900 ${sizeStyles[size]} ${className}`}
    >
      {APP_NAME}
    </Link>
  );
}
