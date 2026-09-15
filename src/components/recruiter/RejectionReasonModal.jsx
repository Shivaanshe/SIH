import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { AlertCircle, Send, XCircle } from 'lucide-react';

export default function RejectionReasonModal({ isOpen, onClose, candidate, postingId }) {
  const { updateApplicationStatus } = useData();

  const reasons = [
    "Insufficient verified clinical procedure hours in mandatory Panchakarma protocols.",
    "Formulation Quality Control experience (Schedule T GMP) below required Level 4.",
    "Eligibility requirement: Candidate lacks prerequisite AYUSH hospital IPD posting credits.",
    "Candidate's project work did not demonstrate applied clinical or laboratory research fit.",
    "Position filled by higher-scoring verified candidate."
  ];

  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [customFeedback, setCustomFeedback] = useState('');

  if (!isOpen || !candidate) return null;

  const handleConfirmReject = () => {
    const finalReason = customFeedback.trim() || selectedReason;
    updateApplicationStatus(candidate.id, postingId, "Rejected", finalReason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Candidate Feedback: ${candidate.name}`}
      subtitle="PRD §10.4 Feedback Loop: Explainable constructive feedback provided to candidate"
      maxWidth="640px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} color="#f43f5e" />
          <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
            Rather than silent rejection, this feedback will be logged into <strong>{candidate.name}'s</strong> Gap Analysis to guide their next learning modules.
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            SELECT PRIMARY DIAGNOSTIC REASON:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reasons.map((r, i) => (
              <label
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: selectedReason === r ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedReason === r ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                <input
                  type="radio"
                  name="reason"
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                  style={{ accentColor: '#f43f5e', marginTop: '3px' }}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            ADDITIONAL PERSONALIZED REMARK (OPTIONAL):
          </label>
          <textarea
            rows={2}
            value={customFeedback}
            onChange={(e) => setCustomFeedback(e.target.value)}
            placeholder="e.g. Recommend completing the CCRAS 30-hour protocol before re-applying..."
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              padding: '8px 12px',
              fontSize: '0.8rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirmReject} className="btn btn-accent" style={{ background: '#f43f5e' }}>
            <XCircle size={15} /> Confirm & Send Feedback
          </button>
        </div>
      </div>
    </Modal>
  );
}
