'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Sprout, Contact, CheckCircle2, ShieldAlert, Upload, Download, Trash2, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, Input, Label, Card, CardContent, Heading } from '@agribandhu/ui';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  village: z.string().min(2, 'Village is required.'),
  preferredLanguage: z.string().min(2, 'Language is required.'),
  farmSize: z.preprocess((val) => Number(val), z.number().nonnegative('Farm size must be positive.')),
  experience: z.preprocess((val) => Number(val), z.number().int().nonnegative('Experience must be an integer.')),
  primaryCrop: z.string().min(2, 'Primary crop is required.'),
  secondaryCrop: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  
  // Phase 3 Extended fields
  dob: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  country: z.string().optional().default('India'),
  pinCode: z.string().optional().nullable(),
  farmerCategory: z.string().optional().default('Medium'),
  preferredUnits: z.string().optional().default('Acres'),
  organicFarming: z.boolean().optional().default(false),
  irrigationMethod: z.string().optional().default('Drip'),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactRelation: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const profile = user?.profile;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      state: profile?.state || '',
      district: profile?.district || '',
      village: profile?.village || '',
      preferredLanguage: profile?.preferredLanguage || '',
      farmSize: profile?.farmSize || 0,
      experience: profile?.experience || 0,
      primaryCrop: profile?.primaryCrop || '',
      secondaryCrop: profile?.secondaryCrop || '',
      bio: profile?.bio || '',
      dob: profile?.dob || '',
      gender: profile?.gender || '',
      country: profile?.country || 'India',
      pinCode: profile?.pinCode || '',
      farmerCategory: profile?.farmerCategory || 'Medium',
      preferredUnits: profile?.preferredUnits || 'Acres',
      organicFarming: profile?.organicFarming || false,
      irrigationMethod: profile?.irrigationMethod || 'Drip',
      emergencyContactName: profile?.emergencyContactName || '',
      emergencyContactRelation: profile?.emergencyContactRelation || '',
      emergencyContactPhone: profile?.emergencyContactPhone || '',
    },
  });

  React.useEffect(() => {
    if (user) {
      const p = user.profile;
      reset({
        name: user.name || '',
        phone: user.phone || '',
        state: p?.state || '',
        district: p?.district || '',
        village: p?.village || '',
        preferredLanguage: p?.preferredLanguage || '',
        farmSize: p?.farmSize || 0,
        experience: p?.experience || 0,
        primaryCrop: p?.primaryCrop || '',
        secondaryCrop: p?.secondaryCrop || '',
        bio: p?.bio || '',
        dob: p?.dob || '',
        gender: p?.gender || '',
        country: p?.country || 'India',
        pinCode: p?.pinCode || '',
        farmerCategory: p?.farmerCategory || 'Medium',
        preferredUnits: p?.preferredUnits || 'Acres',
        organicFarming: p?.organicFarming || false,
        irrigationMethod: p?.irrigationMethod || 'Drip',
        emergencyContactName: p?.emergencyContactName || '',
        emergencyContactRelation: p?.emergencyContactRelation || '',
        emergencyContactPhone: p?.emergencyContactPhone || '',
      });
    }
  }, [user, reset]);

  // Calculate completion percentage dynamically
  const formValues = watch();
  const completionData = React.useMemo(() => {
    const keysToCheck = [
      { key: 'name', label: 'Full Name' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'state', label: 'State' },
      { key: 'district', label: 'District' },
      { key: 'village', label: 'Village' },
      { key: 'preferredLanguage', label: 'Language' },
      { key: 'farmSize', label: 'Farm Area' },
      { key: 'experience', label: 'Farming Experience' },
      { key: 'primaryCrop', label: 'Primary Crop' },
      { key: 'pinCode', label: 'PIN Code' },
      { key: 'farmerCategory', label: 'Farmer Category' },
      { key: 'preferredUnits', label: 'Measurement Units' },
      { key: 'irrigationMethod', label: 'Irrigation Method' },
      { key: 'emergencyContactName', label: 'Emergency Contact Name' },
      { key: 'emergencyContactPhone', label: 'Emergency Contact Phone' },
    ] as const;

    const missingItems: string[] = [];
    let completedCount = 0;

    keysToCheck.forEach((item) => {
      const val = formValues[item.key as keyof ProfileFormData];
      if (val !== undefined && val !== null && val !== '' && val !== 0) {
        completedCount++;
      } else {
        missingItems.push(item.label);
      }
    });

    // Add avatar check if user has avatar
    if (user?.avatar) completedCount++;

    const totalCheckPoints = keysToCheck.length + 1; // +1 for avatar
    const percentage = Math.round((completedCount / totalCheckPoints) * 100);

    return { percentage, missingItems };
  }, [formValues, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo.');
      await refreshUser();
      setSuccessMsg('Profile photo updated successfully!');
      setAvatarFile(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Avatar upload failed.');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Update failed.');

      await refreshUser();
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Update failed.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure you want to delete your account? This action is irreversible.')) return;

    try {
      const res = await fetch('/api/profile', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete account.');
      alert('Your account has been deleted successfully.');
      logout();
    } catch (err: any) {
      setErrorMsg(err.message || 'Account deletion failed.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1 text-left">
            <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
              My Profile Settings
            </Heading>
            <p className="text-neutral-500 text-sm">
              Manage your personal farm demographics, emergency contacts, and account security.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Placeholder export
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `agribandhu-profile-${user?.name.replace(/\s+/g, '-')}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
            {!isEditing ? (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => { setIsEditing(false); reset(); }}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Completion Progress Widget */}
        <Card className="border border-primary-100 bg-primary-50/15 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-center md:text-left space-y-2">
                <p className="text-xs font-bold text-primary-700 uppercase tracking-wider">Profile Setup Progress</p>
                <div className="text-5xl font-extrabold text-primary-600 font-sans">{completionData.percentage}%</div>
              </div>
              <div className="md:col-span-8 space-y-3">
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${completionData.percentage}%` }}
                  />
                </div>
                {completionData.missingItems.length > 0 ? (
                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                    💡 Missing details: <span className="text-neutral-700 font-bold">{completionData.missingItems.slice(0, 4).join(', ')}{completionData.missingItems.length > 4 && '...'}</span>
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-primary-700 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    <span>Your profile is fully completed!</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {errorMsg && (
          <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-lg bg-primary-50 border border-primary-100 p-3.5 text-xs sm:text-sm font-semibold text-primary-700">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Avatar Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-neutral-100 bg-white shadow-sm p-6 text-center">
              <CardContent className="p-0 space-y-6 flex flex-col items-center">
                <div className="relative">
                  {avatarPreview || user?.avatar ? (
                    <img
                      src={avatarPreview || user?.avatar || ''}
                      alt="avatar"
                      className="h-32 w-32 rounded-full object-cover border-4 border-primary-50 shadow-md"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-4xl border-4 border-primary-50 shadow-sm uppercase">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
                    title="Change Photo"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />

                {avatarFile && (
                  <Button size="sm" onClick={handleUploadAvatar} className="w-full">
                    Upload Selected Photo
                  </Button>
                )}

                <div className="space-y-1">
                  <h3 className="font-extrabold text-neutral-900 text-lg leading-tight">{user?.name}</h3>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{user?.role}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-100 bg-white shadow-sm p-6 space-y-4">
              <CardContent className="p-0 space-y-4">
                <h3 className="font-bold text-neutral-900 border-b border-neutral-50 pb-2">Danger Zone</h3>
                <Button variant="outline" onClick={handleDeleteAccount} className="w-full gap-2 text-destructive border-destructive hover:bg-destructive-50 hover:text-destructive justify-center">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Profile Details Form */}
          <div className="lg:col-span-8">
            <Card className="border border-neutral-100 bg-white shadow-sm p-6 sm:p-8">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                      <User className="h-5 w-5" />
                      <span className="text-base text-neutral-900">Personal Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" disabled={!isEditing} {...register('name')} />
                        {errors.name && <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address (Read-only)</Label>
                        <Input id="email" type="email" disabled value={user?.email || ''} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" disabled={!isEditing} {...register('phone')} />
                        {errors.phone && <p className="text-xs font-semibold text-destructive">{errors.phone.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="dob">Date of Birth (Optional)</Label>
                        <Input id="dob" type="date" disabled={!isEditing} {...register('dob')} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <select id="gender" disabled={!isEditing} className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('gender')}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                      <MapPin className="h-5 w-5" />
                      <span className="text-base text-neutral-900">Address Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="village">Village / Town</Label>
                        <Input id="village" disabled={!isEditing} {...register('village')} />
                        {errors.village && <p className="text-xs font-semibold text-destructive">{errors.village.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="district">District</Label>
                        <Input id="district" disabled={!isEditing} {...register('district')} />
                        {errors.district && <p className="text-xs font-semibold text-destructive">{errors.district.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" disabled={!isEditing} {...register('state')} />
                        {errors.state && <p className="text-xs font-semibold text-destructive">{errors.state.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" disabled={!isEditing} {...register('country')} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pinCode">PIN Code</Label>
                        <Input id="pinCode" disabled={!isEditing} {...register('pinCode')} />
                      </div>
                    </div>
                  </div>

                  {/* Farming Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                      <Sprout className="h-5 w-5" />
                      <span className="text-base text-neutral-900">Farming Metrics</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="farmerCategory">Farmer Category</Label>
                        <select id="farmerCategory" disabled={!isEditing} className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('farmerCategory')}>
                          <option value="Small">Small (Less than 2 Hectares)</option>
                          <option value="Medium">Medium (2 - 10 Hectares)</option>
                          <option value="Large">Large (More than 10 Hectares)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input id="experience" type="number" disabled={!isEditing} {...register('experience')} />
                        {errors.experience && <p className="text-xs font-semibold text-destructive">{errors.experience.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="preferredLanguage">Communication Language</Label>
                        <Input id="preferredLanguage" disabled={!isEditing} {...register('preferredLanguage')} />
                        {errors.preferredLanguage && <p className="text-xs font-semibold text-destructive">{errors.preferredLanguage.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="preferredUnits">Measurement Units</Label>
                        <select id="preferredUnits" disabled={!isEditing} className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none" {...register('preferredUnits')}>
                          <option value="Acres">Acres</option>
                          <option value="Hectares">Hectares</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="irrigationMethod">Irrigation Method</Label>
                        <Input id="irrigationMethod" placeholder="Drip, Sprinkler, Manual" disabled={!isEditing} {...register('irrigationMethod')} />
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="flex items-center gap-2 py-3">
                          <input id="organicFarming" type="checkbox" disabled={!isEditing} className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500" {...register('organicFarming')} />
                          <label htmlFor="organicFarming" className="text-sm font-semibold text-neutral-700 select-none">Practice Organic Farming</label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="primaryCrop">Primary Crop</Label>
                        <Input id="primaryCrop" disabled={!isEditing} {...register('primaryCrop')} />
                        {errors.primaryCrop && <p className="text-xs font-semibold text-destructive">{errors.primaryCrop.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="secondaryCrop">Secondary Crop (Optional)</Label>
                        <Input id="secondaryCrop" disabled={!isEditing} {...register('secondaryCrop')} />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600 font-bold border-b border-neutral-50 pb-2">
                      <Contact className="h-5 w-5" />
                      <span className="text-base text-neutral-900">Emergency Contact Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="emergencyContactName">Contact Name</Label>
                        <Input id="emergencyContactName" disabled={!isEditing} {...register('emergencyContactName')} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="emergencyContactRelation">Relationship</Label>
                        <Input id="emergencyContactRelation" placeholder="Brother, Wife, Son" disabled={!isEditing} {...register('emergencyContactRelation')} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                        <Input id="emergencyContactPhone" disabled={!isEditing} {...register('emergencyContactPhone')} />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 border-t border-neutral-100 flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
