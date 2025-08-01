'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', active: pathname === '/' },
    { href: '/projection', label: 'Projection Simulator', active: pathname === '/projection' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary-500">
              <span className="text-2xl">💰</span>
              <span className="hidden xs:inline">FinancePlanner</span>
              <span className="xs:hidden">FP</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? 'nav-link-active'
                      : 'nav-link-inactive'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="hidden lg:block text-sm text-primary-600 font-medium">
              Your 12-month financial roadmap
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-background-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-colors duration-200"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-64 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-background-50 border-t border-background-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                item.active
                  ? 'nav-link-active'
                  : 'nav-link-inactive'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="px-4 py-3 text-sm text-primary-600 font-medium border-t border-background-200 mt-4">
            Your 12-month financial roadmap
          </div>
        </div>
      </div>
    </nav>
  );
}