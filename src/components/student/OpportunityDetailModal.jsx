import React from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  BookOpen,
  Send,
  Building,
  MapPin,
  Banknote,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OpportunityDetailModal({ isOpen, onClose, selectedMatch }) {
  const { applyToPosting, activeStudent } = useData();
  const { domainPack } = useApp();

  if (!selectedMatch) return null;

  const { posting, matchResult, gaps } = selectedMatch;
  const { matchPercent, formulaBreakdown, weights, skillBreakdown } = matchResult;

  const isApplied = (activeStudent?.appliedPostings || []).some(a => a.postingId === posting.id);

  const handleApply = () => {
    applyToPosting(posting.id);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={posting.title}
      subtitle={`${posting.company} • ${posting.location}`}
      maxWidth="900px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Posting Header Specs */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Building size={16} color="#10b981" />
              <span>{posting.sector}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <MapPin size={16} color="#38bdf8" />
              <span>{posting.mode} ({posting.location})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#fbbf24' }}>
              <Banknote size={16} />
              <span>{posting.stipend}</span>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`btn ${isApplied ? 'btn-secondary' : 'btn-primary'}`}
            style={{ minWidth: '140px' }}
          >
            {isApplied ? <CheckCircle2 size={16} /> : <Send size={16} />}
            {isApplied ? 'Already Applied' : 'Submit Application'}
          </button>
        </div>

        {/* Explainable Match Diagnostic Card (PRD §11 Core IP) */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: `6px solid ${getScoreColor(matchPercent)}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
            <div>
              <span className="glass-pill badge-emerald" style={{ marginBottom: '8px' }}>
                PRD §11 Explainable Match Score
              </span>
              <h3 style={{ fontSize: '1.4rem' }}>
                Your Match Rating: <span style={{ color: getScoreColor(matchPercent) }}>{matchPercent}%</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Deterministic formula derived from required clinical skills, hands-on projects, eligibility criteria, and faculty verification.
              </p>
            </div>

            {/* Circular Visual Ring */}
            <div className="score-ring-wrap" style={{ width: '84px', height: '84px' }}>
              <svg width="84" height="84" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="34" stroke="rgba(255,255,255,0.08)" strokeWidth="7" fill="none" />
                <circle
                  cx="42"
                  cy="42"
                  r="34"
                  stroke={getScoreColor(matchPercent)}
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - matchPercent / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 42 42)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="score-text">
                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{matchPercent}%</span>
              </div>
            </div>
          </div>

          {/* Formula Breakdown 4 Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Skill Score ({weights.w1}%)</span>
                <strong style={{ color: '#34d399' }}>{matchResult.skillScore}%</strong>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${matchResult.skillScore}%`, background: '#10b981' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Project Fit ({weights.w2}%)</span>
                <strong style={{ color: '#38bdf8' }}>{matchResult.projectScore}%</strong>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${matchResult.projectScore}%`, background: '#38bdf8' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Eligibility ({weights.w3}%)</span>
                <strong style={{ color: '#fbbf24' }}>{matchResult.eligibilityScore}%</strong>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${matchResult.eligibilityScore}%`, background: '#f59e0b' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Verification ({weights.w4}%)</span>
                <strong style={{ color: '#c084fc' }}>{matchResult.verificationScore}%</strong>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${matchResult.verificationScore}%`, background: '#c084fc' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Skill by Skill Breakdown Matrix */}
        <div>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
            Role Requirements vs. Your Profile
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {skillBreakdown.map(sb => {
              const isMet = sb.studentLevel >= sb.requiredLevel;
              const isPartial = sb.studentLevel > 0 && sb.studentLevel < sb.requiredLevel;

              return (
                <div
                  key={sb.skillId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px' }}>
                    {isMet ? (
                      <CheckCircle2 size={18} color="#10b981" />
                    ) : isPartial ? (
                      <AlertTriangle size={18} color="#f59e0b" />
                    ) : (
                      <XCircle size={18} color="#f43f5e" />
                    )}
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{sb.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {sb.importance === 'must-have' ? '🔴 Must-Have Requirement' : '⚪ Nice-to-Have'}
                        {sb.isVerified && ' • 🏅 Faculty Endorsed'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Target: <strong>Level {sb.requiredLevel}/5</strong>
                    </div>
                    <div style={{ fontSize: '0.78rem' }}>
                      Your Level: <strong style={{ color: isMet ? '#34d399' : '#fbbf24' }}>Level {sb.studentLevel}/5</strong>
                    </div>
                    <span className={`glass-pill ${isMet ? 'badge-emerald' : isPartial ? 'badge-amber' : 'badge-rose'}`} style={{ fontSize: '0.7rem' }}>
                      {sb.matchType === 'exact_full' ? 'Met (100%)' : sb.matchType === 'exact_partial' ? 'Partial' : 'Skill Gap'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prescriptive Gap Closure Recommendations (PRD §11.3 & §11.4) */}
        {gaps.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={18} color="#f59e0b" />
              <h4 style={{ fontSize: '1.05rem' }}>
                Prescriptive Action Plan to Bridge Gaps
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {gaps.map(gap => (
                <div
                  key={gap.skillId}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    borderLeft: `4px solid ${gap.importance === 'must-have' ? '#f43f5e' : '#f59e0b'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h5 style={{ fontSize: '0.94rem' }}>{gap.skillName}</h5>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Gap Size: {gap.gapSize} Level(s) • Priority Score: {gap.priorityScore}
                      </p>
                    </div>
                    <span className={`glass-pill ${gap.importance === 'must-have' ? 'badge-rose' : 'badge-amber'}`}>
                      {gap.importance.toUpperCase()}
                    </span>
                  </div>

                  {/* Learning Modules Curated from SWAYAM/CCRAS */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      CURATED LEARNING PATHWAY:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {gap.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            color: 'inherit',
                            fontSize: '0.8rem',
                            border: '1px solid var(--border-subtle)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981' }}>📚</span>
                            <span style={{ fontWeight: '600' }}>{res.title}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({res.provider})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
                            <span>{res.estMinutes} mins</span>
                            <ExternalLink size={13} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Hands-on Project Blueprint */}
                  {gap.projectIdea && (
                    <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.05)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 'bold', color: '#34d399', marginBottom: '2px' }}>
                        💡 RECOMMENDED HANDS-ON DEMO PROJECT:
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {gap.projectIdea}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
