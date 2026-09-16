import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { computeGapAnalysis } from '../../engine/gapAnalysis';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Building,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function StudentPlacementDiagnosticsModal({ isOpen, onClose, student, onOpenEndorse }) {
  const { allPostings, postings, addNotification } = useData();
  const { domainPack } = useApp();

  const [assignedModules, setAssignedModules] = useState({});
  const [scheduledLabs, setScheduledLabs] = useState({});

  if (!isOpen || !student) return null;

  const appliedList = student.appliedPostings || [];
  const candidateDomain = student.domainPack || domainPack || 'ayush';

  const handleAssignModule = (appId, skillName) => {
    setAssignedModules(prev => ({ ...prev, [`${appId}-${skillName}`]: true }));
    addNotification(
      "Academic Bridge Module Prescribed",
      `Assigned "${skillName}" remedial bridge course to ${student.name}'s curriculum plan.`,
      "emerald"
    );
  };

  const handleScheduleLab = (appId, roleTitle) => {
    setScheduledLabs(prev => ({ ...prev, [appId]: true }));
    addNotification(
      "Department Remedial Lab Scheduled",
      `Faculty 1-on-1 hands-on lab confirmed for ${student.name} to target ${roleTitle} requirements.`,
      "emerald"
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Placement Diagnostic Audit: ${student.name}`}
      subtitle="Academia SPOC Portal: Recruiter Deselection Intelligence, Gap Deficits & Corrective Actions"
      maxWidth="780px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Student Profile Snapshot */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={student.avatar}
              alt={student.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #10b981' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{student.name}</strong>
                <span className="glass-pill badge-blue" style={{ fontSize: '0.7rem' }}>
                  {student.apaarId}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {student.degree} • CGPA: <strong style={{ color: '#fbbf24' }}>{student.cgpa || '8.4'}</strong>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Competencies</div>
            <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>
              {(student.skills || []).filter(s => s.verified).length} / {(student.skills || []).length} Endorsed
            </strong>
          </div>
        </div>

        {/* Applications List */}
        {appliedList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
            <Clock size={36} color="#64748b" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>No Placement Applications Registered</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              This candidate has not yet submitted applications to any active industry job postings.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appliedList.map((app, idx) => {
              const posting = (allPostings || []).find(p => p.id === app.postingId) ||
                              (postings || []).find(p => p.id === app.postingId) || {
                                title: "Full-Stack Software Engineering Intern",
                                company: "DeepTech Cloud Solutions",
                                location: "Bangalore / Remote",
                                stipend: "₹45,000 / month",
                                domainPack: candidateDomain
                              };

              const isRejected = app.status === 'Rejected';
              const isShortlisted = app.status === 'Shortlisted';
              const gaps = computeGapAnalysis(student, posting, candidateDomain);

              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isRejected ? 'rgba(244, 63, 94, 0.4)' : isShortlisted ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: isRejected ? '0 0 16px rgba(244, 63, 94, 0.06)' : 'none'
                  }}
                >
                  {/* Job Header & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{posting.title}</h4>
                        {isRejected ? (
                          <span
                            className="glass-pill badge-rose"
                            style={{
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(244, 63, 94, 0.2)',
                              border: '1px solid #f43f5e',
                              color: '#fda4af'
                            }}
                          >
                            <XCircle size={12} color="#f43f5e" /> Deselected / Rejected
                          </span>
                        ) : isShortlisted ? (
                          <span
                            className="glass-pill badge-emerald"
                            style={{
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle2 size={12} /> Shortlisted
                          </span>
                        ) : (
                          <span className="glass-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                            Applied (Under Review)
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <span>🏢 <strong>{posting.company}</strong></span>
                        <span>📍 {posting.location}</span>
                        <span style={{ color: '#fbbf24' }}>💰 {posting.stipend}</span>
                        <span>📅 Applied: {app.appliedAt || '2026-09-16'}</span>
                      </div>
                    </div>

                    {app.matchScore && (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Algorithm Match:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: app.matchScore >= 70 ? '#10b981' : app.matchScore >= 50 ? '#f59e0b' : '#f43f5e' }}>
                          {app.matchScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recruiter Diagnostic Feedback Reason */}
                  {isRejected && (
                    <div style={{
                      background: 'rgba(244, 63, 94, 0.09)',
                      border: '1px solid rgba(244, 63, 94, 0.35)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <AlertTriangle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 'bold', color: '#fda4af' }}>
                          RECRUITER DESELECTION DIAGNOSTIC REASON:
                        </div>
                        <div style={{ fontSize: '0.86rem', color: '#ffffff', marginTop: '4px', fontStyle: 'italic' }}>
                          "{app.rejectionReason || "Position filled by higher-scoring verified candidate."}"
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
                          Decision Date: {app.decisionDate || app.appliedAt || 'Recent'} • Logged via Recruiter Talent Portal
                        </div>
                      </div>
                    </div>
                  )}

                  {/* What Was He Lacking? - Deficit Skill Analysis */}
                  {isRejected && (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.84rem',
                        fontWeight: 'bold',
                        color: 'var(--text-secondary)',
                        marginBottom: '8px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookOpen size={15} color="#fbbf24" /> WHAT WAS THE STUDENT LACKING? (SKILL DEFICITS)
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#f43f5e' }}>
                          {gaps.length} Deficient Skill(s) Identified
                        </span>
                      </div>

                      {gaps.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                          Candidate met minimum baseline requirements. Deselection was driven by competitive candidate ranking or external quota.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {gaps.map((gap, gIdx) => {
                            const isAssigned = assignedModules[`${idx}-${gap.skillName}`];

                            return (
                              <div
                                key={gIdx}
                                style={{
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '10px 14px',
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '12px'
                                }}
                              >
                                <div style={{ flex: 1, minWidth: '220px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{gap.skillName}</strong>
                                    <span
                                      className={`glass-pill ${gap.importance === 'must-have' ? 'badge-rose' : 'badge-amber'}`}
                                      style={{ fontSize: '0.68rem' }}
                                    >
                                      {gap.importance === 'must-have' ? 'Mandatory Prerequisite' : 'Preferred'}
                                    </span>
                                    <span className="glass-pill" style={{ fontSize: '0.68rem' }}>
                                      {gap.category}
                                    </span>
                                  </div>

                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    Required: <strong style={{ color: '#fbbf24' }}>Level {gap.requiredLevel}/5</strong> • Candidate: <strong style={{ color: gap.studentLevel > 0 ? '#38bdf8' : '#f43f5e' }}>Level {gap.studentLevel}/5</strong> (Deficit: -{gap.gapSize} Levels)
                                  </div>

                                  {gap.resources && gap.resources[0] && (
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                      Prescribed Resource: <span style={{ color: '#34d399' }}>{gap.resources[0].title}</span> ({gap.resources[0].provider})
                                    </div>
                                  )}
                                </div>

                                {/* SPOC Action on this gap */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {isAssigned ? (
                                    <span style={{ fontSize: '0.76rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px' }}>
                                      <CheckCircle2 size={13} /> Bridge Prescribed
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleAssignModule(idx, gap.skillName)}
                                      className="btn btn-secondary"
                                      style={{ fontSize: '0.75rem', padding: '5px 12px', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399' }}
                                      title="Prescribe this bridge course into student learning dashboard"
                                    >
                                      + Prescribe Bridge Course
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* College SPOC Corrective Interventions Footer */}
                  {isRejected && (
                    <div style={{
                      marginTop: '6px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Institutional Faculty Intervention (PRD §10.3 & §14):
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {scheduledLabs[idx] ? (
                          <span style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                            <CheckCircle2 size={14} /> Remedial Lab Booked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleScheduleLab(idx, posting.title)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                          >
                            <Calendar size={14} /> Schedule Faculty Remedial Lab
                          </button>
                        )}

                        {onOpenEndorse && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenEndorse(student);
                            }}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                          >
                            <Award size={14} color="#fbbf24" /> Endorse Verified Skills
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
            Close Audit
          </button>
        </div>
      </div>
    </Modal>
  );
}
