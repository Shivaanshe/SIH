import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { parseResumeText, sampleAyushResume, sampleTechResume } from '../../engine/nlpResumeParser';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  Cpu,
  Sparkles,
  Save,
  Check
} from 'lucide-react';

export default function ResumeUploadModal({ isOpen, onClose }) {
  const { activeStudent, updateStudentSkills } = useData();
  const { domainPack, addNotification } = useApp();

  const [resumeText, setResumeText] = useState(
    domainPack === 'ayush' ? sampleAyushResume : sampleTechResume
  );
  const [parsingResult, setParsingResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editableSkills, setEditableSkills] = useState([]);

  const handleRunNLP = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = parseResumeText(resumeText, domainPack);
      setParsingResult(result);
      setEditableSkills(result.extractedSkills.map(s => ({ ...s, isHumanConfirmed: true })));
      setIsAnalyzing(false);
      addNotification("NLP Extraction Complete", `Extracted ${result.extractedSkills.length} competencies from CV.`, "emerald");
    }, 600);
  };

  const handleLevelChange = (skillId, newLevel) => {
    setEditableSkills(prev => prev.map(s => {
      if (s.skillId === skillId) return { ...s, level: Number(newLevel) };
      return s;
    }));
  };

  const toggleConfirm = (skillId) => {
    setEditableSkills(prev => prev.map(s => {
      if (s.skillId === skillId) return { ...s, isHumanConfirmed: !s.isHumanConfirmed };
      return s;
    }));
  };

  const handleCommit = () => {
    const confirmedSkills = editableSkills
      .filter(s => s.isHumanConfirmed)
      .map(s => ({
        skillId: s.skillId,
        name: s.name,
        level: s.level,
        verified: false // User verified, pending SPOC endorsement
      }));

    // Merge with existing skills
    const existing = activeStudent.skills || [];
    const mergedMap = new Map();
    existing.forEach(s => mergedMap.set(s.skillId, s));
    confirmedSkills.forEach(s => mergedMap.set(s.skillId, s));

    updateStudentSkills(activeStudent.id, Array.from(mergedMap.values()));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NLP-Assisted Resume Parser & Verification"
      subtitle="PRD §11.5 Human-in-the-loop: Review and verify AI extracted competencies before saving to ground truth"
      maxWidth="860px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Sample Loaders & Text Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
              PASTE RESUME / CURRICULUM VITAE TEXT:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setResumeText(sampleAyushResume);
                  setParsingResult(null);
                }}
                className="glass-pill"
                style={{ cursor: 'pointer' }}
              >
                🌿 Load Sample BAMS CV
              </button>
              <button
                type="button"
                onClick={() => {
                  setResumeText(sampleTechResume);
                  setParsingResult(null);
                }}
                className="glass-pill"
                style={{ cursor: 'pointer' }}
              >
                💻 Load Sample Tech CV
              </button>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={7}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              padding: '12px',
              resize: 'vertical'
            }}
          />

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleRunNLP}
              disabled={isAnalyzing || !resumeText.trim()}
              className="btn btn-primary"
            >
              <Cpu size={16} />
              {isAnalyzing ? "Executing NER Parser..." : "Run NLP Skill Extraction"}
            </button>
          </div>
        </div>

        {/* Human-in-the-loop Extraction Review Table */}
        {parsingResult && (
          <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(52, 211, 153, 0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="glass-pill badge-emerald">
                  <Sparkles size={12} /> Extraction Confidence: High
                </span>
                <h4 style={{ fontSize: '1rem', marginTop: '6px' }}>
                  Extracted Entities for: {parsingResult.extractedName}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {parsingResult.extractedDegree} • CGPA: {parsingResult.extractedCgpa}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {editableSkills.map((sk) => (
                <div
                  key={sk.skillId}
                  style={{
                    background: sk.isHumanConfirmed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${sk.isHumanConfirmed ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={sk.isHumanConfirmed}
                      onChange={() => toggleConfirm(sk.skillId)}
                      style={{ cursor: 'pointer', accentColor: '#10b981', width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#f1f5f9' }}>
                        {sk.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Matched phrase: <span style={{ color: '#38bdf8' }}>"{sk.matchedPhrase}"</span> ({sk.confidence}% confidence)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Proficiency Level:
                    </label>
                    <select
                      value={sk.level}
                      onChange={(e) => handleLevelChange(sk.skillId, e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        padding: '4px 8px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <option value="1">Level 1 - Novice</option>
                      <option value="2">Level 2 - Beginner</option>
                      <option value="3">Level 3 - Competent</option>
                      <option value="4">Level 4 - Proficient</option>
                      <option value="5">Level 5 - Expert</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCommit} className="btn btn-primary">
                <Save size={16} />
                Save Confirmed Skills to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
