'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, FileSignature, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Container, Heading, Card, CardContent } from '@agribandhu/ui';

const schema = z
  .object({
    token: z.string().min(1, 'Reset token is required.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Confirm password is required.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setErrorMsg(null);
    try {
      await resetPassword(data.token, data.password);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. The token may be expired or invalid.');
    }
  };

  return (
    <div className="py-16 sm:py-24 min-h-[80vh] flex items-center bg-neutral-50/30">
      <Container className="max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to login</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-md">
            <CardContent className="p-0 space-y-6">
              {!isSuccess ? (
                <>
                  <div className="text-center space-y-2">
                    <Heading level="h1" align="center" className="text-2xl font-extrabold text-neutral-900">
                      Reset Password
                    </Heading>
                    <p className="text-neutral-500 text-sm">
                      Enter the 6-digit OTP token and key in your new secure password.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Token */}
                    <div className="space-y-2">
                      <Label htmlFor="token">Reset OTP Code</Label>
                      <div className="relative">
                        <FileSignature className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                          id="token"
                          type="text"
                          className="pl-10 font-mono tracking-wider text-lg"
                          placeholder="123456"
                          {...register('token')}
                        />
                      </div>
                      {errors.token && (
                        <p className="text-xs font-semibold text-destructive">{errors.token.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10"
                          placeholder="••••••••"
                          {...register('password')}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-xs font-semibold text-destructive">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pl-10"
                          placeholder="••••••••"
                          {...register('confirmPassword')}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs font-semibold text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Resetting...' : 'Update Password'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-neutral-900">Success!</h3>
                    <p className="text-neutral-500 text-sm">
                      Your password has been successfully reset. You can now use your new password to log in.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/login">
                      <Button className="w-full">Proceed to Login</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
