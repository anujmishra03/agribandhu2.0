'use client';

import * as React from 'react';
import Link from 'next/link';
import { Compass, Leaf, Sprout, ChevronRight, Activity, Award, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Heading, Card, CardContent, Button } from '@agribandhu/ui';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  activityDate: string;
  farmName: string;
}

interface DiseaseReport {
  id: string;
  prediction: string;
  confidence: number;
  severity: string;
  createdAt: string;
  imageUrl: string;
  farm: {
    name: string;
  };
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [farmsCount, setFarmsCount] = React.useState(0);
  const [totalArea, setTotalArea] = React.useState(0);
  const [activeCrops, setActiveCrops] = React.useState(0);
  const [recentActivities, setRecentActivities] = React.useState<ActivityItem[]>([]);
  const [latestReport, setLatestReport] = React.useState<DiseaseReport | null>(null);
  const [totalReportsCount, setTotalReportsCount] = React.useState(0);
  const [criticalCount, setCriticalCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // Fetch farms
        const farmsRes = await fetch('/api/farms');
        if (farmsRes.ok) {
          const farms = await farmsRes.json();
          setFarmsCount(farms.length);

          let areaSum = 0;
          let cropsCount = 0;
          const acts: ActivityItem[] = [];

          farms.forEach((f: any) => {
            areaSum += f.area;
            if (f.crop?.cropName) cropsCount++;
            if (f.activities) {
              f.activities.forEach((act: any) => {
                acts.push({
                  ...act,
                  farmName: f.name,
                });
              });
            }
          });

          setTotalArea(areaSum);
          setActiveCrops(cropsCount);
          acts.sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime());
          setRecentActivities(acts.slice(0, 3));
        }

        // Fetch disease reports
        const diseaseRes = await fetch('/api/disease/history');
        if (diseaseRes.ok) {
          const reports = await diseaseRes.json();
          setTotalReportsCount(reports.length);
          if (reports.length > 0) {
            setLatestReport(reports[0]);
            const criticals = reports.filter((r: any) => r.severity === 'Critical' || r.severity === 'High').length;
            setCriticalCount(criticals);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Profile completion percentage
  const profileCompletion = React.useMemo(() => {
    if (!user) return 0;
    const profile = user.profile;
    const keysToCheck = [
      'name', 'phone', 'state', 'district', 'village', 'preferredLanguage',
      'farmSize', 'experience', 'primaryCrop', 'pinCode', 'farmerCategory',
      'preferredUnits', 'irrigationMethod', 'emergencyContactName', 'emergencyContactPhone'
    ];
    let completedCount = 0;
    keysToCheck.forEach((key) => {
      const val = profile ? (profile as any)[key] : null;
      if (key === 'name') {
        if (user.name) completedCount++;
      } else if (key === 'phone') {
        if (user.phone) completedCount++;
      } else if (val !== undefined && val !== null && val !== '' && val !== 0) {
        completedCount++;
      }
    });
    if (user.avatar) completedCount++;
    return Math.round((completedCount / (keysToCheck.length + 1)) * 100);
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-left">
            <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
              Welcome Back, {user?.name}!
            </Heading>
            <p className="text-neutral-500 text-sm sm:text-base">
              Monitor active crop disease diagnostics and land moisture schedules.
            </p>
          </div>

          <Link href="/dashboard/disease-detection">
            <Button className="gap-2 shrink-0 shadow-md">
              <Sparkles className="h-4 w-4" />
              <span>Open AI Scanner</span>
            </Button>
          </Link>
        </div>

        {/* Dynamic widgets grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-primary-50 p-3.5 text-primary-600">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">Registered Lands</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{farmsCount} Farms ({totalArea} A)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">Active Crops</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{activeCrops} Crops</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-accent-yellow-50 p-3.5 text-accent-yellow-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">AI Detections</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{totalReportsCount} Scans</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-destructive-50 p-3.5 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">High Risk Alerts</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{criticalCount} Critical</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main split dashboard view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Main Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Latest AI Disease Report Widget */}
            <Card className="border border-neutral-100 bg-white p-6 shadow-sm text-left">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-bold text-neutral-900">Latest AI Disease Diagnosis</h3>
                  </div>
                  <Link href="/dashboard/disease-detection" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-0.5">
                    <span>Scanner Console</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {latestReport ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-neutral-50/70 rounded-2xl border border-neutral-100">
                    <img
                      src={latestReport.imageUrl}
                      alt={latestReport.prediction}
                      className="h-24 w-24 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-neutral-400">{new Date(latestReport.createdAt).toLocaleDateString()}</span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            latestReport.severity === 'Critical'
                              ? 'bg-destructive text-white'
                              : 'bg-accent-yellow-500 text-white'
                          }`}
                        >
                          {latestReport.severity}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-neutral-900 text-base">{latestReport.prediction}</h4>
                      <p className="text-xs text-neutral-500 font-medium">
                        Farm: <strong className="text-neutral-800">{latestReport.farm.name}</strong> • Confidence: <strong className="text-primary-600">{latestReport.confidence}%</strong>
                      </p>
                      <div className="pt-1">
                        <Link href={`/dashboard/reports/${latestReport.id}`}>
                          <button className="text-xs font-bold text-primary-600 hover:underline">
                            View Full Diagnosis & Treatment →
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-200 py-8 text-center space-y-3">
                    <div className="mx-auto w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-neutral-900">No crop leaf scans uploaded yet</p>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                        Scan your crops to detect early signs of fungal, bacterial, or viral infections.
                      </p>
                    </div>
                    <Link href="/dashboard/disease-detection" className="inline-block pt-1">
                      <Button size="sm" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Run First AI Scan</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Farm Activity Timeline */}
            <Card className="border border-neutral-100 bg-white p-6 shadow-sm text-left">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                  <h3 className="text-lg font-bold text-neutral-900">Recent Land Activities</h3>
                  <Link href="/dashboard/activities" className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-0.5">
                    <span>Timeline View</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {recentActivities.length > 0 ? (
                  <div className="space-y-3 pt-1">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-neutral-400">{act.activityDate}</span>
                            <span className="text-[9px] font-bold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded uppercase">
                              {act.farmName}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-neutral-800 truncate mt-0.5">{act.title}</p>
                          <p className="text-xs text-neutral-400 font-semibold truncate">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400 text-sm py-4">No recent activity logs recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side Panel */}
          <div className="lg:col-span-4 space-y-6 text-left">
            {/* Health & Profile Setup */}
            <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
              <CardContent className="p-0 space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-50 pb-2">
                  Farmer Profile Setup
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-500">Completion Status</span>
                    <span className="text-primary-600">{profileCompletion}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${profileCompletion}%` }} />
                  </div>
                  <Link href="/dashboard/profile">
                    <button className="text-xs font-bold text-primary-600 hover:underline pt-1">
                      Complete Emergency & Location Info →
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
              <CardContent className="p-0 space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-50 pb-2">
                  Irrigation & Spray Schedules
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-primary-600 shrink-0" />
                    <p className="text-xs font-semibold text-neutral-700 flex-grow">
                      Irrigate fields before noon (recommended weather condition)
                    </p>
                    <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                      Today
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
