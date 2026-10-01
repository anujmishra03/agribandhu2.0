'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Container, Heading, Card, CardContent } from '@agribandhu/ui';

// Step 1 schema
const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['FARMER', 'OFFICER', 'ADMIN']),
});

// Step 2 schema
const step2Schema = z.object({
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  village: z.string().min(2, 'Village is required.'),
  preferredLanguage: z.string().min(2, 'Language is required.'),
  farmSize: z.preprocess((val) => Number(val), z.number().nonnegative('Farm size must be a positive number.')),
  experience: z.preprocess((val) => Number(val), z.number().int().nonnegative('Experience must be a positive integer.')),
  primaryCrop: z.string().min(2, 'Primary crop is required.'),
  secondaryCrop: z.string().optional(),
  bio: z.string().optional(),
});

const fullSchema = step1Schema.merge(step2Schema);
type RegisterFormData = z.infer<typeof fullSchema>;

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      role: 'FARMER',
      farmSize: 0,
      experience: 0,
    },
  });

  const handleNextStep = async () => {
    // Validate only Step 1 fields before transitioning
    const fieldsToValidate = ['name', 'email', 'phone', 'password', 'role'] as any;
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setErrorMsg(null);
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    try {
      await registerUser(data);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="py-12 bg-neutral-50/30 min-h-[85vh] flex items-center">
      <Container className="max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to landing page</span>
        </Link>

        <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-md">
          <CardContent className="p-0 space-y-6">
            {/* Header / Steps Indicator */}
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Heading level="h1" align="center" className="text-3xl font-extrabold text-neutral-900">
                  Farmer Registration
                </Heading>
                <p className="text-neutral-500 text-sm">
                  Join AgriBandhu to unlock personalized AI guidelines for your crops.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between gap-4 max-w-sm mx-auto pt-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                    1
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">Account</span>
                </div>
                <div className="h-[1px] bg-neutral-200 flex-grow" />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                    2
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">Farm Profile</span>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <Heading level="h3" className="text-lg font-bold border-b border-neutral-50 pb-2">
                      1. Account Credentials
                    </Heading>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="E.g. Rajesh Patil" {...register('name')} />
                      {errors.name && <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="rajesh@gmail.com" {...register('email')} />
                      {errors.email && <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="9876543210" {...register('phone')} />
                      {errors.phone && <p className="text-xs font-semibold text-destructive">{errors.phone.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password (min 6 characters)</Label>
                      <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                      {errors.password && <p className="text-xs font-semibold text-destructive">{errors.password.message}</p>}
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                      <Label htmlFor="role">Select Your Role</Label>
                      <select
                        id="role"
                        className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 transition-all duration-200"
                        {...register('role')}
                      >
                        <option value="FARMER">Farmer</option>
                        <option value="OFFICER">Agriculture Officer</option>
                        <option value="ADMIN">System Admin</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <Button type="button" onClick={handleNextStep} className="w-full flex items-center justify-center gap-2">
                        <span>Continue to Farm Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <Heading level="h3" className="text-lg font-bold border-b border-neutral-50 pb-2">
                      2. Region & Farm Information
                    </Heading>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* State */}
                      <div className="space-y-1.5">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="Maharashtra" {...register('state')} />
                        {errors.state && <p className="text-xs font-semibold text-destructive">{errors.state.message}</p>}
                      </div>

                      {/* District */}
                      <div className="space-y-1.5">
                        <Label htmlFor="district">District</Label>
                        <Input id="district" placeholder="Pune" {...register('district')} />
                        {errors.district && <p className="text-xs font-semibold text-destructive">{errors.district.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Village */}
                      <div className="space-y-1.5">
                        <Label htmlFor="village">Village / Town</Label>
                        <Input id="village" placeholder="Khed" {...register('village')} />
                        {errors.village && <p className="text-xs font-semibold text-destructive">{errors.village.message}</p>}
                      </div>

                      {/* Language */}
                      <div className="space-y-1.5">
                        <Label htmlFor="preferredLanguage">Preferred Language</Label>
                        <Input id="preferredLanguage" placeholder="Marathi" {...register('preferredLanguage')} />
                        {errors.preferredLanguage && <p className="text-xs font-semibold text-destructive">{errors.preferredLanguage.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Farm Size */}
                      <div className="space-y-1.5">
                        <Label htmlFor="farmSize">Farm Size (in Acres)</Label>
                        <Input id="farmSize" type="number" step="0.1" placeholder="4.5" {...register('farmSize')} />
                        {errors.farmSize && <p className="text-xs font-semibold text-destructive">{errors.farmSize.message}</p>}
                      </div>

                      {/* Experience */}
                      <div className="space-y-1.5">
                        <Label htmlFor="experience">Farming Experience (in Years)</Label>
                        <Input id="experience" type="number" placeholder="10" {...register('experience')} />
                        {errors.experience && <p className="text-xs font-semibold text-destructive">{errors.experience.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Primary Crop */}
                      <div className="space-y-1.5">
                        <Label htmlFor="primaryCrop">Primary Crop</Label>
                        <Input id="primaryCrop" placeholder="Tomatoes" {...register('primaryCrop')} />
                        {errors.primaryCrop && <p className="text-xs font-semibold text-destructive">{errors.primaryCrop.message}</p>}
                      </div>

                      {/* Secondary Crop */}
                      <div className="space-y-1.5">
                        <Label htmlFor="secondaryCrop">Secondary Crop (Optional)</Label>
                        <Input id="secondaryCrop" placeholder="Onions" {...register('secondaryCrop')} />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <Label htmlFor="bio">Brief Farming Bio (Optional)</Label>
                      <Input id="bio" placeholder="Cultivating organic vegetables since 2015..." {...register('bio')} />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1 flex items-center justify-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>
                      <Button type="submit" className="flex-grow flex items-center justify-center gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span>Registering...</span>
                        ) : (
                          <>
                            <span>Register & Access</span>
                            <ShieldCheck className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="text-center text-xs sm:text-sm text-neutral-500 border-t border-neutral-100 pt-5">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary-600 hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
