'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

function ForestBackground() {
  const models = {
    birch1: useGLTF('/models/BirchTree_1.gltf'),
    birch2: useGLTF('/models/BirchTree_2.gltf'),
    birch3: useGLTF('/models/BirchTree_3.gltf'),
    maple1: useGLTF('/models/MapleTree_1.gltf'),
    maple2: useGLTF('/models/MapleTree_2.gltf'),
    maple3: useGLTF('/models/MapleTree_3.gltf'),
    bush: useGLTF('/models/Bush.gltf'),
    bush_small: useGLTF('/models/Bush_Small.gltf'),
    bush_large: useGLTF('/models/Bush_Large.gltf'),
    flower1: useGLTF('/models/Flower_1.gltf'),
    flower2: useGLTF('/models/Flower_2.gltf'),
    flower1_clump: useGLTF('/models/Flower_1_Clump.gltf'),
    flower2_clump: useGLTF('/models/Flower_2_Clump.gltf'),
    grass_large: useGLTF('/models/Grass_Large.gltf'),
    grass_small: useGLTF('/models/Grass_Small.gltf'),
  };

  const foliage = useMemo(() => {
    const list = [];
    let seed = 99;
    function random() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    const getHillHeight = (x: number, z: number) => {
      const distSq = x * x + z * z;
      if (distSq >= 144) return -5.0; // Sit on the forest floor
      
      const hillY = -12.05 + Math.sqrt(144 - distSq);
      // Smoothly blend the hill Y with the forest floor for background objects
      if (z < -8) {
        const t = Math.min(1, (Math.abs(z) - 8) / 4);
        return THREE.MathUtils.lerp(hillY, -5.0, t);
      }
      return hillY;
    };

    // 1. Far background forest (Z: -12 to -30, X: -30 to 30)
    const types = ['birch1', 'birch2', 'birch3', 'maple1', 'maple2', 'maple3'];
    for (let i = 0; i < 40; i++) {
      const z = -12 - random() * 18;
      const x = (random() - 0.5) * 60;
      const scaleVal = 0.8 + random() * 0.9;
      const scale: [number, number, number] = [scaleVal, scaleVal * (0.9 + random() * 0.2), scaleVal];
      const type = types[Math.floor(random() * types.length)];
      const y = getHillHeight(x, z);
      list.push({
        type,
        position: [x, y - 0.2, z] as [number, number, number],
        scale,
        rotation: [0, random() * Math.PI * 2, 0] as [number, number, number]
      });
    }

    // 2. Midground forest framing (Z: -6 to -12, X: -20 to 20, keeping center clear for cabinet)
    const midTypes = ['birch1', 'birch2', 'maple1', 'maple2', 'bush', 'bush_large', 'bush_small'];
    for (let i = 0; i < 25; i++) {
      const z = -6 - random() * 6;
      const x = (random() - 0.5) * 36;
      
      // Keep immediate foreground/center clear so the cabinet is fully visible
      if (z > -10 && Math.abs(x) < 4.5) continue;

      const scaleVal = 0.6 + random() * 0.6;
      const scale: [number, number, number] = [scaleVal, scaleVal, scaleVal];
      const type = midTypes[Math.floor(random() * midTypes.length)];
      const y = getHillHeight(x, z);
      list.push({
        type,
        position: [x, y - 0.1, z] as [number, number, number],
        scale,
        rotation: [0, random() * Math.PI * 2, 0] as [number, number, number]
      });
    }

    // 3. Close foreground details (framing the camera view on the left/right slopes)
    list.push(
      // Left slope
      { type: 'maple1', position: [-4.2, getHillHeight(-4.2, -2) - 0.1, -2], scale: [0.7, 0.7, 0.7], rotation: [0, 0.5, 0] },
      { type: 'bush_large', position: [-3.8, getHillHeight(-3.8, 0.5) - 0.05, 0.5], scale: [0.65, 0.65, 0.65], rotation: [0, 1.2, 0] },
      { type: 'flower1_clump', position: [-2.6, getHillHeight(-2.6, 1.8), 1.8], scale: [0.6, 0.6, 0.6], rotation: [0, 0, 0] },
      { type: 'flower2_clump', position: [-1.9, getHillHeight(-1.9, 2.2), 2.2], scale: [0.5, 0.5, 0.5], rotation: [0, 0.3, 0] },
      { type: 'grass_large', position: [-3.0, getHillHeight(-3.0, 1.0), 1.0], scale: [0.8, 0.8, 0.8], rotation: [0, 0.5, 0] },

      // Right slope
      { type: 'birch2', position: [4.2, getHillHeight(4.2, -2) - 0.1, -2], scale: [0.75, 0.75, 0.75], rotation: [0, -0.5, 0] },
      { type: 'bush', position: [3.8, getHillHeight(3.8, 0.5) - 0.05, 0.5], scale: [0.7, 0.7, 0.7], rotation: [0, -0.8, 0] },
      { type: 'flower2_clump', position: [2.6, getHillHeight(2.6, 1.8), 1.8], scale: [0.6, 0.6, 0.6], rotation: [0, 0, 0] },
      { type: 'flower1_clump', position: [1.9, getHillHeight(1.9, 2.2), 2.2], scale: [0.5, 0.5, 0.5], rotation: [0, -0.3, 0] },
      { type: 'grass_large', position: [3.0, getHillHeight(3.0, 1.0), 1.0], scale: [0.8, 0.8, 0.8], rotation: [0, -0.5, 0] }
    );

    return list;
  }, []);

  return (
    <group>
      {foliage.map((item, idx) => {
        const gltf = (models as any)[item.type];
        if (!gltf) return null;
        return (
          <primitive
            key={idx}
            object={gltf.scene.clone()}
            position={item.position}
            scale={item.scale}
            rotation={item.rotation}
          />
        );
      })}
    </group>
  );
}

export default function FogEnvironment() {
  return (
    <>
      {/* Cartoon sky blue fog */}
      <fog attach="fog" args={['#7ec0ee', 15, 42]} />

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
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* Bounce fill lighting for lush greenery */}
      <directionalLight color="#a8e6cf" intensity={0.4} position={[0, -1, 0]} />
      <pointLight color="#fff" intensity={0.5} position={[0, 4, 6]} />

      {/* 3D Forest Background foliage */}
      <ForestBackground />

      {/* Forest Floor plane in the background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.0, -15]} receiveShadow>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#559655" roughness={0.9} flatShading />
      </mesh>

      {/* Grassy Stylized Hilltop */}
      <group position={[0, -12.05, 0]}>
        {/* Main Hill dome (hemisphere) */}
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[12, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial 
            color="#5ca35c" 
            roughness={0.85} 
            metalness={0.05} 
            flatShading
          />
        </mesh>

        {/* Individual grass patches/clumps for stylized texture */}
        {[
          [-1.5, 1.2], [1.8, 1.4], [-0.5, 2.0], [0.8, 2.2],
          [-2.2, 2.5], [2.1, 2.4], [-3.0, -1.0], [3.2, -0.5],
          [-1.0, -2.2], [1.5, -2.5], [0.0, -1.8], [0.5, 1.0]
        ].map(([x, z], idx) => {
          const y = Math.sqrt(144 - x * x - z * z);
          return (
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
          );
        })}
      </group>
    </>
  );
}

// Preload models for faster rendering
useGLTF.preload('/models/BirchTree_1.gltf');
useGLTF.preload('/models/BirchTree_2.gltf');
useGLTF.preload('/models/BirchTree_3.gltf');
useGLTF.preload('/models/MapleTree_1.gltf');
useGLTF.preload('/models/MapleTree_2.gltf');
useGLTF.preload('/models/MapleTree_3.gltf');
useGLTF.preload('/models/Bush.gltf');
useGLTF.preload('/models/Bush_Small.gltf');
useGLTF.preload('/models/Bush_Large.gltf');
useGLTF.preload('/models/Flower_1.gltf');
useGLTF.preload('/models/Flower_2.gltf');
useGLTF.preload('/models/Flower_1_Clump.gltf');
useGLTF.preload('/models/Flower_2_Clump.gltf');
useGLTF.preload('/models/Grass_Large.gltf');
useGLTF.preload('/models/Grass_Small.gltf');
