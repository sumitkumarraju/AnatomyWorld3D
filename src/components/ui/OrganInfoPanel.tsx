'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { organs } from '@/lib/data/organs';
import { 
  X, Activity, Weight, Maximize, BrainCircuit, AlertTriangle, Lightbulb, 
  Heart, Zap, Scissors, Droplets, Sparkles, Loader2
} from 'lucide-react';
import { getOrganClinicalDetails } from '@/app/actions/ai';

export default function OrganInfoPanel() {
  const { selectedOrgan, setSelectedOrgan } = useAppStore();
  const organ = organs.find((o) => o.slug === selectedOrgan);
  
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Clear AI output if organ changes
  const [lastOrgan, setLastOrgan] = useState<string | null>(null);
  if (selectedOrgan !== lastOrgan) {
    setLastOrgan(selectedOrgan);
    setAiInsights(null);
  }

  const handleGenerateAI = async () => {
    if (!organ) return;
    setIsGeneratingAi(true);
    try {
      const insight = await getOrganClinicalDetails(organ.name);
      setAiInsights(insight);
    } catch (e) {
      setAiInsights("Failed to fetch insight. Please ensure the API is reachable.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <AnimatePresence>
      {organ && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute right-4 top-4 bottom-4 w-[400px] z-20 hidden lg:block"
        >
          <div className="glass-panel h-full overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06] sticky top-0 bg-[#0a1a14]/90 backdrop-blur-xl z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
                  style={{ backgroundColor: `${organ.color}20`, boxShadow: `0 0 20px ${organ.color}30` }}
                >
                  <Activity className="w-5 h-5" style={{ color: organ.color }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-cream-white font-display">{organ.name}</h2>
                  <p className="text-xs text-soft-pistachio/50 font-mono uppercase tracking-wider">{organ.system}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrgan(null)}
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4 text-soft-pistachio/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* AI Clinical Insight Trigger */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Surgeon's Insight
                  </h3>
                </div>
                
                <AnimatePresence mode="wait">
                  {!aiInsights && !isGeneratingAi && (
                    <motion.button
                      key="btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleGenerateAI}
                      className="w-full py-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-sm font-medium transition-colors border border-indigo-500/30 flex items-center justify-center gap-2"
                    >
                      <BrainCircuit className="w-4 h-4" />
                      Generate Clinical Deep Dive
                    </motion.button>
                  )}
                  
                  {isGeneratingAi && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center py-4 text-indigo-400 gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Consulting Bytez AI...</span>
                    </motion.div>
                  )}
                  
                  {aiInsights && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-indigo-100/80 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: aiInsights }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-mint-bloom mb-2">Overview</h3>
                <p className="text-sm text-soft-pistachio/70 leading-relaxed">{organ.description}</p>
              </div>

              {/* Key Facts */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-mint-bloom mb-3">Key Facts</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-panel !p-3 flex items-start gap-2">
                    <Weight className="w-4 h-4 text-soft-pistachio/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-mono uppercase text-soft-pistachio/50 mb-1">Weight</p>
                      <p className="text-sm text-cream-white font-medium">{organ.weight}</p>
                    </div>
                  </div>
                  <div className="glass-panel !p-3 flex items-start gap-2">
                    <Maximize className="w-4 h-4 text-soft-pistachio/40 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-mono uppercase text-soft-pistachio/50 mb-1">Size</p>
                      <p className="text-sm text-cream-white font-medium">{organ.size}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Details — Blood Supply & Innervation */}
              {(organ.bloodSupply || organ.innervation) && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" />
                    Clinical Anatomy
                  </h3>
                  <div className="space-y-2">
                    {organ.bloodSupply && (
                      <div className="glass-panel !p-3 border-l-2 border-l-red-400/40">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          <p className="text-[10px] font-mono uppercase text-red-400/80">Blood Supply</p>
                        </div>
                        <p className="text-xs text-soft-pistachio/70 leading-relaxed">{organ.bloodSupply}</p>
                      </div>
                    )}
                    {organ.innervation && (
                      <div className="glass-panel !p-3 border-l-2 border-l-yellow-400/40">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <p className="text-[10px] font-mono uppercase text-yellow-400/80">Innervation</p>
                        </div>
                        <p className="text-xs text-soft-pistachio/70 leading-relaxed">{organ.innervation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Surgical Notes */}
              {organ.surgicalNotes && organ.surgicalNotes.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    Surgical Notes
                  </h3>
                  <div className="space-y-2">
                    {organ.surgicalNotes.map((note, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-panel !p-3 border-l-2 border-l-emerald-400/30"
                      >
                        <p className="text-xs text-soft-pistachio/70 leading-relaxed">{note}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Functions */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-mint-bloom mb-3 flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  Primary Functions
                </h3>
                <div className="space-y-2">
                  {organ.functions.map((fn, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: organ.color }} />
                      <p className="text-sm text-soft-pistachio/70">{fn}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Diseases */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Common Conditions
                </h3>
                <div className="space-y-2">
                  {organ.diseases.map((disease, i) => (
                    <div key={i} className="glass-panel !p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-cream-white font-medium">{disease.name}</p>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          disease.severity === 'severe' ? 'bg-red-500/15 text-red-400' :
                          disease.severity === 'moderate' ? 'bg-amber-500/15 text-amber-400' :
                          'bg-forest-jade/30 text-mint-bloom'
                        }`}>{disease.severity}</span>
                      </div>
                      <p className="text-xs text-soft-pistachio/60">{disease.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Facts */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Fun Facts
                </h3>
                <div className="space-y-2">
                  {organ.funFacts.map((fact, i) => (
                    <div key={i} className="glass-panel !p-3 border-l-2 border-l-amber-400/40">
                      <p className="text-xs text-soft-pistachio/70 leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
