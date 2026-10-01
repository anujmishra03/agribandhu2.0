'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Heading, Card, CardContent } from '@agribandhu/ui';
import { Activity, ShieldAlert, Settings, HardDrive } from 'lucide-react';

const RECENT_LOGS = [
  { id: '1', action: 'New Farmer registered', detail: 'Rajesh Patil in Maharashtra', time: '10 min ago' },
  { id: '2', action: 'Crop disease diagnosis', detail: 'Tomato blight identified for Ramesh Kumar', time: '1 hour ago' },
  { id: '3', action: 'Verification token generated', detail: 'Password reset OTP signed for support', time: '2 hours ago' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-1 text-left">
          <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
            Administrator Console
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base">
            System Administrator: <span className="text-primary-600 font-bold">{user?.name}</span>. Access global controls.
          </p>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-primary-50 p-3.5 text-primary-600">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Total Users</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">138 Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-accent-yellow-50 p-3.5 text-accent-yellow-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">AI Diagnoses</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">4,281 runs</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Database Size</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">24.8 MB (SQLite)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-accent-brown-50 text-accent-brown-700 p-3.5">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">System Uptime</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">99.98%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Logs */}
        <Card className="border border-neutral-100 bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-50 pb-2">
              Recent System Action Logs
            </h3>
            <div className="space-y-4">
              {RECENT_LOGS.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-neutral-50 rounded-xl">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-neutral-900">{log.action}</p>
                    <p className="text-xs text-neutral-500">{log.detail}</p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase sm:text-right shrink-0">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
