'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import FogEnvironment from '@/components/scene/FogEnvironment';
import Cabinet from '@/components/scene/Cabinet';

interface SceneCanvasProps {
  started: boolean;
}

export default function SceneCanvas({ started }: SceneCanvasProps) {
  const controlsRef = useRef<any>(null);

  return (
    <Canvas
      id="portfolio-canvas"
      shadows={{ type: THREE.PCFShadowMap }}   // ← replaces deprecated PCFSoftShadowMap
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, 7], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      frameloop="always"                      // fog particles + physics need continuous render
      style={{ background: '#050508' }}
    >
      {/* Performance optimizers */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <Suspense fallback={null}>
        <FogEnvironment />

        {started && (
          <Physics gravity={[0, -9.8, 0]} timeStep="vary">
            <Cabinet />
          </Physics>
        )}

        <Preload all />
      </Suspense>

      {/* Subtle orbit controls — limited so scene stays focused */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.35}
        maxPolarAngle={Math.PI * 0.62}
        minAzimuthAngle={-Math.PI * 0.25}
        maxAzimuthAngle={Math.PI * 0.25}
        dampingFactor={0.08}
        enableDamping
        target={[0, 0.5, 0]}
        makeDefault
      />
    </Canvas>
  );
}
