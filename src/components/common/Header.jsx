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
  User,
  LogOut
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
    addNotification,
    currentUser,
    logout
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

        {/* Center: Authorized Role Workspace Indicator (Strict RBAC Enforced) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(currentUser?.role || role) === 'student' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 16px',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.15)'
            }}>
              <GraduationCap size={16} color="#10b981" />
              <span style={{ fontSize: '0.82rem', color: '#f1f5f9' }}>
                Student Workspace: <strong style={{ color: '#34d399' }}>{activeStudent?.name || currentUser?.name || 'Student'}</strong>
              </span>
              <span className="glass-pill badge-emerald" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
                Verified Student
              </span>
            </div>
          )}

          {(currentUser?.role || role) === 'recruiter' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 16px',
              boxShadow: '0 0 14px rgba(251, 191, 36, 0.15)'
            }}>
              <Briefcase size={16} color="#fbbf24" />
              <span style={{ fontSize: '0.82rem', color: '#f1f5f9' }}>
                Industry / HR Recruiter Portal: <strong style={{ color: '#fbbf24' }}>{currentUser?.name || "Dabur Talent Acquisition"}</strong>
              </span>
              <span className="glass-pill badge-amber" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
                Hiring Partner
              </span>
            </div>
          )}

          {(currentUser?.role || role) === 'spoc' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 16px',
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.15)'
            }}>
              <Building2 size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.82rem', color: '#f1f5f9' }}>
                Academia SPOC Command: <strong style={{ color: '#38bdf8' }}>{currentUser?.name || "Dr. Arvind Verma (AIIA)"}</strong>
              </span>
              <span className="glass-pill badge-blue" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
                Faculty Head
              </span>
            </div>
          )}

          {(currentUser?.role || role) === 'ministry' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '6px 16px',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.15)'
            }}>
              <ShieldCheck size={16} color="#a855f7" />
              <span style={{ fontSize: '0.82rem', color: '#f1f5f9' }}>
                Ministry Apex Council: <strong style={{ color: '#c084fc' }}>National Skill Directorate</strong>
              </span>
              <span className="glass-pill badge-purple" style={{ fontSize: '0.66rem', padding: '2px 8px' }}>
                Apex Oversight
              </span>
            </div>
          )}
        </div>

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Switch User Identity or Role"
            >
              <User size={13} color="#10b981" />
              <span style={{ textTransform: 'capitalize' }}>{currentUser?.email || 'shiv@123'} ({role})</span>
            </button>

            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#fca5a5' }}
              title="Sign Out to Login Page"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>

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
