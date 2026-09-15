import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { useData } from './context/DataContext';
import Header from './components/common/Header';
import NotificationToast from './components/common/NotificationToast';
import StudentDashboard from './components/student/StudentDashboard';
import SpocDashboard from './components/spoc/SpocDashboard';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import MinistryDashboard from './components/ministry/MinistryDashboard';
import CollaborationHub from './components/collaboration/CollaborationHub';
import LearningProgramsSection from './components/learning/LearningProgramsSection';
import SkillAssessmentModal from './components/student/SkillAssessmentModal';
import InternshipProgressModal from './components/student/InternshipProgressModal';
import LoginPage from './components/auth/LoginPage';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Brain,
  Clock,
  Briefcase,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const { role, domainPack, isAuthenticated } = useApp();
  const { activeStudent, postings } = useData();

  // Navigation tab state: 'dashboard', 'collaboration', 'learning'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);

  // If not logged in, render the dedicated Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <NotificationToast />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="app-container" style={{ flex: 1, paddingTop: '20px' }}>
        {/* Minimal Enterprise Command Header (Zero 3D Overhead) */}
        <section style={{ marginBottom: '22px' }}>
          <div className="glass-panel" style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            borderLeft: '4px solid #10b981'
          }}>
            {/* Context Breadcrumb & Status */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10b981', fontWeight: 700 }}>
                  Portal Workspace
                </span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Active Sector: <strong style={{ color: '#e2e8f0' }}>{domainPack === 'ayush' ? 'Ministry of Ayush / AIIA' : 'Computer Science & IT'}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {role === 'student' && `Student Employability & Skill Intelligence: ${activeStudent?.name}`}
                {role === 'spoc' && "Academia SPOC Command Center & Curriculum Radar"}
                {role === 'recruiter' && "Industry Talent Acquisition & Candidate Match Funnel"}
                {role === 'ministry' && "National Skill Directorate — Apex Institutional Oversight"}
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {role === 'student' && (
                <>
                  <button
                    onClick={() => setIsAssessmentModalOpen(true)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  >
                    <Brain size={14} /> Take Skill Assessment
                  </button>
                  <button
                    onClick={() => setIsInternshipModalOpen(true)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  >
                    <Clock size={14} /> Active Internship Log
                  </button>
                </>
              )}

              {/* Navigation Tabs */}
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                padding: '3px',
                border: '1px solid var(--border-subtle)'
              }}>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    border: 'none',
                    background: activeTab === 'dashboard' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                    color: activeTab === 'dashboard' ? '#34d399' : 'var(--text-muted)',
                    fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <LayoutDashboard size={13} /> Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('collaboration')}
                  style={{
                    border: 'none',
                    background: activeTab === 'collaboration' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                    color: activeTab === 'collaboration' ? '#38bdf8' : 'var(--text-muted)',
                    fontWeight: activeTab === 'collaboration' ? 'bold' : 'normal',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Users size={13} /> Collaboration Hub
                </button>

                <button
                  onClick={() => setActiveTab('learning')}
                  style={{
                    border: 'none',
                    background: activeTab === 'learning' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                    color: activeTab === 'learning' ? '#fbbf24' : 'var(--text-muted)',
                    fontWeight: activeTab === 'learning' ? 'bold' : 'normal',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <BookOpen size={13} /> Industry Programs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        <section>
          {activeTab === 'dashboard' && (
            <>
              {role === 'student' && <StudentDashboard onOpenAssessment={() => setIsAssessmentModalOpen(true)} onOpenInternship={() => setIsInternshipModalOpen(true)} />}
              {role === 'spoc' && <SpocDashboard />}
              {role === 'recruiter' && <RecruiterDashboard />}
              {role === 'ministry' && <MinistryDashboard />}
            </>
          )}

          {activeTab === 'collaboration' && <CollaborationHub />}

          {activeTab === 'learning' && <LearningProgramsSection />}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 12, 14, 0.95)',
        padding: '20px 24px',
        marginTop: '50px'
      }}>
        <div className="app-container" style={{ padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🌿</span>
              <strong style={{ fontSize: '0.95rem' }}>KaushalSetu</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                • Built for Smart India Hackathon 2026 (Problem Statement SIH26044)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sponsored by Ministry of Ayush & Administered through All India Institute of Ayurveda (AIIA), New Delhi.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span>DPI: APAAR & DigiLocker Compliant</span>
            <span>•</span>
            <span>Digital Personal Data Protection (DPDP) Act, 2023</span>
          </div>
        </div>
      </footer>

      {/* Interactive Feature Modals */}
      <SkillAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
      />

      <InternshipProgressModal
        isOpen={isInternshipModalOpen}
        onClose={() => setIsInternshipModalOpen(false)}
      />

      <NotificationToast />
    </div>
  );
}
