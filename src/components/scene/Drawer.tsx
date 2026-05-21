'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useCabinetStore, DrawerId } from '@/store/cabinetStore';

interface DrawerProps {
  id: DrawerId;
  label: string;
  yOffset: number;
  color: string;
  cabinetRef: React.RefObject<THREE.Group | null>;
}

// --- Cartoon Cobweb Decoration ---
function Cobweb() {
  return (
    <group position={[-1.0, 0.22, 0.45]} rotation={[0, 0, 0]}>
      {/* Web strands */}
      {[0, 0.2, 0.4, 0.6, 0.8].map((rot) => (
        <mesh key={rot} rotation={[0, 0, rot]} position={[0.1, -0.1, 0]}>
          <boxGeometry args={[0.3, 0.005, 0.005]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
        </mesh>
      ))}
      {/* Curved web connecting lines */}
      <mesh position={[0.15, -0.05, 0]} rotation={[0, 0, 0.45]}>
        <torusGeometry args={[0.18, 0.004, 4, 8, Math.PI * 0.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0.2, -0.08, 0]} rotation={[0, 0, 0.45]}>
        <torusGeometry args={[0.26, 0.004, 4, 8, Math.PI * 0.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

export default function Drawer({ id, label, yOffset, color, cabinetRef }: DrawerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { activeDrawer, setActiveDrawer, cabinetLanded } = useCabinetStore();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  const isOpen = activeDrawer === id;

  const animateDrawer = useCallback((open: boolean) => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.position, {
      z: open ? 1.55 : 0,
      duration: 0.9,
      ease: open ? 'back.out(1.1)' : 'power3.inOut',
    });
  }, []);

  const handleClick = useCallback(() => {
    if (!cabinetLanded) return;

    const nextDrawer = isOpen ? null : id;
    setActiveDrawer(nextDrawer);
    animateDrawer(!isOpen);

    if (!isOpen && cabinetRef.current) {
      const worldPos = new THREE.Vector3();
      cabinetRef.current.getWorldPosition(worldPos);

      // Camera zooms in closer to drawer
      gsap.to(camera.position, {
        x: worldPos.x + 0.5,
        y: worldPos.y + yOffset + 0.35,
        z: worldPos.z + 4.2,
        duration: 1.1,
        ease: 'power3.inOut',
      });
      gsap.to(camera, {
        // @ts-ignore
        fov: 52,
        duration: 1.1,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    } else {
      // Zoom back out to master scene angle
      gsap.to(camera.position, {
        x: 0, y: 1.5, z: 7,
        duration: 1.1,
        ease: 'power3.inOut',
      });
      gsap.to(camera, {
        // @ts-ignore
        fov: 60,
        duration: 1.1,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [cabinetLanded, isOpen, id, setActiveDrawer, animateDrawer, camera, cabinetRef, yOffset]);

  const isInteractable = cabinetLanded;

  return (
    <group position={[0, yOffset, 0]}>
      {/* Drawer slide block */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerEnter={() => isInteractable && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerOver={() => isInteractable && (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[2.5, 0.68, 1.6]} />
        <meshStandardMaterial
          color={isOpen ? '#2a2d33' : '#30343a'}
          roughness={0.4}
          metalness={0.3}
        />

        {/* Drawer Front plate */}
        <mesh position={[0, 0, 0.81]} castShadow>
          <boxGeometry args={[2.48, 0.66, 0.04]} />
          <meshStandardMaterial
            color={hovered ? '#40454d' : '#33373d'}
            roughness={0.35}
            metalness={0.4}
          />
        </mesh>

        {/* --- Stylized Yellow Tape Label ("TOP SECRET", "FILES" etc.) --- */}
        <mesh position={[0, 0.1, 0.835]} castShadow>
          <boxGeometry args={[1.3, 0.28, 0.02]} />
          <meshStandardMaterial
            color="#ebd464" // Vibrant yellow tape paper
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>

        {/* Sticky note label text */}
        <Text
          position={[0, 0.1, 0.85]}
          fontSize={0.095}
          color="#302404" // Deep brown charcoal text
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {label}
        </Text>

        {/* Ornate pull handle */}
        <mesh position={[0, -0.16, 0.84]} castShadow>
          <boxGeometry args={[0.55, 0.06, 0.06]} />
          <meshStandardMaterial color="#c5b058" roughness={0.25} metalness={0.8} />
        </mesh>
        {[-0.25, 0.25].map((x) => (
          <mesh key={x} position={[x, -0.16, 0.82]} castShadow>
            <boxGeometry args={[0.04, 0.08, 0.05]} />
            <meshStandardMaterial color="#a08a40" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}

        {/* ── Manila Folders inside the drawer (revealed when opened) ── */}
        {isOpen && (
          <group position={[0, 0.06, 0.2]}>
            {/* Drawers filled with colorful document folders */}
            {[-0.8, -0.4, 0.0, 0.4, 0.8].map((xOffset, fIdx) => (
              <group key={fIdx} position={[xOffset, 0.12, (fIdx - 2) * 0.18]} rotation={[-0.1, 0, 0]}>
                {/* Folder body */}
                <mesh castShadow>
                  <boxGeometry args={[0.42, 0.46, 0.03]} />
                  <meshStandardMaterial
                    color={fIdx % 3 === 0 ? '#e3c588' : fIdx % 3 === 1 ? '#d6ac65' : '#e8cfa7'}
                    roughness={0.85}
                  />
                </mesh>
                {/* Folder tab */}
                <mesh position={[0.1, 0.25, 0]} castShadow>
                  <boxGeometry args={[0.15, 0.05, 0.03]} />
                  <meshStandardMaterial
                    color={fIdx % 3 === 0 ? '#e3c588' : fIdx % 3 === 1 ? '#d6ac65' : '#e8cfa7'}
                    roughness={0.85}
                  />
                </mesh>
              </group>
            ))}

            {/* Little cute cartoon cobweb in top drawer corner */}
            {id === 1 && <Cobweb />}
          </group>
        )}
      </mesh>
    </group>
  );
}
