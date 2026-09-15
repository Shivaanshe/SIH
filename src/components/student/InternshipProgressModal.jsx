import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Award,
  Star,
  FileText,
  UserCheck,
  Send,
  Building,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InternshipProgressModal({ isOpen, onClose }) {
  const { addNotification } = useApp();
  const { internshipProgress, submitInternshipMilestone } = useData();

  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones', 'certificate'
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogNotes, setNewLogNotes] = useState('');

  if (!isOpen || !internshipProgress) return null;

  const handleMilestoneSubmit = (e) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    if (submitInternshipMilestone) {
      submitInternshipMilestone({
        title: newLogTitle,
        notes: newLogNotes
      });
    }

    setNewLogTitle('');
    setNewLogNotes('');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    addNotification(
      "Milestone Log Submitted",
      "Your clinical/technical milestone has been submitted to your industry mentor for review.",
      "emerald"
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={20} color="#10b981" />
          <span>Active Internship Progress & Mentor Evaluation Tracker</span>
        </div>
      }
      maxWidth="840px"
    >
      <div>
        {/* Internship Summary Banner */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                Active Industry Internship
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px' }}>
                {internshipProgress.jobTitle}
              </h3>
              <div style={{ fontSize: '0.84rem', color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} /> {internshipProgress.company}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Assigned Industry Mentor</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                <UserCheck size={14} color="#34d399" /> {internshipProgress.mentorName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <Star size={13} fill="#fbbf24" /> Mentor Rating: <strong>{internshipProgress.mentorRating} / 5.0</strong>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Milestone Progress (Week {internshipProgress.currentWeek} of {internshipProgress.totalWeeks})
              </span>
              <strong style={{ color: '#10b981' }}>{internshipProgress.overallProgressPercent}% Completed</strong>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${internshipProgress.overallProgressPercent}%`,
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`btn ${activeTab === 'milestones' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            Weekly Milestones & Mentor Feedback ({internshipProgress.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`btn ${activeTab === 'certificate' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <Award size={14} /> Completion Certificate & DPI Credential
          </button>
        </div>

        {activeTab === 'milestones' ? (
          <div>
            {/* Submit New Milestone Box */}
            <form onSubmit={handleMilestoneSubmit} className="glass-panel" style={{ padding: '16px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={14} color="#10b981" /> Submit Week {internshipProgress.currentWeek + 1} Milestone Log
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Milestone Topic (e.g. IPD Basti Protocol Observation or React State Architecture)"
                  value={newLogTitle}
                  onChange={(e) => setNewLogTitle(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.86rem'
                  }}
                  required
                />
                <textarea
                  rows="2"
                  placeholder="Key deliverables, patient case count, code PRs, or challenges faced..."
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    resize: 'none'
                  }}
                />
                <div style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
                    Submit for Mentor Evaluation
                  </button>
                </div>
              </div>
            </form>

            {/* Timeline of Milestones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {internshipProgress.milestones.map((m, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '16px', borderLeft: m.status === 'Approved' ? '3px solid #10b981' : '3px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="glass-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                        Week {m.weekNumber}
                      </span>
                      <strong style={{ fontSize: '0.92rem' }}>{m.title}</strong>
                    </div>
                    <span className={`glass-pill ${m.status === 'Approved' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                      {m.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Submitted: {m.submittedDate}
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: '#38bdf8' }}>Mentor Feedback: </strong>
                    {m.mentorFeedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Completion Certificate Tab */
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1.5px solid rgba(52, 211, 153, 0.4)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Award size={32} color="#10b981" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.02em', marginBottom: '6px' }}>
              OFFICIAL CERTIFICATE OF INTERNSHIP COMPLETION
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Issued by {internshipProgress.company} & Verified via Ministry Digital Public Infrastructure
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '520px',
              margin: '0 auto 24px',
              textAlign: 'left',
              fontSize: '0.84rem',
              lineHeight: '1.8'
            }}>
              <div>Candidate: <strong>Dr. Aanya Sharma</strong></div>
              <div>Role: <strong>{internshipProgress.jobTitle}</strong></div>
              <div>Duration: <strong>August 2026 – November 2026 (12 Weeks)</strong></div>
              <div>APAAR ID: <strong className="mono" style={{ color: '#fbbf24' }}>IN-APAAR-2026-AYUSH-9941</strong></div>
              <div>Credential Hash: <strong className="mono" style={{ color: '#38bdf8' }}>{internshipProgress.certificate.credentialId}</strong></div>
              <div>Status: <span style={{ color: '#34d399', fontWeight: 600 }}>Active (Mid-Term Verified)</span></div>
            </div>

            <button
              onClick={() => addNotification("Certificate Preview", "Digital credential verified with APAAR and DigiLocker.", "emerald")}
              className="btn btn-primary"
              style={{ fontSize: '0.86rem', padding: '10px 24px' }}
            >
              <Award size={16} /> Sync Credential to DigiLocker
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
