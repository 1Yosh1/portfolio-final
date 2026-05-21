'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FogEnvironment() {
  const cloudsRef = useRef<THREE.Group>(null);

  // Generate low-poly cloud coordinates
  const clouds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 50,
          -1.5 - Math.random() * 2, // Layered below the hilltop
          (Math.random() - 0.5) * 50 - 5,
        ] as [number, number, number],
        scale: (0.8 + Math.random() * 1.5) as number,
        speed: (0.02 + Math.random() * 0.05) as number,
        wobble: Math.random() * 100,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (cloudsRef.current) {
      // Drifting clouds animation
      cloudsRef.current.children.forEach((child, i) => {
        const cloudData = clouds[i];
        if (cloudData) {
          child.position.x += cloudData.speed * delta * 15;
          child.position.y += Math.sin(state.clock.getElapsedTime() * 0.5 + cloudData.wobble) * 0.002;
          if (child.position.x > 25) {
            child.position.x = -25;
          }
        }
      });
    }
  });

  return (
    <>
      {/* Styled cartoon sky fog */}
      <fog attach="fog" args={['#7ec0ee', 12, 38]} />

      {/* Bright warm sunlight */}
      <ambientLight color="#e3f2fd" intensity={0.9} />
      <directionalLight
        color="#fffceb"
        intensity={1.8}
        position={[-10, 18, 12]}
        castShadow
        shadow-mapSize={[2048, 2048] as unknown as number}
        shadow-camera-far={40}
        shadow-camera-near={0.5}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Bounce fill lighting for lush greenery */}
      <directionalLight color="#a8e6cf" intensity={0.4} position={[0, -1, 0]} />
      <pointLight color="#fff" intensity={0.5} position={[0, 4, 6]} />

      {/* Floating Low-Poly Clouds Group */}
      <group ref={cloudsRef}>
        {clouds.map((c, i) => (
          <group key={i} position={c.position} scale={[c.scale, c.scale, c.scale]}>
            {/* Puffy cloud composite using spheres */}
            <mesh castShadow>
              <sphereGeometry args={[1.5, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.0} flatShading />
            </mesh>
            <mesh position={[1.1, 0.2, 0]} castShadow>
              <sphereGeometry args={[1.1, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-1.1, 0.1, 0.2]} castShadow>
              <sphereGeometry args={[1.0, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.2, 0.1, 0.9]} castShadow>
              <sphereGeometry args={[0.9, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* Grassy Stylized Hilltop */}
      <group position={[0, -2.1, 0]}>
        {/* Main Hill dome */}
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[12, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.22]} />
          <meshStandardMaterial 
            color="#5ca35c" 
            roughness={0.85} 
            metalness={0.05} 
            flatShading
          />
        </mesh>

        {/* Individual grass patches/clumps for stylized texture */}
        {[
          [-1.5, 2.3, 1.2], [1.8, 2.2, 1.4], [-0.5, 2.4, 2.0], [0.8, 2.35, 2.2],
          [-2.2, 2.0, 2.5], [2.1, 2.1, 2.4], [-3.0, 1.8, -1.0], [3.2, 1.7, -0.5],
          [-1.0, 2.3, -2.2], [1.5, 2.2, -2.5], [0.0, 2.4, -1.8], [0.5, 2.4, 1.0]
        ].map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]} scale={[0.12, 0.18, 0.12]}>
            <mesh castShadow>
              <coneGeometry args={[0.8, 2, 4]} />
              <meshStandardMaterial color="#73b973" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.3, -0.2, 0.2]} rotation={[0.2, 0.1, -0.3]} castShadow>
              <coneGeometry args={[0.6, 1.6, 4]} />
              <meshStandardMaterial color="#64ac64" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-0.3, -0.1, -0.2]} rotation={[-0.1, -0.2, 0.3]} castShadow>
              <coneGeometry args={[0.5, 1.4, 4]} />
              <meshStandardMaterial color="#82c782" roughness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}
