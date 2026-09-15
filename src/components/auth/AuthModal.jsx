import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import {
  Lock,
  User,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const demoPersonas = [
  {
    role: 'student',
    name: 'Dr. Aanya Sharma',
    subtitle: 'BAMS Final Year (AIIA New Delhi)',
    email: 'aanya.sharma@aiia.gov.in',
    avatar: 'https://images.unsplash.com/photo-1594824813501-48c9735d491f?w=150&auto=format&fit=crop&q=80',
    icon: GraduationCap,
    color: '#10b981'
  },
  {
    role: 'spoc',
    name: 'Dr. Arvind Verma',
    subtitle: 'Head of Clinical Dept & Faculty SPOC',
    email: 'arvind.verma@aiia.gov.in',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    icon: Building2,
    color: '#38bdf8'
  },
  {
    role: 'recruiter',
    name: 'Dabur Talent Acquisition',
    subtitle: 'Ayurvedic Formulations & Clinical HR',
    email: 'careers@dabur.com',
    avatar: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=100&auto=format&fit=crop&q=80',
    icon: Briefcase,
    color: '#fbbf24'
  },
  {
    role: 'ministry',
    name: 'National Skill Directorate',
    subtitle: 'Ministry of Ayush & AIIA Apex Council',
    email: 'director.skills@ayush.gov.in',
    avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100&auto=format&fit=crop&q=80',
    icon: ShieldCheck,
    color: '#a855f7'
  }
];

export default function AuthModal({ isOpen, onClose }) {
  const { role, setRole, addNotification } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSelectPersona = (p) => {
    setRole(p.role);
    addNotification("Authenticated Successfully", `Signed in as ${p.name} (${p.role.toUpperCase()}).`, "emerald");
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    addNotification("Session Initialized", `Signed in with ${email}.`, "emerald");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={20} color="#10b981" />
          <span>KaushalSetu Identity Gateway & Role Access</span>
        </div>
      }
      maxWidth="680px"
    >
      <div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Select a verified stakeholder persona for 1-click evaluation access, or authenticate with custom credentials.
        </p>

        {/* 1-Click Evaluation Personas Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Instant Evaluation Personas
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {demoPersonas.map((p) => {
              const isActive = role === p.role;
              const Icon = p.icon;

              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  style={{
                    textAlign: 'left',
                    padding: '14px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: isActive ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${p.color}20`,
                    border: `1px solid ${p.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} color={p.color} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '0.86rem', color: '#ffffff' }}>{p.name}</strong>
                      {isActive && <CheckCircle2 size={13} color="#10b981" />}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OR SIGN IN WITH CREDENTIALS</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Institutional Email / APAAR ID
            </label>
            <input
              type="text"
              placeholder="e.g. yourname@aiia.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.84rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Password / Access PIN
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.84rem'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '8px', padding: '10px', fontSize: '0.86rem' }}
          >
            Authenticate & Proceed <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </Modal>
  );
}
