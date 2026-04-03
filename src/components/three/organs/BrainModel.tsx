'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useAppStore } from '@/lib/store/useAppStore';

export default function BrainModel({ 
  onClick,
  isSelected = false,
}: { 
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const materialRightRef = useRef<THREE.MeshStandardMaterial>(null);
  const isSurgicalMode = useAppStore(s => s.isSurgicalMode);

  // Create wrinkled brain geometry using displacement
  const brainGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.45, 64, 64);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      
      // Create wrinkle-like displacement
      const noise = 
        Math.sin(vertex.x * 12) * 0.02 +
        Math.sin(vertex.y * 10 + vertex.x * 8) * 0.025 +
        Math.sin(vertex.z * 14 + vertex.y * 6) * 0.015 +
        Math.sin(vertex.x * 20 + vertex.z * 15) * 0.01;
      
      const len = vertex.length();
      vertex.normalize().multiplyScalar(len + noise);
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Subtle floating
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.position.y = 2.2 + Math.sin(t * 0.8) * 0.02;
    
    const baseEmissive = isSurgicalMode ? 0 : 0.12;
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = isSelected 
        ? baseEmissive + 0.23 + Math.sin(t * 2) * 0.1 
        : baseEmissive + Math.sin(t * 1.5) * 0.03;
    }
    if (materialRightRef.current) {
      materialRightRef.current.emissiveIntensity = isSelected 
        ? baseEmissive + 0.23 + Math.sin(t * 2) * 0.1 
        : baseEmissive + Math.sin(t * 1.5) * 0.03;
    }
  });

  const brainColor = isSurgicalMode ? '#e1b1a7' : '#f59e0b';
  const brainEmissive = isSurgicalMode ? '#220000' : '#fbbf24';
  const fissureColor = isSurgicalMode ? '#8a3a3a' : '#b45309';
  const stemColor = isSurgicalMode ? '#cc9e95' : '#d97706';

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 2.2, 0]}>
      {/* Main brain - left hemisphere */}
      <mesh geometry={brainGeometry} position={[-0.05, 0, 0]} castShadow>
        <meshStandardMaterial
          ref={materialRef}
          color={brainColor}
          emissive={brainEmissive}
          roughness={isSurgicalMode ? 0.8 : 0.6}
          metalness={isSurgicalMode ? 0.0 : 0.2}
          transparent
          opacity={isSurgicalMode ? 1 : 0.9}
        />
      </mesh>
      
      {/* Right hemisphere */}
      <mesh geometry={brainGeometry} position={[0.05, 0, 0]} castShadow>
        <meshStandardMaterial
          ref={materialRightRef}
          color={brainColor}
          emissive={brainEmissive}
          roughness={isSurgicalMode ? 0.8 : 0.6}
          metalness={isSurgicalMode ? 0.0 : 0.2}
          transparent
          opacity={isSurgicalMode ? 1 : 0.9}
        />
      </mesh>

      {/* Central fissure line */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.01, 0.35, 0.4]} />
        <meshStandardMaterial color={fissureColor} transparent opacity={isSurgicalMode ? 0.8 : 0.4} />
      </mesh>

      {/* Brain stem */}
      <mesh position={[0, -0.35, -0.1]}>
        <cylinderGeometry args={[0.08, 0.06, 0.25, 12]} />
        <meshStandardMaterial
          color={stemColor}
          emissive={brainEmissive}
          emissiveIntensity={isSurgicalMode ? 0 : 0.1}
          roughness={isSurgicalMode ? 0.8 : 0.5}
        />
      </mesh>

      {/* Cerebellum (back lower part) */}
      <mesh position={[0, -0.2, -0.25]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={stemColor}
          emissive={brainEmissive}
          emissiveIntensity={isSurgicalMode ? 0 : 0.1}
          roughness={isSurgicalMode ? 0.9 : 0.7}
          metalness={isSurgicalMode ? 0.0 : 0.15}
          transparent
          opacity={isSurgicalMode ? 1 : 0.88}
        />
      </mesh>

      {/* Wireframe overlay for scan effect */}
      <mesh geometry={brainGeometry} position={[0, 0, 0]} scale={1.02}>
        <meshBasicMaterial color="#fbbf24" wireframe transparent opacity={0.05} />
      </mesh>

      {/* Neural activity particles effect */}
      {isSelected && (
        <mesh scale={1.3}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.4}
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
