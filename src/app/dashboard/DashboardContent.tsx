'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Header from '@/components/layout/Header';
import { Activity, BookOpen, Clock, User } from 'lucide-react';
import Link from 'next/link';

type ModuleProgress = {
  id: string;
  title: string;
  progress: number;
};

type ActivityLog = {
  action_type: string;
  entity_title: string;
  module_id: string;
  created_at: string;
};

interface DashboardContentProps {
  modules: ModuleProgress[];
  activities: ActivityLog[];
}

// Simple lookup to assign icons to known modules
const moduleIcons: Record<string, any> = {
  '1': Activity, // Cardio
  '2': Activity, // Respiratory
  '3': Activity, // Nervous
  '4': Activity, // Skeletal
  '5': Activity, // Digestive
  '6': Activity, // Urinary
};

export default function DashboardContent({ modules, activities }: DashboardContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="bg-deep-pine min-h-screen relative overflow-hidden font-sans" ref={containerRef}>
      <Header />

      {/* Decorative Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-mint-bloom/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        
        <motion.div 
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-mint-bloom text-sm font-mono mb-4">
            <User className="w-4 h-4" />
            <span>Welcome back, Doctor</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-cream-white tracking-tight">
            Your Medical Workspace
          </h1>
          <p className="text-soft-pistachio/60 text-lg mt-4 max-w-2xl leading-relaxed">
            Resume your study of human anatomy, view saved clinical AI insights, or explore complete surgical visualizations.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-display text-cream-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-mint-bloom" />
              Active Modules
            </h2>
            
            <div className="space-y-4">
              {modules.map((mod, i) => {
                const Icon = moduleIcons[mod.id] || Activity;
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                    className="glass-panel p-6 border border-white/[0.05] hover:border-white/[0.1] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-mint-bloom border border-white/[0.05]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-cream-white font-medium">{mod.title}</h3>
                      </div>
                      <span className="text-sm font-mono text-soft-pistachio/60">{mod.progress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max(0, mod.progress)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-mint-bloom to-cyan-400 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-display text-cream-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-mint-bloom" />
              Recent Activity
            </h2>
            
            <div className="glass-panel p-6 space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-soft-pistachio/50">No recent activity detected. Start exploring 3D models!</p>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="border-l-2 border-mint-bloom/30 pl-4 py-1 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-mint-bloom -left-[5px] top-2" />
                    <p className="text-sm text-cream-white capitalize">{act.action_type.replace('_', ' ').toLowerCase()}</p>
                    <p className="text-xs text-soft-pistachio/50 font-mono mt-1">{act.entity_title}</p>
                    <p className="text-[10px] text-white/30 font-mono mt-0.5">
                      {new Date(act.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/explore" className="block w-full text-center bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-cream-white py-4 rounded-xl transition-colors font-medium">
                Enter 3D Explorer
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
