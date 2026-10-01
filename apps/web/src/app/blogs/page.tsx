'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, BookOpen, Clock, CalendarDays, ArrowRight } from 'lucide-react';
import { type BlogPost } from '@agribandhu/types';
import { Container, Heading, Card, CardContent, Button } from '@agribandhu/ui';

const CATEGORIES = ['All', 'Crop Care', 'Soil Health', 'Govt Schemes'];

const DUMMY_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Managing Leaf Blast in Paddy: Prevention & Organic Remedies',
    excerpt: 'Learn the primary symptoms of paddy blast disease and how to control it using neem oil formulations and irrigation adjustments.',
    image: 'bg-gradient-to-br from-emerald-500 to-green-600',
    author: { name: 'Dr. Anand Swaminathan', role: 'Chief Agronomist' },
    category: 'Crop Care',
    date: 'July 18, 2026',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Understanding Soil PH and Nutrient Management for Wheat Cultivation',
    excerpt: 'A comprehensive guide on interpreting soil testing reports, identifying acidic soils, and choosing optimal organic supplements.',
    image: 'bg-gradient-to-br from-amber-600 to-yellow-500',
    author: { name: 'Priya Sharma', role: 'AI Engineering Lead' },
    category: 'Soil Health',
    date: 'July 12, 2026',
    readTime: '6 min read',
  },
  {
    id: '3',
    title: 'PM-KISAN Scheme: Eligibility Criteria & Application Process for 2026',
    excerpt: 'Step-by-step breakdown of the documentation needed to register for central farming financial benefits and subsidy schemes.',
    image: 'bg-gradient-to-br from-blue-600 to-sky-500',
    author: { name: 'Gurpreet Singh', role: 'Rural Outreach Head' },
    category: 'Govt Schemes',
    date: 'July 05, 2026',
    readTime: '4 min read',
  },
  {
    id: '4',
    title: 'How to Setup Drip Irrigation for Vegetable Farms with Low Pressure',
    excerpt: 'Design low-cost, gravity-fed drip watering systems to conserve water and prevent soil erosion in dry regions.',
    image: 'bg-gradient-to-br from-teal-500 to-emerald-600',
    author: { name: 'Dr. Anand Swaminathan', role: 'Chief Agronomist' },
    category: 'Soil Health',
    date: 'June 28, 2026',
    readTime: '8 min read',
  },
  {
    id: '5',
    title: 'Top 5 Pest Control Sprays that You Can Prepare at Home',
    excerpt: 'Protect vegetable and fruit crops using cheap, home-made botanical extracts of garlic, ginger, and neem.',
    image: 'bg-gradient-to-br from-green-600 to-emerald-700',
    author: { name: 'Priya Sharma', role: 'AI Engineering Lead' },
    category: 'Crop Care',
    date: 'June 15, 2026',
    readTime: '7 min read',
  },
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredBlogs = React.useMemo(() => {
    if (selectedCategory === 'All') return DUMMY_BLOGS;
    return DUMMY_BLOGS.filter((blog) => blog.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="py-16 sm:py-24 bg-neutral-50/20 space-y-16">
      {/* Page Header */}
      <Container>
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-600 font-bold text-sm tracking-widest uppercase"
          >
            Farming Articles
          </motion.div>
          <Heading level="h1" align="center" className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            AgriBandhu Knowledge Hub
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
            Read expert articles, soil-nutrition guidelines, and updates on government schemes written by agricultural specialists.
          </p>
        </div>
      </Container>

      {/* Category Selection Filter */}
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                  isSelected ? 'text-white' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {category}
                {isSelected && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary-600 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Container>

      {/* Blog Cards Grid */}
      <Container>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border border-neutral-100 bg-white shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-300">
                  {/* Custom Graphic Banner instead of placeholders */}
                  <div className={`h-48 w-full ${blog.image} relative p-6 flex flex-col justify-between text-white`}>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-semibold w-fit">
                      <Sprout className="h-3.5 w-3.5" />
                      <span>{blog.category}</span>
                    </div>
                    <BookOpen className="h-10 w-10 opacity-30 self-end" />
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow justify-between gap-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-neutral-900 leading-snug group-hover:text-primary-600">
                        {blog.title}
                      </h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Meta stats */}
                      <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold border-t border-neutral-50 pt-4">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{blog.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-neutral-900 leading-tight">
                            {blog.author.name}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-semibold">
                            {blog.author.role}
                          </p>
                        </div>
                        <Button variant="link" size="sm" className="p-0 gap-1 group">
                          Read More{' '}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}
