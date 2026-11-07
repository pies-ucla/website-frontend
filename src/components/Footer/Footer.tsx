'use client';

import { usePathname } from 'next/navigation';
import QuickLinks from '../QuickLinks/QuickLinks';

export default function Footer() {
  const pathname = usePathname();
  // the login page is full screen
  if (pathname === '/login') return null;

  return (
    <div>
      <QuickLinks />
    </div>  
  )
};
