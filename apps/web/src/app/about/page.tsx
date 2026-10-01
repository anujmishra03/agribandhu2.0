'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Eye, Cpu, Landmark, User, CalendarDays } from 'lucide-react';
import { Container, Heading, Card, CardContent } from '@agribandhu/ui';

const TIMELINE = [
  {
    year: 'Q1 2026',
    title: 'Platform Foundation',
    desc: 'Establishment of Phase 1 architecture and design system for rural scale.',
  },
  {
    year: 'Q2 2026',
    title: 'AI Model Training',
    desc: 'Fine-tuning vision models on 50,000+ Indian crop disease datasets.',
  },
  {
    year: 'Q3 2026',
    title: 'Beta Launch & Pilots',
    desc: 'Deploying regional pilots in Maharashtra and Punjab with 500+ active farmers.',
  },
  {
    year: 'Q4 2026',
    title: 'Phase 2 Integrations',
    desc: 'Integrating direct agricultural call-support, SMS alerts, and offline sync.',
  },
];

const TEAM = [
  { name: 'Dr. Anand Swaminathan', role: 'Chief Agronomist', initial: 'A' },
  { name: 'Priya Sharma', role: 'AI Engineering Lead', initial: 'P' },
  { name: 'Gurpreet Singh', role: 'Head of Rural Outreach', initial: 'G' },
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 space-y-24 bg-white">
      {/* Intro Hero */}
      <Container>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            About AgriBandhu
          </motion.div>
          <Heading level="h1" align="center" className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Our Journey to Smart Farming
          </Heading>
          <p className="text-neutral-500 text-lg leading-relaxed">
            AgriBandhu is built to bridge the gap between advanced artificial intelligence and rural agriculture, helping farmers mitigate risks and secure yields.
          </p>
        </div>
      </Container>

      {/* Mission & Vision & Tech & Goals Grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="h-full border border-neutral-100/80 bg-gradient-to-br from-white to-primary-50/5 p-6 hover:shadow-md transition-all duration-300">
              <CardContent className="p-0 space-y-4">
                <div className="rounded-2xl bg-primary-50 p-4 w-fit text-primary-600">
                  <Sprout className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Our Mission</h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  To democratize access to agronomic expertise. We provide farmers with immediate, understandable, and actionable advice to safeguard their fields from disease and weather fluctuations.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="h-full border border-neutral-100/80 bg-gradient-to-br from-white to-emerald-50/5 p-6 hover:shadow-md transition-all duration-300">
              <CardContent className="p-0 space-y-4">
                <div className="rounded-2xl bg-emerald-50 p-4 w-fit text-emerald-600">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Our Vision</h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  To build a resilient farming ecosystem in India where every crop disease is stopped in its tracks, soil nutrition is optimized, and farming practices are guided by data-driven insights.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="h-full border border-neutral-100/80 bg-gradient-to-br from-white to-accent-yellow-50/5 p-6 hover:shadow-md transition-all duration-300">
              <CardContent className="p-0 space-y-4">
                <div className="rounded-2xl bg-accent-yellow-50 p-4 w-fit text-accent-yellow-600">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Our Technology</h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  Powered by custom computer vision models trained specifically on sub-continental crops. Our architecture scales effortlessly, providing low-latency classification in remote areas.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Future Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="h-full border border-neutral-100/80 bg-gradient-to-br from-white to-accent-brown-50/5 p-6 hover:shadow-md transition-all duration-300">
              <CardContent className="p-0 space-y-4">
                <div className="rounded-2xl bg-accent-brown-50 p-4 w-fit text-accent-brown-700">
                  <Landmark className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Future Goals</h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  We aim to establish automated pesticide spray drone connections, integrate regional soil-testing laboratory networks, and enable market linkage support for farmers to sell crops directly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>

      {/* Milestones / Timeline */}
      <div className="bg-neutral-50 py-20 border-y border-neutral-100">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <Heading level="h2" align="center" className="text-3xl font-extrabold text-neutral-900">
              Project Timeline
            </Heading>
            <p className="text-neutral-500 text-sm sm:text-base">
              Follow our roadmap for AgriBandhu's development, validation, and expansion phases.
            </p>
          </div>

          <div className="relative border-l border-neutral-200 max-w-3xl mx-auto pl-6 sm:pl-10 space-y-12">
            {TIMELINE.map((time, idx) => (
              <motion.div
                key={time.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 bg-primary-600 text-white rounded-full p-2.5 shadow-md shadow-primary-600/20">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <span className="text-primary-600 font-extrabold text-sm uppercase tracking-wider">
                    {time.year}
                  </span>
                  <h4 className="text-xl font-bold text-neutral-900">{time.title}</h4>
                  <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">{time.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Team Section */}
      <Container>
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <Heading level="h2" align="center" className="text-3xl font-extrabold text-neutral-900">
            Meet Our Experts
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base">
            AgriBandhu is conceptualized by a dedicated team of agronomists, technologists, and social innovators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="text-center p-6 border border-neutral-100 hover:shadow-md transition-all duration-300">
                <CardContent className="p-0 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-2xl border-2 border-primary-100">
                    {member.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-neutral-900">{member.name}</h4>
                    <p className="text-neutral-500 text-sm">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
