'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <MeshDistortMaterial
          color="#5c7cfa"
          emissive="#3b5bdb"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function MiniOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={3} floatIntensity={3}>
      <Sphere position={position} args={[0.3, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          distort={0.4}
          speed={3}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

export default function AuthScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-3, 2, 4]} intensity={1} color="#5c7cfa" />
        <pointLight position={[3, -2, 4]} intensity={0.6} color="#8b5cf6" />

        <FloatingShape />
        <MiniOrb position={[-3, 2, -2]} color="#8b5cf6" />
        <MiniOrb position={[3, -2, -1]} color="#10b981" />
        <MiniOrb position={[-1, -3, -2]} color="#ec4899" />
        <Stars radius={50} depth={50} count={800} factor={3} fade speed={1} />
      </Canvas>
    </div>
  );
}