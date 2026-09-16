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
  Award,
  User,
  UserPlus,
  LogIn,
  RotateCcw
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
  const { login, register, domainPack, setDomainPack, addNotification } = useApp();
  const { dbStatus } = useData();

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = useState('student');

  // Sign In credentials
  const [email, setEmail] = useState('shiv@123');
  const [password, setPassword] = useState('123');

  // Sign Up fields (valid name, email, pass only)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Clear fields helper
  const handleClearSignup = () => {
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setErrorMessage('');
  };

  const handleClearLogin = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = (email || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage('Please enter both user email/ID and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(cleanEmail, cleanPass, selectedRole);
      if (!res.success) {
        setErrorMessage(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    if (e) e.preventDefault();

    // Strict client-side clearing & validation (name, email, pass only)
    const cleanName = (signupName || '').trim();
    const cleanEmail = (signupEmail || '').trim().toLowerCase();
    const cleanPass = (signupPassword || '').trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter a valid full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address format (e.g. student@domain.com).');
      return;
    }

    if (!cleanPass || cleanPass.length < 3) {
      setErrorMessage('Password must be at least 3 characters long.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await register({
        name: cleanName,
        email: cleanEmail,
        password: cleanPass,
        role: selectedRole,
        domainPack
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed. Please check inputs.');
      } else {
        // Clear signup fields on success
        handleClearSignup();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = (roleId, presetEmail, presetPass) => {
    setAuthMode('login');
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

            {/* Step 2: Auth Mode Selector & Credentials Form */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              {/* Tab Selector: Sign In vs Sign Up */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '14px',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                    className={`btn ${authMode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.82rem', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <LogIn size={15} /> Sign In to Existing Account
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
                    className={`btn ${authMode === 'signup' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.82rem', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <UserPlus size={15} /> Create New Account (Sign Up)
                  </button>
                </div>

                {authMode === 'login' ? (
                  <span className="glass-pill badge-emerald" style={{ fontSize: '0.7rem' }}>
                    Default: shiv@123 / 123
                  </span>
                ) : (
                  <span className="glass-pill badge-blue" style={{ fontSize: '0.7rem' }}>
                    Valid Name, Email & Pass Only • MongoDB
                  </span>
                )}
              </div>

              {errorMessage && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#fecdd3',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form 1: Sign In Mode */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit}>
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

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
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
                        <span>Authenticating with MongoDB...</span>
                      ) : (
                        <>
                          <span>Sign In to {rolesList.find(r => r.id === selectedRole)?.title}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearLogin}
                      className="btn btn-secondary"
                      style={{ padding: '12px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      title="Clear Email and Password fields"
                    >
                      <RotateCcw size={14} /> Clear
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.78rem', color: '#94a3b8' }}>
                    New to KaushalSetu?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
                      style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Create an account now
                    </button>
                  </div>
                </form>
              )}

              {/* Form 2: Sign Up / Register Mode (Name, Email, Password Only) */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignupSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                        Full Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="e.g. Shivaansh Tiwari"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
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
                          autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="email"
                          placeholder="e.g. shivaansh@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
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
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          placeholder="Min 3 characters..."
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
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

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
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
                        <span>Validating & Storing in MongoDB...</span>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          <span>Register & Enter {rolesList.find(r => r.id === selectedRole)?.title}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSignup}
                      className="btn btn-secondary"
                      style={{ padding: '12px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      title="Clear all fields"
                    >
                      <RotateCcw size={14} /> Clear Fields
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <div>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                        style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Sign In here
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

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
