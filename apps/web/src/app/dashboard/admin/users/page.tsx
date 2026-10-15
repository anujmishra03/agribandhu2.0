'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Heading, Card, CardContent, Button, Input } from '@agribandhu/ui';
import { Search, Trash2, ChevronLeft, ChevronRight, Users, RefreshCw } from 'lucide-react';

const ROLES = ['FARMER', 'OFFICER', 'ADMIN'] as const;
type Role = (typeof ROLES)[number];

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string | null;
  emailVerified: string | null;
  createdAt: string;
  _count: { farms: number; diseaseReports: number; calendarEvents: number };
}

interface UsersResponse {
  users: AdminUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  // Debounce the search input.
  React.useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handle);
  }, [search]);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (roleFilter) params.set('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;
      if (!res.ok) {
        throw new Error((data && data.error) || `Failed to load users (${res.status}).`);
      }
      const parsed = data as UsersResponse;
      setUsers(parsed.users || []);
      setPagination(parsed.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter]);

  React.useEffect(() => {
    if (!authLoading && user?.role === 'ADMIN') {
      loadUsers();
    }
  }, [authLoading, user, loadUsers]);

  const handleRoleChange = async (target: AdminUser, role: Role) => {
    if (role === target.role) return;
    setBusyId(target.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${target.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;
      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to update role.');
      }
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, role } : u)));
    } catch (err: any) {
      setError(err.message || 'Failed to update role.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (target: AdminUser) => {
    const confirmed = window.confirm(
      `Delete the account "${target.name}" (${target.email})?\n\nThis permanently removes the user and all of their farms, reports and events. This cannot be undone.`
    );
    if (!confirmed) return;

    setBusyId(target.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${target.id}`, { method: 'DELETE' });
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;
      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to delete user.');
      }
      if (users.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        loadUsers();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete user.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
          <div className="space-y-1">
            <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
              Manage Users
            </Heading>
            <p className="text-neutral-500 text-sm sm:text-base">
              {pagination.total} registered {pagination.total === 1 ? 'account' : 'accounts'}
            </p>
          </div>
          <Button variant="outline" onClick={loadUsers} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-4 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              className="pl-10"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-11 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Users Table */}
        <Card className="border border-neutral-100 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-neutral-50 animate-pulse" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <div className="inline-flex rounded-full bg-neutral-50 p-3 text-neutral-400">
                  <Users className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-neutral-600">No users match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Farms</th>
                      <th className="py-3 px-4">Reports</th>
                      <th className="py-3 px-4">Joined</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-neutral-700 divide-y divide-neutral-50">
                    {users.map((u) => {
                      const isSelf = user?.id === u.id;
                      return (
                        <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                {u.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-neutral-900 truncate">{u.name}</p>
                                <p className="text-xs text-neutral-400 font-medium truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              className="h-9 rounded-lg border border-neutral-200 bg-white px-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
                              value={u.role}
                              disabled={isSelf || busyId === u.id}
                              onChange={(e) => handleRoleChange(u, e.target.value as Role)}
                              title={isSelf ? 'You cannot change your own role.' : 'Change role'}
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-4 text-neutral-500">{u._count.farms}</td>
                          <td className="py-4 px-4 text-neutral-500">{u._count.diseaseReports}</td>
                          <td className="py-4 px-4 text-neutral-500">{formatDate(u.createdAt)}</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDelete(u)}
                              disabled={isSelf || busyId === u.id}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive hover:text-destructive/80 disabled:opacity-40 disabled:cursor-not-allowed"
                              title={isSelf ? 'You cannot delete your own account.' : 'Delete user'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
