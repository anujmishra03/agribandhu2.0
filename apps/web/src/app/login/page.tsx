'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Container, Heading, Card, CardContent } from '@agribandhu/ui';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await login(data.email, data.password, data.rememberMe);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="py-16 sm:py-24 min-h-[80vh] flex items-center bg-neutral-50/30">
      <Container className="max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to landing page</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-md">
            <CardContent className="p-0 space-y-6">
              <div className="text-center space-y-2">
                <Heading level="h1" align="center" className="text-3xl font-extrabold text-neutral-900">
                  Welcome Back
                </Heading>
                <p className="text-neutral-500 text-sm">
                  Sign in to access crop recommendations and soil reports.
                </p>
              </div>

              {errorMsg && (
                <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      placeholder="farmer@agribandhu.in"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-50 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-semibold text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="text-xs font-semibold text-neutral-600 select-none">
                    Remember me for 7 days
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <LogIn className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-xs sm:text-sm text-neutral-500 border-t border-neutral-100 pt-5">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-primary-600 hover:underline">
                  Register here
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
