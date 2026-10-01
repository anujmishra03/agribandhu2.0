'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Heading, Card, CardContent } from '@agribandhu/ui';

export default function DashboardSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
          Console Settings
        </Heading>
        <Card className="border border-neutral-100 bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-50 pb-2">
              System Configurations
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Farming preference, default language translation toggles, and notification reminder triggers. These dashboard settings are fully configurable in this sandbox profile environment.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
