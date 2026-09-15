import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Briefcase, CheckCircle } from 'lucide-react';

export default function CreateJobModal({ isOpen, onClose }) {
  const { activeTaxonomy, createJobPosting } = useData();
  const { domainPack } = useApp();

  const [title, setTitle] = useState(
    domainPack === 'ayush'
      ? 'Ayurvedic Clinical Research & Panchakarma Resident'
      : 'Junior Fullstack Cloud Engineer'
  );
  const [company, setCompany] = useState(
    domainPack === 'ayush' ? 'Charak Ayush Pharma & Hospitals' : 'CloudHealth Solutions'
  );
  const [sector, setSector] = useState(
    domainPack === 'ayush' ? 'Clinical Healthcare & Wellness' : 'HealthTech & Cloud'
  );
  const [location, setLocation] = useState('New Delhi (Hybrid)');
  const [stipend, setStipend] = useState('₹40,000 / month');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [description, setDescription] = useState(
    domainPack === 'ayush'
      ? 'Seeking dedicated BAMS interns for holistic inpatient case management, Panchakarma procedure monitoring, and clinical research documentation.'
      : 'Seeking skilled React & Node engineers to build resilient public health telemetry pipelines.'
  );

  const [selectedSkills, setSelectedSkills] = useState([
    {
      skillId: activeTaxonomy[0]?.id || 'ayush-pk-01',
      name: activeTaxonomy[0]?.name || 'Panchakarma Protocol & Procedures',
      minLevel: 4,
      importance: 'must-have'
    },
    {
      skillId: activeTaxonomy[1]?.id || 'ayush-kaya-02',
      name: activeTaxonomy[1]?.name || 'Kayachikitsa (Internal Medicine & Diagnostics)',
      minLevel: 3,
      importance: 'must-have'
    }
  ]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const available = activeTaxonomy.find(t => !selectedSkills.some(s => s.skillId === t.id));
    if (available) {
      setSelectedSkills(prev => [
        ...prev,
        { skillId: available.id, name: available.name, minLevel: 3, importance: 'nice-to-have' }
      ]);
    }
  };

  const handleRemoveSkill = (id) => {
    setSelectedSkills(prev => prev.filter(s => s.skillId !== id));
  };

  const handleSkillChange = (index, field, value) => {
    setSelectedSkills(prev => prev.map((s, i) => {
      if (i === index) return { ...s, [field]: value };
      return s;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || selectedSkills.length === 0) return;

    createJobPosting({
      title,
      company,
      sector,
      location,
      stipend,
      type: 'Internship & Fellowship',
      mode: 'Hybrid',
      description,
      eligibility: {
        degree: domainPack === 'ayush' ? ['BAMS', 'MD (Ayurveda)'] : ['B.Tech CS', 'MCA'],
        minCgpa: parseFloat(minCgpa),
        year: ['Final Year', 'Internship Year']
      },
      requiredSkills: selectedSkills.map(s => ({
        ...s,
        weight: s.importance === 'must-have' ? 0.4 : 0.2
      })),
      weights: {
        w1_skill: 0.45,
        w2_project: 0.20,
        w3_eligibility: 0.15,
        w4_verification: 0.20
      }
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post New Clinical / Technical Opportunity"
      subtitle="Define required skills, importance weights, and eligibility for instant candidate matching"
      maxWidth="760px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>ROLE TITLE</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '8px 12px',
                marginTop: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>COMPANY / CLINICAL WING</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '8px 12px',
                marginTop: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>SECTOR</label>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '8px 12px',
                marginTop: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>STIPEND</label>
            <input
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '8px 12px',
                marginTop: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>MIN CGPA</label>
            <input
              type="number"
              step="0.1"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '8px 12px',
                marginTop: '4px'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>DESCRIPTION</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              padding: '8px 12px',
              marginTop: '4px'
            }}
          />
        </div>

        {/* Required Skills & Weights Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
              REQUIRED COMPETENCIES & WEIGHTS (PRD §10.4):
            </label>
            <button
              type="button"
              onClick={handleAddSkill}
              className="glass-pill"
              style={{ cursor: 'pointer' }}
            >
              <Plus size={13} /> Add Competency
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedSkills.map((sk, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <select
                  value={sk.skillId}
                  onChange={(e) => {
                    const item = activeTaxonomy.find(t => t.id === e.target.value);
                    if (item) {
                      handleSkillChange(index, 'skillId', item.id);
                      handleSkillChange(index, 'name', item.name);
                    }
                  }}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    padding: '6px 8px',
                    fontSize: '0.8rem'
                  }}
                >
                  {activeTaxonomy.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <select
                  value={sk.minLevel}
                  onChange={(e) => handleSkillChange(index, 'minLevel', Number(e.target.value))}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    padding: '6px 8px',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="2">Level 2+ (Basic)</option>
                  <option value="3">Level 3+ (Competent)</option>
                  <option value="4">Level 4+ (Proficient)</option>
                  <option value="5">Level 5 (Expert)</option>
                </select>

                <select
                  value={sk.importance}
                  onChange={(e) => handleSkillChange(index, 'importance', e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    color: sk.importance === 'must-have' ? '#34d399' : '#fbbf24',
                    padding: '6px 8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  <option value="must-have">Must-Have (40%)</option>
                  <option value="nice-to-have">Nice-to-Have (20%)</option>
                </select>

                {selectedSkills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk.skillId)}
                    style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Briefcase size={16} /> Publish Opportunity
          </button>
        </div>
      </form>
    </Modal>
  );
}
