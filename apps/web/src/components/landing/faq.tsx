'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FAQAccordion, Container, Heading } from '@agribandhu/ui';

const FAQS = [
  {
    question: 'What is AgriBandhu and how does it help farmers?',
    answer:
      'AgriBandhu is an AI-powered agricultural helper platform. It helps farmers identify crop leaf diseases, analyze soil health reports, view localized weather warnings, access region-specific crop calendars, and discover relevant government subsidies.',
  },
  {
    question: 'How do I analyze crop diseases on the platform?',
    answer:
      'You simply take a clear picture of the damaged or infected crop leaf using your mobile camera, and upload it. The AI analyzer processes the symptoms instantly, giving you a detailed breakdown of the disease and a list of organic and chemical remedies.',
  },
  {
    question: 'Is AgriBandhu available in Indian regional languages?',
    answer:
      'Yes, localization is a core priority for us. AgriBandhu supports major Indian regional languages including Hindi, Punjabi, Marathi, Gujarati, Telugu, Tamil, and Bengali to ensure it is fully accessible to rural farmers.',
  },
  {
    question: 'Does the application support offline usage?',
    answer:
      'You require an active internet connection to perform live AI disease checks and receive updated weather warnings. However, once loaded, your crop calendar checklist, government scheme details, and advice summaries are stored offline for quick reference.',
  },
  {
    question: 'How do I use the smart soil analysis recommendations?',
    answer:
      'You can input the primary soil values (Nitrogen, Phosphorus, Potassium, and pH level) from your government Soil Health Card, or upload a scanned image of the report. The platform translates the values into an optimal crop matching and fertilizer application schedule.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-neutral-50/50">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            Got Questions?
          </motion.div>
          <Heading level="h2" align="center" className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Frequently Asked Questions
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Here are answers to the most common questions about using AgriBandhu on your farm.
          </p>
        </div>

        <FAQAccordion items={FAQS} />
      </Container>
    </section>
  );
}
