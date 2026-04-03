'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function IntestinesModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Small intestine: coiled tube
  const smallIntestineCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const coils = 8;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 2 * coils;
      const radius = 0.12 + Math.sin(t * Math.PI) * 0.08;
      const x = Math.sin(angle) * radius + Math.sin(t * 5) * 0.03;
      const y = -0.5 - t * 0.35;
      const z = Math.cos(angle) * radius * 0.6 + 0.1;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const smallIntestineGeo = useMemo(() => {
    return new THREE.TubeGeometry(smallIntestineCurve, 200, 0.015, 8, false);
  }, [smallIntestineCurve]);

  // Large intestine: C-shaped frame
  const largeIntestineParts = useMemo(() => {
    const parts: { curve: THREE.CatmullRomCurve3; name: string }[] = [];

    // Ascending colon (right side, going up)
    const ascending: THREE.Vector3[] = [];
    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      ascending.push(new THREE.Vector3(
        0.22 + Math.sin(t * 4) * 0.01,
        -0.85 + t * 0.45,
        0.12
      ));
    }
    parts.push({ curve: new THREE.CatmullRomCurve3(ascending), name: 'ascending' });

    // Transverse colon (across top)
    const transverse: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      transverse.push(new THREE.Vector3(
        0.22 - t * 0.44,
        -0.4 + Math.sin(t * Math.PI) * 0.06,
        0.12 + Math.sin(t * Math.PI) * 0.03
      ));
    }
    parts.push({ curve: new THREE.CatmullRomCurve3(transverse), name: 'transverse' });

    // Descending colon (left side, going down)
    const descending: THREE.Vector3[] = [];
    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      descending.push(new THREE.Vector3(
        -0.22 + Math.sin(t * 4) * 0.01,
        -0.4 - t * 0.4,
        0.12
      ));
    }
    parts.push({ curve: new THREE.CatmullRomCurve3(descending), name: 'descending' });

    // Sigmoid colon (S-curve at bottom)
    const sigmoid: THREE.Vector3[] = [];
    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      sigmoid.push(new THREE.Vector3(
        -0.22 + Math.sin(t * Math.PI * 1.5) * 0.12,
        -0.8 - t * 0.12,
        0.12 - t * 0.05
      ));
    }
    parts.push({ curve: new THREE.CatmullRomCurve3(sigmoid), name: 'sigmoid' });

    return parts;
  }, []);

  // Cecum and appendix
  const cecumGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.05, 16, 16);
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      vertex.y *= 1.3;
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Peristalsis wave
    groupRef.current.scale.x = 1 + Math.sin(t * 0.8) * 0.008;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.03;
  });

  return (
    <group ref={groupRef} onClick={onClick} position={[0, 0, 0]}>
      {/* Small intestine (coiled) */}
      <mesh geometry={smallIntestineGeo}>
        <meshStandardMaterial
          color="#f0a0a0"
          emissive="#e08080"
          emissiveIntensity={isSelected ? 0.2 : 0.08}
          roughness={0.55}
          metalness={0.15}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Large intestine segments */}
      {largeIntestineParts.map((part) => {
        const geo = new THREE.TubeGeometry(part.curve, 30, 0.035, 10, false);
        return (
          <mesh key={part.name} geometry={geo}>
            <meshStandardMaterial
              color="#c07050"
              emissive="#a06040"
              emissiveIntensity={isSelected ? 0.25 : 0.1}
              roughness={0.5}
              metalness={0.15}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}

      {/* Cecum */}
      <mesh geometry={cecumGeo} position={[0.22, -0.88, 0.12]}>
        <meshStandardMaterial
          color="#c07050"
          emissive="#a06040"
          emissiveIntensity={0.1}
          roughness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Appendix */}
      <mesh position={[0.25, -0.94, 0.12]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.008, 0.005, 0.08, 6]} />
        <meshStandardMaterial
          color="#d08060"
          emissive="#b07050"
          emissiveIntensity={0.1}
          roughness={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Rectum */}
      <mesh position={[0, -0.95, 0.05]}>
        <cylinderGeometry args={[0.03, 0.025, 0.1, 8]} />
        <meshStandardMaterial
          color="#b06050"
          emissive="#905040"
          emissiveIntensity={0.1}
          roughness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {isSelected && (
        <mesh position={[0, -0.65, 0.1]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial
            color="#e08080"
            emissive="#e08080"
            emissiveIntensity={0.2}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
