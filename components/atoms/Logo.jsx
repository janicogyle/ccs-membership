import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/constants';

export default function Logo({ className = '', size = 'md', showText = true }) {
  const sizeMap = {
    sm: { width: 40, height: 40, text: 'text-base' },
    md: { width: 50, height: 50, text: 'text-lg' },
    lg: { width: 70, height: 70, text: 'text-2xl' },
  };
  
  const dimensions = sizeMap[size];
  
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
    >
      {showText && (
        <span className={`font-bold text-white ${dimensions.text} tracking-wide whitespace-nowrap`}>
          CCS MemberLink
        </span>
      )}
    </Link>
  );
}
