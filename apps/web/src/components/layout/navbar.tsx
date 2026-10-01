'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, LogOut, LayoutDashboard, User, Bell } from 'lucide-react';
import { Button } from '@agribandhu/ui';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const guestLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blogs', href: '/blogs' },
  ];

  const authLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Farm', href: user?.role === 'FARMER' ? '/dashboard/farmer' : '/dashboard' },
    { label: 'About', href: '/about' },
    { label: 'Blogs', href: '/blogs' },
  ];

  const navLinks = user ? authLinks : guestLinks;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary-600 hover:opacity-90">
            <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-neutral-900">
              Agri<span className="text-primary-600">Bandhu</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-primary-600 relative py-1 ${
                    isActive ? 'text-primary-600' : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Badge */}
                <button className="relative rounded-full p-1.5 text-neutral-500 hover:bg-neutral-50 hover:text-primary-600 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-accent-yellow-500 ring-2 ring-white" />
                </button>

                {/* Profile Panel */}
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 border-l border-neutral-100 pl-4 hover:opacity-80 transition-opacity"
                  title="View Profile Dashboard"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm uppercase">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-neutral-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 uppercase tracking-wide">
                      {user.role}
                    </p>
                  </div>
                </Link>

                {/* Logout */}
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                  <span>Logout</span>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-neutral-100 bg-white shadow-lg overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-6 flex flex-col gap-3 px-4 border-t border-neutral-100 pt-6">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 leading-tight">{user.name}</p>
                        <p className="text-xs text-neutral-400 font-semibold">{user.email}</p>
                      </div>
                    </div>
                    <Button onClick={logout} variant="outline" className="w-full gap-2">
                      <span>Logout</span>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full" size="default">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full" size="default">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
