'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="vox-header">
      <div className="vox-container flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="vox-logo">
            <span className="text-white dark:text-stone-900 font-bold text-xl">V</span>
          </div>
          <h1 className="vox-logo-text">Vox Dualis</h1>
        </div>
        <nav className="vox-nav">
          <Link 
            href="/" 
            className={pathname === '/' ? 'vox-nav-link-active' : 'vox-nav-link'}
          >
            Home
          </Link>
          <Link 
            href="/arena" 
            className={pathname === '/arena' ? 'vox-nav-link-active' : 'vox-nav-link'}
          >
            Arena
          </Link>
          <a href="#about" className="vox-nav-link">About</a>
          <a href="#philosophy" className="vox-nav-link">Philosophy</a>
        </nav>
      </div>
    </header>
  );
}
