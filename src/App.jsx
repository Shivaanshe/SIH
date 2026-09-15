import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/common/Header';
import NotificationToast from './components/common/NotificationToast';
import SkillBridgeCanvas from './components/3d/SkillBridgeCanvas';
import SkillConstellation3D from './components/3d/SkillConstellation3D';
import AnatomyHologram3D from './components/3d/AnatomyHologram3D';
import StudentDashboard from './components/student/StudentDashboard';
import SpocDashboard from './components/spoc/SpocDashboard';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import MinistryDashboard from './components/ministry/MinistryDashboard';
import { Compass, Boxes, Sparkles, Shield, Heart } from 'lucide-react';

export default function App() {
  const { role, active3DView, setActive3DView, domainPack } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="app-container" style={{ flex: 1, paddingTop: '24px' }}>
        {/* 3D Web Experience Hero Section */}
        <section style={{ marginBottom: '28px' }}>
          <div className="glass-panel" style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#10b981" />
                <h3 style={{ fontSize: '0.96rem', letterSpacing: '-0.01em' }}>
                  {active3DView === 'bridge' && "3D KaushalSetu Dynamic Skill Bridge — Three.js / WebGL"}
                  {active3DView === 'constellation' && "3D Interactive Skill Constellation & Spatial Knowledge Graph"}
                  {active3DView === 'anatomy' && "3D Holographic Clinical / Marma Diagnostic Model"}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setActive3DView('bridge')}
                  className={`btn ${active3DView === 'bridge' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                >
                  <Compass size={13} /> Bridge
                </button>
                <button
                  onClick={() => setActive3DView('constellation')}
                  className={`btn ${active3DView === 'constellation' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                >
                  <Boxes size={13} /> Constellation
                </button>
                {domainPack === 'ayush' && (
                  <button
                    onClick={() => setActive3DView('anatomy')}
                    className={`btn ${active3DView === 'anatomy' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                  >
                    🧬 Clinical
                  </button>
                )}
              </div>
            </div>

            {/* Render Selected 3D Scene */}
            {active3DView === 'bridge' && <SkillBridgeCanvas />}
            {active3DView === 'constellation' && <SkillConstellation3D />}
            {active3DView === 'anatomy' && <AnatomyHologram3D />}
          </div>
        </section>

        {/* Dynamic Role-Based Experience View */}
        <section>
          {role === 'student' && <StudentDashboard />}
          {role === 'spoc' && <SpocDashboard />}
          {role === 'recruiter' && <RecruiterDashboard />}
          {role === 'ministry' && <MinistryDashboard />}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 12, 14, 0.95)',
        padding: '24px',
        marginTop: '60px'
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

      <NotificationToast />
    </div>
  );
}
