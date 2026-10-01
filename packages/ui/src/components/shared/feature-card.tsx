'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full border border-neutral-100/80 bg-gradient-to-br from-white to-primary-50/10 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300">
        <CardContent className="pt-6 flex flex-col h-full items-start">
          <div className="rounded-2xl bg-primary-50 p-4 text-primary-600 mb-5">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
          <p className="text-neutral-600 text-sm leading-relaxed flex-grow">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
