'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarRange, Compass, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, Heading, Button } from '@agribandhu/ui';

interface Activity {
  id: string;
  title: string;
  description: string;
  activityDate: string;
  farmId: string;
  farmName: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/farms');
        if (res.ok) {
          const farms = await res.json();
          const allActivities: Activity[] = [];
          farms.forEach((farm: any) => {
            if (farm.activities) {
              farm.activities.forEach((act: any) => {
                allActivities.push({
                  ...act,
                  farmName: farm.name,
                });
              });
            }
          });
          // Sort by date desc
          allActivities.sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime());
          setActivities(allActivities);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1 text-left">
          <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
            Activities Timeline
          </Heading>
          <p className="text-neutral-500 text-sm">
            Check the chronological list of soil audits, sowing calendars, and crop harvests across all farms.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
            <p className="text-neutral-400 text-sm font-semibold font-sans">Loading timeline logs...</p>
          </div>
        ) : activities.length === 0 ? (
          <Card className="border border-dashed border-neutral-200 py-16 text-center bg-white">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                <CalendarRange className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 text-lg">No logged activities</h3>
                <p className="text-neutral-500 text-sm max-w-xs mx-auto">
                  Log your fertilizer sprays, watering checklists, or pest controls inside your farm details console.
                </p>
              </div>
              <Link href="/dashboard/farms" className="inline-block pt-2">
                <Button className="gap-2">
                  <span>Go to My Farms</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
            <CardContent className="p-0">
              <div className="relative pl-6 border-l-2 border-neutral-100 space-y-6">
                {activities.map((act) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary-600 border-4 border-white ring-2 ring-neutral-50" />
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">{act.activityDate}</span>
                        <span className="text-[9px] font-extrabold text-primary-700 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {act.farmName}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-neutral-900 text-sm leading-snug">{act.title}</h4>
                      <p className="text-xs text-neutral-500 font-semibold">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
