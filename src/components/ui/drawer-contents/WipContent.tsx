'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WORKS_IN_PROGRESS } from '@/data/portfolioData';

export default function WipContent() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animate progress bars in on mount
  useEffect(() => {
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const target = WORKS_IN_PROGRESS[i].status;
      gsap.fromTo(
        bar,
        { width: '0%' },
        { width: `${target}%`, duration: 1.2, delay: i * 0.15, ease: 'power3.out' }
      );
    });
  }, []);

  return (
    <>
      <div className="document-stamp stamp-wip">IN PROGRESS</div>
      <h2 className="doc-title">Works in Progress</h2>
      <span className="doc-category">Active Development Logs</span>
      <hr className="doc-divider" />

      {WORKS_IN_PROGRESS.map((item, i) => (
        <div key={item.id} className="wip-item">
          <div className="wip-header">
            <span className="wip-title">{item.title}</span>
            <span className="wip-percent">{item.status}% · {item.statusLabel}</span>
          </div>

          <div className="wip-progress-track">
            <div
              ref={(el) => { barsRef.current[i] = el; }}
              className="wip-progress-fill"
              style={{ width: '0%' }}
              role="progressbar"
              aria-valuenow={item.status}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.title} progress`}
            />
          </div>

          <p className="doc-body" style={{ fontSize: '0.82rem', marginBottom: 'var(--space-sm)' }}>
            {item.description}
          </p>

          <div className="tag-row" style={{ marginBottom: 'var(--space-sm)' }}>
            {item.tech.map((t) => (
              <span key={t} className="doc-tag">{t}</span>
            ))}
          </div>

          <div className="wip-upcoming">
            <span className="id-label" style={{ display: 'block', marginBottom: 4 }}>Upcoming</span>
            {item.upcoming.map((u) => (
              <span key={u} className="wip-upcoming-item">{u}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
