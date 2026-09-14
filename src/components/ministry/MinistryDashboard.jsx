import React from 'react';
import MetricCard from '../common/MetricCard';
import {
  ShieldCheck,
  Building,
  Globe2,
  TrendingUp,
  FileCheck2,
  Award,
  Database,
  Layers,
  MapPin
} from 'lucide-react';

const stateData = [
  { state: "Delhi (NCR)", apexInstitute: "All India Institute of Ayurveda (AIIA)", students: 1240, placementFit: "89%", topDemand: "Panchakarma & Clinical Research", status: "Optimal" },
  { state: "Rajasthan", apexInstitute: "National Institute of Ayurveda (NIA Jaipur)", students: 1680, placementFit: "84%", topDemand: "Shalya Tantra & Ksharasutra", status: "Optimal" },
  { state: "Gujarat", apexInstitute: "Institute of Teaching and Research in Ayurveda (ITRA)", students: 950, placementFit: "87%", topDemand: "Rasashastra & Formulation GMP", status: "Optimal" },
  { state: "Kerala", apexInstitute: "Vaidyaratnam Ayurveda College / Kottakkal Wing", students: 1420, placementFit: "92%", topDemand: "Authentic Panchakarma & Wellness", status: "Optimal" },
  { state: "Maharashtra", apexInstitute: "RA Podar Ayurvedic Medical College", students: 1560, placementFit: "81%", topDemand: "Kayachikitsa & Ayush Pharma QA", status: "Needs Intervention" }
];

export default function MinistryDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Ministry Apex Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)', borderLeft: '6px solid #10b981' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🇮🇳</span>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Ministry of Ayush & AIIA — National Skill Intelligence Directorate</h2>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '2px' }}>
                  Smart India Hackathon 2026 • Problem Statement SIH26044 National Public Good Infrastructure
                </p>
              </div>
            </div>
          </div>
          <span className="glass-pill badge-emerald" style={{ fontSize: '0.78rem' }}>
            ● Live DPI National Sync Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-metrics">
        <MetricCard
          title="Affiliated AYUSH Colleges"
          value="482"
          subtitle="All India Institute of Ayurveda Network"
          icon={Building}
          color="emerald"
        />
        <MetricCard
          title="APAAR ID Registered Students"
          value="68,450"
          subtitle="94.2% DPI Ecosystem Onboarding"
          icon={ShieldCheck}
          trend="+18% YoY"
          color="blue"
        />
        <MetricCard
          title="DigiLocker Verified Skills"
          value="142,800"
          subtitle="Cryptographically verified competency logs"
          icon={FileCheck2}
          color="amber"
        />
        <MetricCard
          title="National Placement Index"
          value="84.6%"
          subtitle="Direct outcome of explainable gap closing"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* DPI Integration Status Panel (PRD §16) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          Alignment with India's Digital Public Infrastructure (DPI)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px' }}>
              <Database size={18} />
              <strong style={{ fontSize: '0.94rem' }}>APAAR ID Integration</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Unique One Nation One Student ID links verified academic credits from the Academic Bank of Credits (ABC) to prevent duplicate profiles.
            </p>
            <div style={{ marginTop: '10px' }}>
              <span className="glass-pill badge-blue" style={{ fontSize: '0.7rem' }}>Status: Production Live</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '6px' }}>
              <FileCheck2 size={18} />
              <strong style={{ fontSize: '0.94rem' }}>DigiLocker Credential Verification</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Direct zero-trust verification of BAMS/BHMS degree certificates and CME clinical posting transcripts without manual paper upload.
            </p>
            <div style={{ marginTop: '10px' }}>
              <span className="glass-pill badge-emerald" style={{ fontSize: '0.7rem' }}>Status: Connected</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '6px' }}>
              <Globe2 size={18} />
              <strong style={{ fontSize: '0.94rem' }}>Skill India Digital & NCS Outbound</strong>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Outbound sync pipeline pushing verified AYUSH clinical specialists directly to the National Career Service portal and AyushGrid.
            </p>
            <div style={{ marginTop: '10px' }}>
              <span className="glass-pill badge-amber" style={{ fontSize: '0.7rem' }}>Status: API Sandbox Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* State-Level AYUSH Workforce Intelligence Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>State-Level AYUSH Workforce & Institutional Heatmap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stateData.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div style={{ minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#10b981" />
                  <strong style={{ fontSize: '0.95rem' }}>{item.state}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Apex Center: {item.apexInstitute}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Enrolled Interns: <strong style={{ color: '#ffffff' }}>{item.students}</strong>
              </div>

              <div style={{ fontSize: '0.8rem' }}>
                Cohort Placement Fit: <strong style={{ color: '#34d399' }}>{item.placementFit}</strong>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Primary Demand: <span style={{ color: '#fbbf24' }}>{item.topDemand}</span>
              </div>

              <span className={`glass-pill ${item.status === 'Optimal' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
