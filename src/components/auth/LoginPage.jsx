import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import {
  Lock,
  Mail,
  KeyRound,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Layers,
  Award
} from 'lucide-react';

const rolesList = [
  {
    id: 'student',
    title: 'Student Portal',
    subtitle: 'Employability Index, Assessment & Placement',
    icon: GraduationCap,
    badge: 'BAMS & Tech Cohorts',
    color: '#10b981'
  },
  {
    id: 'recruiter',
    title: 'HR / Recruiter',
    subtitle: 'Post Jobs, Shortlist Candidates & Close Openings',
    icon: Briefcase,
    badge: 'Industry Talent Gateway',
    color: '#fbbf24'
  },
  {
    id: 'spoc',
    title: 'Faculty SPOC',
    subtitle: 'Endorse Skills, FDPs & Curriculum Radar',
    icon: Building2,
    badge: 'AIIA & Academic Heads',
    color: '#38bdf8'
  },
  {
    id: 'ministry',
    title: 'Admin / Ministry',
    subtitle: 'National Analytics & Apex Council Oversight',
    icon: ShieldCheck,
    badge: 'National Skill Directorate',
    color: '#a855f7'
  }
];

export default function LoginPage() {
  const { login, domainPack, setDomainPack, addNotification } = useApp();
  const { dbStatus } = useData();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('shiv@123');
  const [password, setPassword] = useState('123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email/ID and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(email, password, selectedRole);
      if (!res.success) {
        setErrorMessage(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = (roleId, presetEmail, presetPass) => {
    setSelectedRole(roleId);
    setEmail(presetEmail);
    setPassword(presetPass);
    login(presetEmail, presetPass, roleId);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at top, #0c201d 0%, #070c0e 60%, #030708 100%)',
      color: '#f8fafc'
    }}>
      {/* Top Apex Ministry Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #064e3b 0%, #0f172a 50%, #78350f 100%)',
        padding: '8px 24px',
        fontSize: '0.78rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#e2e8f0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🇮🇳</span>
          <strong style={{ letterSpacing: '0.04em' }}>SMART INDIA HACKATHON 2026 • PS SIH26044</strong>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ color: '#34d399' }}>Ministry of Ayush & All India Institute of Ayurveda (AIIA)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={12} /> Live MongoDB Storage Ready
          </span>
          <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>
            DPI: APAAR & DigiLocker
          </span>
        </div>
      </div>

      {/* Main Login Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '920px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
          overflow: 'hidden'
        }}>
          {/* Header Banner Inside Card */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                border: '1px solid rgba(52, 211, 153, 0.5)'
              }}>
                🌿
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                  Kaushal<span style={{ color: '#10b981' }}>Setu</span>
                </h1>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Unified Academia–Industry Collaboration & Skill Intelligence Portal
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDomainPack(domainPack === 'ayush' ? 'tech' : 'ayush')}
                className="glass-pill"
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                Domain: <strong style={{ color: domainPack === 'ayush' ? '#34d399' : '#38bdf8' }}>{domainPack.toUpperCase()}</strong>
              </button>
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Step 1: Select Stakeholder Role */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#cbd5e1',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                1. Select Login Role & Workspace
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '12px'
              }}>
                {rolesList.map((r) => {
                  const isSelected = selectedRole === r.id;
                  const Icon = r.icon;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      style={{
                        textAlign: 'left',
                        padding: '14px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? `2px solid ${r.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? `0 0 16px ${r.color}30` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: `${r.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={18} color={r.color} />
                        </div>
                        {isSelected && <CheckCircle2 size={16} color={r.color} />}
                      </div>

                      <div>
                        <strong style={{ fontSize: '0.88rem', color: isSelected ? '#ffffff' : '#e2e8f0', display: 'block' }}>
                          {r.title}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '2px', lineHeight: 1.3 }}>
                          {r.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Input Credentials */}
            <form onSubmit={handleSubmit} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  2. Authenticate with Credentials
                </span>
                <span className="glass-pill badge-emerald" style={{ fontSize: '0.7rem' }}>
                  Default: shiv@123 / 123
                </span>
              </div>

              {errorMessage && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#fecdd3',
                  fontSize: '0.8rem',
                  marginBottom: '14px'
                }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                    User Email / Institutional ID
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. shiv@123"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                    Password / Access Key
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="e.g. 123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to {rolesList.find(r => r.id === selectedRole)?.title}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Step 3: Quick Evaluation 1-Click Buttons */}
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Instant Evaluator Presets (Pre-configured SIH Test Accounts)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('student', 'shiv@123', '123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                >
                  🎓 Shiv (Student)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('recruiter', 'hr@123', '123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                >
                  🏢 HR Recruiter (Dabur)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('spoc', 'spoc@123', '123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                >
                  🏛️ Faculty SPOC (AIIA)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('ministry', 'admin@123', '123')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                >
                  🛡️ Ministry Apex Council
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
