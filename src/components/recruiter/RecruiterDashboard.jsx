import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import CreateJobModal from './CreateJobModal';
import RejectionReasonModal from './RejectionReasonModal';
import { calculateMatchScore } from '../../engine/matchingEngine';
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Award,
  ChevronRight,
  Sparkles,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecruiterDashboard() {
  const { postings, students, updateApplicationStatus, closeJobPosting, deleteJobPosting } = useData();
  const { domainPack } = useApp();

  const [selectedPostingId, setSelectedPostingId] = useState(postings[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [candidateForReject, setCandidateForReject] = useState(null);

  const activePosting = postings.find(p => p.id === selectedPostingId) || postings[0];

  // Candidates who applied to this posting or all domain candidates ranked
  const rankedCandidates = useMemo(() => {
    if (!activePosting) return [];

    const domainStudents = students.filter(s => s.domainPack === domainPack);

    return domainStudents.map(stud => {
      const matchResult = calculateMatchScore(stud, activePosting);
      const appRecord = (stud.appliedPostings || []).find(a => a.postingId === activePosting.id);
      return {
        student: stud,
        matchResult,
        status: appRecord?.status || 'Eligible Pool',
        rejectionReason: appRecord?.rejectionReason
      };
    }).sort((a, b) => b.matchResult.matchPercent - a.matchResult.matchPercent);
  }, [students, activePosting, domainPack]);

  const shortlistedCount = rankedCandidates.filter(c => c.status === 'Shortlisted').length;
  const avgPoolScore = rankedCandidates.length > 0
    ? Math.round(rankedCandidates.reduce((acc, c) => acc + c.matchResult.matchPercent, 0) / rankedCandidates.length)
    : 0;

  const handleShortlist = (studentId) => {
    updateApplicationStatus(studentId, activePosting.id, "Shortlisted");
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Industry Talent Acquisition & Shortlisting Portal</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Hiring Partner: <strong>{activePosting?.company || "Ayush Research Unit"}</strong> • Sector: {activePosting?.sector}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Post New Opportunity
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-metrics">
        <MetricCard
          title="Active Postings"
          value={postings.length}
          subtitle={`Current active listings in ${domainPack.toUpperCase()}`}
          icon={Briefcase}
          color="emerald"
        />
        <MetricCard
          title="Total Evaluated Pool"
          value={rankedCandidates.length}
          subtitle="Ranked by deterministic PRD formula"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Average Match Fit"
          value={`${avgPoolScore}%`}
          subtitle="Cohort alignment to required competencies"
          icon={Sparkles}
          color="amber"
        />
        <MetricCard
          title="Shortlisted Candidates"
          value={shortlistedCount}
          subtitle="Ready for interview & clinical rounds"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid-two-col">
        {/* Left Column: Active Postings Selector */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Your Active Postings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {postings.map(p => {
              const isSelected = p.id === activePosting?.id;
              const isClosed = Boolean(p.isClosed);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPostingId(p.id)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#10b981' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isClosed ? 0.75 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.94rem', color: isSelected ? '#34d399' : '#f1f5f9' }}>{p.title}</h4>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className={`glass-pill ${isClosed ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.66rem' }}>
                        {isClosed ? 'Closed' : 'Active'}
                      </span>
                      <span className="glass-pill" style={{ fontSize: '0.66rem' }}>{p.type.split(' ')[0]}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {p.company} • {p.location}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{p.stipend}</span>
                      <span style={{ color: 'var(--text-muted)' }}>• {p.requiredSkills?.length} Skills</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeJobPosting(p.id);
                      }}
                      className={`btn ${isClosed ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                      title={isClosed ? 'Reopen this posting' : 'Close this posting to new applicants'}
                    >
                      {isClosed ? '🔓 Reopen' : '🔒 Close'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ranked Candidate Funnel (PRD §10.4) */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Ranked Candidate Shortlist</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sorted strictly by explainable competency match score
              </p>
            </div>
            <span className="glass-pill badge-emerald">
              {rankedCandidates.length} Candidates
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {rankedCandidates.map(({ student, matchResult, status, rejectionReason }, rankIdx) => {
              const scoreColor = matchResult.matchPercent >= 80 ? '#10b981' : matchResult.matchPercent >= 60 ? '#f59e0b' : '#f43f5e';
              const isShortlisted = status === 'Shortlisted';
              const isRejected = status === 'Rejected';

              return (
                <div
                  key={student.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isShortlisted ? 'rgba(16, 185, 129, 0.4)' : isRejected ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                        #{rankIdx + 1}
                      </span>
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: `2px solid ${scoreColor}` }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '0.96rem' }}>{student.name}</strong>
                          <span className={`glass-pill ${isShortlisted ? 'badge-emerald' : isRejected ? 'badge-rose' : 'badge-blue'}`} style={{ fontSize: '0.68rem' }}>
                            {status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {student.degree} • CGPA: <strong>{student.cgpa}</strong> • {student.institutionName.split(',')[0]}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: scoreColor }}>
                        {matchResult.matchPercent}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Match Score</div>
                    </div>
                  </div>

                  {/* Skills Snapshot */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {matchResult.skillBreakdown?.map((sb, i) => (
                      <span
                        key={i}
                        className={`glass-pill ${sb.studentLevel >= sb.requiredLevel ? 'badge-emerald' : 'badge-amber'}`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {sb.name.split(' ')[0]}: Lv.{sb.studentLevel}/{sb.requiredLevel}
                      </span>
                    ))}
                  </div>

                  {/* Actions Pipeline */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setCandidateForReject(student)}
                      disabled={isRejected}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                    >
                      <XCircle size={14} color="#f43f5e" /> {isRejected ? 'Rejected' : 'Reject with Feedback'}
                    </button>

                    <button
                      onClick={() => handleShortlist(student.id)}
                      disabled={isShortlisted}
                      className="btn btn-primary"
                      style={{ fontSize: '0.78rem', padding: '5px 14px' }}
                    >
                      <CheckCircle size={14} /> {isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <RejectionReasonModal
        isOpen={Boolean(candidateForReject)}
        onClose={() => setCandidateForReject(null)}
        candidate={candidateForReject}
        postingId={activePosting?.id}
      />
    </div>
  );
}
