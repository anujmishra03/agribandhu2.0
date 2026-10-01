'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Heading, Card, CardContent } from '@agribandhu/ui';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ASSIGNED_FARMERS = [
  { id: '1', name: 'Ramesh Kumar', location: 'Punjab', crop: 'Paddy Rice', status: 'Disease Flagged' },
  { id: '2', name: 'Sunita Devi', location: 'Maharashtra', crop: 'Tomatoes', status: 'Healthy' },
  { id: '3', name: 'Amit Patel', location: 'Gujarat', crop: 'Cotton', status: 'Review Needed' },
];

export default function OfficerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-1 text-left">
          <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
            Officer Console
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base">
            Logged in as <span className="text-emerald-600 font-bold">{user?.name}</span>. Manage your assigned farmer regional reports.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-primary-50 p-3.5 text-primary-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Assigned Farmers</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">3 Farmers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-accent-yellow-50 p-3.5 text-accent-yellow-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Pending Diagnostics</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">2 Reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Resolved Cases</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">18 Audited</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-destructive-50 p-3.5 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Urgent Alerts</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">1 Alert</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Farmers Table */}
        <Card className="border border-neutral-100 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-50 pb-2">
              Farmers Under Your Jurisdiction
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Primary Crop</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-neutral-700 divide-y divide-neutral-50">
                  {ASSIGNED_FARMERS.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-4 text-neutral-900">{farmer.name}</td>
                      <td className="py-4 px-4 text-neutral-500">{farmer.location}</td>
                      <td className="py-4 px-4">{farmer.crop}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            farmer.status === 'Healthy'
                              ? 'bg-primary-50 text-primary-700'
                              : farmer.status === 'Review Needed'
                              ? 'bg-accent-yellow-50 text-accent-yellow-700'
                              : 'bg-destructive-50 text-destructive'
                          }`}
                        >
                          {farmer.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-xs font-bold text-primary-600 hover:text-primary-700">
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
