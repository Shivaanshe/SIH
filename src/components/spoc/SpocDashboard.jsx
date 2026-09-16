import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import CurriculumActionModal from './CurriculumActionModal';
import EndorseStudentModal from './EndorseStudentModal';
import FacultyFdpSection from './FacultyFdpSection';
import StudentPlacementDiagnosticsModal from './StudentPlacementDiagnosticsModal';
import {
  Users,
  GraduationCap,
  Radar,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  Search,
  CheckCircle,
  Building,
  Briefcase,
  Layers,
  ChevronDown,
  XCircle,
  Eye
} from 'lucide-react';

export default function SpocDashboard() {
  const { students, batchCurriculumGaps, institutions, directives, adoptDirective } = useData();
  const { domainPack } = useApp();

  const [activeSpocTab, setActiveSpocTab] = useState('curriculum'); // 'curriculum' or 'fdp'
  const [selectedStudentForEndorse, setSelectedStudentForEndorse] = useState(null);
  const [selectedStudentForDiagnostics, setSelectedStudentForDiagnostics] = useState(null);
  const [rosterFilter, setRosterFilter] = useState('all'); // 'all', 'deselected', 'shortlisted', 'pending-endorse'
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter institutions and students for active domain
  const domainInstitutions = institutions.filter(i => i.domainPack === domainPack);
  const [selectedInstId, setSelectedInstId] = useState(domainInstitutions[0]?.id || institutions[0]?.id);

  useEffect(() => {
    const firstForDomain = institutions.find(i => i.domainPack === domainPack);
    if (firstForDomain) setSelectedInstId(firstForDomain.id);
  }, [domainPack, institutions]);

  const activeInstitution = institutions.find(i => i.id === selectedInstId) || domainInstitutions[0] || institutions[0];
  const domainDirectives = (directives || []).filter(d => !d.domainPack || d.domainPack === domainPack);
  const domainStudents = students.filter(s => s.domainPack === domainPack || !s.domainPack);

  const deselectedCohortStudents = domainStudents.filter(s =>
    (s.appliedPostings || []).some(a => a.status === 'Rejected')
  );
  const shortlistedCohortStudents = domainStudents.filter(s =>
    (s.appliedPostings || []).some(a => a.status === 'Shortlisted')
  );

  const filteredStudents = domainStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.apaarId.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (rosterFilter === 'deselected') {
      return (s.appliedPostings || []).some(a => a.status === 'Rejected');
    }
    if (rosterFilter === 'shortlisted') {
      return (s.appliedPostings || []).some(a => a.status === 'Shortlisted');
    }
    if (rosterFilter === 'pending-endorse') {
      return (s.skills || []).some(sk => !sk.verified);
    }
    return true;
  });

  // Overall batch metrics
  const totalStudents = domainStudents.length;
  const verifiedSkillsTotal = domainStudents.reduce((acc, s) => {
    return acc + (s.skills || []).filter(sk => sk.verified).length;
  }, 0);
  const avgCgpa = (domainStudents.reduce((acc, s) => acc + s.cgpa, 0) / (totalStudents || 1)).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Institution Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.3rem' }}>{activeInstitution.name}</h2>
                <select
                  value={activeInstitution.id}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#34d399',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Switch Institution View"
                >
                  {domainInstitutions.map((inst) => (
                    <option key={inst.id} value={inst.id} style={{ background: '#0f172a', color: '#fff' }}>
                      {inst.name} ({inst.location})
                    </option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                SPOC: <strong>{activeInstitution.spocName}</strong> ({activeInstitution.spocDesignation}) • Accreditation: <span style={{ color: '#34d399' }}>{activeInstitution.accreditation}</span>
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsCurriculumModalOpen(true)}
            className="btn btn-primary"
          >
            <Radar size={16} /> Generate Curriculum Action Plan
          </button>
        </div>
      </div>

      {/* Academia Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSpocTab('curriculum')}
          className={`btn ${activeSpocTab === 'curriculum' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.84rem', padding: '8px 16px' }}
        >
          <Radar size={15} /> Student Cohort & Curriculum Gap Radar
        </button>

        <button
          onClick={() => setActiveSpocTab('fdp')}
          className={`btn ${activeSpocTab === 'fdp' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.84rem', padding: '8px 16px' }}
        >
          <Briefcase size={15} /> Faculty FDPs, Residencies & Research Grants
        </button>
      </div>

      {activeSpocTab === 'fdp' ? (
        <FacultyFdpSection />
      ) : (
        <>

      {/* Metrics Row */}
      <div className="grid-metrics">
        <MetricCard
          title="Active Cohort Size"
          value={activeInstitution.studentCount}
          subtitle={`Batch 2026 • ${activeInstitution.placementRate} placement rate`}
          icon={Users}
          color="emerald"
        />
        <MetricCard
          title="Faculty Endorsements"
          value={verifiedSkillsTotal}
          subtitle="Clinically verified competency records"
          icon={Award}
          color="blue"
        />
        <MetricCard
          title="Mean Cohort CGPA"
          value={avgCgpa}
          subtitle="Audited against Academic Bank of Credits"
          icon={GraduationCap}
          color="amber"
        />
        <MetricCard
          title="Curriculum Deficiencies"
          value={batchCurriculumGaps.filter(g => g.deficiencyRate > 40).length}
          subtitle="Identified against live recruiter demands"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* National Ministry Directives & Syllabus Mandates (Live Feed) */}
      {domainDirectives.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>📜</span>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>National Ministry Directives & Curriculum Mandates</h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Mandatory syllabus guidelines dispatched by the Ministry Directorate to all affiliated institutions.
                </p>
              </div>
            </div>
            <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
              ● Live National Policy Feed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {domainDirectives.map((dir) => {
              const isAdopted = (dir.adoptedInstitutions || []).includes(activeInstitution.id);
              return (
                <div
                  key={dir.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="glass-pill badge-emerald" style={{ fontSize: '0.68rem' }}>Ministry Mandate</span>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{dir.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Scope: <strong style={{ color: '#38bdf8' }}>{dir.target}</strong> • Enforced: {dir.issuedAt}
                    </div>
                  </div>

                  <button
                    onClick={() => adoptDirective(dir.id, activeInstitution.id)}
                    disabled={isAdopted}
                    className={`btn ${isAdopted ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  >
                    {isAdopted ? '✅ Adopted into College Syllabus' : '📥 Adopt into College Syllabus'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Curriculum Gap Radar (PRD §10.3 Core Differentiator) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radar size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.2rem' }}>Batch Curriculum Gap Radar</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Aggregated institutional deficiency ranked by: Cohort Gap Frequency × Active Recruiter Demand Multiplier.
            </p>
          </div>
          <span className="glass-pill badge-emerald">
            Live Feed: Ministry of Ayush & Partner Portals
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {batchCurriculumGaps.map((item, idx) => {
            const isHighPriority = item.deficiencyRate > 50;
            return (
              <div
                key={item.skillId}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: item.isMinistryMandated ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{idx + 1}</span>
                    <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                    <span className="glass-pill" style={{ fontSize: '0.68rem' }}>{item.category}</span>
                    {item.isMinistryMandated && (
                      <span className="glass-pill badge-emerald" style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981' }}>
                        👑 Ministry Mandate
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Average Batch Proficiency: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{item.avgBatchProficiency} / 5.0</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '240px' }}>
                  {/* Deficiency Bar */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Deficiency in Cohort:</span>
                      <strong style={{ color: isHighPriority ? '#f43f5e' : '#f59e0b' }}>
                        {item.deficiencyRate}%
                      </strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${item.deficiencyRate}%`,
                          background: isHighPriority ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : '#10b981'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Industry Demand:</div>
                    <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
                      {item.industryDemandCount}x Multiplier
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cohort Student Roster with Endorsement & Placement Audit Action */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Cohort Student Roster & Placement Audit</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Audit recruiter deselection reasons, identify lacking student skills, and endorse verified competencies.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search by student name or APAAR ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '6px 14px',
                fontSize: '0.8rem',
                minWidth: '220px'
              }}
            />
          </div>
        </div>

        {/* Deselection Alert Banner for College SPOC */}
        {deselectedCohortStudents.length > 0 && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 18px',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#f43f5e" />
              <div style={{ fontSize: '0.82rem', color: '#fda4af' }}>
                <strong>Placement Deselection Alert:</strong> {deselectedCohortStudents.length} student(s) in this cohort were deselected by industry partners. Recruiter diagnostic feedback is available to guide academic intervention and remedial coursework.
              </div>
            </div>
            <button
              onClick={() => setRosterFilter(rosterFilter === 'deselected' ? 'all' : 'deselected')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.75rem',
                padding: '5px 12px',
                borderColor: 'rgba(244, 63, 94, 0.4)',
                background: rosterFilter === 'deselected' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                color: '#fca5a5'
              }}
            >
              {rosterFilter === 'deselected' ? 'Show All Students' : 'Filter Deselected Students'}
            </button>
          </div>
        )}

        {/* Roster Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setRosterFilter('all')}
            className={`glass-pill ${rosterFilter === 'all' ? 'badge-blue' : ''}`}
            style={{ cursor: 'pointer', fontSize: '0.74rem', padding: '4px 12px' }}
          >
            All Students ({domainStudents.length})
          </button>
          <button
            onClick={() => setRosterFilter('deselected')}
            className={`glass-pill ${rosterFilter === 'deselected' ? 'badge-rose' : ''}`}
            style={{
              cursor: 'pointer',
              fontSize: '0.74rem',
              padding: '4px 12px',
              border: deselectedCohortStudents.length > 0 ? '1px solid rgba(244, 63, 94, 0.5)' : undefined
            }}
          >
            ⚠️ Deselected / Lacking Skills ({deselectedCohortStudents.length})
          </button>
          <button
            onClick={() => setRosterFilter('shortlisted')}
            className={`glass-pill ${rosterFilter === 'shortlisted' ? 'badge-emerald' : ''}`}
            style={{ cursor: 'pointer', fontSize: '0.74rem', padding: '4px 12px' }}
          >
            Shortlisted ({shortlistedCohortStudents.length})
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No students found matching current filter criteria.
            </div>
          ) : (
            filteredStudents.map((stud) => {
              const verifiedCount = (stud.skills || []).filter(s => s.verified).length;
              const totalCount = (stud.skills || []).length;
              const appliedList = stud.appliedPostings || [];
              const rejectedApps = appliedList.filter(a => a.status === 'Rejected');
              const shortlistedApps = appliedList.filter(a => a.status === 'Shortlisted');

              return (
                <div
                  key={stud.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${rejectedApps.length > 0 ? 'rgba(244, 63, 94, 0.35)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={stud.avatar}
                      alt={stud.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', border: `2px solid ${rejectedApps.length > 0 ? '#f43f5e' : '#10b981'}` }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.96rem' }}>{stud.name}</strong>
                        <span className="glass-pill badge-blue" style={{ fontSize: '0.68rem' }}>
                          {stud.apaarId}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {stud.degree} • CGPA: <strong>{stud.cgpa}</strong>
                      </div>

                      {/* Placement Outcome Indicators */}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {rejectedApps.length > 0 && (
                          <span
                            className="glass-pill badge-rose"
                            style={{
                              fontSize: '0.68rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(244, 63, 94, 0.18)',
                              border: '1px solid rgba(244, 63, 94, 0.4)',
                              color: '#fda4af',
                              fontWeight: 'bold'
                            }}
                          >
                            <AlertTriangle size={10} color="#f43f5e" /> {rejectedApps.length} Deselected / Rejected
                          </span>
                        )}
                        {shortlistedApps.length > 0 && (
                          <span
                            className="glass-pill badge-emerald"
                            style={{
                              fontSize: '0.68rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle size={10} /> {shortlistedApps.length} Shortlisted
                          </span>
                        )}
                        {appliedList.length > 0 && rejectedApps.length === 0 && shortlistedApps.length === 0 && (
                          <span className="glass-pill badge-blue" style={{ fontSize: '0.68rem' }}>
                            {appliedList.length} Active Applications
                          </span>
                        )}
                        {appliedList.length === 0 && (
                          <span className="glass-pill" style={{ fontSize: '0.68rem', opacity: 0.55 }}>
                            0 Applications
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Skills:</div>
                      <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>
                        {verifiedCount} / {totalCount} Endorsed
                      </strong>
                    </div>

                    <button
                      onClick={() => setSelectedStudentForDiagnostics(stud)}
                      className="btn btn-secondary"
                      style={{
                        fontSize: '0.78rem',
                        padding: '6px 12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderColor: rejectedApps.length > 0 ? 'rgba(244, 63, 94, 0.45)' : 'var(--border-subtle)',
                        background: rejectedApps.length > 0 ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255,255,255,0.02)',
                        color: rejectedApps.length > 0 ? '#fda4af' : 'var(--text-primary)'
                      }}
                      title="Audit recruiter deselection reasons and lacking skills"
                    >
                      <AlertTriangle size={13} color={rejectedApps.length > 0 ? '#f43f5e' : '#38bdf8'} />
                      Placement Diagnostics & Gaps
                    </button>

                    <button
                      onClick={() => setSelectedStudentForEndorse(stud)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <Award size={14} color="#fbbf24" /> Endorse Skills
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      </>
      )}

      <CurriculumActionModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        curriculumGaps={batchCurriculumGaps}
        institutionName={activeInstitution.name}
      />

      <EndorseStudentModal
        isOpen={Boolean(selectedStudentForEndorse)}
        onClose={() => setSelectedStudentForEndorse(null)}
        student={selectedStudentForEndorse}
      />

      <StudentPlacementDiagnosticsModal
        isOpen={Boolean(selectedStudentForDiagnostics)}
        onClose={() => setSelectedStudentForDiagnostics(null)}
        student={selectedStudentForDiagnostics}
        onOpenEndorse={(stud) => setSelectedStudentForEndorse(stud)}
      />
    </div>
  );
}
