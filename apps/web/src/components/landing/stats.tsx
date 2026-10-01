'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { StatsCard, Container, Heading } from '@agribandhu/ui';

const STATS = [
  { value: '1000+', label: 'Active Farmers' },
  { value: '98%', label: 'Detection Accuracy' },
  { value: '24/7', label: 'AI Support Desk' },
  { value: '50+', label: 'Supported Crops' },
];

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <Container className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-300 font-bold text-sm tracking-widest uppercase"
          >
            AgriBandhu Impact
          </motion.div>
          <Heading level="h2" align="center" className="text-3xl sm:text-4xl font-extrabold text-white">
            Transforming Agriculture with Trusted Insights
          </Heading>
          <p className="text-primary-100/70 text-sm sm:text-base leading-relaxed">
            Our technology is built to be reliable, fast, and accessible for rural farming communities, helping secure their livelihood.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="text-neutral-900" /* override text color in cards to maintain card readability */
            >
              <StatsCard value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
