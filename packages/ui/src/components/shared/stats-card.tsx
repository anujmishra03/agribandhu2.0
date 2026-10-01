'use client';

import * as React from 'react';
import { motion, useMotionValue, useInView, animate } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

export interface StatsCardProps {
  value: string;
  label: string;
}

export function StatsCard({ value, label }: StatsCardProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = React.useState('0');

  // Parse numbers and suffixes, e.g. "1000+" -> 1000 and "+"
  const match = value.match(/^(\d+)(.*)$/);
  const numericVal = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : value;

  React.useEffect(() => {
    if (isInView) {
      if (numericVal !== null) {
        const controls = animate(count, numericVal, {
          duration: 1.8,
          ease: 'easeOut',
          onUpdate: (latest) => {
            setDisplayValue(Math.round(latest).toLocaleString() + suffix);
          },
        });
        return () => controls.stop();
      } else {
        setDisplayValue(value);
      }
    }
  }, [isInView, numericVal, suffix, value, count]);

  return (
    <Card ref={ref} className="bg-white border border-neutral-100/80 shadow-sm text-center py-8 px-6 hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold text-primary-600 mb-2 font-sans tracking-tight"
        >
          {displayValue}
        </motion.div>
        <div className="text-neutral-500 text-sm sm:text-base font-medium">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
