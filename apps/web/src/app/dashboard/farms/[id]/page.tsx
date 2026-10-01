'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Compass, Leaf, Sprout, Calendar, BarChart3, SunDim, Upload, ClipboardList, Camera, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, Card, CardContent, Heading, Input, Label } from '@agribandhu/ui';

interface FarmActivity {
  id: string;
  title: string;
  description: string;
  activityDate: string;
}

interface FarmImage {
  id: string;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
}

interface FarmDetails {
  id: string;
  name: string;
  farmType: string;
  area: number;
  unit: string;
  state: string;
  district: string;
  village: string;
  address: string;
  latitude?: number;
  longitude?: number;
  crop?: {
    id: string;
    cropName: string;
    variety: string;
    sowingDate: string;
    harvestDate: string;
    growthStage: string;
  } | null;
  soil?: {
    id: string;
    soilType: string;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicCarbon: number;
  } | null;
  activities: FarmActivity[];
  images: FarmImage[];
}

export default function FarmDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const farmId = params.id as string;

  const [farm, setFarm] = React.useState<FarmDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  // Form states for Timeline Activity
  const [activityTitle, setActivityTitle] = React.useState('');
  const [activityDesc, setActivityDesc] = React.useState('');
  const [activityDate, setActivityDate] = React.useState(new Date().toISOString().split('T')[0]);

  // Form states for Gallery Image Upload
  const [galleryFile, setGalleryFile] = React.useState<File | null>(null);
  const [galleryCaption, setGalleryCaption] = React.useState('');
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const fetchFarmDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/farms/${farmId}`);
      if (!res.ok) throw new Error('Farm details not found.');
      const data = await res.json();
      setFarm(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading farm specifications.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (farmId) fetchFarmDetails();
  }, [farmId]);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle || !activityDesc) return;

    try {
      const res = await fetch(`/api/farms/${farmId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activityTitle,
          description: activityDesc,
          activityDate,
        }),
      });

      if (!res.ok) throw new Error('Failed to log activity.');
      setActivityTitle('');
      setActivityDesc('');
      fetchFarmDetails();
    } catch (err: any) {
      alert(err.message || 'Error adding activity.');
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) return;

    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('caption', galleryCaption || 'Farm Upload');

    try {
      const res = await fetch(`/api/farms/${farmId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image.');
      setGalleryFile(null);
      setGalleryCaption('');
      if (imageInputRef.current) imageInputRef.current.value = '';
      fetchFarmDetails();
    } catch (err: any) {
      alert(err.message || 'Error uploading photo.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-neutral-400 text-sm font-semibold">Loading farm console...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!farm) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <Heading level="h2">Farm Not Found</Heading>
          <p className="text-neutral-500">The farm registry could not be found or you do not have permission to view it.</p>
          <Link href="/dashboard/farms">
            <Button>Back to My Farms</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'crop', label: 'Crop Details', icon: Sprout },
    { id: 'soil', label: 'Soil Health', icon: Leaf },
    { id: 'timeline', label: 'Timeline', icon: ClipboardList },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'weather', label: 'Weather Info', icon: SunDim },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link
            href="/dashboard/farms"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Farms</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-6">
            <div className="text-left space-y-1">
              <div className="flex items-center gap-3">
                <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
                  {farm.name}
                </Heading>
                <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {farm.farmType}
                </span>
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                📍 {farm.village}, {farm.district}, {farm.state}
              </p>
            </div>
            <Link href={`/dashboard/farms/new?edit=${farm.id}`}>
              <Button variant="outline" size="sm">
                Edit Farm
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex overflow-x-auto gap-2 border-b border-neutral-100 pb-px scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-600 text-primary-700 bg-primary-50/10'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <TabIcon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Farm Overview Info */}
                  <div className="md:col-span-8 space-y-6">
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0 space-y-4">
                        <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-50 pb-2">Land Profile</h3>
                        <div className="grid grid-cols-2 gap-6 text-sm font-medium">
                          <div>
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wide">Total Boundaries Area</p>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.area} {farm.unit}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wide">Region Location</p>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.state}, India</p>
                          </div>
                          <div>
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wide">GPS Latitude</p>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.latitude || 'Not Available'}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wide">GPS Longitude</p>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.longitude || 'Not Available'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Active Crop Summary */}
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0 space-y-4">
                        <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-50 pb-2">Primary Sown Crop</h3>
                        {farm.crop ? (
                          <div className="flex items-center justify-between gap-4 py-2">
                            <div>
                              <p className="font-bold text-neutral-900 text-base">{farm.crop.cropName}</p>
                              <p className="text-xs text-neutral-500">Variety: {farm.crop.variety}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
                              {farm.crop.growthStage}
                            </span>
                          </div>
                        ) : (
                          <p className="text-neutral-400 text-sm">No crops sown currently on this farm.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick stats panel */}
                  <div className="md:col-span-4 space-y-6">
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0 space-y-4">
                        <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-50 pb-2">Recent Timeline</h3>
                        {farm.activities.length > 0 ? (
                          <div className="space-y-4">
                            {farm.activities.slice(0, 3).map((act) => (
                              <div key={act.id} className="border-l-2 border-primary-500 pl-4 py-0.5">
                                <p className="text-xs text-neutral-400 font-bold">{act.activityDate}</p>
                                <p className="text-sm font-bold text-neutral-800">{act.title}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-neutral-400 text-xs">No recent activity logs.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Crop Details Tab */}
              {activeTab === 'crop' && (
                <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-2 border-b border-neutral-50 pb-3">
                      <Sprout className="h-5 w-5 text-emerald-600" />
                      <Heading level="h2" className="text-xl font-bold text-neutral-900">Crop Health & Schedule</Heading>
                    </div>

                    {farm.crop ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm font-medium">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-neutral-400">Crop Type Name</Label>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.crop.cropName}</p>
                          </div>
                          <div>
                            <Label className="text-neutral-400">Sowing Date</Label>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.crop.sowingDate}</p>
                          </div>
                          <div>
                            <Label className="text-neutral-400">Expected Harvest Calendar</Label>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.crop.harvestDate}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-neutral-400">Variety Seeds</Label>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.crop.variety}</p>
                          </div>
                          <div>
                            <Label className="text-neutral-400">Current Phase</Label>
                            <p className="text-emerald-700 font-extrabold text-lg mt-1">{farm.crop.growthStage}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-400 text-sm">No sowing information logged. Click Edit Farm to add a crop.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Soil Health Tab */}
              {activeTab === 'soil' && (
                <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-2 border-b border-neutral-50 pb-3">
                      <Leaf className="h-5 w-5 text-primary-600" />
                      <Heading level="h2" className="text-xl font-bold text-neutral-900">Soil Metrics & Chemistry</Heading>
                    </div>

                    {farm.soil ? (
                      <div className="space-y-8">
                        {/* Type & pH */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium">
                          <div>
                            <Label className="text-neutral-400">Soil Texture / Type</Label>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.soil.soilType}</p>
                          </div>
                          <div>
                            <Label className="text-neutral-400">Acidity (pH Scale)</Label>
                            <p className="text-neutral-900 font-extrabold text-lg mt-1">{farm.soil.ph}</p>
                          </div>
                        </div>

                        {/* NPK Values Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-100 text-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Nitrogen (N)</span>
                            <p className="text-2xl font-extrabold text-primary-600 mt-1">{farm.soil.nitrogen}</p>
                            <span className="text-[9px] text-neutral-400 font-semibold mt-0.5 inline-block">kg / ha</span>
                          </div>

                          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-100 text-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Phosphorus (P)</span>
                            <p className="text-2xl font-extrabold text-primary-600 mt-1">{farm.soil.phosphorus}</p>
                            <span className="text-[9px] text-neutral-400 font-semibold mt-0.5 inline-block">kg / ha</span>
                          </div>

                          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-100 text-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Potassium (K)</span>
                            <p className="text-2xl font-extrabold text-primary-600 mt-1">{farm.soil.potassium}</p>
                            <span className="text-[9px] text-neutral-400 font-semibold mt-0.5 inline-block">kg / ha</span>
                          </div>

                          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-100 text-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Organic Carbon</span>
                            <p className="text-2xl font-extrabold text-primary-600 mt-1">{farm.soil.organicCarbon}</p>
                            <span className="text-[9px] text-neutral-400 font-semibold mt-0.5 inline-block">% Carbon</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-400 text-sm">No soil laboratory metrics loaded. Edit this farm to input values.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Activity Log Form */}
                  <div className="md:col-span-4">
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0">
                        <form onSubmit={handleAddActivity} className="space-y-4">
                          <h3 className="font-extrabold text-neutral-900 text-base border-b border-neutral-50 pb-2">
                            Log Activity
                          </h3>
                          <div className="space-y-1.5">
                            <Label htmlFor="actTitle">Activity Title</Label>
                            <Input
                              id="actTitle"
                              placeholder="E.g. Fertilizer Sprayed"
                              value={activityTitle}
                              onChange={(e: any) => setActivityTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="actDesc">Details</Label>
                            <Input
                              id="actDesc"
                              placeholder="E.g. Added Potash mix to Zone B"
                              value={activityDesc}
                              onChange={(e: any) => setActivityDesc(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="actDate">Activity Date</Label>
                            <Input
                              id="actDate"
                              type="date"
                              value={activityDate}
                              onChange={(e: any) => setActivityDate(e.target.value)}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Add Log Entry
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Activities List */}
                  <div className="md:col-span-8">
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0 space-y-6">
                        <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-50 pb-2">
                          Sowing & Harvest Logs
                        </h3>
                        {farm.activities.length > 0 ? (
                          <div className="relative pl-6 border-l-2 border-neutral-100 space-y-6">
                            {farm.activities.map((act) => (
                              <div key={act.id} className="relative">
                                {/* Dot indicator */}
                                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary-600 border-4 border-white ring-2 ring-neutral-50" />
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-neutral-400">{act.activityDate}</span>
                                  <h4 className="font-extrabold text-neutral-900 text-sm leading-snug">{act.title}</h4>
                                  <p className="text-xs text-neutral-500 font-semibold">{act.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-neutral-400 text-sm">No activity logs recorded.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Photo upload form */}
                  <div className="md:col-span-4">
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0">
                        <form onSubmit={handleUploadImage} className="space-y-4">
                          <h3 className="font-extrabold text-neutral-900 text-base border-b border-neutral-50 pb-2">
                            Upload Crop File
                          </h3>
                          <div className="space-y-1.5">
                            <Label htmlFor="imageUpload">Select Image File</Label>
                            <Input
                              id="imageUpload"
                              type="file"
                              ref={imageInputRef}
                              accept="image/*"
                              onChange={(e: any) => setGalleryFile(e.target.files?.[0] || null)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="imageCaption">Short Caption</Label>
                            <Input
                              id="imageCaption"
                              placeholder="E.g. Leaf spot close up"
                              value={galleryCaption}
                              onChange={(e: any) => setGalleryCaption(e.target.value)}
                            />
                          </div>
                          <Button type="submit" className="w-full gap-2 justify-center">
                            <Upload className="h-4 w-4" />
                            <span>Upload Image</span>
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Photos Grid */}
                  <div className="md:col-span-8">
                    <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
                      <CardContent className="p-0 space-y-6">
                        <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-50 pb-2">
                          Images & Upload History
                        </h3>
                        {farm.images.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {farm.images.map((img) => (
                              <div key={img.id} className="group relative rounded-xl border border-neutral-100 overflow-hidden bg-neutral-50">
                                <img
                                  src={img.imageUrl}
                                  alt={img.caption}
                                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="p-2 bg-white text-left">
                                  <p className="text-[10px] font-bold text-neutral-800 truncate">{img.caption}</p>
                                  <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">
                                    {new Date(img.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-neutral-400 text-sm">
                            No uploaded crop images.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Weather Tab */}
              {activeTab === 'weather' && (
                <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-2 border-b border-neutral-50 pb-3">
                      <SunDim className="h-5 w-5 text-accent-yellow-600" />
                      <Heading level="h2" className="text-xl font-bold text-neutral-900">Weather Intelligence & Alerts</Heading>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                      <div className="p-5 rounded-xl border border-primary-50 bg-primary-50/10 space-y-2">
                        <p className="text-xs font-bold text-primary-700 uppercase tracking-wide">Farming Action Recommendation</p>
                        <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                          Light showers expected tomorrow evening. Postpone any fertilizer or chemical applications by 48 hours to avoid run-off.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Local Micro-Climate</p>
                        <ul className="space-y-1.5 text-xs font-bold text-neutral-700 pt-1">
                          <li>🌡️ Temp: 31°C</li>
                          <li>💧 Humidity: 65%</li>
                          <li>💨 Wind: 14 km/h West</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
