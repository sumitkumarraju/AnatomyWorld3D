'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Activity } from 'lucide-react';
import Link from 'next/link';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-pine flex items-center justify-center relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mint-bloom/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md p-8 glass-panel border border-white/[0.05] relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-mint-bloom/20 to-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.05]"
          >
            <Activity className="w-8 h-8 text-mint-bloom" />
          </motion.div>
          <h1 className="text-2xl font-display text-cream-white font-semibold">Welcome Back</h1>
          <p className="text-soft-pistachio/60 text-sm mt-2">Sign in to sync your anatomy models and ai insights.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-soft-pistachio/60 ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-pistachio/40">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-black/20 border border-white/[0.05] rounded-xl py-2.5 pl-10 pr-4 text-sm text-cream-white placeholder:text-soft-pistachio/30 focus:outline-none focus:border-mint-bloom/50 focus:ring-1 focus:ring-mint-bloom/50 transition-all"
                placeholder="doctor@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-soft-pistachio/60 ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-pistachio/40">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-black/20 border border-white/[0.05] rounded-xl py-2.5 pl-10 pr-4 text-sm text-cream-white placeholder:text-soft-pistachio/30 focus:outline-none focus:border-mint-bloom/50 focus:ring-1 focus:ring-mint-bloom/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full relative group bg-mint-bloom text-deep-pine hover:bg-mint-bloom/90 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-xs text-soft-pistachio/50 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-mint-bloom hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
