'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Leaf, Sprout, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, Input, Label, Card, CardContent, Heading } from '@agribandhu/ui';

const farmFormSchema = z.object({
  name: z.string().min(2, 'Farm name is required.'),
  farmType: z.string().min(2, 'Farm type is required.'),
  area: z.preprocess((val) => Number(val), z.number().positive('Area must be greater than 0.')),
  unit: z.enum(['Acres', 'Hectares']),
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  village: z.string().min(2, 'Village is required.'),
  address: z.string().min(2, 'Address is required.'),
  latitude: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  longitude: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  // Crop
  cropName: z.string().optional().nullable(),
  cropVariety: z.string().optional().nullable(),
  sowingDate: z.string().optional().nullable(),
  harvestDate: z.string().optional().nullable(),
  growthStage: z.string().optional().nullable(),
  // Soil
  soilType: z.string().optional().nullable(),
  ph: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  nitrogen: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  phosphorus: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  potassium: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  organicCarbon: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
});

type FarmFormData = z.infer<typeof farmFormSchema>;

export default function FarmFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      unit: 'Acres',
      area: 1.0,
      ph: 6.5,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      organicCarbon: 0,
    },
  });

  React.useEffect(() => {
    if (editId) {
      const loadFarmData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/farms/${editId}`);
          if (!res.ok) throw new Error('Failed to load farm details.');
          const data = await res.json();
          // Reset form fields
          reset({
            name: data.name,
            farmType: data.farmType,
            area: data.area,
            unit: data.unit,
            state: data.state,
            district: data.district,
            village: data.village,
            address: data.address,
            latitude: data.latitude || undefined,
            longitude: data.longitude || undefined,
            cropName: data.crop?.cropName || '',
            cropVariety: data.crop?.variety || '',
            sowingDate: data.crop?.sowingDate || '',
            harvestDate: data.crop?.harvestDate || '',
            growthStage: data.crop?.growthStage || 'Seedling',
            soilType: data.soil?.soilType || '',
            ph: data.soil?.ph || 6.5,
            nitrogen: data.soil?.nitrogen || 0,
            phosphorus: data.soil?.phosphorus || 0,
            potassium: data.soil?.potassium || 0,
            organicCarbon: data.soil?.organicCarbon || 0,
          });
        } catch (err: any) {
          setErrorMsg(err.message || 'Error fetching farm information.');
        } finally {
          setLoading(false);
        }
      };
      loadFarmData();
    }
  }, [editId, reset]);

  const onSubmit = async (data: FarmFormData) => {
    setErrorMsg(null);
    try {
      const url = editId ? `/api/farms/${editId}` : '/api/farms';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit form.');

      router.push('/dashboard/farms');
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-neutral-400 text-sm font-semibold">Fetching land records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard/farms"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-2 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Farms</span>
        </Link>

        <div className="flex flex-col gap-1 text-left">
          <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
            {editId ? 'Edit Farm' : 'Register New Farm'}
          </Heading>
          <p className="text-neutral-500 text-sm">
            Fill in boundaries, location specs, current crop layout, and chemical/soil details.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Card 1: Farm Area specs */}
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                <Compass className="h-5 w-5" />
                <span className="text-base text-neutral-900">Land Boundary Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Farm Name / Identifier</Label>
                  <Input id="name" placeholder="E.g. North Ridge Field" {...register('name')} />
                  {errors.name && <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="farmType">Farm Type</Label>
                  <select id="farmType" className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('farmType')}>
                    <option value="Vegetable Farm">Vegetable Farm</option>
                    <option value="Paddy Field">Paddy Field</option>
                    <option value="Fruit Orchard">Fruit Orchard</option>
                    <option value="Cash Crops Field">Cash Crops Field</option>
                    <option value="Mixed Farm">Mixed Farm</option>
                  </select>
                  {errors.farmType && <p className="text-xs font-semibold text-destructive">{errors.farmType.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="area">Farm Area Size</Label>
                  <Input id="area" type="number" step="0.01" placeholder="4.5" {...register('area')} />
                  {errors.area && <p className="text-xs font-semibold text-destructive">{errors.area.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="unit">Measurement Unit</Label>
                  <select id="unit" className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('unit')}>
                    <option value="Acres">Acres</option>
                    <option value="Hectares">Hectares</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: GPS & Address Location */}
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                <MapPin className="h-5 w-5" />
                <span className="text-base text-neutral-900">Geographic Location</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="village">Village / Town</Label>
                  <Input id="village" placeholder="Khed" {...register('village')} />
                  {errors.village && <p className="text-xs font-semibold text-destructive">{errors.village.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" placeholder="Pune" {...register('district')} />
                  {errors.district && <p className="text-xs font-semibold text-destructive">{errors.district.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Maharashtra" {...register('state')} />
                  {errors.state && <p className="text-xs font-semibold text-destructive">{errors.state.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Local Address / Land Marks</Label>
                <Input id="address" placeholder="Behind village school, NH 4 Bypass" {...register('address')} />
                {errors.address && <p className="text-xs font-semibold text-destructive">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="latitude">Latitude (Optional)</Label>
                  <Input id="latitude" type="number" step="0.000001" placeholder="18.5204" {...register('latitude')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input id="longitude" type="number" step="0.000001" placeholder="73.8567" {...register('longitude')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Crop Details */}
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                <Sprout className="h-5 w-5" />
                <span className="text-base text-neutral-900">Current Crop Layout (Optional)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cropName">Crop Sown</Label>
                  <Input id="cropName" placeholder="E.g. Tomatoes" {...register('cropName')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cropVariety">Variety</Label>
                  <Input id="cropVariety" placeholder="E.g. Abhinav Hybrids" {...register('cropVariety')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sowingDate">Sowing Date</Label>
                  <Input id="sowingDate" type="date" {...register('sowingDate')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="harvestDate">Expected Harvest Date</Label>
                  <Input id="harvestDate" type="date" {...register('harvestDate')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="growthStage">Current Growth Stage</Label>
                  <select id="growthStage" className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('growthStage')}>
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Maturity">Maturity / Harvesting</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Soil Report */}
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                <Leaf className="h-5 w-5" />
                <span className="text-base text-neutral-900">Soil Metrics & Chemistry (Optional)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <select id="soilType" className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('soilType')}>
                    <option value="">Select Soil Type</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Black Soil">Black Cotton Soil</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ph">Soil pH Scale (0 - 14)</Label>
                  <Input id="ph" type="number" step="0.1" placeholder="6.5" {...register('ph')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nitrogen">Nitrogen (N) (kg/ha)</Label>
                  <Input id="nitrogen" type="number" placeholder="280" {...register('nitrogen')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phosphorus">Phosphorus (P) (kg/ha)</Label>
                  <Input id="phosphorus" type="number" placeholder="22" {...register('phosphorus')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="potassium">Potassium (K) (kg/ha)</Label>
                  <Input id="potassium" type="number" placeholder="310" {...register('potassium')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="organicCarbon">Organic Carbon (%)</Label>
                  <Input id="organicCarbon" type="number" step="0.01" placeholder="0.55" {...register('organicCarbon')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4 justify-end">
            <Link href="/dashboard/farms">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <span>{editId ? 'Save Changes' : 'Register Farm'}</span>
              <ShieldCheck className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
