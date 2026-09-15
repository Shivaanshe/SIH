import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Briefcase, CheckCircle, Sparkles, Building, MapPin, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';

const commonTechSkills = [
  "React.js & Modern Frontend Architecture",
  "Node.js & Scalable REST/GraphQL APIs",
  "Python & Machine Learning Pipelines",
  "Java & Enterprise Spring Boot",
  "Database Systems & Data Modeling (SQL / NoSQL)",
  "Cloud Architecture & AWS / GCP Deployment",
  "Docker, Kubernetes & CI/CD Pipelines",
  "TypeScript & Full-Stack System Design",
  "Cybersecurity & Zero-Trust Infrastructure",
  "Data Engineering & Apache Kafka Streams",
  "Mobile App Development (React Native / Flutter)"
];

const commonAyushSkills = [
  "Panchakarma Protocol & Procedures",
  "Kayachikitsa (Internal Medicine & Diagnostics)",
  "Dravyaguna & Herb Identification",
  "Rasashastra & Formulation Quality Control",
  "Shalya Tantra (Surgical Procedures & Ksharsutra)",
  "Clinical Trial Documentation & AYUSH GCP",
  "Yoga Therapy & Lifestyle Prescription",
  "Agadatantra & Forensic Toxicology",
  "Nadi Pariksha & Pulse Diagnostics",
  "Schedule T GMP & Pharmacopoeial Standardization",
  "Panchakarma IPD & Inpatient Care Management"
];

export default function CreateJobModal({ isOpen, onClose }) {
  const { activeTaxonomy, createJobPosting } = useData();
  const { domainPack, addNotification } = useApp();

  const suggestedSkills = domainPack === 'ayush' ? commonAyushSkills : commonTechSkills;

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
      skillId: domainPack === 'ayush' ? 'ayush-pk-01' : 'tech-react-01',
      name: domainPack === 'ayush' ? 'Panchakarma Protocol & Procedures' : 'React.js & Frontend Architecture',
      minLevel: 4,
      importance: 'must-have'
    },
    {
      skillId: domainPack === 'ayush' ? 'ayush-kaya-02' : 'tech-node-02',
      name: domainPack === 'ayush' ? 'Kayachikitsa (Internal Medicine & Diagnostics)' : 'Node.js & Express API Engineering',
      minLevel: 3,
      importance: 'must-have'
    }
  ]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    // Find first suggested skill not yet added
    const available = suggestedSkills.find(s => !selectedSkills.some(item => item.name.toLowerCase() === s.toLowerCase()));
    const newName = available || (domainPack === 'ayush' ? 'Dravyaguna & Herb Identification' : 'Database Systems & Data Modeling');
    
    setSelectedSkills(prev => [
      ...prev,
      {
        skillId: `req-${Date.now()}`,
        name: newName,
        minLevel: 3,
        importance: 'nice-to-have'
      }
    ]);
  };

  const handleRemoveSkill = (index) => {
    setSelectedSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, field, value) => {
    setSelectedSkills(prev => prev.map((s, i) => {
      if (i === index) {
        const updated = { ...s, [field]: value };
        if (field === 'name') {
          // If name matches a taxonomy item, link its id
          const tax = activeTaxonomy.find(t => t.name.toLowerCase() === value.toLowerCase() || (t.aliases || []).some(a => a.toLowerCase() === value.toLowerCase()));
          if (tax) updated.skillId = tax.id;
        }
        return updated;
      }
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
        minCgpa: parseFloat(minCgpa) || 7.0,
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

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post New Clinical / Technical Opportunity"
      subtitle="Define required skills (type custom or pick from recommendations), importance weights, and eligibility"
      maxWidth="780px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Basic Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ROLE TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '9px 12px',
                marginTop: '4px',
                fontSize: '0.86rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              COMPANY / CLINICAL WING
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Dabur India / AIIA IPD"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '9px 12px',
                marginTop: '4px',
                fontSize: '0.86rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SECTOR
            </label>
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="e.g. HealthTech / Pharma"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '9px 12px',
                marginTop: '4px',
                fontSize: '0.84rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              STIPEND
            </label>
            <input
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              placeholder="e.g. ₹40,000 / month"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '9px 12px',
                marginTop: '4px',
                fontSize: '0.84rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              MIN CGPA
            </label>
            <input
              type="number"
              step="0.1"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: '9px 12px',
                marginTop: '4px',
                fontSize: '0.84rem'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ROLE DESCRIPTION
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              padding: '9px 12px',
              marginTop: '4px',
              fontSize: '0.84rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Datalist for autocomplete suggestions */}
        <datalist id="suggested-skills-list">
          {suggestedSkills.map((s, idx) => (
            <option key={idx} value={s} />
          ))}
        </datalist>

        {/* Required Skills & Weights Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9' }}>
                REQUIRED COMPETENCIES & TARGET PROFICIENCY (PRD §10.4)
              </span>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Type any custom skill name or choose from suggestions. Student match is dynamically calibrated.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              <Plus size={13} /> Add Competency
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedSkills.map((sk, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {/* Skill Name Input (Editable & Autocomplete) */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    list="suggested-skills-list"
                    value={sk.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    placeholder="Type or select required skill (e.g. React.js, Python, GCP)"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '7px 10px',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                {/* Target Proficiency Level */}
                <select
                  value={sk.minLevel}
                  onChange={(e) => handleSkillChange(index, 'minLevel', Number(e.target.value))}
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    padding: '7px 10px',
                    fontSize: '0.78rem'
                  }}
                >
                  <option value="1">Level 1+ (Awareness)</option>
                  <option value="2">Level 2+ (Basic)</option>
                  <option value="3">Level 3+ (Competent)</option>
                  <option value="4">Level 4+ (Proficient)</option>
                  <option value="5">Level 5 (Expert)</option>
                </select>

                {/* Importance Weight */}
                <select
                  value={sk.importance}
                  onChange={(e) => handleSkillChange(index, 'importance', e.target.value)}
                  style={{
                    background: sk.importance === 'must-have' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: `1px solid ${sk.importance === 'must-have' ? '#10b981' : '#f59e0b'}`,
                    borderRadius: '6px',
                    color: sk.importance === 'must-have' ? '#34d399' : '#fbbf24',
                    padding: '7px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold'
                  }}
                >
                  <option value="must-have" style={{ background: '#0f172a', color: '#34d399' }}>Must-Have (40%)</option>
                  <option value="nice-to-have" style={{ background: '#0f172a', color: '#fbbf24' }}>Nice-to-Have (20%)</option>
                </select>

                {/* Delete Skill */}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  disabled={selectedSkills.length <= 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: selectedSkills.length <= 1 ? '#475569' : '#f43f5e',
                    cursor: selectedSkills.length <= 1 ? 'not-allowed' : 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove competency"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} /> Publish Opportunity
          </button>
        </div>
      </form>
    </Modal>
  );
}
