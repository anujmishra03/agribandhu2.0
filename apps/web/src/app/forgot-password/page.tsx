'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, HelpCircle, ArrowLeft, KeyRound, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Label, Container, Heading, Card, CardContent } from '@agribandhu/ui';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [successInfo, setSuccessInfo] = React.useState<{ message: string; token?: string } | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

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
      const response = await forgotPassword(data.email);
      setSuccessInfo({
        message: response.message,
        token: response.debugToken,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Request failed. Please check your email.');
    }
  };

  const copyToClipboard = () => {
    if (successInfo?.token) {
      navigator.clipboard.writeText(successInfo.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
              {!successInfo ? (
                <>
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <Heading level="h1" align="center" className="text-2xl font-extrabold text-neutral-900">
                      Forgot Password?
                    </Heading>
                    <p className="text-neutral-500 text-sm">
                      Enter your email address and we will generate a recovery token to reset your password.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Requesting...' : 'Generate Reset Token'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Check className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-neutral-900">Request Sent</h3>
                    <p className="text-neutral-500 text-sm">
                      {successInfo.message}
                    </p>
                  </div>

                  {successInfo.token && (
                    <div className="rounded-xl border border-primary-100 bg-primary-50/30 p-4 space-y-3">
                      <p className="text-xs font-bold text-primary-800 uppercase tracking-wide">
                        Sandbox Debug Token
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-mono font-extrabold text-neutral-800 tracking-wider">
                          {successInfo.token}
                        </span>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-600 transition-colors"
                          title="Copy Code"
                        >
                          {copied ? <Check className="h-4 w-4 text-primary-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                        Copy this code and paste it on the reset page.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link href="/reset-password">
                      <Button className="w-full">Proceed to Reset Password</Button>
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
