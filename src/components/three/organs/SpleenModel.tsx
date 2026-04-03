'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpleenModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const spleenGeo = useMemo(() => {
    // Oval, slightly curved shape
    const geo = new THREE.SphereGeometry(0.15, 32, 32);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      // Elongate and flatten like a coffee bean
      vertex.x *= 1.4;
      vertex.y *= 0.8;
      vertex.z *= 0.6;
      // Slight curvature on one side
      if (vertex.z > 0) {
        vertex.z *= 0.7;
      }
      // Organic noise
      const noise = Math.sin(vertex.x * 10 + vertex.y * 8) * 0.005;
      vertex.x += noise;
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    groupRef.current.position.y = 0.1 + Math.sin(t * 0.6) * 0.005;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[-0.55, 0.1, 0.12]}>
      <mesh geometry={spleenGeo} rotation={[0.2, 0.5, 0.1]} castShadow>
        <meshStandardMaterial
          color="#8b1a4a"
          emissive="#a02050"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.5}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Splenic hilum area */}
      <mesh position={[0, 0, 0.08]} rotation={[0.2, 0.5, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#6b1040"
          roughness={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={spleenGeo} rotation={[0.2, 0.5, 0.1]} scale={1.02}>
        <meshBasicMaterial color="#a02050" wireframe transparent opacity={0.06} />
      </mesh>

      {isSelected && (
        <mesh scale={1.5}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#a02050"
            emissive="#a02050"
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
