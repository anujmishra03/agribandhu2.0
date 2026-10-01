'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Button, Input, Textarea, Label, Container, Heading, Card, CardContent } from '@agribandhu/ui';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Submitted successfully:', data);
    setIsSuccess(true);
    reset();
  };

  return (
    <div className="py-16 sm:py-24 bg-neutral-50/30">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            Get In Touch
          </motion.div>
          <Heading level="h1" align="center" className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Contact Our Support Team
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Have questions about disease detection, soil test inputs, or account access? We are here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-neutral-100/80 bg-white p-6 shadow-sm">
              <CardContent className="p-0 space-y-8">
                <Heading level="h3" className="text-neutral-950 font-bold">
                  Contact Information
                </Heading>
                <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
                  Reach out to us directly or fill in the form and we will reply within 24 hours.
                </p>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex gap-4 items-start">
                    <div className="rounded-xl bg-primary-50 p-3 text-primary-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Call Us (Toll-Free)</h4>
                      <p className="text-neutral-500 text-sm sm:text-base">1800-123-4567</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 items-start">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Email Support</h4>
                      <p className="text-neutral-500 text-sm sm:text-base">support@agribandhu.in</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4 items-start">
                    <div className="rounded-xl bg-accent-yellow-50/50 p-3 text-accent-yellow-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Corporate Office</h4>
                      <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
                        Krishi Bhawan, Sector 5, New Delhi, India
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7">
            <Card className="border border-neutral-100/80 bg-white p-6 sm:p-8 shadow-sm">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          aria-invalid={errors.name ? 'true' : 'false'}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email address"
                          aria-invalid={errors.email ? 'true' : 'false'}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Your 10-digit mobile number"
                          aria-invalid={errors.phone ? 'true' : 'false'}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-xs font-semibold text-destructive">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Describe your question or request..."
                          aria-invalid={errors.message ? 'true' : 'false'}
                          {...register('message')}
                        />
                        {errors.message && (
                          <p className="text-xs font-semibold text-destructive">{errors.message.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>Sending Message...</span>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 space-y-6 flex flex-col items-center"
                    >
                      <div className="rounded-full bg-primary-50 p-4 text-primary-600">
                        <CheckCircle2 className="h-12 w-12" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-neutral-900">Thank You!</h3>
                        <p className="text-neutral-500 text-sm sm:text-base max-w-sm">
                          Your message has been sent successfully. Our support team will get in touch with you shortly.
                        </p>
                      </div>
                      <Button onClick={() => setIsSuccess(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
