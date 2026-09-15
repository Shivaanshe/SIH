import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import CurriculumActionModal from './CurriculumActionModal';
import EndorseStudentModal from './EndorseStudentModal';
import {
  Users,
  GraduationCap,
  Radar,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  Search,
  CheckCircle,
  Building
} from 'lucide-react';

export default function SpocDashboard() {
  const { students, batchCurriculumGaps, institutions } = useData();
  const { domainPack } = useApp();

  const [selectedStudentForEndorse, setSelectedStudentForEndorse] = useState(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students for active domain
  const domainStudents = students.filter(s => s.domainPack === domainPack);
  const activeInstitution = institutions.find(i => i.domainPack === domainPack) || institutions[0];

  const filteredStudents = domainStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.apaarId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h2 style={{ fontSize: '1.3rem' }}>{activeInstitution.name}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                SPOC: <strong>{activeInstitution.spocName}</strong> ({activeInstitution.spocDesignation}) • Accreditation: <span style={{ color: '#34d399' }}>{activeInstitution.accreditation}</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCurriculumModalOpen(true)}
          className="btn btn-primary"
        >
          <Radar size={16} /> Generate Curriculum Action Plan
        </button>
      </div>

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
                  border: '1px solid var(--border-subtle)',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{idx + 1}</span>
                    <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                    <span className="glass-pill" style={{ fontSize: '0.68rem' }}>{item.category}</span>
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

      {/* Cohort Student Roster with Endorsement Action */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Cohort Student Roster</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Audit clinical case logs and endorse specific student skills to raise verification confidence.
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredStudents.map((stud) => {
            const verifiedCount = (stud.skills || []).filter(s => s.verified).length;
            const totalCount = (stud.skills || []).length;

            return (
              <div
                key={stud.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
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
                    style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #10b981' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.94rem' }}>{stud.name}</strong>
                      <span className="glass-pill badge-blue" style={{ fontSize: '0.68rem' }}>
                        {stud.apaarId}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {stud.degree} • CGPA: <strong>{stud.cgpa}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Skills:</div>
                    <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>
                      {verifiedCount} / {totalCount} Endorsed
                    </strong>
                  </div>

                  <button
                    onClick={() => setSelectedStudentForEndorse(stud)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    <Award size={14} color="#fbbf24" /> Endorse Skills
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
    </div>
  );
}
