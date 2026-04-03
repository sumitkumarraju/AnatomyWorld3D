'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import HeartModel from './organs/HeartModel';
import LungsModel from './organs/LungsModel';
import BrainModel from './organs/BrainModel';
import LiverModel from './organs/LiverModel';
import KidneyModel from './organs/KidneyModel';
import StomachModel from './organs/StomachModel';
import ParticleField from './effects/ParticleField';

const organComponents: Record<string, React.ComponentType<{ onClick?: () => void; isSelected?: boolean }>> = {
  heart: HeartModel,
  lungs: LungsModel,
  brain: BrainModel,
  liver: LiverModel,
  kidney: KidneyModel,
  stomach: StomachModel,
};

export default function OrganViewer({ slug }: { slug: string }) {
  const OrganComponent = organComponents[slug];

  if (!OrganComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-slate-muted font-mono text-sm">Organ model not found</p>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.5, 3], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={
        <Html center>
          <div className="glass-panel px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-medical-teal/30 border-t-medical-teal rounded-full animate-spin" />
              <span className="text-sm text-medical-teal font-mono">Loading...</span>
            </div>
          </div>
        </Html>
      }>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[0, 1, 2]} intensity={0.6} color="#00d4aa" distance={8} />
        
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
          <group position={[0, -0.5, 0]}>
            <OrganComponent isSelected />
          </group>
        </Float>

        <ParticleField />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Suspense>
    </Canvas>
  );
}
