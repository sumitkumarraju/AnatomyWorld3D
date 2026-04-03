'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { organs } from '@/lib/data/organs';
import { Search } from 'lucide-react';

export default function OrganSidebar() {
  const { 
    selectedOrgan, setSelectedOrgan, 
    searchQuery, setSearchQuery, 
    isSidebarOpen,
    isSurgicalMode, setSurgicalMode 
  } = useAppStore();

  const filtered = organs.filter((o) =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.system.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-4 top-20 bottom-4 w-[260px] z-20 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-[280px]'
      }`}
    >
      <div className="glass-panel h-full flex flex-col pt-4">
        {/* Search */}
        <div className="px-4 pb-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-pistachio/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Search organs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-cream-white placeholder-soft-pistachio/40 focus:outline-none focus:border-forest-jade transition-colors font-mono"
            />
          </div>
        </div>

        {/* Organ List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filtered.map((organ) => {
            const isActive = selectedOrgan === organ.slug;
            return (
              <motion.button
                key={organ.slug}
                onClick={() => setSelectedOrgan(isActive ? null : organ.slug)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-mint-bloom/10 border border-mint-bloom/30 shadow-lg shadow-mint-bloom/5'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    backgroundColor: isActive ? `${organ.color}20` : 'rgba(255,255,255,0.04)',
                    boxShadow: isActive ? `0 0 15px ${organ.color}20` : 'none',
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: organ.color }} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate font-display ${
                    isActive ? 'text-cream-white' : 'text-soft-pistachio/80'
                  }`}>
                    {organ.name}
                  </p>
                  <p className="text-[10px] text-soft-pistachio/50 font-mono uppercase tracking-wider">
                    {organ.system}
                  </p>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-mint-bloom"
                    style={{ boxShadow: '0 0 8px #73e2a7' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer Stats & Toggles */}
        <div className="p-4 border-t border-white/[0.06] flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] text-soft-pistachio/50 font-mono uppercase tracking-wider">
            <span>{filtered.length} organs</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-bloom animate-pulse border border-forest-jade" />
              Interactive
            </span>
          </div>
          
          <button
            onClick={() => setSurgicalMode(!isSurgicalMode)}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-colors border ${
              isSurgicalMode 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                : 'bg-white/[0.04] border-transparent text-soft-pistachio/60 hover:bg-white/[0.08]'
            }`}
          >
            <span>Surgical Realness</span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
              isSurgicalMode ? 'bg-rose-500/50' : 'bg-white/10'
            }`}>
              <motion.div 
                layout
                className="w-3 h-3 rounded-full bg-white shadow-sm"
                animate={{ x: isSurgicalMode ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
