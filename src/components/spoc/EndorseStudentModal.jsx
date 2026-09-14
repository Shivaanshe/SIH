import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { Award, CheckCircle2, Shield, User } from 'lucide-react';

export default function EndorseStudentModal({ isOpen, onClose, student }) {
  const { endorseStudentSkill } = useData();
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [comments, setComments] = useState('Verified via completed IPD Panchakarma clinical logbook and patient assessment.');

  if (!student || !isOpen) return null;

  const handleEndorse = () => {
    if (!selectedSkillId) return;
    endorseStudentSkill(student.id, selectedSkillId, "Dr. Arvind Verma (AIIA Placement SPOC)");
    onClose();
  };

  const skillsToVerify = (student.skills || []).filter(s => !s.verified);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Faculty Skill Endorsement: ${student.name}`}
      subtitle={`Official institutional verification of clinical/technical competence`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
          <img
            src={student.avatar}
            alt={student.name}
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #10b981' }}
          />
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 'bold' }}>{student.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {student.degree} • CGPA: {student.cgpa} • APAAR: {student.apaarId}
            </div>
          </div>
        </div>

        {skillsToVerify.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#10b981' }}>
            <CheckCircle2 size={36} style={{ margin: '0 auto 8px auto' }} />
            <p style={{ fontWeight: 'bold' }}>All registered skills have already been officially verified!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                SELECT COMPETENCY TO VERIFY & ENDORSE:
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="">-- Choose skill pending verification --</option>
                {skillsToVerify.map(s => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.name} (Current Self-Rated Level: {s.level}/5)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                SUPERVISING FACULTY AUDIT NOTE:
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.78rem', color: '#34d399' }}>
              🛡️ <strong>Impact of Verification:</strong> Endorsement increases student's Verification Confidence Index by +15% and guarantees full weight recognition in recruiter screening algorithms.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleEndorse}
                disabled={!selectedSkillId}
                className="btn btn-primary"
              >
                <Award size={15} /> Sign & Endorse Competency
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
