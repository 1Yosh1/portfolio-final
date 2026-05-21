'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Volumetric fog particle system — drifting mist
export default function FogEnvironment() {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const count = 500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(() => {
    // Generate soft circular gradient for mist particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      color: '#5a5080',
      size: 0.15,
      map: texture,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    timeRef.current += delta;
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3]     += 0.003 * delta * 60 * 0.3;
      pos[i * 3 + 1] += Math.sin(timeRef.current * 0.2 + i) * 0.0008;
      if (pos[i * 3] > 15) pos[i * 3] = -15;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = Math.sin(timeRef.current * 0.05) * 0.1;
  });

  return (
    <>
      {/* Scene fog */}
      <fog attach="fog" args={['#0a0a14', 8, 35]} />

      {/* Ambient lighting — gloomy purple tint */}
      <ambientLight color="#1a1228" intensity={0.8} />

      {/* Key light — dim amber from above-left */}
      <directionalLight
        color="#4a3820"
        intensity={0.6}
        position={[-5, 10, 5]}
        castShadow
        shadow-mapSize={[1024, 1024] as unknown as number}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Fill light — cold blue from right */}
      <pointLight color="#1a2a4a" intensity={0.4} position={[8, 3, -3]} />

      {/* Rim light — eerie purple from behind */}
      <pointLight color="#3a1a5a" intensity={0.5} position={[0, 5, -8]} />

      {/* Ground bounce */}
      <pointLight color="#2a1a08" intensity={0.2} position={[0, -2, 0]} />

      {/* Fog particles */}
      <points ref={particlesRef} geometry={geometry} material={material} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a0a12" roughness={1} metalness={0} />
      </mesh>
    </>
  );
}
