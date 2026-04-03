'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StomachModel({ 
  onClick,
  isSelected = false,
}: { 
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const stomachGeometry = useMemo(() => {
    // Create J-shaped stomach using lathe
    const points: THREE.Vector2[] = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      // J-curve profile
      const x = Math.sin(t * Math.PI) * (0.15 + t * 0.1);
      const y = t * 0.8 - 0.4;
      points.push(new THREE.Vector2(x, y));
    }
    
    const geo = new THREE.LatheGeometry(points, 32);
    
    // Deform for more organic feel
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      const noise = Math.sin(vertex.x * 8 + vertex.y * 6) * 0.01 +
                    Math.sin(vertex.z * 10) * 0.008;
      vertex.x += noise;
      vertex.z += noise;
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.06;
    // Subtle churning
    groupRef.current.scale.x = 1 + Math.sin(t * 1.5) * 0.02;
    groupRef.current.scale.z = 1 + Math.cos(t * 1.5) * 0.02;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0.3, 0.1, 0.3]}>
      <mesh geometry={stomachGeometry} rotation={[0, 0, -0.3]} castShadow>
        <meshStandardMaterial
          color="#ea580c"
          emissive="#f97316"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.5}
          metalness={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Esophagus connection */}
      <mesh position={[-0.05, 0.42, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.03, 0.04, 0.2, 10]} />
        <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={0.1} roughness={0.5} />
      </mesh>

      {/* Pylorus (exit) */}
      <mesh position={[0.12, -0.35, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.025, 0.035, 0.15, 10]} />
        <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={0.1} roughness={0.5} />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={stomachGeometry} rotation={[0, 0, -0.3]} scale={1.01}>
        <meshBasicMaterial color="#f97316" wireframe transparent opacity={0.06} />
      </mesh>

      {isSelected && (
        <mesh scale={1.3}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#f97316"
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
