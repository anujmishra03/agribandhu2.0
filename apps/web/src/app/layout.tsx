import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const headingFont = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgriBandhu - Empowering Farmers with AI Insights',
  description:
    'AgriBandhu is an AI-powered agriculture platform for farmers, offering instant crop disease detection, soil moisture analysis, personalized crop calendars, and local weather forecasts.',
  keywords: [
    'AgriBandhu',
    'AI agriculture',
    'crop disease detection',
    'soil health analysis',
    'Indian farmers',
    'farming support',
  ],
  authors: [{ name: 'AgriBandhu Team' }],
  openGraph: {
    title: 'AgriBandhu - Empowering Farmers with AI',
    description:
      'Instant crop disease detection, soil analysis, and regional farming insights in your local language.',
    url: 'https://agribandhu.in',
    siteName: 'AgriBandhu',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${sansFont.variable} ${headingFont.variable} font-sans bg-white text-neutral-900 antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
