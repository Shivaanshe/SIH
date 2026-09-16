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
  FolderGit2,
  FileText,
  Download,
  Briefcase,
  Layers
} from 'lucide-react';
import ResumeUploadModal from './ResumeUploadModal';
import DigiLockerModal from '../common/DigiLockerModal';

export default function ProfileEditor() {
  const { activeStudent, updateStudentSkills, activeTaxonomy, institutions, updateStudentInstitution } = useData();
  const { domainPack, addNotification } = useApp();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  if (!activeStudent) return null;

  const handleLevelChange = (skillId, newLevel) => {
    const updated = (activeStudent.skills || []).map(s => {
      if (s.skillId === skillId) return { ...s, level: Number(newLevel) };
      return s;
    });
    updateStudentSkills(activeStudent.id, updated);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const existing = (activeStudent.skills || []).some(
      s => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );

    if (existing) {
      addNotification("Skill Exists", `"${newSkillName}" is already registered in your portfolio.`, "amber");
      return;
    }

    // Check if skill matches any taxonomy item or alias
    const taxMatch = (activeTaxonomy || []).find(t =>
      t.name.toLowerCase() === newSkillName.trim().toLowerCase() ||
      t.name.toLowerCase().includes(newSkillName.trim().toLowerCase()) ||
      newSkillName.trim().toLowerCase().includes(t.name.toLowerCase()) ||
      (t.aliases || []).some(a => a.toLowerCase() === newSkillName.trim().toLowerCase())
    );

    const newSkill = {
      skillId: taxMatch ? taxMatch.id : `custom-${Date.now()}`,
      name: newSkillName.trim(),
      level: Number(newSkillLevel),
      verified: false,
      endorsedBy: null
    };

    const updated = [newSkill, ...(activeStudent.skills || [])];
    updateStudentSkills(activeStudent.id, updated);
    setNewSkillName('');
    setIsAddingOpen(false);
    addNotification("Skill Added", `Added "${newSkill.name}" (Level ${newSkill.level}/5) to your digital profile.`, "emerald");
  };

  const handleDeleteSkill = (skillId, skillName) => {
    const updated = (activeStudent.skills || []).filter(s => s.skillId !== skillId);
    updateStudentSkills(activeStudent.id, updated);
    addNotification("Skill Removed", `Removed "${skillName}" from profile.`, "blue");
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🏛️ Institution:</span>
              <select
                value={activeStudent.institutionId || ''}
                onChange={(e) => {
                  const inst = institutions.find(i => i.id === e.target.value);
                  if (inst) updateStudentInstitution(activeStudent.id, inst);
                }}
                style={{
                  padding: '3px 8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#38bdf8',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                title="Change Affiliated University"
              >
                {institutions.filter(i => i.domainPack === domainPack).map((inst) => (
                  <option key={inst.id} value={inst.id} style={{ background: '#0f172a', color: '#fff' }}>
                    {inst.name} ({inst.location})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                • Student ID: <strong style={{ color: '#e2e8f0' }}>{activeStudent.id}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* DPI Digital Credentials & Confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="glass-pill badge-blue" title="One Nation, One Student ID (Academic Bank of Credits)">
              APAAR: {activeStudent.apaarId}
            </span>
            {activeStudent.digiLockerVerified ? (
              <button
                onClick={() => setIsDigiLockerModalOpen(true)}
                className="glass-pill badge-emerald"
                style={{ cursor: 'pointer', border: '1px solid #10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Click to view verified DigiLocker credentials"
              >
                <CheckCircle2 size={13} /> DigiLocker Verified
              </button>
            ) : (
              <button
                onClick={() => setIsDigiLockerModalOpen(true)}
                className="btn btn-primary"
                style={{
                  fontSize: '0.74rem',
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  borderColor: '#38bdf8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Connect DigiLocker to verify credentials and boost confidence"
              >
                <ShieldCheck size={13} /> Connect DigiLocker
              </button>
            )}
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

      {/* Uploaded Resume Document Vault & Portfolio Registration Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Uploaded Resume Card */}
        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '0.9rem' }}>
                  {activeStudent.uploadedResume?.name || `${activeStudent.name.replace(/\s+/g, '_')}_Official_CV.pdf`}
                </strong>
                <span className="glass-pill badge-emerald" style={{ fontSize: '0.66rem' }}>
                  ● NLP Parsed
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeStudent.uploadedResume?.size || '142 KB'} • Extracted {activeStudent.skills?.length || 0} Competencies • Synced with APAAR
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', padding: '6px 12px' }}
            >
              <Upload size={13} /> Upload New PDF / Inspect
            </button>
          </div>
        </div>

        {/* DigiLocker Verified Academic Credentials Card */}
        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderLeft: `4px solid ${activeStudent.digiLockerVerified ? '#10b981' : '#f59e0b'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: activeStudent.digiLockerVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${activeStudent.digiLockerVerified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} color={activeStudent.digiLockerVerified ? '#10b981' : '#fbbf24'} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '0.9rem' }}>
                  {activeStudent.digiLockerVerified ? 'DigiLocker DPI Verified Credentials' : 'DigiLocker Academic Credential Sync'}
                </strong>
                <span className={`glass-pill ${activeStudent.digiLockerVerified ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.66rem' }}>
                  {activeStudent.digiLockerVerified ? '● National DPI Verified' : '○ Pending Verification'}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeStudent.digiLockerVerified
                  ? `MeitY DPI • APAAR ID ${activeStudent.apaarId} • University Degree Transcript Verified in MongoDB`
                  : 'Link Aadhaar/APAAR to boost verification confidence to 95% and raise recruiter ranking'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className={`btn ${activeStudent.digiLockerVerified ? 'btn-secondary' : 'btn-primary'}`}
              style={{ fontSize: '0.76rem', padding: '6px 14px', background: activeStudent.digiLockerVerified ? undefined : '#0284c7' }}
            >
              <ShieldCheck size={13} /> {activeStudent.digiLockerVerified ? 'View Verified Vault' : 'Verify with DigiLocker'}
            </button>
          </div>
        </div>

        {/* Portfolio Registration Counts */}
        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
              {activeStudent.skills?.length || 0}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registered Skills</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {(activeStudent.appliedPostings || []).length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Applied Opportunities</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
              {(activeStudent.projects || []).length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Case Logs</div>
          </div>
        </div>
      </div>

      {/* Skills Inventory Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Core Competencies & Verified Portfolio</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Self-rated proficiencies are calibrated against faculty endorsements, clinical logs, and assessment tests.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setIsAddingOpen(prev => !prev)}
              className="btn btn-primary"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Plus size={14} /> {isAddingOpen ? 'Close Form' : 'Add New Skill'}
            </button>
            <span className="glass-pill badge-emerald">
              {activeStudent.skills?.length || 0} Registered Skills
            </span>
          </div>
        </div>

        {/* Inline Add Skill Form */}
        {isAddingOpen && (
          <form onSubmit={handleAddSkill} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 2, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Skill Name (e.g. Panchakarma, React.js, HPLC Standardization)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.84rem'
                }}
                required
              />
            </div>

            <div style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Level:</span>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  background: '#0f172a',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.84rem'
                }}
              >
                <option value="1">1 - Beginner (Foundational)</option>
                <option value="2">2 - Novice (Observed)</option>
                <option value="3">3 - Competent (Working)</option>
                <option value="4">4 - Proficient (Hands-on)</option>
                <option value="5">5 - Expert (Independent)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              Save to Profile
            </button>
          </form>
        )}

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {sk.verified && (
                    <span className="glass-pill badge-emerald" style={{ fontSize: '0.68rem' }}>
                      🏅 Endorsed
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(sk.skillId, sk.name)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Remove Skill"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
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

      <DigiLockerModal
        isOpen={isDigiLockerModalOpen}
        onClose={() => setIsDigiLockerModalOpen(false)}
        student={activeStudent}
      />
    </div>
  );
}
