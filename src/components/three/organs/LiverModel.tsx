'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LiverModel({ 
  onClick,
  isSelected = false,
}: { 
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const liverGeometry = useMemo(() => {
    // Create an organic liver-like shape
    const geo = new THREE.SphereGeometry(0.4, 32, 32);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      
      // Flatten and shape like liver
      vertex.y *= 0.5; // Flatten vertically
      vertex.x *= 1.3; // Wider
      
      // Right lobe larger
      if (vertex.x > 0) {
        vertex.x *= 1.2;
        vertex.z *= 1.1;
      }
      
      // Organic noise
      const noise = 
        Math.sin(vertex.x * 6 + vertex.z * 4) * 0.02 +
        Math.sin(vertex.y * 8) * 0.015;
      
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
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    groupRef.current.position.y = -0.5 + Math.sin(t * 0.6) * 0.01;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[-0.5, 0, 0.2]}>
      <mesh geometry={liverGeometry} castShadow>
        <meshStandardMaterial
          color="#92400e"
          emissive="#b45309"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.5}
          metalness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh geometry={liverGeometry} scale={1.01}>
        <meshBasicMaterial color="#b45309" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Gallbladder */}
      <mesh position={[0.15, -0.15, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#16a34a"
          emissive="#22c55e"
          emissiveIntensity={0.15}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {isSelected && (
        <mesh geometry={liverGeometry} scale={1.15}>
          <meshStandardMaterial
            color="#b45309"
            emissive="#b45309"
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
