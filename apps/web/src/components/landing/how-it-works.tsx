'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Upload, ShieldAlert, FileCheck } from 'lucide-react';
import { Container, Heading, Card, CardContent } from '@agribandhu/ui';

const STEPS = [
  {
    number: '01',
    title: 'Register',
    description: 'Create your account by entering your phone number and selecting your language preference.',
    icon: UserPlus,
    color: 'bg-primary-50 text-primary-600',
  },
  {
    number: '02',
    title: 'Upload Crop Image',
    description: 'Take or upload a photo of your affected crop using your phone camera directly on our app.',
    icon: Upload,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    number: '03',
    title: 'AI Detects Disease',
    description: 'Our agricultural AI model processes the image in seconds to identify specific pests or deficiencies.',
    icon: ShieldAlert,
    color: 'bg-accent-yellow-50 text-accent-yellow-600',
  },
  {
    number: '04',
    title: 'Get Recommendations',
    description: 'Receive verified treatments, pesticide quantities, and irrigation adjustments for recovery.',
    icon: FileCheck,
    color: 'bg-accent-brown-50 text-accent-brown-700',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            How it works
          </motion.div>
          <Heading level="h2" align="center" className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Four Simple Steps to Healthier Yields
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Get instant solutions tailored to your crops in less than a minute. Here is the step-by-step process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative group"
                >
                  <Card className="h-full border border-neutral-100/80 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                      <div className={`rounded-2xl p-4 mb-5 ${step.color} transition-transform group-hover:scale-105 duration-200`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-bold text-neutral-300 mb-1 font-mono tracking-wider">
                        STEP {step.number}
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Arrow connector for Desktop */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none"
                    style={{ left: `calc(${25 * (idx + 1)}% - 16px)` }}
                  >
                    <ArrowRight className="h-8 w-8 animate-pulse text-neutral-200" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
