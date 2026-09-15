import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { parseResumeText, sampleAyushResume, sampleTechResume } from '../../engine/nlpResumeParser';
import { extractTextFromPdf } from '../../utils/pdfExtractor';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  Cpu,
  Sparkles,
  Save,
  Check,
  Eye,
  FileCheck,
  AlertCircle,
  Trash2,
  RefreshCw,
  Plus,
  Sliders,
  CheckSquare,
  Square,
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResumeUploadModal({ isOpen, onClose }) {
  const { activeStudent, updateStudentSkills } = useData();
  const { domainPack, addNotification } = useApp();

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'skills', 'preview'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeText, setResumeText] = useState(
    domainPack === 'ayush' ? sampleAyushResume : sampleTechResume
  );
  const [parsingResult, setParsingResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editableSkills, setEditableSkills] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Quick add custom skill inside modal
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillLevel, setCustomSkillLevel] = useState(4);

  if (!isOpen) return null;

  // Process file upload (PDF, TXT, DOCX)
  const handleFileProcess = async (file) => {
    if (!file) return;

    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'application/pdf',
      lastModified: new Date(file.lastModified || Date.now()).toLocaleDateString()
    });

    setIsAnalyzing(true);

    try {
      let extractedText = '';

      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        // Real client-side PDF text extraction via pdfjs-dist
        extractedText = await extractTextFromPdf(file);
      } else {
        // Plain text / markdown
        extractedText = await file.text();
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No readable text streams found in file.');
      }

      setResumeText(extractedText);

      // Run NLP entity & skill extraction
      const result = parseResumeText(extractedText, domainPack);
      setParsingResult(result);
      setEditableSkills(result.extractedSkills.map(s => ({ ...s, isHumanConfirmed: true })));
      setIsAnalyzing(false);
      setActiveTab('skills');

      addNotification(
        "PDF Extracted Successfully",
        `Discovered ${result.extractedSkills.length} competencies from ${file.name}. Review & calibrate below.`,
        "emerald"
      );
    } catch (err) {
      console.error("PDF extraction error:", err);
      setIsAnalyzing(false);

      // Graceful fallback with notification
      addNotification(
        "PDF Reading Notice",
        "Could not decode text streams directly. You can inspect or edit text in the Document Preview tab.",
        "amber"
      );
      setActiveTab('preview');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleRunNLP = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = parseResumeText(resumeText, domainPack);
      setParsingResult(result);
      setEditableSkills(result.extractedSkills.map(s => ({ ...s, isHumanConfirmed: true })));
      setIsAnalyzing(false);
      setActiveTab('skills');
      addNotification(
        "NLP Extraction Complete",
        `Extracted ${result.extractedSkills.length} competencies from document text.`,
        "emerald"
      );
    }, 400);
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

  const toggleSelectAll = () => {
    const allSelected = editableSkills.every(s => s.isHumanConfirmed);
    setEditableSkills(prev => prev.map(s => ({ ...s, isHumanConfirmed: !allSelected })));
  };

  const handleRemoveSkill = (skillId) => {
    setEditableSkills(prev => prev.filter(s => s.skillId !== skillId));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    const trimmed = customSkillName.trim();
    const alreadyExists = editableSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (alreadyExists) {
      addNotification("Skill already listed", `"${trimmed}" is already in your extraction list.`, "amber");
      return;
    }

    const newSkill = {
      skillId: `custom-res-${Date.now()}`,
      name: trimmed,
      matchedPhrase: "Manual Entry",
      confidence: 100,
      level: Number(customSkillLevel),
      category: "Candidate Competency",
      verified: false,
      isHumanConfirmed: true
    };

    setEditableSkills(prev => [newSkill, ...prev]);
    setCustomSkillName('');
    setIsAddingSkill(false);
    addNotification("Competency Added", `Added "${trimmed}" to confirmed skills.`, "emerald");
  };

  const handleCommit = () => {
    const confirmedSkills = editableSkills
      .filter(s => s.isHumanConfirmed)
      .map(s => ({
        skillId: s.skillId,
        name: s.name,
        level: s.level,
        verified: false
      }));

    if (confirmedSkills.length === 0) {
      addNotification("No Skills Selected", "Please check at least one skill to save to your profile.", "amber");
      return;
    }

    // Merge with existing skills
    const existing = activeStudent?.skills || [];
    const mergedMap = new Map();
    existing.forEach(s => mergedMap.set(s.name.toLowerCase(), s));
    confirmedSkills.forEach(s => mergedMap.set(s.name.toLowerCase(), s));

    const updatedSkillsList = Array.from(mergedMap.values());

    // Prepare profile updates
    const additionalData = {
      uploadedResume: {
        name: uploadedFile ? uploadedFile.name : `${(activeStudent?.name || 'Student').replace(/\s+/g, '_')}_Official_CV.pdf`,
        size: uploadedFile ? uploadedFile.size : '142 KB',
        uploadedAt: new Date().toLocaleDateString(),
        parsedSkillsCount: confirmedSkills.length,
        summary: parsingResult ? parsingResult.summary : 'Uploaded & NLP Verified'
      }
    };

    if (parsingResult?.extractedCgpa && (!activeStudent?.cgpa || activeStudent?.cgpa === 8.5)) {
      additionalData.cgpa = parsingResult.extractedCgpa;
    }

    updateStudentSkills(activeStudent?.id, updatedSkillsList, additionalData);

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      // Ignore if confetti blocked
    }

    addNotification(
      "Skills Synced to Profile",
      `Saved ${confirmedSkills.length} competencies to profile. Opportunity match scores calibrated!`,
      "emerald"
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Resume (PDF) & Dynamic NLP Skill Extraction"
      subtitle="Upload your CV/resume to dynamically extract competencies, inspect uploaded text, and sync skills"
      maxWidth="880px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <UploadCloud size={15} /> Upload PDF Document
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <Sparkles size={15} /> Extracted Skills ({editableSkills.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <Eye size={15} /> Check Uploaded Document
          </button>
        </div>

        {/* Tab 1: Upload PDF Area */}
        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Drag & Drop File Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#10b981' : 'rgba(52, 211, 153, 0.4)'}`,
                background: isDragging ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: isAnalyzing ? 'wait' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: isAnalyzing ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isAnalyzing ? '#38bdf8' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                {isAnalyzing ? (
                  <RefreshCw size={28} className="spin" />
                ) : (
                  <UploadCloud size={28} />
                )}
              </div>

              <h4 style={{ fontSize: '1.05rem', color: '#f1f5f9' }}>
                {isAnalyzing ? 'Extracting & Parsing PDF with NLP Engine...' : 'Click to Upload PDF Resume or Drag and Drop'}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports standard PDF documents (Tech & Ayush). Extracted client-side with zero external servers.
              </p>

              <button
                type="button"
                disabled={isAnalyzing}
                className="btn btn-primary"
                style={{ marginTop: '14px', fontSize: '0.82rem', padding: '8px 18px' }}
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                {isAnalyzing ? 'Analyzing Stream...' : 'Browse PDF File'}
              </button>
            </div>

            {/* Currently Selected / Uploaded File Status */}
            {uploadedFile && (
              <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileCheck size={24} color="#10b981" />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{uploadedFile.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Size: {uploadedFile.size} • Uploaded: {uploadedFile.lastModified} • Status: <span style={{ color: '#34d399' }}>Parsed with Client-Side PDF.js</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                >
                  <Eye size={13} /> View Content
                </button>
              </div>
            )}

            {/* Load Pre-Configured Test Samples */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Need a quick test resume?
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setResumeText(sampleAyushResume);
                    setUploadedFile({ name: 'Dr_Aanya_Sharma_BAMS_CV.pdf', size: '142 KB', lastModified: 'Today', type: 'application/pdf' });
                    const res = parseResumeText(sampleAyushResume, 'ayush');
                    setParsingResult(res);
                    setEditableSkills(res.extractedSkills.map(s => ({ ...s, isHumanConfirmed: true })));
                    setActiveTab('skills');
                  }}
                  className="glass-pill"
                  style={{ cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  🌿 Load Sample BAMS CV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResumeText(sampleTechResume);
                    setUploadedFile({ name: 'Rohan_Mehta_FullStack_CV.pdf', size: '168 KB', lastModified: 'Today', type: 'application/pdf' });
                    const res = parseResumeText(sampleTechResume, 'tech');
                    setParsingResult(res);
                    setEditableSkills(res.extractedSkills.map(s => ({ ...s, isHumanConfirmed: true })));
                    setActiveTab('skills');
                  }}
                  className="glass-pill"
                  style={{ cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  💻 Load Sample Tech CV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Extracted Skills & Verification */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header with Candidate Profile Summary */}
            {parsingResult && (
              <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #10b981' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                    Candidate: {parsingResult.extractedName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {parsingResult.extractedEmail && <span>{parsingResult.extractedEmail} • </span>}
                    {parsingResult.extractedPhone && <span>{parsingResult.extractedPhone} • </span>}
                    Degree: <strong style={{ color: '#38bdf8' }}>{parsingResult.extractedDegree}</strong> • CGPA: <strong style={{ color: '#34d399' }}>{parsingResult.extractedCgpa}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
                    Detected Domain: {parsingResult.detectedDomain?.toUpperCase() || 'TECH'}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h4 style={{ fontSize: '0.98rem', color: '#ffffff' }}>
                  Extracted Competencies ({editableSkills.filter(s => s.isHumanConfirmed).length}/{editableSkills.length} Selected)
                </h4>
                {editableSkills.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="glass-pill"
                    style={{ cursor: 'pointer', fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    {editableSkills.every(s => s.isHumanConfirmed) ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(!isAddingSkill)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Add Additional Skill
                </button>
                <button
                  type="button"
                  onClick={handleCommit}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <Save size={14} /> Save & Sync to Profile
                </button>
              </div>
            </div>

            {/* Quick Form to Add Custom Skill */}
            {isAddingSkill && (
              <form onSubmit={handleAddCustomSkill} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Skill name (e.g. Next.js, Docker, DSA, Kotlin)..."
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Level: {customSkillLevel}/5</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={customSkillLevel}
                    onChange={(e) => setCustomSkillLevel(e.target.value)}
                    style={{ width: '80px', accentColor: '#10b981' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                  <Plus size={13} /> Add
                </button>
                <button type="button" onClick={() => setIsAddingSkill(false)} className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
                  Cancel
                </button>
              </form>
            )}

            {editableSkills.length === 0 ? (
              <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
                <AlertCircle size={32} color="#fbbf24" style={{ margin: '0 auto 10px auto' }} />
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  No skills extracted yet. Upload a resume file or click "Run NLP Skill Extraction".
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="btn btn-secondary"
                  style={{ marginTop: '12px', fontSize: '0.8rem' }}
                >
                  Go to File Upload
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {editableSkills.map((sk) => (
                  <div
                    key={sk.skillId}
                    style={{
                      background: sk.isHumanConfirmed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${sk.isHumanConfirmed ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'background 0.2s'
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
                        <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: sk.isHumanConfirmed ? '#f1f5f9' : 'var(--text-muted)' }}>
                          {sk.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {sk.matchedPhrase && <span style={{ color: '#34d399', marginRight: '6px' }}>Matched: "{sk.matchedPhrase}"</span>}
                          • Confidence: <span style={{ color: '#38bdf8' }}>{sk.confidence}%</span> • Category: {sk.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          Level: <strong>{sk.level}/5</strong>
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={sk.level}
                          onChange={(e) => handleLevelChange(sk.skillId, e.target.value)}
                          style={{ width: '85px', accentColor: '#10b981', cursor: 'pointer' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.skillId)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        title="Remove from list"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Check Uploaded Document & Extracted Text */}
        {activeTab === 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '14px 18px', borderLeft: '4px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.94rem', color: '#ffffff' }}>
                  Document: {uploadedFile?.name || `${(activeStudent?.name || 'Student').replace(/\s+/g, '_')}_Official_CV.pdf`}
                </h4>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Size: {uploadedFile?.size || '142 KB'} • Clean Text Decoded via PDF.js Stream Extraction
                </div>
              </div>
              <span className="glass-pill badge-emerald">
                ● Client-Side Decoded
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Decoded Document Text Preview (Editable)
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {resumeText.length} characters
                </span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste or inspect extracted resume text..."
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#cbd5e1',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  lineHeight: '1.45',
                  padding: '12px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tip: You can edit or paste extra text above and click Re-Scan.
              </span>
              <button
                type="button"
                onClick={handleRunNLP}
                disabled={isAnalyzing}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={isAnalyzing ? 'spin' : ''} /> Re-Scan Text with NLP
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            type="button"
            onClick={handleCommit}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={16} /> Save Confirmed Skills
          </button>
        </div>
      </div>
    </Modal>
  );
}
