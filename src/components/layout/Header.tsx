'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bone, BookOpen, LayoutDashboard, GraduationCap, FlaskConical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/app/actions/auth';
import type { User } from '@supabase/supabase-js';

const navLinks = [
  { href: '/explore', label: 'Explore', icon: Bone },
  { href: '/quiz', label: 'Quiz', icon: GraduationCap },
  { href: '/notes', label: 'Notes', icon: BookOpen },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-forest-jade/20 to-mint-bloom/10 border border-forest-jade/30 flex items-center justify-center group-hover:border-mint-bloom/50 transition-all duration-300">
              <FlaskConical className="w-5 h-5 text-mint-bloom" />
              <div className="absolute inset-0 rounded-xl bg-mint-bloom/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              <span className="text-cream-white">Anatomy</span>
              <span className="text-mint-bloom">World</span>
              <span className="text-forest-jade text-sm ml-0.5">3D</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-mint-bloom'
                      : 'text-soft-pistachio/50 hover:text-cream-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-mint-bloom/10 border border-mint-bloom/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <form action={logout} className="hidden sm:block">
                <button type="submit" className="glass-button text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:block glass-button text-xs"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-soft-pistachio/50 hover:text-cream-white transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-forest-jade/10 bg-obsidian/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-mint-bloom bg-mint-bloom/10'
                        : 'text-soft-pistachio/50 hover:text-cream-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              
              {user ? (
                <form action={logout}>
                  <button
                    type="submit"
                    onClick={() => setMobileOpen(false)}
                    className="w-full mt-3 block glass-button text-center text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                  >
                    Sign Out
                  </button>
                </form>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block glass-button text-center text-xs mt-3"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
