import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import AuthModal from '../auth/AuthModal';
import {
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Layers,
  Sun,
  Moon,
  User
} from 'lucide-react';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    role,
    setRole,
    domainPack,
    setDomainPack,
    theme,
    setTheme,
    addNotification
  } = useApp();

  const { activeStudent, dbStatus, seedDatabaseNow } = useData();

  const handleDomainChange = (newPack) => {
    setDomainPack(newPack);
    addNotification(
      `Domain Pack Switched to ${newPack.toUpperCase()}`,
      newPack === 'ayush'
        ? "Flagship AYUSH Domain active: All BAMS/AIIA clinical skills & pharmaceutical standards loaded."
        : "Tech Domain active: Demonstrating domain-agnostic matching engine scalability.",
      newPack === 'ayush' ? 'emerald' : 'blue'
    );
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--bg-glass-border)',
      background: 'rgba(7, 12, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Ministry Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #064e3b 0%, #0f172a 50%, #78350f 100%)',
        padding: '5px 24px',
        fontSize: '0.74rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🇮🇳</span>
          <span style={{ fontWeight: '700', letterSpacing: '0.04em' }}>
            SMART INDIA HACKATHON 2026 • PS SIH26044
          </span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span style={{ color: '#34d399' }}>Ministry of Ayush & All India Institute of Ayurveda (AIIA)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* CONDITIONAL SEEDER: ONLY SHOWS WHEN WE DON'T HAVE DATA */}
          {!dbStatus?.hasData && (
            <button
              onClick={seedDatabaseNow}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '0.68rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.35)',
                animation: 'pulse 2s infinite'
              }}
              title="Zero-data detected in backend. Click to seed initial AYUSH & Tech baseline records."
            >
              🌱 Seed Database
            </button>
          )}

          {dbStatus?.hasData && (
            <span style={{ fontSize: '0.68rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Live Database Ready
            </span>
          )}

          <span className="mono" style={{ fontSize: '0.7rem', color: '#fbbf24' }}>
            DPI: APAAR & DigiLocker Connected
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="app-container" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            border: '1px solid rgba(52, 211, 153, 0.5)'
          }}>
            🌿
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1 }}>
                Kaushal<span style={{ color: '#10b981' }}>Setu</span>
              </h1>
              <span className="glass-pill badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                v1.0 MVP
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Skill Intelligence & Academia–Industry Bridge
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Crucial for SIH Evaluators) */}
        <nav aria-label="Role Navigation" style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '4px'
        }}>
          <button
            onClick={() => setRole('student')}
            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <GraduationCap size={15} /> Student ({activeStudent?.name.split(' ')[0]})
          </button>

          <button
            onClick={() => setRole('spoc')}
            className={`btn ${role === 'spoc' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <Building2 size={15} /> Academia SPOC
          </button>

          <button
            onClick={() => setRole('recruiter')}
            className={`btn ${role === 'recruiter' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <Briefcase size={15} /> Industry / HR
          </button>

          <button
            onClick={() => setRole('ministry')}
            className={`btn ${role === 'ministry' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <ShieldCheck size={15} /> Ministry Admin
          </button>
        </nav>

        {/* Right Controls: Domain Switcher & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Domain Pack Switcher (AYUSH vs Tech) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '3px'
          }}>
            <button
              onClick={() => handleDomainChange('ayush')}
              style={{
                border: 'none',
                background: domainPack === 'ayush' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: domainPack === 'ayush' ? '#34d399' : 'var(--text-muted)',
                fontWeight: domainPack === 'ayush' ? 'bold' : 'normal',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
              title="Flagship AYUSH Domain Pack (Ministry of Ayush / AIIA)"
            >
              🌿 AYUSH
            </button>
            <button
              onClick={() => handleDomainChange('tech')}
              style={{
                border: 'none',
                background: domainPack === 'tech' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: domainPack === 'tech' ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: domainPack === 'tech' ? 'bold' : 'normal',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
              title="Tech Domain Pack"
            >
              💻 Tech
            </button>
          </div>

          {/* User Profile & Auth Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Switch User Identity or Authenticate"
          >
            <User size={13} color="#10b981" />
            <span style={{ textTransform: 'capitalize' }}>{role} Access</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary"
            style={{ padding: '6px 8px', borderRadius: '8px', minWidth: '32px', minHeight: '32px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
