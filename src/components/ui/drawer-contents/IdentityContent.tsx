'use client';

import { PROFILE } from '@/data/portfolioData';
import { GitBranch, Link2 } from 'lucide-react';

export default function IdentityContent() {
  return (
    <div className="id-card">
      <div className="document-stamp stamp-live">CLASSIFIED</div>

      <div className="id-header">
        {/* Avatar — gothic initials */}
        <div className="id-avatar" aria-hidden="true">
          {PROFILE.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h2 className="doc-title">{PROFILE.name}</h2>
          <span className="doc-category">{PROFILE.title}</span>
          <p style={{ fontSize: '0.8rem', color: '#5a4a2a', fontStyle: 'italic' }}>
            {PROFILE.tagline}
          </p>
        </div>
      </div>

      <hr className="doc-divider" />

      <div className="id-grid">
        <div className="id-field">
          <span className="id-label">Case ID</span>
          <span className="id-value">EZ-2026</span>
        </div>
        <div className="id-field">
          <span className="id-label">Location</span>
          <span className="id-value">{PROFILE.location}</span>
        </div>
        <div className="id-field">
          <span className="id-label">Languages</span>
          <span className="id-value">{PROFILE.languages.join(' · ')}</span>
        </div>
        <div className="id-field">
          <span className="id-label">Status</span>
          <span className="id-value" style={{ color: '#2d6a2d' }}>Available for Work</span>
        </div>
      </div>

      <hr className="doc-divider" />

      {/* Education */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <span className="id-label" style={{ display: 'block', marginBottom: 8 }}>Education</span>
        {PROFILE.education.map((edu, i) => (
          <div key={i} className="id-field">
            <span className="id-value">{edu.degree}</span>
            <span style={{ fontSize: '0.8rem', color: '#6a5a3a' }}>
              {edu.institution} · {edu.year}
            </span>
          </div>
        ))}
      </div>

      <hr className="doc-divider" />

      {/* Bio */}
      <p className="doc-body">{PROFILE.bio}</p>

      {/* Links */}
      <div className="doc-links">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="doc-btn doc-btn-primary"
          aria-label="GitHub profile"
        >
          <GitBranch size={12} /> GitHub
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="doc-btn doc-btn-ghost"
          aria-label="LinkedIn profile"
        >
          <Link2 size={12} /> LinkedIn
        </a>
      </div>
    </div>
  );
}
