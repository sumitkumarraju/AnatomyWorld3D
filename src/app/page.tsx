'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Heart, Microscope, FlaskConical, FileText, Brain, Wind, Beef, Bean, CircleDot, Dna } from 'lucide-react';

const HumanBodyScene = dynamic(() => import('@/components/three/HumanBodyScene'), { ssr: false });

const features = [
  {
    Icon: Heart,
    title: '3D Organ Models',
    description: 'Explore procedurally generated 3D organs with real-time animations — heartbeat, breathing, digestion',
  },
  {
    Icon: Microscope,
    title: 'Interactive Learning',
    description: 'Click, rotate, and zoom into each organ to discover anatomy, functions, and diseases',
  },
  {
    Icon: FlaskConical,
    title: 'Medical Quizzes',
    description: '30+ quiz questions with explanations — test your anatomy knowledge by organ system',
  },
  {
    Icon: FileText,
    title: 'Smart Notes',
    description: 'Save personalized notes for each organ — powered by Supabase for cloud sync',
  },
];

const organPreviews = [
  { name: 'Heart', system: 'Cardiovascular', color: '#dc2626', Icon: Heart },
  { name: 'Brain', system: 'Nervous', color: '#f59e0b', Icon: Brain },
  { name: 'Lungs', system: 'Respiratory', color: '#f472b6', Icon: Wind },
  { name: 'Liver', system: 'Digestive', color: '#92400e', Icon: Beef },
  { name: 'Kidneys', system: 'Urinary', color: '#7c3aed', Icon: Bean },
  { name: 'Stomach', system: 'Digestive', color: '#ea580c', Icon: CircleDot },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Radial gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 60% 50%, rgba(115,226,167,0.06) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pt-20">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-jade/10 border border-forest-jade/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-mint-bloom animate-pulse" />
              <span className="text-xs font-mono text-mint-bloom uppercase tracking-wider">Interactive 3D Anatomy Lab</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 font-display">
              <span className="text-cream-white">Explore the</span>
              <br />
              <span className="gradient-text">Human Body</span>
              <br />
              <span className="text-cream-white">in 3D</span>
            </h1>

            <p className="text-lg text-soft-pistachio/50 leading-relaxed mb-8 max-w-lg font-body">
              An immersive medical education platform where you can interact with 
              real-time 3D organs, learn anatomy, and test your knowledge — like 
              Google Maps, but for the human body.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button-primary px-8 py-4 text-base"
                >
                  Start Exploring →
                </motion.button>
              </Link>
              <Link href="/quiz">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-8 py-4 text-base"
                >
                  Take a Quiz
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/[0.06]">
              {[
                { label: 'Organs', value: '6+' },
                { label: 'Quiz Questions', value: '30+' },
                { label: 'Conditions', value: '30+' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="text-2xl font-bold text-cream-white font-display">{stat.value}</p>
                  <p className="text-xs font-mono text-soft-pistachio/40 uppercase tracking-wider mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <HumanBodyScene interactive={false} showLabels={false} reducedOrganSet />
            </div>
            {/* Glow behind scene */}
            <div className="absolute inset-0 -z-10 rounded-3xl" style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(115,226,167,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-mint-bloom" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-cream-white mb-4 font-display">
              Your Virtual Anatomy Lab
            </h2>
            <p className="text-soft-pistachio/50 max-w-2xl mx-auto">
              Everything you need for interactive anatomy learning, in one beautiful platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-forest-jade/15 border border-forest-jade/20 flex items-center justify-center mb-4">
                  <feature.Icon className="w-6 h-6 text-mint-bloom" />
                </div>
                <h3 className="text-cream-white font-semibold mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-soft-pistachio/40 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organs Preview */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(28,124,84,0.05) 0%, transparent 60%)',
        }} />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-cream-white mb-4 font-display">
              6 Major Organs
            </h2>
            <p className="text-soft-pistachio/50">Click on any organ to start exploring</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {organPreviews.map((organ, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href="/explore">
                  <div className="glass-panel-hover p-6 text-center group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${organ.color}15` }}
                    >
                      <organ.Icon className="w-7 h-7" style={{ color: organ.color }} />
                    </div>
                    <h3 className="text-cream-white font-semibold mb-1 font-display">{organ.name}</h3>
                    <p className="text-xs font-mono text-soft-pistachio/40 uppercase tracking-wider">{organ.system}</p>
                    <div 
                      className="w-8 h-0.5 mx-auto mt-3 rounded-full opacity-50 transition-all duration-300 group-hover:w-12 group-hover:opacity-100"
                      style={{ backgroundColor: organ.color }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-panel p-12"
        >
          <h2 className="text-3xl font-bold text-cream-white mb-4 font-display">
            Ready to explore anatomy?
          </h2>
          <p className="text-soft-pistachio/50 mb-8">
            Dive into the 3D anatomy lab, quiz yourself on medical knowledge, and learn like never before.
          </p>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button-primary px-10 py-4 text-base"
            >
              Launch 3D Lab →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-mint-bloom" />
            <span className="font-bold text-cream-white font-display">AnatomyWorld3D</span>
          </div>
          <p className="text-xs text-soft-pistachio/40 font-mono">
            © 2026 AnatomyWorld3D — Built for Medical Education
          </p>
        </div>
      </footer>
    </main>
  );
}
