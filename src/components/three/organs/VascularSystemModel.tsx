'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BloodVessel({
  points,
  radius = 0.015,
  color,
  emissive,
  pulseSpeed = 2,
  isArtery = true,
}: {
  points: [number, number, number][];
  radius?: number;
  color: string;
  emissive: string;
  pulseSpeed?: number;
  isArtery?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p))
    );
  }, [points]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [curve, radius]);

  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.getElapsedTime();
    // Blood flow pulsing
    materialRef.current.emissiveIntensity = 0.15 + Math.sin(t * pulseSpeed) * 0.08;
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeo} castShadow>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        roughness={0.35}
        metalness={0.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export default function VascularSystemModel({
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
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.02;
  });

  const arteryColor = '#c41e3a';
  const arteryEmissive = '#dc2626';
  const veinColor = '#2563eb';
  const veinEmissive = '#3b82f6';

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* === ARTERIAL SYSTEM (Red) === */}

      {/* Aorta - ascending from heart */}
      <BloodVessel
        points={[
          [0, 0.7, 0.25],
          [0, 0.95, 0.28],
          [0.05, 1.15, 0.2],
          [0.08, 1.3, 0.1],
        ]}
        radius={0.025}
        color={arteryColor}
        emissive={arteryEmissive}
        pulseSpeed={3}
      />

      {/* Aortic arch */}
      <BloodVessel
        points={[
          [0.08, 1.3, 0.1],
          [0.05, 1.38, 0.0],
          [-0.02, 1.4, -0.1],
          [-0.05, 1.35, -0.18],
        ]}
        radius={0.023}
        color={arteryColor}
        emissive={arteryEmissive}
        pulseSpeed={3}
      />

      {/* Descending aorta (thoracic + abdominal) */}
      <BloodVessel
        points={[
          [-0.05, 1.35, -0.18],
          [-0.03, 1.1, -0.2],
          [-0.02, 0.8, -0.18],
          [-0.02, 0.5, -0.16],
          [-0.02, 0.2, -0.15],
          [-0.02, -0.1, -0.14],
        ]}
        radius={0.02}
        color={arteryColor}
        emissive={arteryEmissive}
        pulseSpeed={2.5}
      />

      {/* Right carotid artery */}
      <BloodVessel
        points={[
          [0.06, 1.35, 0.05],
          [0.08, 1.5, 0.02],
          [0.07, 1.7, 0.0],
          [0.06, 1.9, 0.02],
          [0.04, 2.1, 0.05],
        ]}
        radius={0.01}
        color={arteryColor}
        emissive={arteryEmissive}
      />

      {/* Left carotid artery */}
      <BloodVessel
        points={[
          [0.02, 1.38, 0.02],
          [-0.02, 1.5, 0.0],
          [-0.04, 1.7, -0.02],
          [-0.05, 1.9, 0.0],
          [-0.04, 2.1, 0.05],
        ]}
        radius={0.01}
        color={arteryColor}
        emissive={arteryEmissive}
      />

      {/* Right subclavian artery (to arm) */}
      <BloodVessel
        points={[
          [0.07, 1.32, 0.08],
          [0.2, 1.3, 0.05],
          [0.35, 1.25, 0.02],
          [0.45, 1.18, 0.0],
        ]}
        radius={0.008}
        color={arteryColor}
        emissive={arteryEmissive}
      />

      {/* Left subclavian artery */}
      <BloodVessel
        points={[
          [-0.02, 1.38, -0.05],
          [-0.2, 1.32, -0.02],
          [-0.35, 1.25, 0.0],
          [-0.45, 1.18, 0.0],
        ]}
        radius={0.008}
        color={arteryColor}
        emissive={arteryEmissive}
      />

      {/* Renal arteries (to kidneys) */}
      <BloodVessel
        points={[
          [-0.02, 0.0, -0.15],
          [-0.12, -0.05, -0.2],
          [-0.25, -0.1, -0.25],
        ]}
        radius={0.008}
        color={arteryColor}
        emissive={arteryEmissive}
      />
      <BloodVessel
        points={[
          [-0.02, -0.05, -0.15],
          [0.12, -0.1, -0.2],
          [0.25, -0.15, -0.25],
        ]}
        radius={0.008}
        color={arteryColor}
        emissive={arteryEmissive}
      />

      {/* Common iliac arteries (split at pelvis) */}
      <BloodVessel
        points={[
          [-0.02, -0.1, -0.14],
          [-0.1, -0.25, -0.12],
          [-0.18, -0.4, -0.08],
          [-0.2, -0.6, -0.05],
        ]}
        radius={0.012}
        color={arteryColor}
        emissive={arteryEmissive}
      />
      <BloodVessel
        points={[
          [-0.02, -0.1, -0.14],
          [0.1, -0.25, -0.12],
          [0.18, -0.4, -0.08],
          [0.2, -0.6, -0.05],
        ]}
        radius={0.012}
        color={arteryColor}
        emissive={arteryEmissive}
      />

      {/* Coronary arteries (on heart surface) */}
      <BloodVessel
        points={[
          [0.05, 0.9, 0.35],
          [0.15, 0.85, 0.38],
          [0.2, 0.75, 0.35],
          [0.15, 0.65, 0.3],
        ]}
        radius={0.005}
        color="#e63946"
        emissive="#ff4d5a"
        pulseSpeed={4}
      />
      <BloodVessel
        points={[
          [-0.05, 0.9, 0.35],
          [-0.15, 0.85, 0.38],
          [-0.18, 0.75, 0.35],
          [-0.12, 0.65, 0.3],
        ]}
        radius={0.005}
        color="#e63946"
        emissive="#ff4d5a"
        pulseSpeed={4}
      />

      {/* === VENOUS SYSTEM (Blue) === */}

      {/* Superior vena cava */}
      <BloodVessel
        points={[
          [0.12, 1.35, 0.12],
          [0.1, 1.2, 0.15],
          [0.08, 1.0, 0.2],
          [0.05, 0.85, 0.25],
        ]}
        radius={0.022}
        color={veinColor}
        emissive={veinEmissive}
        pulseSpeed={1.5}
        isArtery={false}
      />

      {/* Inferior vena cava */}
      <BloodVessel
        points={[
          [0.05, 0.7, 0.2],
          [0.05, 0.5, -0.1],
          [0.04, 0.2, -0.12],
          [0.03, -0.1, -0.1],
        ]}
        radius={0.022}
        color={veinColor}
        emissive={veinEmissive}
        pulseSpeed={1.5}
        isArtery={false}
      />

      {/* Jugular veins */}
      <BloodVessel
        points={[
          [0.1, 2.0, 0.08],
          [0.12, 1.8, 0.1],
          [0.13, 1.6, 0.12],
          [0.12, 1.4, 0.14],
        ]}
        radius={0.009}
        color={veinColor}
        emissive={veinEmissive}
        isArtery={false}
      />
      <BloodVessel
        points={[
          [-0.1, 2.0, 0.08],
          [-0.12, 1.8, 0.1],
          [-0.13, 1.6, 0.12],
          [-0.12, 1.4, 0.14],
        ]}
        radius={0.009}
        color={veinColor}
        emissive={veinEmissive}
        isArtery={false}
      />

      {/* Pulmonary artery (to lungs, carries deoxygenated blood) */}
      <BloodVessel
        points={[
          [0, 0.9, 0.3],
          [-0.05, 0.98, 0.2],
          [-0.15, 1.02, 0.1],
          [-0.3, 1.0, 0.05],
        ]}
        radius={0.015}
        color={veinColor}
        emissive={veinEmissive}
        pulseSpeed={3}
      />
      <BloodVessel
        points={[
          [0, 0.9, 0.3],
          [0.05, 0.98, 0.2],
          [0.15, 1.02, 0.1],
          [0.3, 1.0, 0.05],
        ]}
        radius={0.015}
        color={veinColor}
        emissive={veinEmissive}
        pulseSpeed={3}
      />

      {/* Pulmonary veins (from lungs, carries oxygenated blood) */}
      <BloodVessel
        points={[
          [-0.35, 0.9, 0.05],
          [-0.2, 0.85, 0.15],
          [-0.05, 0.82, 0.25],
        ]}
        radius={0.012}
        color={arteryColor}
        emissive={arteryEmissive}
        pulseSpeed={2.5}
      />
      <BloodVessel
        points={[
          [0.35, 0.9, 0.05],
          [0.2, 0.85, 0.15],
          [0.05, 0.82, 0.25],
        ]}
        radius={0.012}
        color={arteryColor}
        emissive={arteryEmissive}
        pulseSpeed={2.5}
      />

      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#dc2626"
            emissiveIntensity={0.2}
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
