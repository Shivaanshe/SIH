import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Award,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Building,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearningProgramsSection() {
  const { domainPack, addNotification } = useApp();
  const { learningPrograms, enrollInLearningProgram } = useData();

  const [enrolledIds, setEnrolledIds] = useState(new Set());

  const programs = (learningPrograms || []).filter(p => p.domainPack === domainPack);

  const handleEnroll = (program) => {
    setEnrolledIds(prev => new Set(prev).add(program.id));
    if (enrollInLearningProgram) {
      enrollInLearningProgram(program);
    }
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    addNotification(
      "Enrolled in Industry Cohort",
      `You have successfully enrolled in "${program.title}". Course syllabus unlocked in your portfolio.`,
      "emerald"
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderLeft: '5px solid #10b981'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>🎓</span>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Industry-Published Training Programs & Certifications
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Acquire certified, in-demand technical competencies authored directly by hiring employers.
                </p>
              </div>
            </div>
          </div>

          <span className="glass-pill badge-emerald" style={{ fontSize: '0.74rem' }}>
            ● Direct Pre-Placement Interview (PPI) Pathways
          </span>
        </div>
      </div>

      {/* Programs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {programs.map(prog => {
          const isEnrolled = enrolledIds.has(prog.id);

          return (
            <div key={prog.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={prog.companyLogo}
                      alt={prog.company}
                      style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0' }}>{prog.company}</span>
                  </div>
                  <span className="glass-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                    {prog.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '8px' }}>
                  {prog.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {prog.description}
                </p>

                {/* Skills Tags */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Competencies Certified:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {prog.skillsCovered.map((sk, idx) => (
                      <span key={idx} className="glass-pill badge-emerald" style={{ fontSize: '0.7rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Credential Details */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fbbf24'
                }}>
                  <Award size={16} />
                  <span>Certification: <strong>{prog.certification}</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {prog.enrolledCount + (isEnrolled ? 1 : 0)} Enrolled
                </span>

                <button
                  onClick={() => handleEnroll(prog)}
                  disabled={isEnrolled}
                  className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle size={14} color="#10b981" /> Enrolled & Active
                    </>
                  ) : (
                    <>
                      <BookOpen size={14} /> Enroll in Cohort
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
