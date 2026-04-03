'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LungLobe({ 
  position, 
  scale, 
  mirror = false 
}: { 
  position: [number, number, number]; 
  scale: [number, number, number];
  mirror?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Breathing animation
    const breath = Math.sin(t * 1.2) * 0.5 + 0.5;
    meshRef.current.scale.x = scale[0] * (1 + breath * 0.08);
    meshRef.current.scale.y = scale[1] * (1 + breath * 0.06);
    meshRef.current.scale.z = scale[2] * (1 + breath * 0.1);
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial
        color="#f472b6"
        emissive="#ec4899"
        emissiveIntensity={0.12}
        roughness={0.4}
        metalness={0.3}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

export default function LungsModel({ 
  onClick,
  isSelected = false,
}: { 
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 0.9, 0]}>
      {/* Left Lung - 2 lobes */}
      <group position={[-0.45, 0, 0]}>
        <LungLobe position={[0, 0.15, 0]} scale={[0.85, 1, 0.8]} />
        <LungLobe position={[0, -0.25, 0]} scale={[0.9, 0.85, 0.8]} />
        {/* Wireframe overlay */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#f472b6" wireframe transparent opacity={0.06} />
        </mesh>
      </group>
      
      {/* Right Lung - 3 lobes */}
      <group position={[0.45, 0, 0]}>
        <LungLobe position={[0, 0.2, 0]} scale={[0.9, 0.85, 0.85]} />
        <LungLobe position={[0, -0.05, 0]} scale={[0.95, 0.75, 0.85]} />
        <LungLobe position={[0, -0.3, 0]} scale={[0.85, 0.7, 0.8]} />
        {/* Wireframe overlay */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshBasicMaterial color="#f472b6" wireframe transparent opacity={0.06} />
        </mesh>
      </group>

      {/* Trachea */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.4, 12]} />
        <meshStandardMaterial 
          color="#fda4af" 
          emissive="#ec4899" 
          emissiveIntensity={0.1} 
          roughness={0.5}
        />
      </mesh>

      {/* Bronchi - left */}
      <mesh position={[-0.15, 0.35, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.025, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#fda4af" emissive="#ec4899" emissiveIntensity={0.1} roughness={0.5} />
      </mesh>
      
      {/* Bronchi - right */}
      <mesh position={[0.15, 0.35, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.025, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#fda4af" emissive="#ec4899" emissiveIntensity={0.1} roughness={0.5} />
      </mesh>

      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={0.3}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
