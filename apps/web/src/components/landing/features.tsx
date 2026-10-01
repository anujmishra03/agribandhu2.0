'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Droplet, Calendar, FileText, CloudSun, Bot } from 'lucide-react';
import { FeatureCard, Container, Heading } from '@agribandhu/ui';

const FEATURES = [
  {
    title: 'AI Disease Detection',
    description: 'Upload crop images to immediately detect pests and diseases, and get organic or chemical cure recommendations.',
    icon: ScanLine,
  },
  {
    title: 'Soil Health Analysis',
    description: 'Understand soil nutrient configurations, pH values, and moisture status with diagnostic recommendation logs.',
    icon: Droplet,
  },
  {
    title: 'Crop Calendar',
    description: 'Get personalized, region-based cultivation calendars detailing irrigation, seeding, and harvest cycles.',
    icon: Calendar,
  },
  {
    title: 'Government Schemes',
    description: 'Search, apply, and receive notifications for central and state agriculture subsidies and schemes.',
    icon: FileText,
  },
  {
    title: 'Weather Forecast',
    description: 'Access highly local, real-time weather logs and proactive storm or heavy rainfall alerts.',
    icon: CloudSun,
  },
  {
    title: 'AI Assistant',
    description: 'Ask questions in your regional language and receive crop advice powered by AgriBandhu AI models.',
    icon: Bot,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-neutral-50/50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            What We Offer
          </motion.div>
          <Heading level="h2" align="center" className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Smart Features Built for Modern Agriculture
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            AgriBandhu combines cutting-edge artificial intelligence with local agronomy expertise to provide actionable guides for your farm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <FeatureCard title={feat.title} description={feat.description} icon={feat.icon} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
