import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, DoubleSide, Color } from 'three';

interface MuscularSystemModelProps {
  isSurgicalMode?: boolean;
}

export function MuscularSystemModel({ isSurgicalMode = false }: MuscularSystemModelProps) {
  const groupRef = useRef<Group>(null);
  
  // Base color or realistic surgical color
  const baseColor = isSurgicalMode ? '#8a2b2b' : '#ff5c5c';
  const roughness = isSurgicalMode ? 0.4 : 0.7;
  const metalness = isSurgicalMode ? 0.1 : 0.0;

  const muscleMaterial = new MeshStandardMaterial({
    color: new Color(baseColor),
    roughness,
    metalness,
    side: DoubleSide,
    transparent: true,
    opacity: 0.95,
  });

  const tendonMaterial = new MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.6,
    transparent: true,
    opacity: 0.9,
  });

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle breathing animation
      const t = clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 1.5) * 0.005;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} dispose={null} position={[0, -1, 0]}>
      {/* Abstract Representation of Torso Muscles */}
      
      {/* Pectoralis Major - Left */}
      <mesh position={[-0.4, 2.2, 0.4]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.6, 0.4, 0.1]} />
        <primitive object={muscleMaterial} />
      </mesh>
      
      {/* Pectoralis Major - Right */}
      <mesh position={[0.4, 2.2, 0.4]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.6, 0.4, 0.1]} />
        <primitive object={muscleMaterial} />
      </mesh>

      {/* Rectus Abdominis (Abs) */}
      <mesh position={[0, 1.4, 0.35]}>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <primitive object={muscleMaterial} />
      </mesh>

      {/* Deltoids */}
      <mesh position={[-1.1, 2.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <primitive object={muscleMaterial} />
      </mesh>
      <mesh position={[1.1, 2.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <primitive object={muscleMaterial} />
      </mesh>

      {/* Biceps */}
      <mesh position={[-1.2, 1.5, 0.1]}>
        <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
        <primitive object={muscleMaterial} />
      </mesh>
      <mesh position={[1.2, 1.5, 0.1]}>
        <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
        <primitive object={muscleMaterial} />
      </mesh>
      
      {/* Tendon Connections (Abstract) */}
      <mesh position={[-1.1, 1.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <primitive object={tendonMaterial} />
      </mesh>
      <mesh position={[1.1, 1.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <primitive object={tendonMaterial} />
      </mesh>
    </group>
  );
}
