'use client';

import dynamic from 'next/dynamic';
import OrganSidebar from '@/components/ui/OrganSidebar';
import OrganInfoPanel from '@/components/ui/OrganInfoPanel';
import { useAppStore } from '@/lib/store/useAppStore';

const HumanBodyScene = dynamic(() => import('@/components/three/HumanBodyScene'), { ssr: false });

export default function ExplorePage() {
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 relative pt-16">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="fixed left-4 top-20 z-30 glass-panel !p-2.5 hover:border-mint-bloom/30 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mint-bloom">
            {isSidebarOpen ? (
              <><path d="m15 18-6-6 6-6"/></>
            ) : (
              <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>
            )}
          </svg>
        </button>

        {/* Organ Sidebar */}
        <OrganSidebar />

        {/* 3D Canvas */}
        <div className="absolute inset-0 pt-16">
          <HumanBodyScene />
        </div>

        {/* Organ Info Panel */}
        <OrganInfoPanel />

        {/* Bottom Help Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="glass-panel !py-2 !px-4 flex items-center gap-4 text-[10px] font-mono text-soft-pistachio/40 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-soft-pistachio/60">Click</kbd>
              Select organ
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-soft-pistachio/60">Drag</kbd>
              Rotate
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-soft-pistachio/60">Scroll</kbd>
              Zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
