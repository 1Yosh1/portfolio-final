'use client';

import { useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
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

export default function Drawer({ id, label, yOffset, color, cabinetRef }: DrawerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const handleRef = useRef<THREE.Mesh>(null);
  const { activeDrawer, setActiveDrawer, cabinetLanded } = useCabinetStore();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  const isOpen = activeDrawer === id;

  // Animate drawer slide on open/close
  const animateDrawer = useCallback((open: boolean) => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.position, {
      z: open ? 1.4 : 0,
      duration: 0.8,
      ease: open ? 'back.out(1.2)' : 'power3.inOut',
    });
  }, []);

  const handleClick = useCallback(() => {
    if (!cabinetLanded) return;

    const nextDrawer = isOpen ? null : id;
    setActiveDrawer(nextDrawer);
    animateDrawer(!isOpen);

    // GSAP camera zoom toward this drawer
    if (!isOpen && cabinetRef.current) {
      const worldPos = new THREE.Vector3();
      cabinetRef.current.getWorldPosition(worldPos);

      gsap.to(camera.position, {
        x: worldPos.x + 0.5,
        y: worldPos.y + yOffset + 0.5,
        z: worldPos.z + 4.5,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      gsap.to(camera, {
        // @ts-ignore
        fov: 55,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    } else {
      // Zoom back out
      gsap.to(camera.position, {
        x: 0, y: 1.5, z: 7,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      gsap.to(camera, {
        // @ts-ignore
        fov: 60,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [cabinetLanded, isOpen, id, setActiveDrawer, animateDrawer, camera, cabinetRef, yOffset]);

  // Hover glow pulse
  useFrame((_, delta) => {
    if (!handleRef.current) return;
    const mat = handleRef.current.material as THREE.MeshStandardMaterial;
    if (hovered && cabinetLanded) {
      mat.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.005) * 0.15;
    } else {
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 5 * delta);
    }
  });

  const drawerColor = new THREE.Color(color);
  const isInteractable = cabinetLanded;

  return (
    <group position={[0, yOffset, 0]}>
      {/* Drawer body */}
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
        <boxGeometry args={[2.6, 0.72, 1.6]} />
        <meshStandardMaterial
          color={new THREE.Color('#2a2a38').lerp(drawerColor, 0.06)}
          roughness={0.35}
          metalness={0.65}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Drawer front face accent */}
      <mesh position={[0, 0, 0.8]} castShadow>
        <boxGeometry args={[2.58, 0.70, 0.04]} />
        <meshStandardMaterial
          color={new THREE.Color('#32323f').lerp(drawerColor, 0.12)}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Pull handle */}
      <mesh ref={handleRef} position={[0, 0, 0.84]} castShadow>
        <boxGeometry args={[0.6, 0.07, 0.07]} />
        <meshStandardMaterial
          color="#8a8a9a"
          roughness={0.2}
          metalness={0.9}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Handle brackets */}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0, 0.82]} castShadow>
          <boxGeometry args={[0.04, 0.1, 0.06]} />
          <meshStandardMaterial color="#6a6a78" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}

      {/* Drawer label */}
      <Text
        position={[0, -0.2, 0.85]}
        fontSize={0.085}
        color={hovered && cabinetLanded ? color : '#c8c0b0'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        {label}
      </Text>

      {/* Drawer number */}
      <Text
        position={[-1.1, 0, 0.85]}
        fontSize={0.07}
        color="#6a6a78"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {`0${id}`}
      </Text>

      {/* Open indicator glow when active */}
      {isOpen && (
        <pointLight
          color={color}
          intensity={0.3}
          distance={2}
          position={[0, 0, 1.2]}
        />
      )}

      {/* Folders inside (visible when open) */}
      {isOpen && (
        <group position={[0, 0.05, 0.5]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[(i - 1.5) * 0.55, 0.25, 0.3]} castShadow>
              <boxGeometry args={[0.45, 0.5, 0.04]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#e8c87a' : '#d4b068'}
                roughness={0.8}
                metalness={0.05}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
