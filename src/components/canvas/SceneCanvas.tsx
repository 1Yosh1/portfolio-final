'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
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
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, 7], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      frameloop="always"
      style={{ background: '#050508' }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <Suspense fallback={null}>
        <FogEnvironment />

        {started && (
          <Physics gravity={[0, -9.8, 0]} timeStep="vary">
            <Cabinet />
            
            {/* Invisible floor collider to catch the cabinet */}
            <RigidBody type="fixed" position={[0, -0.05, 0]}>
              <CuboidCollider args={[20, 0.1, 20]} />
            </RigidBody>
          </Physics>
        )}

        <Preload all />
      </Suspense>

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
