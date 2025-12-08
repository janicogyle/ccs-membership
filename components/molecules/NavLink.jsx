'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function NavLink({ href, children, active, className = '' }) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : pathname === href;
  
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm transition-colors rounded-lg ${
        isActive 
          ? 'text-white bg-white/20' 
          : 'text-white/90 hover:text-white hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </Link>
  );
}
