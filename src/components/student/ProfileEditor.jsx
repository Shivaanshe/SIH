import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
  FolderGit2
} from 'lucide-react';
import ResumeUploadModal from './ResumeUploadModal';

export default function ProfileEditor() {
  const { activeStudent, updateStudentSkills } = useData();
  const { domainPack } = useApp();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  if (!activeStudent) return null;

  const handleLevelChange = (skillId, newLevel) => {
    const updated = (activeStudent.skills || []).map(s => {
      if (s.skillId === skillId) return { ...s, level: Number(newLevel) };
      return s;
    });
    updateStudentSkills(activeStudent.id, updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Student Identity & DPI Compliance Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #10b981',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>{activeStudent.name}</h2>
              <span className="glass-pill badge-emerald">
                <ShieldCheck size={13} /> Verified Student
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {activeStudent.degree} • {activeStudent.year}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              🏛️ {activeStudent.institutionName}
            </p>
          </div>
        </div>

        {/* DPI Digital Credentials & Confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="glass-pill badge-blue" title="One Nation, One Student ID (Academic Bank of Credits)">
              APAAR: {activeStudent.apaarId}
            </span>
            <span className="glass-pill badge-emerald" title="DigiLocker Integrated">
              <CheckCircle2 size={13} /> DigiLocker
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Verification Confidence Index: <strong style={{ color: '#34d399' }}>{Math.round((activeStudent.verificationConfidence || 0.6) * 100)}%</strong>
          </div>
          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Upload size={14} /> NLP Resume Scanner
          </button>
        </div>
      </div>

      {/* Skills Inventory Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Core Competencies & Proficiency</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Self-rated proficiencies are calibrated against faculty endorsements and clinical logs.
            </p>
          </div>
          <span className="glass-pill badge-emerald">
            {activeStudent.skills?.length || 0} Registered Skills
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {(activeStudent.skills || []).map((sk) => (
            <div
              key={sk.skillId}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>{sk.name}</span>
                {sk.verified && (
                  <span className="glass-pill badge-emerald" style={{ fontSize: '0.68rem' }}>
                    🏅 Endorsed
                  </span>
                )}
              </div>

              {sk.endorsedBy && (
                <div style={{ fontSize: '0.72rem', color: '#34d399' }}>
                  Verified by: {sk.endorsedBy}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proficiency:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sk.level}
                  onChange={(e) => handleLevelChange(sk.skillId, e.target.value)}
                  style={{ flex: 1, accentColor: '#10b981', cursor: 'pointer' }}
                />
                <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981', minWidth: '36px', textAlign: 'right' }}>
                  {sk.level}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects & Hands-on Logs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Verified Projects & Clinical Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(activeStudent.projects || []).map((proj, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px'
              }}
            >
              <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderGit2 size={16} color="#38bdf8" /> {proj.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {proj.description}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                {proj.tags?.map((t, i) => (
                  <span key={i} className="glass-pill" style={{ fontSize: '0.7rem' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
