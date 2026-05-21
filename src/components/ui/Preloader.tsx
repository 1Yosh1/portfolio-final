'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const STEPS: { pct: number; msg: string }[] = [
  { pct: 0,   msg: 'OPENING FILE CABINET...' },
  { pct: 20,  msg: 'LOADING CLASSIFIED DOCUMENTS...' },
  { pct: 45,  msg: 'DUSTING OFF FOLDERS...' },
  { pct: 65,  msg: 'CALIBRATING FOG MACHINE...' },
  { pct: 85,  msg: 'WINDING UP THE CLOCK...' },
  { pct: 100, msg: 'SYSTEM READY' },
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const statusRef  = useRef<HTMLParagraphElement>(null);
  const countRef   = useRef<HTMLParagraphElement>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (hasCompleted.current) return;

    // Build a GSAP timeline that drives the bar through all steps,
    // then fades out and calls onComplete — no useProgress needed.
    const tl = gsap.timeline({ delay: 0.3 });

    STEPS.forEach(({ pct, msg }, i) => {
      const duration = i === 0 ? 0 : 0.55 + Math.random() * 0.4;
      tl.to(barRef.current, { width: `${pct}%`, duration, ease: 'power1.inOut' }, i === 0 ? 0 : '+=0')
        .call(() => {
          if (statusRef.current) statusRef.current.textContent = msg;
        }, [], i === 0 ? 0 : '<');

      // Counter tick
      tl.to({ v: i === 0 ? 0 : STEPS[i - 1].pct }, {
        v: pct,
        duration,
        ease: 'power1.inOut',
        onUpdate() {
          if (countRef.current) {
            countRef.current.textContent = `${Math.round((this as any).targets()[0].v)}%`;
          }
        },
      }, '<');
    });

    // Hold briefly on "SYSTEM READY", then fade out
    tl.to(wrapRef.current, {
      opacity: 0,
      y: -30,
      duration: 1.1,
      ease: 'power3.inOut',
      delay: 0.7,
      onComplete: () => {
        hasCompleted.current = true;
        onComplete();
      },
    });

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="preloader">
      <div className="preloader-scanlines" aria-hidden="true" />

      {/* Ghost glow orbs */}
      <div aria-hidden="true" style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,191,0.08) 0%, transparent 70%)',
        top: '20%', left: '30%', filter: 'blur(60px)',
        animation: 'pulse-orb 6s ease-in-out infinite',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,144,42,0.05) 0%, transparent 70%)',
        bottom: '25%', right: '25%', filter: 'blur(80px)',
        animation: 'pulse-orb 8s ease-in-out infinite reverse',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 className="preloader-title">Eyoas Zewd</h1>
        <p className="preloader-subtitle">Full-Stack · Security · 3D</p>
      </div>

      <div style={{ width: 'min(400px, 80vw)', position: 'relative', zIndex: 1 }}>
        <div className="preloader-bar-wrap">
          <div
            ref={barRef}
            className="preloader-bar"
            style={{ width: '0%' }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <div className="preloader-bar-shimmer" aria-hidden="true" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <p ref={statusRef} className="preloader-status">{STEPS[0].msg}</p>
          <p ref={countRef}  className="preloader-status" aria-live="polite">0%</p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-orb {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
