'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, LayoutDashboard, User, Settings, Bell, Menu, X, Landmark, Compass, FolderHeart, CalendarRange, ShieldAlert } from 'lucide-react';
import { Button } from '@agribandhu/ui';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto" />
          <p className="text-neutral-500 font-semibold text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const farmerItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard/farmer', icon: LayoutDashboard },
    { label: 'My Farms', href: '/dashboard/farms', icon: Compass },
    { label: 'Farm Planner', href: '/dashboard/planner', icon: CalendarRange },
    { label: 'AI Disease Scanner', href: '/dashboard/disease-detection', icon: ShieldAlert },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Activities', href: '/dashboard/activities', icon: FolderHeart },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const officerItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard/officer', icon: LayoutDashboard },
    { label: 'Assigned Farmers', href: '/officer/farmers', icon: FolderHeart },
    { label: 'Farm Planner', href: '/dashboard/planner', icon: CalendarRange },
    { label: 'AI Disease Diagnostics', href: '/dashboard/disease-detection', icon: ShieldAlert },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/admin/users', icon: Landmark },
    { label: 'System Settings', href: '/dashboard/settings', icon: Settings },
  ];

  let menuItems = farmerItems;
  if (user.role === 'OFFICER') menuItems = officerItems;
  if (user.role === 'ADMIN') menuItems = adminItems;

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((crumb) => {
      if (crumb === 'farms') return 'My Farms';
      if (crumb === 'planner') return 'Farm Planner';
      if (crumb === 'disease-detection') return 'Disease Scanner';
      if (crumb === 'reports') return 'AI Reports';
      return crumb.charAt(0).toUpperCase() + crumb.slice(1);
    });

  return (
    <div className="min-h-screen flex bg-neutral-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-100 shrink-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-neutral-100">
          <div className="rounded-xl bg-primary-50 p-2 text-primary-600 shrink-0">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-bold text-neutral-900 text-base tracking-tight">AgriBandhu Console</span>
        </div>
        <nav className="flex-grow p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10'
                    : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-neutral-100">
          <Button onClick={logout} variant="outline" className="w-full gap-2 text-sm justify-center">
            <span>Log out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-white flex flex-col border-r border-neutral-100 lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-neutral-950 text-lg">AgriBandhu</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-neutral-500 p-1.5 hover:bg-neutral-50 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-grow p-4 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10'
                          : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-neutral-100">
                <Button onClick={logout} variant="outline" className="w-full gap-2 text-sm justify-center">
                  <span>Log out</span>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Side */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-100 bg-white flex items-center justify-between px-4 sm:px-6 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-50 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-500">
              <Link href="/dashboard" className="hover:text-primary-600">Console</Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  <span>/</span>
                  <span
                    className={
                      idx === breadcrumbs.length - 1 ? 'text-neutral-800 font-extrabold' : 'hover:text-primary-600'
                    }
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-50 hover:text-primary-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-accent-yellow-500 ring-2 ring-white" />
            </button>

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
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-neutral-800 leading-none">{user.name}</p>
                <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 uppercase tracking-wide">
                  {user.role}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* View Port Content */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
