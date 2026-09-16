import React, { useState } from 'react';
import MetricCard from '../common/MetricCard';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building,
  Globe2,
  TrendingUp,
  FileCheck2,
  Award,
  Database,
  Layers,
  MapPin,
  Send,
  PlusCircle,
  Filter,
  CheckCircle,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ayushStateData = [
  { state: "Delhi (NCR)", apexInstitute: "All India Institute of Ayurveda (AIIA)", students: 1240, placementFit: 89, topDemand: "Panchakarma & Clinical Research", status: "Optimal" },
  { state: "Rajasthan", apexInstitute: "National Institute of Ayurveda (NIA Jaipur)", students: 1680, placementFit: 84, topDemand: "Shalya Tantra & Ksharasutra", status: "Optimal" },
  { state: "Gujarat", apexInstitute: "Institute of Teaching and Research in Ayurveda (ITRA)", students: 950, placementFit: 87, topDemand: "Rasashastra & Formulation GMP", status: "Optimal" },
  { state: "Kerala", apexInstitute: "Vaidyaratnam Ayurveda College / Kottakkal Wing", students: 1420, placementFit: 92, topDemand: "Authentic Panchakarma & Wellness", status: "Optimal" },
  { state: "Maharashtra", apexInstitute: "RA Podar Ayurvedic Medical College", students: 1560, placementFit: 81, topDemand: "Kayachikitsa & Ayush Pharma QA", status: "Needs Intervention" },
  { state: "Punjab", apexInstitute: "Guru Gobind Singh Ayurvedic College & Hospital", students: 820, placementFit: 78, topDemand: "Dravyaguna Herb Taxonomy", status: "Needs Intervention" }
];

const techStateData = [
  { state: "Delhi (NCR)", apexInstitute: "Delhi Technological University (DTU)", students: 2450, placementFit: 91, topDemand: "Full-Stack Architecture & Cloud", status: "Optimal" },
  { state: "Karnataka", apexInstitute: "IISc & IIIT Bangalore Cluster", students: 3100, placementFit: 94, topDemand: "AI/ML & Microservice Runtimes", status: "Optimal" },
  { state: "Maharashtra", apexInstitute: "IIT Bombay & VJTI Mumbai", students: 2890, placementFit: 88, topDemand: "Distributed Systems & Security", status: "Optimal" },
  { state: "Punjab", apexInstitute: "Lovely Professional University (LPU)", students: 4200, placementFit: 85, topDemand: "DevOps, React & Enterprise Java", status: "Optimal" },
  { state: "Telangana", apexInstitute: "IIIT Hyderabad & JNTU", students: 1980, placementFit: 89, topDemand: "NLP, Vector Search & Data Eng", status: "Optimal" },
  { state: "Uttar Pradesh", apexInstitute: "IIT Kanpur & AKTU Hub", students: 3600, placementFit: 80, topDemand: "Cloud Containerization & Kubernetes", status: "Needs Intervention" }
];

export default function MinistryDashboard() {
  const { domainPack, addNotification } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [directiveTopic, setDirectiveTopic] = useState('Schedule T GMP Regulations & Clinical Trial GCP');
  const [activeDirectives, setActiveDirectives] = useState([
    {
      id: "dir-01",
      title: "Mandatory Clinical Trials & GCP Compliance Protocol (Schedule Y / Ayush GCP)",
      target: "All 482 Affiliated BAMS Institutions",
      issuedAt: "Sept 2026",
      status: "Active"
    }
  ]);

  const activeData = domainPack === 'ayush' ? ayushStateData : techStateData;

  const filteredData = activeData.filter(item => {
    if (filterStatus === 'Optimal') return item.status === 'Optimal';
    if (filterStatus === 'Needs Intervention') return item.status === 'Needs Intervention';
    return true;
  });

  const handleIssueDirective = (e) => {
    e.preventDefault();
    if (!directiveTopic.trim()) return;

    const newDirective = {
      id: `dir-${Date.now()}`,
      title: directiveTopic.trim(),
      target: domainPack === 'ayush' ? 'All 482 AYUSH Medical Colleges' : 'All 850 Technical Universities',
      issuedAt: 'Just Now',
      status: 'Active'
    };

    setActiveDirectives(prev => [newDirective, ...prev]);
    setIsDirectiveModalOpen(false);
    setDirectiveTopic('');

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}

    addNotification(
      "National Skill Directive Published",
      `Ministry of Ayush published directive: "${newDirective.title}". Dispatched across all institutions.`,
      "emerald"
    );
  };

  const handleGrantAllocation = (stateName, amount = "₹25 Lakhs") => {
    addNotification(
      "Regional FDP Grant Sanctioned",
      `Apex Directorate approved ${amount} curriculum intervention grant for ${stateName}.`,
      "emerald"
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Ministry Apex Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
        borderLeft: '6px solid #10b981'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🇮🇳</span>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  {domainPack === 'ayush' ? 'Ministry of Ayush & AIIA — National Skill Intelligence Directorate' : 'National Skill Development Directorate — Technology & IT Sector'}
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '3px' }}>
                  Smart India Hackathon 2026 • Problem Statement SIH26044 Apex Governance & Public Good Ecosystem
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsDirectiveModalOpen(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={15} /> Issue National Curriculum Directive
            </button>
            <span className="glass-pill badge-emerald" style={{ fontSize: '0.78rem' }}>
              ● Live DPI National Sync Active
            </span>
          </div>
        </div>
      </div>

      {/* Overview Card: What is Ministry Admin & What is its Purpose? */}
      <div className="glass-panel" style={{ padding: '18px 22px', borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            flexShrink: 0
          }}>
            <Info size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', color: '#f1f5f9', fontWeight: 700 }}>
              Purpose of the Ministry Admin Directorate
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
              The <strong>Ministry Admin Portal</strong> is the apex command center designed for the <strong>Ministry of Ayush</strong> and national accrediting bodies. It provides macroscopic oversight over the nationwide higher education ecosystem: monitoring real-time student employability heatmaps, detecting regional curriculum deficits across colleges, enforcing India Digital Public Infrastructure (DPI) compliance (APAAR & DigiLocker), and sanctioning national skill missions and FDP grants.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-metrics">
        <MetricCard
          title={domainPack === 'ayush' ? "Affiliated AYUSH Colleges" : "Technical Universities"}
          value={domainPack === 'ayush' ? "482" : "850"}
          subtitle={domainPack === 'ayush' ? "All India Institute of Ayurveda Network" : "AICTE & Autonomous Universities"}
          icon={Building}
          color="emerald"
        />
        <MetricCard
          title="APAAR ID Registered Students"
          value={domainPack === 'ayush' ? "68,450" : "145,200"}
          subtitle="94.2% DPI Ecosystem Onboarding"
          icon={ShieldCheck}
          trend="+18% YoY"
          color="blue"
        />
        <MetricCard
          title="DigiLocker Verified Skills"
          value={domainPack === 'ayush' ? "142,800" : "312,500"}
          subtitle="Cryptographically verified competency logs"
          icon={FileCheck2}
          color="amber"
        />
        <MetricCard
          title="National Placement Index"
          value={domainPack === 'ayush' ? "84.6%" : "88.2%"}
          subtitle="Direct outcome of explainable AI matching"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Active National Directives Section */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Active National Policy Directives</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Curriculum mandates and skill modernization advisories issued by the Apex Directorate.
            </p>
          </div>
          <button
            onClick={() => setIsDirectiveModalOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <PlusCircle size={14} /> Add Directive
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeDirectives.map((dir) => (
            <div
              key={dir.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  {dir.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Scope: <strong style={{ color: '#38bdf8' }}>{dir.target}</strong> • Issued: {dir.issuedAt}
                </div>
              </div>
              <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
                ● Enforced Nationwide
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* State-Level Workforce & Institutional Heatmap Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>
              State-Level Workforce & Institutional Placement Heatmap
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Aggregated institutional cohort readiness and industry demand alignment across states.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={15} color="#94a3b8" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem'
              }}
            >
              <option value="All">All Statuses ({activeData.length})</option>
              <option value="Optimal">Optimal Only (Fit ≥ 85%)</option>
              <option value="Needs Intervention">Needs Intervention (&lt; 85%)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredData.map((item, idx) => (
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
                  <strong style={{ fontSize: '0.95rem', color: '#f1f5f9' }}>{item.state}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Apex Center: {item.apexInstitute}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Enrolled Interns: <strong style={{ color: '#ffffff' }}>{item.students}</strong>
              </div>

              <div style={{ fontSize: '0.8rem' }}>
                Placement Fit: <strong style={{ color: item.placementFit >= 85 ? '#34d399' : '#fbbf24' }}>{item.placementFit}%</strong>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Primary Demand: <span style={{ color: '#fbbf24' }}>{item.topDemand}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`glass-pill ${item.status === 'Optimal' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                  {item.status}
                </span>

                {item.status === 'Needs Intervention' && (
                  <button
                    onClick={() => handleGrantAllocation(item.state)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                    title="Sanction ₹25L FDP Grant to bridge curriculum gap"
                  >
                    Sanction FDP Grant
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
              Direct zero-trust verification of degree certificates and clinical posting transcripts without manual paperwork.
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
              Outbound sync pipeline pushing verified specialists directly to the National Career Service portal and AyushGrid.
            </p>
            <div style={{ marginTop: '10px' }}>
              <span className="glass-pill badge-amber" style={{ fontSize: '0.7rem' }}>Status: API Sandbox Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Issue National Curriculum Directive */}
      {isDirectiveModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.6rem' }}>📜</span>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Issue National Curriculum Directive</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Publish mandatory syllabus updates to colleges under the Ministry Directorate.
                </p>
              </div>
            </div>

            <form onSubmit={handleIssueDirective} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Directive Title / Focus Area
                </label>
                <input
                  type="text"
                  value={directiveTopic}
                  onChange={(e) => setDirectiveTopic(e.target.value)}
                  placeholder="e.g. Mandatory Panchakarma IPD & NABH Protocol Hours..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '6px' }}>
                ℹ️ This directive will be automatically transmitted to all university SPOC dashboards to update their Batch Curriculum Gap Radar.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsDirectiveModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={14} /> Publish Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
