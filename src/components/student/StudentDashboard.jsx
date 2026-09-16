import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import OpportunityDetailModal from './OpportunityDetailModal';
import ProfileEditor from './ProfileEditor';
import ApplicationTracker from './ApplicationTracker';
import {
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight,
  Filter,
  Send,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentDashboard({ onOpenAssessment, onOpenInternship }) {
  const { activeStudent, studentMatches, postings, applyToPosting, directives } = useData();
  const { domainPack } = useApp();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'applications', 'profile'
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!activeStudent) return null;

  // Average match score
  const avgMatch = studentMatches.length > 0
    ? Math.round(studentMatches.reduce((acc, m) => acc + m.matchResult.matchPercent, 0) / studentMatches.length)
    : 0;

  // Filtered matches
  const filteredMatches = studentMatches.filter(m => {
    return (
      m.posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.posting.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.posting.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Top 3 priority gaps across all opportunities
  const allGaps = [];
  studentMatches.forEach(m => {
    (m.gaps || []).forEach(g => {
      if (!allGaps.some(existing => existing.skillId === g.skillId)) {
        allGaps.push(g);
      }
    });
  });
  const top3Gaps = allGaps.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Quick Action Navigation */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          <Sparkles size={16} color="#10b981" />
          <span>Calibrate your verified employability score or submit weekly internship milestones:</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {onOpenAssessment && (
            <button
              onClick={onOpenAssessment}
              className="btn btn-primary"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              📝 Take Skill Assessment
            </button>
          )}
          {onOpenInternship && (
            <button
              onClick={onOpenInternship}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              🕒 Active Internship Log
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-metrics">
        <MetricCard
          title="Employability Index"
          value={`${avgMatch}%`}
          subtitle={`Calibrated across ${studentMatches.length} active opportunities`}
          icon={TrendingUp}
          trend="+12% this month"
          color="emerald"
        />
        <MetricCard
          title="Verified Competencies"
          value={`${(activeStudent.skills || []).filter(s => s.verified).length} / ${(activeStudent.skills || []).length}`}
          subtitle="Endorsed by AIIA faculty & clinical logs"
          icon={Award}
          color="blue"
        />
        <MetricCard
          title="Verification Confidence"
          value={`${Math.round((activeStudent.verificationConfidence || 0.6) * 100)}%`}
          subtitle="DPI APAAR ID & DigiLocker verified"
          icon={CheckCircle2}
          color="amber"
        />
        <MetricCard
          title="Applications in Pipeline"
          value={(activeStudent.appliedPostings || []).length}
          subtitle="1-click submission with explainable logs"
          icon={Briefcase}
          color="emerald"
        />
      </div>

      {/* Top 3 Gap Closing Action Banner (PRD §10.2) */}
      {top3Gaps.length > 0 && (
        <div className="glass-panel" style={{ padding: '18px 24px', borderLeft: '5px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="#f59e0b" />
              <h4 style={{ fontSize: '0.98rem' }}>
                Top High-Leverage Actions to Maximize Your Placement Readiness
              </h4>
            </div>
            <span className="glass-pill badge-amber">
              Prescriptive Recommendations
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {top3Gaps.map((gap) => {
              const isDirectiveSkill = (directives || []).some(d =>
                (!d.domainPack || d.domainPack === domainPack) &&
                ((d.title || '').toLowerCase().includes((gap.skillName || '').toLowerCase()) ||
                 (gap.skillName || '').toLowerCase().includes((d.title || '').toLowerCase()) ||
                 (d.skillsImpacted || []).some(s => s.toLowerCase().includes((gap.skillName || '').toLowerCase())))
              );
              return (
                <div
                  key={gap.skillId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: isDirectiveSkill ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{gap.skillName}</div>
                    {isDirectiveSkill && (
                      <span className="glass-pill badge-emerald" style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.2)' }}>
                        👑 Ministry Priority
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Required in {gap.importance === 'must-have' ? 'Mandatory' : 'Optional'} role postings
                  </div>
                  {gap.resources?.[0] && (
                    <a
                      href={gap.resources[0].url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#34d399',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginTop: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      📖 {gap.resources[0].title.slice(0, 32)}...
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Sub-tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('feed')}
            className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <Briefcase size={15} /> Opportunity Feed ({filteredMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <Layers size={15} /> My Applications ({(activeStudent.appliedPostings || []).length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <Sparkles size={15} /> Skills & Verification
          </button>
        </div>

        {activeTab === 'feed' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search by role, company, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '6px 14px',
                fontSize: '0.8rem',
                minWidth: '240px'
              }}
            />
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredMatches.map(({ posting, matchResult, gaps }) => {
            const appRecord = (activeStudent.appliedPostings || []).find(a => a.postingId === posting.id);
            const isApplied = Boolean(appRecord);
            const appStatus = appRecord?.status;
            const scoreColor = matchResult.matchPercent >= 80 ? '#10b981' : matchResult.matchPercent >= 60 ? '#f59e0b' : '#f43f5e';

            return (
              <div
                key={posting.id}
                className="glass-panel"
                style={{
                  padding: '22px 26px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  borderLeft: `5px solid ${appStatus === 'Rejected' ? '#f43f5e' : appStatus === 'Shortlisted' ? '#10b981' : scoreColor}`
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{posting.title}</h3>
                    {posting.isClosed && (
                      <span className="glass-pill badge-rose" style={{ fontSize: '0.68rem' }}>
                        Closed
                      </span>
                    )}
                    {appStatus === 'Rejected' ? (
                      <span
                        className="glass-pill badge-rose"
                        style={{
                          fontSize: '0.68rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(244, 63, 94, 0.2)',
                          border: '1px solid #f43f5e',
                          color: '#fda4af'
                        }}
                      >
                        <XCircle size={11} color="#f43f5e" /> Application Rejected
                      </span>
                    ) : appStatus === 'Shortlisted' ? (
                      <span
                        className="glass-pill badge-emerald"
                        style={{
                          fontSize: '0.68rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid #10b981'
                        }}
                      >
                        <CheckCircle2 size={11} /> Shortlisted
                      </span>
                    ) : isApplied ? (
                      <span className="glass-pill badge-blue" style={{ fontSize: '0.68rem' }}>
                        Applied
                      </span>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span>🏢 {posting.company}</span>
                    <span>📍 {posting.location}</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>💰 {posting.stipend}</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '720px' }}>
                    {posting.description}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {posting.requiredSkills?.map((req, i) => (
                      <span
                        key={i}
                        className={`glass-pill ${req.importance === 'must-have' ? 'badge-emerald' : ''}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {req.name.split(' ')[0]} ({req.importance})
                      </span>
                    ))}
                  </div>

                  {/* On-Card Recruiter Diagnostic Callout when Rejected */}
                  {appStatus === 'Rejected' && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      background: 'rgba(244, 63, 94, 0.08)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}>
                      <AlertCircle size={16} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                        <strong>Recruiter Diagnostic Feedback:</strong> "{appRecord.rejectionReason || 'Position filled by higher-scoring verified candidate.'}"
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Diagnostic logged into your placement gap analysis. Check prescriptive courses to raise your readiness.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Score Ring & Action Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div className="score-ring-wrap" style={{ width: '68px', height: '68px' }}>
                    <svg width="68" height="68" viewBox="0 0 68 68">
                      <circle cx="34" cy="34" r="27" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
                      <circle
                        cx="34"
                        cy="34"
                        r="27"
                        stroke={scoreColor}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 27}
                        strokeDashoffset={2 * Math.PI * 27 * (1 - matchResult.matchPercent / 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 34 34)"
                      />
                    </svg>
                    <div className="score-text">
                      <span style={{ fontSize: '1rem', fontWeight: '800', color: scoreColor }}>
                        {matchResult.matchPercent}%
                      </span>
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Match
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {posting.isClosed ? (
                      <button
                        disabled
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '8px 16px', opacity: 0.6, cursor: 'not-allowed' }}
                      >
                        🔒 Applications Closed
                      </button>
                    ) : appStatus === 'Rejected' ? (
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="btn btn-secondary"
                        style={{
                          fontSize: '0.8rem',
                          padding: '8px 14px',
                          borderColor: 'rgba(244, 63, 94, 0.5)',
                          background: 'rgba(244, 63, 94, 0.12)',
                          color: '#fda4af',
                          cursor: 'pointer'
                        }}
                        title="View recruiter feedback loop in My Applications"
                      >
                        <XCircle size={14} color="#f43f5e" /> Rejected • View Feedback
                      </button>
                    ) : appStatus === 'Shortlisted' ? (
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.8rem',
                          padding: '8px 14px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          borderColor: '#10b981',
                          color: '#6ee7b7'
                        }}
                      >
                        <CheckCircle2 size={14} color="#10b981" /> Shortlisted for Interview
                      </button>
                    ) : isApplied ? (
                      <button
                        disabled
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '8px 16px', opacity: 0.85, cursor: 'default' }}
                      >
                        <CheckCircle2 size={14} color="#38bdf8" /> Registered / Applied
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          applyToPosting(posting.id);
                          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                      >
                        <Send size={13} /> Quick Register
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedMatch({ posting, matchResult, gaps })}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '7px 14px' }}
                    >
                      View Diagnostic <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'applications' && (
        <ApplicationTracker
          onSelectOpportunity={(post) => {
            const found = studentMatches.find(m => m.posting.id === post.id);
            if (found) setSelectedMatch(found);
          }}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileEditor />
      )}

      {/* Modal for Deep Diagnostic & Gap Breakdown */}
      <OpportunityDetailModal
        isOpen={Boolean(selectedMatch)}
        onClose={() => setSelectedMatch(null)}
        selectedMatch={selectedMatch}
      />
    </div>
  );
}
