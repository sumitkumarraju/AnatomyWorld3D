'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DiaphragmModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const diaphragmGeo = useMemo(() => {
    // Dome-shaped muscular partition
    const geo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      // Flatten the dome and make it wider
      vertex.y *= 0.35;
      vertex.x *= 1.1;
      vertex.z *= 0.9;
      // Add muscular texture
      const noise = Math.sin(vertex.x * 15 + vertex.z * 12) * 0.005;
      vertex.y += noise;
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Breathing movement — diaphragm contracts down on inhale
    const breath = Math.sin(t * 1.2) * 0.5 + 0.5;
    meshRef.current.position.y = -breath * 0.04;
    meshRef.current.scale.y = 1 + breath * 0.15;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 0.55, 0.05]}>
      <mesh ref={meshRef} geometry={diaphragmGeo} rotation={[Math.PI, 0, 0]} castShadow>
        <meshStandardMaterial
          color="#cc6060"
          emissive="#b05050"
          emissiveIntensity={isSelected ? 0.25 : 0.08}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central tendon */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.15, 16]} />
        <meshStandardMaterial
          color="#e8c8c8"
          emissive="#d0a0a0"
          emissiveIntensity={0.1}
          roughness={0.7}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Esophageal hiatus */}
      <mesh position={[0, 0, 0.05]}>
        <torusGeometry args={[0.025, 0.008, 8, 12]} />
        <meshStandardMaterial
          color="#cc5050"
          roughness={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>

      {isSelected && (
        <mesh>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial
            color="#b05050"
            emissive="#b05050"
            emissiveIntensity={0.3}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
