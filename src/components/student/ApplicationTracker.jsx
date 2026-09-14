import React from 'react';
import { useData } from '../../context/DataContext';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Building,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function ApplicationTracker({ onSelectOpportunity }) {
  const { activeStudent, postings } = useData();

  if (!activeStudent) return null;

  const appliedList = activeStudent.appliedPostings || [];

  if (appliedList.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <Clock size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.1rem' }}>No Applications Submitted Yet</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Explore matching postings in the Feed and submit an application with 1 click.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.15rem' }}>Active Application Pipeline</h3>
        <span className="glass-pill badge-emerald">
          {appliedList.length} Active Applications
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {appliedList.map((app) => {
          const post = postings.find(p => p.id === app.postingId);
          const isShortlisted = app.status === 'Shortlisted';
          const isRejected = app.status === 'Rejected';
          const isPending = app.status === 'Applied' || app.status === 'Under Review';

          return (
            <div
              key={app.postingId}
              className="glass-panel"
              style={{
                padding: '18px 22px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                borderLeft: `5px solid ${isShortlisted ? '#10b981' : isRejected ? '#f43f5e' : '#38bdf8'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontSize: '1.05rem' }}>{post?.title || "Clinical Role"}</h4>
                  <span className={`glass-pill ${isShortlisted ? 'badge-emerald' : isRejected ? 'badge-rose' : 'badge-blue'}`}>
                    {app.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>🏢 {post?.company || "Ayush Research Unit"}</span>
                  <span>📅 Applied: {app.appliedAt}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Match: {app.matchScore}%</span>
                </div>

                {/* Structured Rejection Feedback Loop (PRD §10.4 & §14) */}
                {isRejected && app.rejectionReason && (
                  <div style={{
                    marginTop: '10px',
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <AlertCircle size={15} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
                      <strong>Recruiter Feedback Loop:</strong> "{app.rejectionReason}"
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (post && onSelectOpportunity) {
                      onSelectOpportunity(post);
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <ExternalLink size={14} /> View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
