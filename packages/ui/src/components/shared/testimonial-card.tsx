'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    location: string;
    avatar?: string;
  };
}

export function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full border border-neutral-100/80 bg-white shadow-sm flex flex-col justify-between p-6 hover:shadow-md transition-all duration-300">
        <CardContent className="p-0 flex flex-col h-full justify-between">
          <div>
            <Quote className="h-8 w-8 text-primary-200 mb-4 shrink-0" />
            <p className="text-neutral-600 text-base italic leading-relaxed mb-6">
              "{quote}"
            </p>
          </div>
          <div className="flex items-center gap-4 mt-auto border-t border-neutral-50 pt-4">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary-100"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                {author.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-bold text-neutral-900 text-sm sm:text-base leading-tight">
                {author.name}
              </h4>
              <p className="text-neutral-500 text-xs sm:text-sm">
                {author.role}, {author.location}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
