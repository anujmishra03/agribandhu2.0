'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard, Container, Heading } from '@agribandhu/ui';

const TESTIMONIALS = [
  {
    quote: "AgriBandhu helped me detect leaf blast disease in my paddy crop 2 weeks earlier than usual. The organic remedy recommended saved my entire harvest, keeping my family secure.",
    author: {
      name: 'Ramesh Kumar',
      role: 'Paddy Cultivator',
      location: 'Punjab',
    },
  },
  {
    quote: "The soil health recommendations are very simple to follow. I adjusted my fertilizer usage based on the diagnostic insight, and my tomato crop yield increased by 20% this season!",
    author: {
      name: 'Sunita Devi',
      role: 'Organic Vegetable Grower',
      location: 'Maharashtra',
    },
  },
  {
    quote: "Having access to agronomy guidelines and disease detection at any hour in my local language is life-changing. I just upload a picture of the insect and get immediate spray dosages.",
    author: {
      name: 'Amit Patel',
      role: 'Cotton & Spice Farmer',
      location: 'Gujarat',
    },
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            Farmer Reviews
          </motion.div>
          <Heading level="h2" align="center" className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Loved by Farmers Across India
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Read how AgriBandhu is assisting rural farming families to build sustainable agriculture and secure food production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.author.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <TestimonialCard quote={test.quote} author={test.author} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
