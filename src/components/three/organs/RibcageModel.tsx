'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store/useAppStore';

function Rib({ yPos, width, depth, side, index, isSurgicalMode }: {
  yPos: number;
  width: number;
  depth: number;
  side: 'left' | 'right';
  index: number;
  isSurgicalMode: boolean;
}) {
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const sideSign = side === 'left' ? -1 : 1;
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 0.7;
      const x = Math.sin(angle) * width * sideSign;
      const y = Math.cos(angle) * 0.02 - t * 0.03;
      const z = -Math.cos(angle * 0.8) * depth + 0.1;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [width, depth, side]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 20, 0.012, 6, false);
  }, [curve]);

  const boneColor = isSurgicalMode ? '#eadecc' : '#f0e6d4';
  const emissiveColor = isSurgicalMode ? '#000000' : '#e8d8c0';

  return (
    <mesh position={[0, yPos, 0]} geometry={tubeGeo} castShadow>
      <meshStandardMaterial
        color={boneColor}
        emissive={emissiveColor}
        emissiveIntensity={isSurgicalMode ? 0 : 0.06}
        roughness={isSurgicalMode ? 0.9 : 0.7}
        metalness={isSurgicalMode ? 0.0 : 0.05}
        transparent
        opacity={isSurgicalMode ? 0.98 : 0.75}
      />
    </mesh>
  );
}

export default function RibcageModel({
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
    // Subtle breathing expansion
    const breath = Math.sin(t * 1.2) * 0.5 + 0.5;
    groupRef.current.scale.x = 1 + breath * 0.015;
    groupRef.current.scale.z = 1 + breath * 0.02;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
  });

  const ribs = useMemo(() => {
    const ribData: { yPos: number; width: number; depth: number; type: string }[] = [];
    // 12 pairs of ribs
    for (let i = 0; i < 12; i++) {
      const yPos = 1.35 - i * 0.075;
      const width = i < 3 ? 0.2 + i * 0.06 : i < 7 ? 0.38 + (i - 3) * 0.02 : 0.42 - (i - 7) * 0.04;
      const depth = 0.15 + Math.sin((i / 12) * Math.PI) * 0.1;
      const type = i < 7 ? 'true' : i < 10 ? 'false' : 'floating';
      ribData.push({ yPos, width, depth, type });
    }
    return ribData;
  }, []);

  const boneColor = isSurgicalMode ? '#eadecc' : '#f0e6d4';
  const emissiveColor = isSurgicalMode ? '#000000' : '#e8d8c0';

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Ribs (12 pairs - left and right) */}
      {ribs.map((rib, i) => (
        <group key={i}>
          <Rib yPos={rib.yPos} width={rib.width} depth={rib.depth} side="left" index={i} isSurgicalMode={isSurgicalMode} />
          <Rib yPos={rib.yPos} width={rib.width} depth={rib.depth} side="right" index={i} isSurgicalMode={isSurgicalMode} />
        </group>
      ))}

      {/* Sternum (breastbone) */}
      <mesh position={[0, 1.1, 0.22]}>
        <boxGeometry args={[0.05, 0.55, 0.02]} />
        <meshStandardMaterial
          color={boneColor}
          emissive={emissiveColor}
          emissiveIntensity={isSurgicalMode ? 0 : 0.08}
          roughness={isSurgicalMode ? 0.9 : 0.7}
        />
      </mesh>

      {/* Xiphoid process */}
      <mesh position={[0, 0.78, 0.22]}>
        <coneGeometry args={[0.015, 0.06, 4]} />
        <meshStandardMaterial color={boneColor} roughness={isSurgicalMode ? 0.9 : 0.8} />
      </mesh>

      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial
            color="#e8d8c0"
            emissive="#e8d8c0"
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
