'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingQRShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 2.2, 0.15]} />
        <MeshDistortMaterial
          color="#5c7cfa"
          emissive="#3b5bdb"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function GlowingOrb({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <Float speed={3} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[size, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={3}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#748ffc"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ... (keep all the FloatingQRShape, GlowingOrb, ParticleField components the same) ...

export default function HeroScene() {
  return (
    // FIX: Changed -z-10 to z-0, added pointer-events-none so buttons behind it are still clickable
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }} // alpha: true ensures the canvas background is transparent
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-3, 2, 4]} intensity={1} color="#5c7cfa" />
        <pointLight position={[3, -2, 4]} intensity={0.8} color="#8b5cf6" />

        <FloatingQRShape />
        <GlowingOrb position={[-3.5, 1.5, -2]} color="#8b5cf6" size={0.4} />
        <GlowingOrb position={[3.5, -1, -1]} color="#10b981" size={0.3} />
        <GlowingOrb position={[-2, -2, -3]} color="#ec4899" size={0.25} />
        <ParticleField />
        <Stars radius={50} depth={50} count={1000} factor={3} fade speed={1} />
      </Canvas>
    </div>
  );
}