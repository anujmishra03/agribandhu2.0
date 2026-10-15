'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Heading, Card, CardContent, Button } from '@agribandhu/ui';
import {
  Activity,
  ShieldAlert,
  Users,
  Tractor,
  CalendarRange,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  roles: { admins: number; officers: number; farmers: number };
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  totalFarms: number;
  totalDiseaseReports: number;
  totalCalendarEvents: number;
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
  generatedAt: string;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  const loadStats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;
      if (!res.ok) {
        throw new Error((data && data.error) || `Failed to load statistics (${res.status}).`);
      }
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!authLoading && user?.role === 'ADMIN') {
      loadStats();
    }
  }, [authLoading, user, loadStats]);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, tone: 'bg-primary-50 text-primary-600' },
        { label: 'Farmers', value: stats.roles.farmers, icon: Tractor, tone: 'bg-emerald-50 text-emerald-600' },
        { label: 'Officers', value: stats.roles.officers, icon: ShieldAlert, tone: 'bg-accent-yellow-50 text-accent-yellow-600' },
        { label: 'Administrators', value: stats.roles.admins, icon: Activity, tone: 'bg-accent-brown-50 text-accent-brown-700' },
        { label: 'New (7 days)', value: stats.newUsersLast7Days, icon: UserPlus, tone: 'bg-primary-50 text-primary-600' },
        { label: 'Farms', value: stats.totalFarms, icon: Tractor, tone: 'bg-emerald-50 text-emerald-600' },
        { label: 'Disease Reports', value: stats.totalDiseaseReports, icon: ShieldAlert, tone: 'bg-destructive-50 text-destructive' },
        { label: 'Calendar Events', value: stats.totalCalendarEvents, icon: CalendarRange, tone: 'bg-accent-yellow-50 text-accent-yellow-600' },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
          <div className="space-y-1">
            <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
              Administrator Console
            </Heading>
            <p className="text-neutral-500 text-sm sm:text-base">
              System Administrator: <span className="text-primary-600 font-bold">{user?.name}</span>. Live platform metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={loadStats} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Link href="/dashboard/admin/users">
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-4 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        {loading && !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-neutral-100 bg-white shadow-sm">
                <CardContent className="p-6 h-24 animate-pulse bg-neutral-50/50 rounded-xl" />
              </Card>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.label} className="border border-neutral-100 bg-white shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={`rounded-xl p-3.5 ${card.tone}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{card.label}</p>
                        <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{card.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Registrations */}
            <Card className="border border-neutral-100 bg-white shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-50 pb-2">
                  Recent Registrations
                </h3>
                {stats.recentUsers.length === 0 ? (
                  <p className="text-sm text-neutral-500 py-6 text-center">
                    No users have registered yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4 sm:text-right">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-semibold text-neutral-700 divide-y divide-neutral-50">
                        {stats.recentUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="py-4 px-4 text-neutral-900">{u.name}</td>
                            <td className="py-4 px-4 text-neutral-500">{u.email}</td>
                            <td className="py-4 px-4">
                              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-neutral-500 sm:text-right">{formatDate(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
