'use client';

import { useState } from 'react';
import { SKILLS, PROJECTS } from '@/data/portfolioData';
import { useCabinetStore, ProjectFolder } from '@/store/cabinetStore';
import { GitBranch, ExternalLink, ChevronLeft } from 'lucide-react';

const FOLDERS: ProjectFolder[] = ['Skills', 'Projects', 'Demos'];

export default function ProjectsContent() {
  const { activeProjectFolder, setActiveProjectFolder, activeProject, setActiveProject } = useCabinetStore();
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  const handleProjectClick = (proj: typeof PROJECTS[0]) => setSelectedProject(proj);
  const handleBack = () => setSelectedProject(null);

  // ── Project Detail View ──
  if (selectedProject) {
    const statusClass =
      selectedProject.status === 'live' ? 'stamp-live' :
      selectedProject.status === 'active' ? 'stamp-active' : 'stamp-wip';

    return (
      <>
        <button className="doc-btn doc-btn-ghost" onClick={handleBack} style={{ marginBottom: 'var(--space-md)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={12} /> Back to folder
        </button>

        <div className={`document-stamp ${statusClass}`}>
          {selectedProject.status === 'live' ? 'LIVE' : selectedProject.status === 'active' ? 'IN DEV' : 'WIP'}
        </div>

        <h2 className="doc-title">{selectedProject.title}</h2>
        <span className="doc-category">{selectedProject.category}</span>

        <hr className="doc-divider" />
        <p className="doc-body">{selectedProject.description}</p>

        <div className="tag-row">
          {selectedProject.tech.map((t) => (
            <span key={t} className="doc-tag">{t}</span>
          ))}
        </div>

        <div className="doc-links">
          <a
            href={selectedProject.github}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-btn doc-btn-primary"
            aria-label={`GitHub for ${selectedProject.title}`}
          >
            <GitBranch size={12} /> View on GitHub
          </a>
          {selectedProject.live && (
            <a
              href={selectedProject.live}
              target="_blank"
              rel="noopener noreferrer"
              className="doc-btn doc-btn-ghost"
              aria-label={`Live demo for ${selectedProject.title}`}
            >
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
        </div>
      </>
    );
  }

  // ── Folder List View ──
  return (
    <>
      <div className="document-stamp stamp-active">ARCHIVE</div>
      <h2 className="doc-title">Projects & Archives</h2>
      <span className="doc-category">github.com/1Yosh1</span>

      <hr className="doc-divider" />

      {/* Folder tabs */}
      <div className="folder-tabs" role="tablist" aria-label="Project folders">
        {FOLDERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={activeProjectFolder === f}
            className={`folder-tab${activeProjectFolder === f ? ' active' : ''}`}
            onClick={() => setActiveProjectFolder(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Skills view */}
      {activeProjectFolder === 'Skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {SKILLS.map((skill) => (
            <div key={skill.category}>
              <span className="id-label" style={{ display: 'block', marginBottom: 6 }}>{skill.category}</span>
              <div className="tag-row">
                {skill.items.map((item) => (
                  <span key={item} className="doc-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects / Demos list */}
      {(activeProjectFolder === 'Projects' || activeProjectFolder === 'Demos') && (
        <div className="projects-list" role="tabpanel">
          {PROJECTS
            .filter((p) => p.folder === activeProjectFolder)
            .map((project) => (
              <button
                key={project.id}
                className="project-list-item"
                onClick={() => handleProjectClick(project)}
                aria-label={`Open ${project.title}`}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <div>
                  <div className="project-list-name">{project.title}</div>
                  <div className="project-list-cat">{project.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      padding: '2px 6px',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: project.status === 'live' ? '#2d6a2d' : '#8a6a10',
                      color: project.status === 'live' ? '#2d6a2d' : '#8a6a10',
                    }}
                  >
                    {project.status === 'live' ? 'LIVE' : 'DEV'}
                  </span>
                  <ChevronLeft size={14} style={{ transform: 'rotate(180deg)', color: '#8a7a5a' }} />
                </div>
              </button>
            ))}
        </div>
      )}
    </>
  );
}
