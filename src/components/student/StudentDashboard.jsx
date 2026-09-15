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
  Filter
} from 'lucide-react';

export default function StudentDashboard({ onOpenAssessment, onOpenInternship }) {
  const { activeStudent, studentMatches, postings } = useData();
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
            {top3Gaps.map((gap) => (
              <div
                key={gap.skillId}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{gap.skillName}</div>
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
            ))}
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
            const isApplied = (activeStudent.appliedPostings || []).some(a => a.postingId === posting.id);
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
                  borderLeft: `5px solid ${scoreColor}`
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{posting.title}</h3>
                    {isApplied && (
                      <span className="glass-pill badge-emerald" style={{ fontSize: '0.68rem' }}>
                        Applied
                      </span>
                    )}
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

                  <button
                    onClick={() => setSelectedMatch({ posting, matchResult, gaps })}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '10px 18px' }}
                  >
                    View Diagnostic <ChevronRight size={15} />
                  </button>
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
