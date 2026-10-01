'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Container } from '@agribandhu/ui';
import { ArrowRight, Leaf } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-36 bg-gradient-to-b from-primary-50/40 via-white to-transparent">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700"
            >
              <Leaf className="h-4 w-4" />
              <span>AgriBandhu AI Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-neutral-900 font-sans"
            >
              Empowering Farmers with <span className="text-primary-600">AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-neutral-600 max-w-xl font-medium leading-relaxed"
            >
              AI-powered crop disease detection, soil health analysis, smart reminders, and agricultural insights for higher yields.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/#get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group gap-2">
                  Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/#features" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            <div className="w-full max-w-[480px] sm:max-w-[540px] aspect-square relative select-none">
              <svg
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Background Grid Circles */}
                <circle cx="250" cy="250" r="230" stroke="#f0fdf4" strokeWidth="2" />
                <circle cx="250" cy="250" r="180" stroke="#e8fcf0" strokeWidth="2" />

                {/* Sun */}
                <motion.circle
                  cx="410"
                  cy="90"
                  r="30"
                  fill="#fef08a"
                  initial={{ opacity: 0.8 }}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                />

                {/* Hills / Fields */}
                <path d="M50 430C150 400 220 420 330 380C410 350 450 360 450 360V450H50V430Z" fill="#bbf7d0" />
                <path d="M120 440C220 410 320 430 450 395V450H120V440Z" fill="#86efac" />
                <path d="M250 445C330 435 390 440 450 425V450H250V445Z" fill="#4ade80" />

                {/* Tractor */}
                <rect x="180" y="380" width="40" height="25" rx="4" fill="#15803d" />
                <rect x="205" y="365" width="12" height="16" rx="2" fill="#dcfce7" />
                <circle cx="190" cy="405" r="8" fill="#1e293b" />
                <circle cx="210" cy="405" r="8" fill="#1e293b" />

                {/* Wind Turbine */}
                <line x1="80" y1="420" x2="80" y2="340" stroke="#94a3b8" strokeWidth="4" />
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                  style={{ transformOrigin: '80px 340px' }}
                >
                  <line x1="80" y1="340" x2="80" y2="300" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                  <line x1="80" y1="340" x2="45" y2="360" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                  <line x1="80" y1="340" x2="115" y2="360" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                </motion.g>

                {/* Cloud 1 */}
                <motion.g
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                >
                  <path d="M100 130C100 119 109 110 120 110C123.5 110 127 111 130 113C134.5 105 143 100 152 100C165.5 100 177 110.5 178 124C185 125 190 131 190 138C190 145.5 184 151.5 176.5 151.5H113.5C106 151.5 100 145.5 100 138Z" fill="#f8fafc" />
                </motion.g>

                {/* AI / Digital Leaf (Floating Centerpiece) */}
                <motion.g
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  {/* Floating Hexagon Panel */}
                  <polygon points="250,150 330,195 330,285 250,330 170,285 170,195" fill="white" fillOpacity="0.85" stroke="#22c55e" strokeWidth="3" filter="drop-shadow(0px 8px 24px rgba(34, 197, 94, 0.15))" />

                  {/* Leaf inside hexagon */}
                  <path d="M250 180C210 220 215 285 250 295C285 285 290 220 250 180Z" fill="url(#leaf-grad)" />
                  <path d="M250 180V295" stroke="white" strokeWidth="2" />
                  <path d="M250 215C260 225 270 230 278 232" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M250 240C262 250 272 253 282 255" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M250 225C238 235 228 240 218 242" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M250 250C236 260 226 263 216 265" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Connection Node Circles */}
                  <circle cx="250" cy="180" r="5" fill="#10b981" />
                  <circle cx="218" cy="242" r="4" fill="#fbbf24" />
                  <circle cx="282" cy="255" r="4" fill="#10b981" />
                  <circle cx="250" cy="295" r="5" fill="#10b981" />
                </motion.g>

                {/* Color Gradients */}
                <defs>
                  <linearGradient id="leaf-grad" x1="250" y1="180" x2="250" y2="295" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating tags using Tailwind absolute layout */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="absolute top-[20%] left-[5%] bg-white border border-neutral-100 shadow-lg rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Crop Health</p>
                  <p className="text-sm font-bold text-neutral-900">98% Healthy</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="absolute bottom-[25%] right-[5%] bg-white border border-neutral-100 shadow-lg rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="rounded-xl bg-accent-yellow-50 p-2 text-accent-yellow-600">
                  <span className="text-lg font-bold">⚡</span>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Soil Moisture</p>
                  <p className="text-sm font-bold text-neutral-900">Optimal (42%)</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
