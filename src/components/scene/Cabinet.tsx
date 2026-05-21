'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import gsap from 'gsap';
import * as THREE from 'three';
import { Text, RoundedBox } from '@react-three/drei';
import { useCabinetStore } from '@/store/cabinetStore';
import Drawer from './Drawer';

const DRAWERS = [
  { id: 1 as const, label: 'TOP SECRET',  yOffset:  1.05, color: '#e6b800' }, // Gold theme from video
  { id: 2 as const, label: 'FILES',       yOffset:  0.28, color: '#d87040' }, // Orange theme
  { id: 3 as const, label: 'WIP',         yOffset: -0.49, color: '#529b52' }, // Green theme
  { id: 4 as const, label: 'CONTACT',     yOffset: -1.26, color: '#4a90e2' }, // Blue theme
];

// --- Cartoon Puffy Dust Smoke Particle System ---
function DustPuff({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate distinct particles blowing outward in different directions
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = 1.8 + Math.random() * 2.2;
      list.push({
        dir: [Math.cos(angle) * speed, 0.4 + Math.random() * 1.5, Math.sin(angle) * speed] as [number, number, number],
        size: 0.35 + Math.random() * 0.45,
        delay: Math.random() * 0.15,
        id: i,
      });
    }
    return list;
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const p = particles[idx];
        if (!p) return;
        
        // Reset scale and material initial state
        child.scale.set(0.01, 0.01, 0.01);
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.opacity = 0.8;

        // GSAP animate each puffy sphere outward, scaling up, then dissolving out
        gsap.timeline({ delay: p.delay })
          .to(child.position, {
            x: p.dir[0],
            y: p.dir[1],
            z: p.dir[2],
            duration: 1.2,
            ease: 'power3.out',
          })
          .to(child.scale, {
            x: p.size,
            y: p.size,
            z: p.size,
            duration: 0.3,
            ease: 'back.out(2)',
          }, 0)
          .to(child.scale, {
            x: p.size * 1.5,
            y: p.size * 1.5,
            z: p.size * 1.5,
            duration: 0.9,
            ease: 'none',
          }, 0.3)
          .to(mat, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.in',
          }, 0.5);
      });
    }
  }, [particles]);

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p) => (
        <mesh key={p.id} castShadow>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial 
            color="#e3f2fd" 
            roughness={0.9} 
            transparent 
            opacity={0.8}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

import { useMemo } from 'react';

export default function Cabinet() {
  const cabinetRef = useRef<THREE.Group>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const { setCabinetLanded } = useCabinetStore();
  const shakeCount = useRef(0);
  const [showDust, setShowDust] = useState(false);

  const handleCollision = useCallback(() => {
    if (shakeCount.current > 0) return;
    shakeCount.current++;
    
    // Trigger cartoon dust explosion
    setShowDust(true);

    // Dynamic camera impact shake
    const tl = gsap.timeline();
    tl.to(camera.position, { y: camera.position.y - 0.28, duration: 0.05, ease: 'power3.out' })
      .to(camera.position, { y: camera.position.y + 0.16, duration: 0.08, ease: 'power2.inOut' })
      .to(camera.position, { y: camera.position.y - 0.08, duration: 0.06, ease: 'power2.inOut' })
      .to(camera.position, { y: camera.position.y,        duration: 0.12, ease: 'power2.out'   });

    tl.to(camera.rotation, { z: 0.02, duration: 0.04, ease: 'power2.out' }, 0)
      .to(camera.rotation, { z: -0.01, duration: 0.06, ease: 'power2.inOut' }, '+=0.01')
      .to(camera.rotation, { z: 0,    duration: 0.1,  ease: 'power2.out'  });

    setTimeout(() => setCabinetLanded(true), 1200);
  }, [camera, setCabinetLanded]);

  return (
    <group>
      <RigidBody
        ref={rigidBodyRef}
        position={[0, 16, 0]}
        rotation={[0, 0, 0]}
        enabledRotations={[false, false, false]} // Keep upright
        restitution={0.25} // Elastic cartoon impact thud
        friction={1.0}
        linearDamping={0.08}
        onCollisionEnter={handleCollision}
        colliders={false}
      >
        <CuboidCollider 
          args={[1.35, 1.95, 0.85]} 
          position={[0, 0, 0]} 
          onCollisionEnter={handleCollision}
        />

        <group ref={cabinetRef}>
          {/* Main Stylized Cabinet Body with Rounded Edges */}
          <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
            <boxGeometry args={[2.7, 3.9, 1.7]} />
            <meshStandardMaterial color="#3b3f46" roughness={0.4} metalness={0.4} flatShading />
          </mesh>

          {/* Decorative scrollwork side trims (iron scrolls from video) */}
          {[-1.38, 1.38].map((x, sideIdx) => (
            <group key={sideIdx} position={[x, 0, 0.45]} scale={[1, 1, 1]}>
              {/* Vertical iron bar */}
              <mesh castShadow>
                <boxGeometry args={[0.05, 3.2, 0.05]} />
                <meshStandardMaterial color="#1a1c1e" roughness={0.6} />
              </mesh>
              {/* Upper scroll curl */}
              <mesh position={[x > 0 ? 0.15 : -0.15, 1.0, 0]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]} castShadow>
                <torusGeometry args={[0.2, 0.024, 6, 16, Math.PI * 1.5]} />
                <meshStandardMaterial color="#1a1c1e" roughness={0.6} />
              </mesh>
              {/* Center scroll curl */}
              <mesh position={[x > 0 ? 0.15 : -0.15, 0, 0]} rotation={[0, 0, x > 0 ? -0.5 : 0.5]} castShadow>
                <torusGeometry args={[0.22, 0.024, 6, 16, Math.PI * 1.5]} />
                <meshStandardMaterial color="#1a1c1e" roughness={0.6} />
              </mesh>
              {/* Lower scroll curl */}
              <mesh position={[x > 0 ? 0.15 : -0.15, -1.0, 0]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]} castShadow>
                <torusGeometry args={[0.2, 0.024, 6, 16, Math.PI * 1.5]} />
                <meshStandardMaterial color="#1a1c1e" roughness={0.6} />
              </mesh>
            </group>
          ))}

          {/* Top cover cap */}
          <mesh castShadow position={[0, 2.0, -0.05]}>
            <boxGeometry args={[2.78, 0.12, 1.78]} />
            <meshStandardMaterial color="#4a4f57" roughness={0.3} />
          </mesh>

          {/* Bottom base lip */}
          <mesh castShadow position={[0, -2.0, -0.05]}>
            <boxGeometry args={[2.78, 0.12, 1.78]} />
            <meshStandardMaterial color="#2d3036" roughness={0.5} />
          </mesh>

          {/* Cute curved metal cabinet legs */}
          {[
            [-1.15, -2.12, 0.65],
            [1.15, -2.12, 0.65],
            [-1.15, -2.12, -0.65],
            [1.15, -2.12, -0.65],
          ].map(([x, y, z], idx) => (
            <mesh key={idx} position={[x, y, z]} castShadow>
              <cylinderGeometry args={[0.08, 0.05, 0.24, 8]} />
              <meshStandardMaterial color="#1a1c1e" roughness={0.6} />
            </mesh>
          ))}

          {/* Drawers */}
          {DRAWERS.map((d) => (
            <Drawer
              key={d.id}
              id={d.id}
              label={d.label}
              yOffset={d.yOffset}
              color={d.color}
              cabinetRef={cabinetRef}
            />
          ))}

          {/* Mild warm interior lighting */}
          <pointLight color="#fffceb" intensity={0.4} distance={4} position={[0, 0.5, 0.8]} />
        </group>
      </RigidBody>

      {/* Play dust explosion at the impact coordinates */}
      {showDust && <DustPuff position={[0, -2.0, 0.5]} />}
    </group>
  );
}
