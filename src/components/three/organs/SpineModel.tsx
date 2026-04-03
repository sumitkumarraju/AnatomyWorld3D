'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useAppStore } from '@/lib/store/useAppStore';

function Vertebra({ position, scale = 1, index, isSurgicalMode }: { position: [number, number, number]; scale?: number; index: number; isSurgicalMode: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const vertebraGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.06 * scale, 0.07 * scale, 0.04, 8);
    return geo;
  }, [scale]);

  const spinousProcessGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.01, 0.02, 0.08 * scale);
    return geo;
  }, [scale]);

  const boneColor = isSurgicalMode ? '#eadecc' : '#e8dcc8';
  const processColor = isSurgicalMode ? '#e2d4bc' : '#ddd0b8';
  const emissiveColor = isSurgicalMode ? '#000000' : '#d4c4a8';

  return (
    <group position={position}>
      {/* Vertebral body */}
      <mesh geometry={vertebraGeo} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial
          color={boneColor}
          emissive={emissiveColor}
          emissiveIntensity={isSurgicalMode ? 0 : 0.08}
          roughness={isSurgicalMode ? 0.9 : 0.7}
          metalness={isSurgicalMode ? 0.0 : 0.1}
        />
      </mesh>
      {/* Spinous process */}
      <mesh geometry={spinousProcessGeo} position={[0, 0, -0.04 * scale]}>
        <meshStandardMaterial
          color={processColor}
          emissive={emissiveColor}
          emissiveIntensity={isSurgicalMode ? 0 : 0.05}
          roughness={isSurgicalMode ? 0.9 : 0.8}
        />
      </mesh>
      {/* Transverse processes (left & right) */}
      <mesh position={[-0.06 * scale, 0, -0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.05 * scale, 0.015, 0.015]} />
        <meshStandardMaterial color={processColor} roughness={isSurgicalMode ? 0.9 : 0.8} />
      </mesh>
      <mesh position={[0.06 * scale, 0, -0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.05 * scale, 0.015, 0.015]} />
        <meshStandardMaterial color={processColor} roughness={isSurgicalMode ? 0.9 : 0.8} />
      </mesh>
    </group>
  );
}

export default function SpineModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isSurgicalMode = useAppStore(s => s.isSurgicalMode);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.03;
  });

  // Generate vertebrae positions along the spine
  const vertebrae = useMemo(() => {
    const verts: { pos: [number, number, number]; scale: number; region: string }[] = [];
    // 7 cervical (C1-C7)
    for (let i = 0; i < 7; i++) {
      const y = 1.8 - i * 0.065;
      verts.push({ pos: [0, y, -0.25], scale: 0.6 + i * 0.03, region: 'cervical' });
    }
    // 12 thoracic (T1-T12)
    for (let i = 0; i < 12; i++) {
      const y = 1.35 - i * 0.075;
      verts.push({ pos: [0, y, -0.28], scale: 0.85 + i * 0.02, region: 'thoracic' });
    }
    // 5 lumbar (L1-L5)
    for (let i = 0; i < 5; i++) {
      const y = 0.44 - i * 0.08;
      verts.push({ pos: [0, y, -0.26], scale: 1.15 + i * 0.03, region: 'lumbar' });
    }
    // 5 sacral (fused)
    for (let i = 0; i < 5; i++) {
      const y = 0.02 - i * 0.05;
      verts.push({ pos: [0, y, -0.24], scale: 1.3 - i * 0.08, region: 'sacral' });
    }
    // 4 coccyx (fused)
    for (let i = 0; i < 4; i++) {
      const y = -0.25 - i * 0.03;
      verts.push({ pos: [0, y, -0.22], scale: 0.5 - i * 0.1, region: 'coccyx' });
    }
    return verts;
  }, []);

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Vertebrae */}
      {vertebrae.map((v, i) => (
        <Vertebra key={i} position={v.pos} scale={v.scale} index={i} isSurgicalMode={isSurgicalMode} />
      ))}

      {/* Spinal cord (runs through center) */}
      <mesh position={[0, 0.9, -0.26]}>
        <cylinderGeometry args={[0.015, 0.012, 2.2, 8]} />
        <meshStandardMaterial
          color="#f0e0c0"
          emissive="#ffd700"
          emissiveIntensity={0.15}
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Intervertebral discs (between vertebrae) */}
      {vertebrae.slice(0, -1).map((v, i) => {
        const next = vertebrae[i + 1];
        const midY = (v.pos[1] + next.pos[1]) / 2;
        const midZ = (v.pos[2] + next.pos[2]) / 2;
        return (
          <mesh key={`disc-${i}`} position={[0, midY, midZ]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04 * v.scale, 0.04 * v.scale, 0.015, 8]} />
            <meshStandardMaterial
              color="#6bb8d0"
              emissive="#4aa8c0"
              emissiveIntensity={0.1}
              roughness={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 0.9, -0.26]}>
          <cylinderGeometry args={[0.2, 0.15, 2.5, 12]} />
          <meshStandardMaterial
            color="#d4c4a8"
            emissive="#d4c4a8"
            emissiveIntensity={0.3}
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
