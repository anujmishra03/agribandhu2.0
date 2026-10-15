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

const OAUTH_ERRORS: Record<string, string> = {
  google_not_configured: 'Google sign-in is not configured on the server.',
  oauth_state_mismatch: 'Google sign-in session expired. Please try again.',
  oauth_token_exchange_failed: 'Could not verify your Google account. Please try again.',
  oauth_invalid_token: 'Could not verify your Google account. Please try again.',
  oauth_userinfo_failed: 'Could not read your Google profile. Please try again.',
  oauth_email_unavailable: 'Your Google account has no verified email address.',
  oauth_failed: 'Google sign-in failed. Please try again.',
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      setErrorMsg(OAUTH_ERRORS[error] || 'Sign in failed. Please try again.');
    }
  }, []);

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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-neutral-400 font-semibold tracking-wide">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <a href="/api/auth/google" className="flex items-center justify-center gap-2">
                  <GoogleIcon className="h-4 w-4" />
                  <span>Continue with Google</span>
                </a>
              </Button>

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
