'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store/useAppStore';

export default function HeartModel({ 
  onClick,
  isSelected = false,
  animate = true 
}: { 
  onClick?: () => void;
  isSelected?: boolean;
  animate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const isSurgicalMode = useAppStore(s => s.isSurgicalMode);
  
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.35);
    shape.bezierCurveTo(x, y + 0.35, x - 0.05, y + 0.5, x - 0.25, y + 0.5);
    shape.bezierCurveTo(x - 0.55, y + 0.5, x - 0.55, y + 0.25, x - 0.55, y + 0.25);
    shape.bezierCurveTo(x - 0.55, y + 0.1, x - 0.45, y - 0.08, x, y - 0.35);
    shape.bezierCurveTo(x + 0.45, y - 0.08, x + 0.55, y + 0.1, x + 0.55, y + 0.25);
    shape.bezierCurveTo(x + 0.55, y + 0.25, x + 0.55, y + 0.5, x + 0.25, y + 0.5);
    shape.bezierCurveTo(x + 0.05, y + 0.5, x, y + 0.35, x, y + 0.35);
    return shape;
  }, []);

  const geometry = useMemo(() => {
    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 12,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };
    const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [heartShape]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    if (animate) {
      // Heartbeat animation
      const beat = Math.sin(t * 4) * 0.5 + 0.5;
      const scale = 1 + beat * 0.06;
      groupRef.current.scale.setScalar(scale);
    }
    
    // Gentle rotation
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    
    // Glow pulse
    if (glowRef.current) {
      const glowScale = 1.15 + Math.sin(t * 3) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
    }

    // Selection highlight
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = isSelected 
        ? 0.4 + Math.sin(t * 2) * 0.1 
        : (isSurgicalMode ? 0.0 : 0.15 + Math.sin(t * 3) * 0.05);
    }
  });

  const baseColor = isSurgicalMode ? '#6a1a1a' : '#dc2626';
  const emissiveColor = isSurgicalMode ? '#000000' : '#ef4444';

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 0.8, 0.3]}>
      {/* Main heart mesh */}
      <mesh geometry={geometry} rotation={[0, 0, Math.PI]} castShadow>
        <meshStandardMaterial
          ref={materialRef}
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 0.4 : 0.15}
          roughness={isSurgicalMode ? 0.3 : 0.3}
          metalness={isSurgicalMode ? 0.2 : 0.4}
          transparent
          opacity={isSurgicalMode ? 0.98 : 0.92}
        />
      </mesh>
      
      {/* Inner glow mesh */}
      {!isSurgicalMode && (
        <mesh ref={glowRef} geometry={geometry} rotation={[0, 0, Math.PI]}>
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.3}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Wireframe overlay for tech look (disabled in surgical mode) */}
      {!isSurgicalMode && (
        <mesh geometry={geometry} rotation={[0, 0, Math.PI]}>
          <meshBasicMaterial
            color="#ff6b6b"
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}
    </group>
  );
}
