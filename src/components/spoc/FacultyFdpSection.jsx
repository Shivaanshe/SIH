import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  Building,
  Award,
  Calendar,
  CheckCircle,
  ExternalLink,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FacultyFdpSection() {
  const { domainPack, addNotification } = useApp();
  const { fdpPrograms, applyToFdp } = useData();

  const [selectedType, setSelectedType] = useState('all');
  const [appliedFdpIds, setAppliedFdpIds] = useState(new Set());

  // Filter programs for domain
  const domainFdps = (fdpPrograms || []).filter(item => item.domainPack === domainPack);

  const filteredFdps = selectedType === 'all'
    ? domainFdps
    : domainFdps.filter(f => f.type.toLowerCase().includes(selectedType.toLowerCase()));

  const handleApply = (fdp) => {
    setAppliedFdpIds(prev => new Set(prev).add(fdp.id));
    if (applyToFdp) {
      applyToFdp(fdp.id);
    }
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    addNotification(
      "Faculty Application Submitted",
      `Successfully registered for ${fdp.title}. Institutional sponsorship confirmed.`,
      "emerald"
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.45) 0%, rgba(15, 23, 42, 0.75) 100%)',
        borderLeft: '5px solid #10b981'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>👨‍🏫</span>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Academician & Faculty Industry Exposure Portal
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Faculty Development Programs (FDPs), Industrial Sabbaticals, and Collaborative Corporate Consultancy.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="glass-pill badge-emerald" style={{ fontSize: '0.74rem' }}>
              ● 100% Ministry Sponsored Grant
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Faculty Opportunities' },
          { id: 'fdp', label: 'Faculty Development Programs (FDPs)' },
          { id: 'residency', label: 'Industrial Sabbaticals' },
          { id: 'consultancy', label: 'Corporate Consultancy & R&D' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`btn ${selectedType === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FDP Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filteredFdps.map(fdp => {
          const isApplied = appliedFdpIds.has(fdp.id);

          return (
            <div key={fdp.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="glass-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                    {fdp.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {fdp.mode}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '6px' }}>
                  {fdp.title}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} /> {fdp.host}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {fdp.description}
                </p>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.76rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                    <strong style={{ color: '#e2e8f0' }}>{fdp.duration}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Honorarium / Grant:</span>
                    <strong style={{ color: '#34d399' }}>{fdp.stipendGrant}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Eligibility:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{fdp.eligibility}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {fdp.applicantsCount + (isApplied ? 1 : 0)} Faculty Applied
                </span>

                <button
                  onClick={() => handleApply(fdp)}
                  disabled={isApplied}
                  className={`btn ${isApplied ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle size={14} color="#10b981" /> Application Sent
                    </>
                  ) : (
                    <>
                      <Briefcase size={14} /> Apply as Faculty
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
