'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SingleKidney({ position, mirror = false }: { position: [number, number, number]; mirror?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const kidneyGeometry = useMemo(() => {
    // Bean-shaped kidney
    const geo = new THREE.SphereGeometry(0.2, 32, 32);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      
      // Bean shape: indent on one side
      const indentFactor = mirror ? -1 : 1;
      if (vertex.x * indentFactor > 0) {
        const indent = Math.cos(vertex.y * Math.PI * 1.5) * 0.06;
        vertex.x -= indent * indentFactor;
      }
      
      // Elongate vertically
      vertex.y *= 1.4;
      vertex.z *= 0.7;
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [mirror]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.05;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={kidneyGeometry} castShadow>
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#8b5cf6"
          emissiveIntensity={0.12}
          roughness={0.45}
          metalness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Ureter tube */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.25, 8]} />
        <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.1} roughness={0.5} />
      </mesh>

      {/* Wireframe */}
      <mesh geometry={kidneyGeometry} scale={1.02}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

export default function KidneyModel({ 
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
    groupRef.current.position.y = -0.2 + Math.sin(t * 0.5) * 0.01;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0, -0.2, -0.3]}>
      {/* Left kidney */}
      <SingleKidney position={[-0.35, 0, 0]} />
      
      {/* Right kidney (slightly lower) */}
      <SingleKidney position={[0.35, -0.05, 0]} mirror />

      {isSelected && (
        <mesh scale={1.5}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
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
