'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BladderModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const bladderGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.1, 24, 24);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      // Pear shape — wider at bottom, narrower at top
      const yFactor = (vertex.y + 0.1) / 0.2;
      vertex.x *= 1 + (1 - yFactor) * 0.3;
      vertex.z *= 1 + (1 - yFactor) * 0.3;
      // Flatten slightly front-back
      vertex.z *= 0.8;
      // Organic noise
      const noise = Math.sin(vertex.x * 15 + vertex.y * 12) * 0.003;
      vertex.x += noise;
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.03;
    // Subtle filling/emptying cycle
    const fill = Math.sin(t * 0.1) * 0.5 + 0.5;
    groupRef.current.scale.setScalar(0.95 + fill * 0.1);
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0, -0.65, 0.2]}>
      <mesh geometry={bladderGeo} castShadow>
        <meshStandardMaterial
          color="#f0c080"
          emissive="#e0a060"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.45}
          metalness={0.15}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Urethra */}
      <mesh position={[0, -0.12, 0.02]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.08, 6]} />
        <meshStandardMaterial
          color="#e0a060"
          emissive="#d09050"
          emissiveIntensity={0.1}
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ureters (from kidneys) */}
      <mesh position={[-0.05, 0.08, -0.02]} rotation={[0.3, 0.2, 0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.15, 6]} />
        <meshStandardMaterial color="#e0a060" transparent opacity={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.08, -0.02]} rotation={[0.3, -0.2, -0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.15, 6]} />
        <meshStandardMaterial color="#e0a060" transparent opacity={0.5} roughness={0.5} />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={bladderGeo} scale={1.03}>
        <meshBasicMaterial color="#e0a060" wireframe transparent opacity={0.06} />
      </mesh>

      {isSelected && (
        <mesh scale={1.5}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#e0a060"
            emissive="#e0a060"
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
