import Link from 'next/link';
import { Sprout, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Container } from '@agribandhu/ui';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-100 py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-primary-600">
              <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-neutral-900">
                Agri<span className="text-primary-600">Bandhu</span>
              </span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              Empowering farmers with AI-driven insights, soil reports, disease detection, and agricultural support to grow smarter.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm tracking-wider uppercase mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  AI Features
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  Articles & Blogs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm tracking-wider uppercase mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#faq" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  FAQ Accordion
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <a href="/docs/guide.pdf" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  Farmer's Guide
                </a>
              </li>
              <li>
                <a href="/docs/schemes.pdf" className="text-neutral-500 hover:text-primary-600 text-sm transition-colors">
                  Govt Schemes PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm tracking-wider uppercase mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li>Toll-Free: 1800-123-4567</li>
              <li>Email: support@agribandhu.in</li>
              <li>Address: Krishi Bhawan, Sector 5, New Delhi, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-200/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-xs sm:text-sm">
            &copy; {currentYear} AgriBandhu. All rights reserved. Made for Indian Farmers.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm text-neutral-400">
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
