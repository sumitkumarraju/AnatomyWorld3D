import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AnatomyWorld3D — Interactive Human Anatomy Platform',
  description: 'Explore the human body in 3D. Interactive anatomy learning platform for medical students with organ animations, quizzes, and study tools.',
  keywords: ['anatomy', '3D', 'medical education', 'human body', 'organs', 'interactive learning'],
  authors: [{ name: 'AnatomyWorld3D' }],
  openGraph: {
    title: 'AnatomyWorld3D — Interactive Human Anatomy Platform',
    description: 'Google Maps for the Human Body. Explore organs in 3D with animations, quizzes, and notes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-body bg-obsidian text-cream-white antialiased" suppressHydrationWarning>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
