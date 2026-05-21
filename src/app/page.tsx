'use client';

import { Suspense, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/ui/Preloader';
import DrawerContent from '@/components/ui/DrawerContent';
import { useCabinetStore } from '@/store/cabinetStore';

// Dynamically import the 3D scene (no SSR — Three.js needs browser)
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [sceneStarted, setSceneStarted] = useState(false);
  const { activeDrawer, cabinetLanded } = useCabinetStore();

  const handleLoadComplete = useCallback(() => {
    setLoadingDone(true);
    // Small delay then drop the cabinet
    setTimeout(() => setSceneStarted(true), 300);
  }, []);

  return (
    <main
      id="portfolio-main"
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* 3D Canvas — always rendered behind everything */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <SceneCanvas started={sceneStarted} />
      </div>

      {/* Preloader overlay */}
      {!loadingDone && (
        <Preloader onComplete={handleLoadComplete} />
      )}

      {/* Drawer content overlays */}
      {activeDrawer && <DrawerContent />}

      {/* Hint label — appears after cabinet lands */}
      {cabinetLanded && !activeDrawer && (
        <p
          className="hint-label"
          aria-live="polite"
          style={{ animationDelay: '0.5s', animationPlayState: 'running' }}
        >
          ↑ Click a drawer to open ↑
        </p>
      )}

      {/* Corner info */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'rgba(168,144,112,0.4)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 5,
        }}
        aria-hidden="true"
      >
        github.com/1Yosh1
      </div>
    </main>
  );
}
