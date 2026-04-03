'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { Suspense, useState, useCallback } from 'react';
import HeartModel from './organs/HeartModel';
import LungsModel from './organs/LungsModel';
import BrainModel from './organs/BrainModel';
import LiverModel from './organs/LiverModel';
import KidneyModel from './organs/KidneyModel';
import StomachModel from './organs/StomachModel';
import SpineModel from './organs/SpineModel';
import RibcageModel from './organs/RibcageModel';
import VascularSystemModel from './organs/VascularSystemModel';
import PancreasModel from './organs/PancreasModel';
import SpleenModel from './organs/SpleenModel';
import IntestinesModel from './organs/IntestinesModel';
import BladderModel from './organs/BladderModel';
import DiaphragmModel from './organs/DiaphragmModel';
import EsophagusModel from './organs/EsophagusModel';
import BodyOutlineModel from './organs/BodyOutlineModel';
import { MuscularSystemModel } from '../models/MuscularSystemModel';
import ParticleField from './effects/ParticleField';
import { useAppStore } from '@/lib/store/useAppStore';
import { organs } from '@/lib/data/organs';
import { logUserActivity } from '@/app/actions/progress';

function OrganLabel({ 
  position, 
  name, 
  slug 
}: { 
  position: [number, number, number]; 
  name: string;
  slug: string;
}) {
  const selectedOrgan = useAppStore((s) => s.selectedOrgan);
  const isSelected = selectedOrgan === slug;

  return (
    <Html
      position={[position[0], position[1] + 0.35, position[2]]}
      center
      distanceFactor={5}
      style={{ pointerEvents: 'none' }}
    >
      <div className={`organ-label transition-all duration-300 whitespace-nowrap ${
        isSelected ? 'border-mint-bloom/50 text-glow scale-110' : ''
      }`}>
        {name}
      </div>
    </Html>
  );
}

function SceneLighting() {
  const isSurgicalMode = useAppStore(s => s.isSurgicalMode);

  return (
    <>
      <ambientLight intensity={isSurgicalMode ? 0.2 : 0.35} />
      <directionalLight position={[5, 5, 5]} intensity={isSurgicalMode ? 1.5 : 0.9} color={isSurgicalMode ? "#fff5e6" : "#ffffff"} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={isSurgicalMode ? 0.5 : 0.3} color={isSurgicalMode ? "#d4d4aa" : "#3b82f6"} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color={isSurgicalMode ? "#ffccaa" : "#00d4aa"} distance={10} />
      <pointLight position={[0, -1, -2]} intensity={0.3} color="#3b82f6" distance={8} />
      <pointLight position={[2, 0.5, 0]} intensity={0.2} color="#f59e0b" distance={6} />
      <pointLight position={[-2, 0.5, 0]} intensity={0.2} color="#ec4899" distance={6} />
      {/* Rim light for depth */}
      <directionalLight position={[0, 0, -5]} intensity={0.15} color={isSurgicalMode ? "#ff5555" : "#6366f1"} />
    </>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="glass-panel px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-medical-teal/30 border-t-medical-teal rounded-full animate-spin" />
          <span className="text-sm text-medical-teal font-mono">Loading Anatomy 3D...</span>
        </div>
      </div>
    </Html>
  );
}

// Layer visibility control
type BodyLayer = 'skeleton' | 'muscular' | 'organs' | 'vascular' | 'outline';

export default function HumanBodyScene({ 
  interactive = true,
  showLabels = true,
  reducedOrganSet = false,
  visibleLayers,
}: {
  interactive?: boolean;
  showLabels?: boolean;
  reducedOrganSet?: boolean;
  visibleLayers?: BodyLayer[];
}) {
  const { selectedOrgan, setSelectedOrgan, isSurgicalMode } = useAppStore();
  
  // Default: show all layers
  const layers = visibleLayers || ['skeleton', 'muscular', 'organs', 'vascular', 'outline'];
  const showSkeleton = layers.includes('skeleton');
  const showMuscular = layers.includes('muscular');
  const showOrgans = layers.includes('organs');
  const showVascular = layers.includes('vascular');
  const showOutline = layers.includes('outline');

  const getModuleForOrgan = (slug: string) => {
    switch (slug) {
      case 'heart':
      case 'vascular': return '1';
      case 'lungs':
      case 'diaphragm': return '2';
      case 'brain': return '3';
      case 'spine':
      case 'ribcage': return '4';
      case 'stomach':
      case 'liver':
      case 'intestines':
      case 'pancreas':
      case 'esophagus': return '5';
      case 'kidney':
      case 'bladder': return '6';
      default: return '1';
    }
  };

  const handleOrganClick = useCallback(async (slug: string) => {
    if (!interactive) return;
    
    const isNewSelection = selectedOrgan !== slug;
    setSelectedOrgan(isNewSelection ? slug : null);

    if (isNewSelection) {
      const organInfo = organs.find(o => o.slug === slug);
      if (organInfo) {
        try {
          await logUserActivity('EXPLORED_ORGAN', slug, organInfo.name, getModuleForOrgan(slug));
        } catch (e) {
          console.error('Failed to log activity', e);
        }
      }
    }
  }, [interactive, selectedOrgan, setSelectedOrgan]);

  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <SceneLighting />
        
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <group>
            {/* === BODY OUTLINE (transparent wireframe reference) === */}
            {showOutline && <BodyOutlineModel />}

            {/* === SKELETAL SYSTEM === */}
            {showSkeleton && !reducedOrganSet && (
              <>
                <SpineModel
                  onClick={() => handleOrganClick('spine')}
                  isSelected={selectedOrgan === 'spine'}
                />
                <RibcageModel
                  onClick={() => handleOrganClick('ribcage')}
                  isSelected={selectedOrgan === 'ribcage'}
                />
              </>
            )}

            {/* === MUSCULAR SYSTEM === */}
            {showMuscular && !reducedOrganSet && (
              <MuscularSystemModel isSurgicalMode={isSurgicalMode} />
            )}

            {/* === VASCULAR SYSTEM === */}
            {showVascular && !reducedOrganSet && (
              <VascularSystemModel
                onClick={() => handleOrganClick('vascular')}
                isSelected={selectedOrgan === 'vascular'}
              />
            )}

            {/* === ORGAN SYSTEMS === */}
            {showOrgans && (
              <>
                {/* Heart — Cardiovascular */}
                <HeartModel
                  onClick={() => handleOrganClick('heart')}
                  isSelected={selectedOrgan === 'heart'}
                />
                
                {!reducedOrganSet && (
                  <>
                    {/* Lungs — Respiratory */}
                    <LungsModel
                      onClick={() => handleOrganClick('lungs')}
                      isSelected={selectedOrgan === 'lungs'}
                    />
                    
                    {/* Brain — Nervous */}
                    <BrainModel
                      onClick={() => handleOrganClick('brain')}
                      isSelected={selectedOrgan === 'brain'}
                    />

                    {/* Esophagus — Digestive */}
                    <EsophagusModel
                      onClick={() => handleOrganClick('esophagus')}
                      isSelected={selectedOrgan === 'esophagus'}
                    />

                    {/* Diaphragm — Muscular/Respiratory */}
                    <DiaphragmModel
                      onClick={() => handleOrganClick('diaphragm')}
                      isSelected={selectedOrgan === 'diaphragm'}
                    />
                    
                    {/* Liver — Digestive */}
                    <LiverModel
                      onClick={() => handleOrganClick('liver')}
                      isSelected={selectedOrgan === 'liver'}
                    />

                    {/* Spleen — Lymphatic */}
                    <SpleenModel
                      onClick={() => handleOrganClick('spleen')}
                      isSelected={selectedOrgan === 'spleen'}
                    />
                    
                    {/* Stomach — Digestive */}
                    <StomachModel
                      onClick={() => handleOrganClick('stomach')}
                      isSelected={selectedOrgan === 'stomach'}
                    />

                    {/* Pancreas — Digestive/Endocrine */}
                    <PancreasModel
                      onClick={() => handleOrganClick('pancreas')}
                      isSelected={selectedOrgan === 'pancreas'}
                    />
                    
                    {/* Kidneys — Urinary */}
                    <KidneyModel
                      onClick={() => handleOrganClick('kidney')}
                      isSelected={selectedOrgan === 'kidney'}
                    />

                    {/* Intestines — Digestive */}
                    <IntestinesModel
                      onClick={() => handleOrganClick('intestines')}
                      isSelected={selectedOrgan === 'intestines'}
                    />

                    {/* Bladder — Urinary */}
                    <BladderModel
                      onClick={() => handleOrganClick('bladder')}
                      isSelected={selectedOrgan === 'bladder'}
                    />
                  </>
                )}
              </>
            )}
          </group>
        </Float>

        {/* Organ Labels */}
        {showLabels && organs.map((organ) => (
          !reducedOrganSet || organ.slug === 'heart' ? (
            <OrganLabel
              key={organ.slug}
              position={organ.position}
              name={organ.name}
              slug={organ.slug}
            />
          ) : null
        ))}

        <ParticleField />

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={12}
            autoRotate
            autoRotateSpeed={0.3}
            target={[0, 0.5, 0]}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
