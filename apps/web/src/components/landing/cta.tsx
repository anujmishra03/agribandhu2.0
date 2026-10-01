'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Container, Heading } from '@agribandhu/ui';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section id="get-started" className="py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-800 text-white overflow-hidden py-16 px-6 sm:px-12 md:py-20 text-center shadow-xl shadow-primary-600/10"
        >
          {/* Background circles */}
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 rounded-full bg-accent-yellow-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-100 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent-yellow-400" />
              <span>Phase 1 Sandbox - Free for All</span>
            </div>

            <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Transform Your Farming Experience?
            </Heading>

            <p className="text-primary-100/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Join thousands of farmers using AgriBandhu AI to monitor crop growth, prevent crop failures, and scale their yield production.
            </p>

            <div className="pt-4 w-full sm:w-auto">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="accentYellow"
                  size="lg"
                  className="w-full sm:w-auto text-neutral-900 group gap-2 h-14 text-lg rounded-xl shadow-lg"
                >
                  Start Using AgriBandhu
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
