'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function PancreasModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const pancreasGeo = useMemo(() => {
    // Elongated, tapered shape
    const points: THREE.Vector3[] = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * 0.6 - 0.3;
      const y = Math.sin(t * Math.PI * 0.8) * 0.02;
      const z = Math.sin(t * Math.PI) * 0.04;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const radiusFunc = (t: number) => {
      // Head is wider, tail tapers
      if (t < 0.3) return 0.06 + t * 0.1;
      return 0.09 - (t - 0.3) * 0.08;
    };
    // Approximate with tube of varying radius
    const geo = new THREE.TubeGeometry(curve, 20, 0.05, 12, false);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      const t = (vertex.x + 0.3) / 0.6;
      const scale = radiusFunc(Math.max(0, Math.min(1, t)));
      const centerDist = Math.sqrt(vertex.y * vertex.y + vertex.z * vertex.z);
      if (centerDist > 0.001) {
        const normalized = new THREE.Vector2(vertex.y, vertex.z).normalize();
        vertex.y = normalized.x * scale;
        vertex.z = normalized.y * scale;
      }
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.04;
    groupRef.current.position.y = -0.15 + Math.sin(t * 0.7) * 0.005;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0.15, -0.15, 0.15]}>
      <mesh geometry={pancreasGeo} rotation={[0, 0.3, 0.1]} castShadow>
        <meshStandardMaterial
          color="#f0c040"
          emissive="#daa520"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.55}
          metalness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Pancreatic duct */}
      <mesh position={[0, 0, 0.02]} rotation={[0, 0.3, 0.1]}>
        <cylinderGeometry args={[0.005, 0.005, 0.55, 6]} />
        <meshStandardMaterial
          color="#e8b830"
          emissive="#daa520"
          emissiveIntensity={0.15}
          roughness={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={pancreasGeo} rotation={[0, 0.3, 0.1]} scale={1.02}>
        <meshBasicMaterial color="#daa520" wireframe transparent opacity={0.06} />
      </mesh>

      {isSelected && (
        <mesh scale={1.4}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#daa520"
            emissive="#daa520"
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
