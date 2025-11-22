'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function NavLink({ href, children, active, className = '' }) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : pathname === href;
  
  const activeStyles = isActive 
    ? 'text-gray-900 font-semibold' 
    : 'text-gray-700 hover:text-gray-900';
  
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium transition-colors ${activeStyles} ${className}`}
    >
      {children}
    </Link>
  );
}
