'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useCabinetStore } from '@/store/cabinetStore';
import IdentityContent from './drawer-contents/IdentityContent';
import ProjectsContent from './drawer-contents/ProjectsContent';
import WipContent from './drawer-contents/WipContent';
import ContactContent from './drawer-contents/ContactContent';

const DRAWER_LABELS: Record<number, string> = {
  1: 'Identity',
  2: 'Projects & Skills',
  3: 'Works in Progress',
  4: 'Contact',
};

export default function DrawerContent() {
  const { activeDrawer, closeAll } = useCabinetStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeDrawer) {
      setVisible(true);
      requestAnimationFrame(() => {
        if (!panelRef.current) return;
        gsap.fromTo(
          panelRef.current,
          { y: 80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }
        );
      });
    } else if (visible) {
      if (panelRef.current) {
        gsap.to(panelRef.current, {
          y: 60,
          opacity: 0,
          scale: 0.96,
          duration: 0.45,
          ease: 'power3.in',
          onComplete: () => setVisible(false),
        });
      } else {
        setVisible(false);
      }
    }
  }, [activeDrawer]);

  if (!visible) return null;

  const renderContent = () => {
    switch (activeDrawer) {
      case 1: return <IdentityContent />;
      case 2: return <ProjectsContent />;
      case 3: return <WipContent />;
      case 4: return <ContactContent />;
      default: return null;
    }
  };

  return (
    <>
      {/* Backdrop — Vignette style so the 3D drawer remains highly visible behind the sheet */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(5,5,8,0) 20%, rgba(5,5,8,0.7) 100%)',
          zIndex: 40,
        }}
        onClick={closeAll}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        className="overlay-close"
        onClick={closeAll}
        aria-label="Close drawer"
      >
        <X size={16} />
      </button>

      {/* Document panel */}
      <div className="overlay-panel" style={{ zIndex: 50 }}>
        <div ref={panelRef} className="document-sheet" role="dialog" aria-modal="true" aria-label={DRAWER_LABELS[activeDrawer || 1]}>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
