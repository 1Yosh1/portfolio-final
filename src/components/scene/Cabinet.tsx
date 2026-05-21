'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import gsap from 'gsap';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useCabinetStore } from '@/store/cabinetStore';
import Drawer from './Drawer';

const DRAWERS = [
  { id: 1 as const, label: '[ IDENTITY ]',  yOffset:  1.05, color: '#9b7de8' },
  { id: 2 as const, label: '[ PROJECTS ]',  yOffset:  0.28, color: '#c8902a' },
  { id: 3 as const, label: '[ WIP      ]',  yOffset: -0.49, color: '#5a9a5a' },
  { id: 4 as const, label: '[ CONTACT  ]',  yOffset: -1.26, color: '#d04a4a' },
];

export default function Cabinet() {
  const cabinetRef = useRef<THREE.Group>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const { setCabinetLanded } = useCabinetStore();
  const shakeCount = useRef(0);

  const handleCollision = useCallback(() => {
    if (shakeCount.current > 0) return;
    shakeCount.current++;

    // Camera shake on impact
    const tl = gsap.timeline();
    tl.to(camera.position, { y: camera.position.y - 0.15, duration: 0.06, ease: 'power2.out' })
      .to(camera.position, { y: camera.position.y + 0.1,  duration: 0.08, ease: 'power2.inOut' })
      .to(camera.position, { y: camera.position.y - 0.06, duration: 0.06, ease: 'power2.inOut' })
      .to(camera.position, { y: camera.position.y + 0.03, duration: 0.06, ease: 'power2.inOut' })
      .to(camera.position, { y: camera.position.y,        duration: 0.1,  ease: 'power2.out'   });

    tl.to(camera.rotation, { z: 0.018, duration: 0.05, ease: 'power2.out' }, 0)
      .to(camera.rotation, { z: -0.01, duration: 0.07, ease: 'power2.inOut' }, '+=0.02')
      .to(camera.rotation, { z: 0,     duration: 0.1,  ease: 'power2.out'  });

    // Signal that cabinet has landed so drawers become interactive
    setTimeout(() => setCabinetLanded(true), 1200);
  }, [camera, setCabinetLanded]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 16, 0]}
      rotation={[0, 0, 0.08]} // Slight tilt so it lands on one edge and wobbles naturally
      restitution={0.4} // More bounce for theatrical landing
      friction={0.7}
      linearDamping={0.3}
      angularDamping={0.85}
      onCollisionEnter={handleCollision}
      colliders={false}
    >
      {/* Cabinet collision shape */}
      <CuboidCollider args={[1.4, 2.0, 0.9]} position={[0, 0, 0]} />

      <group ref={cabinetRef}>
        {/* ── Cabinet Body ── */}
        {/* Main shell */}
        <mesh castShadow receiveShadow position={[0, 0, -0.1]}>
          <boxGeometry args={[2.8, 4.0, 1.8]} />
          <meshStandardMaterial color="#252530" roughness={0.35} metalness={0.7} />
        </mesh>

        {/* Front panel recess */}
        <mesh castShadow position={[0, 0, 0.81]}>
          <boxGeometry args={[2.76, 3.96, 0.04]} />
          <meshStandardMaterial color="#1e1e28" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Top cap */}
        <mesh castShadow position={[0, 2.06, -0.05]}>
          <boxGeometry args={[2.84, 0.12, 1.88]} />
          <meshStandardMaterial color="#2e2e3c" roughness={0.3} metalness={0.75} />
        </mesh>

        {/* Bottom base */}
        <mesh castShadow receiveShadow position={[0, -2.06, -0.05]}>
          <boxGeometry args={[2.84, 0.12, 1.88]} />
          <meshStandardMaterial color="#1a1a22" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Side trim strips */}
        {[-1.38, 1.38].map((x) => (
          <mesh key={x} castShadow position={[x, 0, 0.6]}>
            <boxGeometry args={[0.04, 3.9, 0.6]} />
            <meshStandardMaterial color="#3a3a4a" roughness={0.25} metalness={0.8} />
          </mesh>
        ))}

        {/* Legs */}
        {[
          [-1.2, -2.2,  0.6],
          [ 1.2, -2.2,  0.6],
          [-1.2, -2.2, -0.7],
          [ 1.2, -2.2, -0.7],
        ].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <boxGeometry args={[0.12, 0.3, 0.12]} />
            <meshStandardMaterial color="#1a1a20" roughness={0.5} metalness={0.6} />
          </mesh>
        ))}

        {/* Branding plate */}
        <mesh position={[0, 1.65, 0.85]}>
          <boxGeometry args={[1.2, 0.12, 0.02]} />
          <meshStandardMaterial color="#6a5a30" roughness={0.4} metalness={0.6} emissive="#3a3020" emissiveIntensity={0.2} />
        </mesh>
        <Text
          position={[0, 1.65, 0.87]}
          fontSize={0.065}
          color="#c8a050"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          E. ZEWD ARCHIVES
        </Text>

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

        {/* Subtle interior glow when landed */}
        <pointLight color="#4a3820" intensity={0.15} distance={3} position={[0, 0, 0.5]} />
      </group>
    </RigidBody>
  );
}
