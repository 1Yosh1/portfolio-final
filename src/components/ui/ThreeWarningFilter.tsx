'use client';

import { useEffect } from 'react';

/**
 * Silences known Three.js r168+ deprecation notices that are
 * internal to the library and not actionable by application code.
 */
export default function ThreeWarningFilter() {
  useEffect(() => {
    const orig = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : '';
      if (
        msg.includes('THREE.Clock') ||
        msg.includes('PCFSoftShadowMap')
      ) return;
      orig(...args);
    };
    return () => { console.warn = orig; };
  }, []);
  return null;
}
