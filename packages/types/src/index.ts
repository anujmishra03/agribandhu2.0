export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  category: string;
  date: string;
  readTime: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    location: string;
    avatar?: string;
  };
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}
