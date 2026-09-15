import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Award, Brain, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const ayushQuestions = [
  {
    id: 1,
    category: "Technical / Clinical",
    skillId: "ayush-pk-01",
    skillName: "Panchakarma Protocol & Procedures",
    question: "Which of the following is an absolute contraindication for administering classical Vamana Karma?",
    options: [
      "Kaphaja disorders with excess mucus congestion",
      "Garbhini (Pregnancy) and acute Krisha (severely emaciated patients)",
      "Tamaka Shwasa (Bronchial Asthma) in remission",
      "Kushta (Skin dermatological disorders)"
    ],
    correctIndex: 1,
    explanation: "Classical texts specify that emaciated, pregnant, or acutely debilitated patients are contraindicated for Vamana."
  },
  {
    id: 2,
    category: "Technical / Regulatory QA",
    skillId: "ayush-rasa-04",
    skillName: "Rasashastra & Formulation Quality Control",
    question: "Under Schedule T Good Manufacturing Practices (GMP), which standard test confirms complete calcination and lack of free metallic lusture in a Bhasma?",
    options: [
      "Varitara (Floating on water) and Rekhapurna (Microfine particle index)",
      "High temperature flame test only",
      "Solubility in concentrated acid",
      "Visual color matching against raw ore"
    ],
    correctIndex: 0,
    explanation: "Varitara and Rekhapurna are the classical Ayurvedic nanoscience tests for Bhasma quality standardization."
  },
  {
    id: 3,
    category: "Technical / Pharmacognosy",
    skillId: "ayush-dravya-03",
    skillName: "Dravyaguna & Herb Identification",
    question: "What is the primary marker withanolide bioactive compound standardized using HPLC in Withania somnifera (Ashwagandha)?",
    options: [
      "Curcuminoid Complex",
      "Withaferin A and Withanolide D",
      "Gymnemic Acid",
      "Guggulsterone E and Z"
    ],
    correctIndex: 1,
    explanation: "Withaferin A and Withanolide D are the standard pharmacological reference standards for Ashwagandha."
  },
  {
    id: 4,
    category: "Industry Soft Skill",
    skillId: "soft-empathy-01",
    skillName: "Clinical Empathy & Patient Communication",
    question: "A chronic arthritis patient is frustrated by slow therapeutic progress during a Panchakarma regimen. What is the most effective clinical communication approach?",
    options: [
      "Tell the patient that traditional herbs take years and they must remain quiet",
      "Acknowledge their emotional distress, explain the biological purification phase (Shodhana vs Shamana), and review milestone progress transparently",
      "Immediately double the herbal dosage without checking digestive fire (Agni)",
      "Refer them to another clinic immediately"
    ],
    correctIndex: 1,
    explanation: "Effective clinical empathy bridges patient expectations and treatment milestones through clear, compassionate education."
  },
  {
    id: 5,
    category: "Industry Soft Skill",
    skillId: "soft-team-02",
    skillName: "Interdisciplinary Team Collaboration & Ethics",
    question: "During an integrative hospital round, an allopathic resident questions an Ayurvedic prescription. How should an AYUSH practitioner respond?",
    options: [
      "Argue defensively and refuse to share diagnostic rationale",
      "Present empirical clinical trial documentation, drug-herb interaction data, and propose collaborative patient monitoring",
      "Withdraw the patient's treatment without informing the chief consultant",
      "Ignore modern medical tests and rely solely on pulse diagnosis"
    ],
    correctIndex: 1,
    explanation: "Integrative healthcare requires evidence-informed dialogue, mutual respect, and collaborative pharmacovigilance."
  }
];

const techQuestions = [
  {
    id: 1,
    category: "Technical Architecture",
    skillId: "tech-react-01",
    skillName: "React.js & Frontend Architecture",
    question: "In React, why must a cleanup function be returned from a useEffect hook handling WebSocket or event listeners?",
    options: [
      "To force the virtual DOM to rerender immediately",
      "To prevent memory leaks and dangling event listeners when the component unmounts",
      "To convert asynchronous callbacks into synchronous state updates",
      "It is an optional aesthetic practice with no performance impact"
    ],
    correctIndex: 1,
    explanation: "Cleaning up timers, subscriptions, and WebSockets prevents memory leaks and stale closure bugs."
  },
  {
    id: 2,
    category: "Technical Engineering",
    skillId: "tech-node-02",
    skillName: "Node.js & Express API Engineering",
    question: "Which Node.js architectural mechanism handles non-blocking I/O operations without blocking the main JavaScript thread?",
    options: [
      "The libuv event loop and thread pool",
      "Multiple V8 execution instances running simultaneously",
      "Synchronous filesystem locks",
      "Direct kernel-level process forks per request"
    ],
    correctIndex: 0,
    explanation: "Node.js utilizes libuv to offload asynchronous I/O tasks to system threads."
  },
  {
    id: 3,
    category: "System Design",
    skillId: "tech-db-03",
    skillName: "Database Indexing & Query Optimization",
    question: "What is the primary trade-off of adding multiple B-Tree secondary indexes to a high-throughput MongoDB collection?",
    options: [
      "Reads become slower while writes become faster",
      "Read queries become significantly faster, but write/insert latency and disk consumption increase",
      "Data consistency is automatically downgraded to eventual consistency",
      "Indexes reduce the maximum document size limit"
    ],
    correctIndex: 1,
    explanation: "Every index must be updated upon each document insertion or modification, adding write overhead."
  },
  {
    id: 4,
    category: "Industry Soft Skill",
    skillId: "soft-agile-01",
    skillName: "Agile Prioritization & Problem Solving",
    question: "Two days before a production release, a critical edge-case bug is discovered that impacts 2% of users. What is the best engineering course of action?",
    options: [
      "Silently ignore it and hope users do not notice",
      "Immediately alert the product lead and tech lead, assess severity, deploy a targeted hotfix or feature-flag, and document the root cause",
      "Cancel the entire release indefinitely without consulting stakeholders",
      "Blame the junior engineer who committed the code"
    ],
    correctIndex: 1,
    explanation: "Transparent escalation, risk assessment, and feature-flagging demonstrate mature engineering ownership."
  },
  {
    id: 5,
    category: "Industry Soft Skill",
    skillId: "soft-comm-02",
    skillName: "Stakeholder Communication & Conflict Resolution",
    question: "A client requests a scope-creep feature that contradicts the architectural foundation agreed upon in the sprint. How do you respond?",
    options: [
      "Agree immediately and work 80 hours over the weekend without telling anyone",
      "Explain the technical impact on stability and timeline, and propose scheduling it as a top priority for the next sprint iteration",
      "Refuse rudely and close the ticket with no explanation",
      "Pretend you completed it without implementing the code"
    ],
    correctIndex: 1,
    explanation: "Constructive pushback with technical justification and timeline trade-offs builds client trust."
  }
];

export default function SkillAssessmentModal({ isOpen, onClose }) {
  const { domainPack, addNotification } = useApp();
  const { activeStudent, completeSkillAssessment } = useData();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const questions = domainPack === 'ayush' ? ayushQuestions : techQuestions;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (index) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: index
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    // Grade the assessment
    let correctCount = 0;
    const verifiedSkills = [];

    questions.forEach(q => {
      const isCorrect = selectedAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        correctCount += 1;
        verifiedSkills.push({
          skillId: q.skillId,
          name: q.skillName,
          category: q.category,
          level: 4,
          verified: true,
          endorsedBy: "Standardized Industry Assessment (AIIA / Industry Board)"
        });
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);

    const assessmentResult = {
      scorePercent,
      correctCount,
      totalQuestions: questions.length,
      passed: scorePercent >= 60,
      verifiedSkills
    };

    setResult(assessmentResult);
    setIsSubmitted(true);

    // Call context to persist verified skills & boost verification confidence
    if (completeSkillAssessment) {
      completeSkillAssessment(assessmentResult);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    addNotification(
      "Assessment Complete!",
      `You scored ${scorePercent}%. Tested competencies are now officially verified on your digital profile.`,
      scorePercent >= 60 ? 'emerald' : 'amber'
    );
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={20} color="#10b981" />
          <span>Standardized Skill Assessment & Aptitude Evaluation</span>
        </div>
      }
      maxWidth="780px"
    >
      {!isSubmitted ? (
        <div>
          {/* Progress Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Progress
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="glass-pill badge-blue" style={{ fontSize: '0.74rem' }}>
                {currentQ.category}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Target Competency: <strong style={{ color: '#e2e8f0' }}>{currentQ.skillName}</strong>
              </span>
            </div>

            <h3 style={{ fontSize: '1.08rem', lineHeight: '1.5', fontWeight: 600, marginBottom: '20px' }}>
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 18px',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid #10b981' : '1px solid var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      background: isSelected ? '#10b981' : 'transparent',
                      color: isSelected ? '#000000' : 'var(--text-muted)'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Next Question <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={!isAllAnswered}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.86rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    opacity: isAllAnswered ? 1 : 0.5
                  }}
                >
                  <ShieldCheck size={16} /> Submit & Calibrate Profile
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Result Scorecard View */
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Award size={36} color="#10b981" />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
            Assessment Calibrated Successfully!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Your test responses have been evaluated against current industry standards.
          </p>

          <div className="grid-metrics" style={{ marginBottom: '24px', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Score Achieved</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {result.scorePercent}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {result.correctCount} of {result.totalQuestions} Questions Correct
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verification Status</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                Level 4 Verified
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                DPI Verified Competency Stamp
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Confidence Boost</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                +25%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Reduced Gap Priority Scores
              </div>
            </div>
          </div>

          {/* Verified Competencies Accordion */}
          <div className="glass-panel" style={{ padding: '18px', textAlign: 'left', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.92rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              Verified Competencies Added to Digital Portfolio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.verifiedSkills.map((sk, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '6px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>{sk.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Category: {sk.category}</div>
                  </div>
                  <span className="glass-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
                    Level {sk.level} Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            View Updated Employability Dashboard & Gap Radar
          </button>
        </div>
      )}
    </Modal>
  );
}
