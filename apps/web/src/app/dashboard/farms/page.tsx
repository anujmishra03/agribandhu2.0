'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Leaf, Sprout, Plus, Eye, Edit, Trash2, Copy, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, Card, CardContent, Heading } from '@agribandhu/ui';

interface Farm {
  id: string;
  name: string;
  farmType: string;
  area: number;
  unit: string;
  state: string;
  district: string;
  village: string;
  address: string;
  createdAt: string;
  crop?: {
    cropName: string;
    variety: string;
    growthStage: string;
  } | null;
}

export default function FarmsDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [farms, setFarms] = React.useState<Farm[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/farms');
      if (!res.ok) throw new Error('Failed to load farms.');
      const data = await res.json();
      setFarms(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading farm records.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFarms();
  }, []);

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/farms/${id}/duplicate`, { method: 'POST' });
      if (!res.ok) throw new Error('Duplicate failed.');
      fetchFarms();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate farm.');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this farm? This will delete all crop, soil, and activity logs.')) return;

    try {
      const res = await fetch(`/api/farms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed.');
      fetchFarms();
    } catch (err: any) {
      alert(err.message || 'Failed to delete farm.');
    }
  };

  // Metrics Aggregation
  const totalArea = React.useMemo(() => {
    return farms.reduce((acc, curr) => acc + curr.area, 0);
  }, [farms]);

  const activeCrops = React.useMemo(() => {
    return farms.filter((f) => f.crop?.cropName).length;
  }, [farms]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1 text-left">
            <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
              My Farms
            </Heading>
            <p className="text-neutral-500 text-sm">
              Add and manage your agricultural lands, soil analytics, and sowing logs.
            </p>
          </div>
          <Link href="/dashboard/farms/new">
            <Button className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>Add New Farm</span>
            </Button>
          </Link>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-primary-50 p-3.5 text-primary-600">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">Total Lands</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{farms.length} Farms</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-600">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">Total Area</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">
                  {totalArea} {farms[0]?.unit || 'Acres'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-100 bg-white shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-xl bg-accent-yellow-50 p-3.5 text-accent-yellow-600">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-sans">Sown Crops</p>
                <p className="text-xl font-extrabold text-neutral-900 mt-0.5">{activeCrops} Crops</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Farms Grid / Empty State */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
            <p className="text-neutral-400 text-sm font-semibold">Loading farm data...</p>
          </div>
        ) : farms.length === 0 ? (
          <Card className="border border-dashed border-neutral-200 py-16 text-center bg-white">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                <Compass className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 text-lg">No farms registered yet</h3>
                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                  Add your primary farming lands to get crop recommendations and soil diagnostics.
                </p>
              </div>
              <Link href="/dashboard/farms/new" className="inline-block pt-2">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Farm</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Link key={farm.id} href={`/dashboard/farms/${farm.id}`} className="group">
                <Card className="border border-neutral-100 bg-white hover:border-primary-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <CardContent className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    {/* Farm Title & Type */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-neutral-900 text-lg group-hover:text-primary-600 transition-colors leading-tight">
                          {farm.name}
                        </h3>
                        <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {farm.farmType}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-xs flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span>
                          {farm.village}, {farm.district}
                        </span>
                      </p>
                    </div>

                    {/* Sown Crop Badge */}
                    <div className="py-3 px-4 bg-neutral-50 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-xs text-neutral-600 font-bold">
                          {farm.crop?.cropName || 'Fallow Land'}
                        </span>
                      </div>
                      {farm.crop && (
                        <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wide bg-neutral-100 px-2 py-0.5 rounded">
                          {farm.crop.growthStage}
                        </span>
                      )}
                    </div>

                    {/* Dimensions & Actions */}
                    <div className="flex items-center justify-between border-t border-neutral-50 pt-4 mt-auto">
                      <div className="text-left">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Area</p>
                        <p className="text-sm font-extrabold text-neutral-800 mt-1">
                          {farm.area} {farm.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/dashboard/farms/new?edit=${farm.id}`);
                          }}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-neutral-500 hover:text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e: React.MouseEvent) => handleDuplicate(farm.id, e)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4 text-neutral-500 hover:text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e: React.MouseEvent) => handleDelete(farm.id, e)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-neutral-500 hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
