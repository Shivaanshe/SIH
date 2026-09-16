import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useApp } from './AppContext';
import { seedStudents } from '../data/seedStudents';
import { seedPostings } from '../data/seedPostings';
import { seedInstitutions } from '../data/seedInstitutions';
import { ayushTaxonomy } from '../data/ayushTaxonomy';
import { techTaxonomy } from '../data/techTaxonomy';
import {
  seedFdpPrograms,
  seedCollaborationItems,
  seedLearningPrograms,
  seedInternshipProgress
} from '../data/seedCollaboration';
import { calculateMatchScore } from '../engine/matchingEngine';
import { computeCurriculumGapRadar, computeGapAnalysis } from '../engine/gapAnalysis';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { domainPack, addNotification, currentUser, role } = useApp();

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('kaushal_all_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize any Authorized Stakeholder names
          return parsed.map(s => {
            if (!s.name || s.name === 'Authorized Stakeholder') {
              const prefix = s.email ? s.email.split('@')[0].replace(/[._0-9]/g, ' ').trim() : 'Dhruv';
              const clean = prefix ? prefix.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Dhruv';
              return { ...s, name: clean };
            }
            return s;
          });
        }
      }
    } catch (e) {}
    return seedStudents;
  });
  const [postings, setPostings] = useState(seedPostings);
  const [institutions, setInstitutions] = useState(seedInstitutions);
  const [directives, setDirectives] = useState([
    {
      id: "dir-01",
      title: "Mandatory Clinical Trials & GCP Compliance Protocol (Schedule Y / Ayush GCP)",
      target: "All 482 Affiliated BAMS Institutions",
      domainPack: "ayush",
      issuedAt: "Sept 2026",
      status: "Active",
      skillsImpacted: ["Clinical Trial Documentation & AYUSH GCP", "Schedule T & GMP Regulations"],
      adoptedInstitutions: ["inst-aiia-01"]
    },
    {
      id: "dir-02",
      title: "Mandatory Cloud Architecture & Microservices Certification",
      target: "All 850 Affiliated Engineering Colleges",
      domainPack: "tech",
      issuedAt: "Aug 2026",
      status: "Active",
      skillsImpacted: ["Cloud Architecture & AWS/GCP", "Docker & Kubernetes"],
      adoptedInstitutions: ["inst-dtu-04"]
    }
  ]);

  // Official collaboration, FDP, learning & internship datasets
  const [fdpPrograms, setFdpPrograms] = useState(seedFdpPrograms);
  const [collaborationItems, setCollaborationItems] = useState(seedCollaborationItems);
  const [learningPrograms, setLearningPrograms] = useState(seedLearningPrograms);
  const [internshipProgress, setInternshipProgress] = useState(seedInternshipProgress);

  // Backend connection and database state
  const [dbStatus, setDbStatus] = useState({
    checked: false,
    hasData: false,
    isOffline: true,
    counts: { students: 0, jobs: 0, skills: 0 }
  });
  const [dataSource, setDataSource] = useState('seed'); // 'api' or 'seed'

  // Check backend & database status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('http://localhost:5000/api/seed/status');
        if (res.ok) {
          const data = await res.json();
          setDbStatus({
            checked: true,
            hasData: Boolean(data.hasData),
            isOffline: false,
            counts: data.counts || { students: 0, jobs: 0, skills: 0 }
          });

          if (data.hasData) {
            setDataSource('api');
            const [jobsRes, studentsRes] = await Promise.allSettled([
              fetch('http://localhost:5000/api/jobs'),
              fetch('http://localhost:5000/api/students')
            ]);

            if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
              const jobsData = await jobsRes.value.json();
              if (jobsData.postings && jobsData.postings.length > 0) {
                setPostings(jobsData.postings);
              }
            }

            let studsData = null;
            if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
              try {
                studsData = await studentsRes.value.json();
              } catch (e) {}
            }
            if (!studsData) {
              try {
                const cohortRes = await fetch('http://localhost:5000/api/spoc/cohort');
                if (cohortRes.ok) studsData = await cohortRes.json();
              } catch (e) {}
            }

            if (studsData && studsData.students && studsData.students.length > 0) {
              setStudents(prev => {
                const sanitizedApiStudents = studsData.students.map(s => {
                  let name = s.name;
                  if (!name || name === 'Authorized Stakeholder') {
                    const prefix = s.email ? s.email.split('@')[0].replace(/[._0-9]/g, ' ').trim() : 'Dhruv';
                    name = prefix ? prefix.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Dhruv';
                  }
                  return { ...s, name };
                });

                const merged = [...sanitizedApiStudents];
                prev.forEach(p => {
                  if (!merged.some(m => (m.email && p.email && m.email.toLowerCase() === p.email.toLowerCase()) || m.id === p.id)) {
                    let name = p.name;
                    if (!name || name === 'Authorized Stakeholder') {
                      const prefix = p.email ? p.email.split('@')[0].replace(/[._0-9]/g, ' ').trim() : 'Dhruv';
                      name = prefix ? prefix.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Dhruv';
                    }
                    merged.push({ ...p, name });
                  }
                });
                return merged;
              });
            }
          }
        } else {
          setDbStatus(prev => ({ ...prev, checked: true, isOffline: true }));
        }
      } catch (err) {
        setDbStatus({
          checked: true,
          hasData: false,
          isOffline: true,
          counts: { students: 0, jobs: 0, skills: 0 }
        });
      }
    }

    checkStatus();
  }, []);

  // Persist all live students to localStorage so HR & SPOC see all registrations across sessions
  useEffect(() => {
    if (students && students.length > 0) {
      try {
        localStorage.setItem('kaushal_all_students', JSON.stringify(students));
      } catch (e) {}
    }
  }, [students]);

  // Action: Seed database when empty
  const seedDatabaseNow = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setDbStatus({
          checked: true,
          hasData: true,
          isOffline: false,
          counts: data.counts || { students: 2, jobs: 2, skills: 5 }
        });
        setDataSource('api');
        addNotification("Database Seeded", "Successfully initialized database with AYUSH & Tech baseline records.", "emerald");
      } else {
        addNotification("Seeding Notice", data.message || "Could not seed database.", "amber");
      }
    } catch (err) {
      addNotification("Backend Offline", "Start the backend server on port 5000 to seed MongoDB.", "rose");
    }
  };

  // Synchronize authenticated student user with local student records
  useEffect(() => {
    if (role === 'student' && currentUser?.email) {
      const cleanEmail = currentUser.email.toLowerCase().trim();
      setStudents(prev => {
        const existingIndex = prev.findIndex(s => s.email?.toLowerCase().trim() === cleanEmail);
        let studentName = currentUser.name;
        if (!studentName || studentName === 'Authorized Stakeholder') {
          const raw = cleanEmail.split('@')[0].replace(/[._0-9]/g, ' ').trim();
          studentName = raw ? raw.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Dhruv';
        }

        if (existingIndex >= 0) {
          if (prev[existingIndex].name !== studentName || prev[existingIndex].name === 'Authorized Stakeholder') {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], name: studentName };
            return updated;
          }
          return prev;
        }

        // Initialize personal profile for newly logged-in/registered student (e.g. Dhruv)
        const nameCode = (studentName || 'STUD').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'STUD';
        const newStudent = {
          id: currentUser.id || `stud-${Date.now()}`,
          name: studentName,
          email: currentUser.email,
          degree: domainPack === 'ayush'
            ? 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)'
            : 'B.Tech in Computer Science & Engineering',
          year: 'Final Year (Batch 2026)',
          institutionId: domainPack === 'ayush' ? 'inst-aiia-01' : 'inst-dtu-04',
          institutionName: domainPack === 'ayush'
            ? 'All India Institute of Ayurveda (AIIA), New Delhi'
            : 'Delhi Technological University (DTU), New Delhi',
          apaarId: `IN-APAAR-2026-${nameCode}-${Math.floor(1000 + Math.random() * 9000)}`,
          verificationConfidence: 0.85,
          domainPack: domainPack,
          avatar: currentUser.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          skills: [],
          appliedPostings: [],
          projects: [],
          uploadedResume: null
        };
        return [newStudent, ...prev];
      });
    }
  }, [role, currentUser, domainPack]);

  // Active student based on authenticated student user or domain pack
  const activeStudent = useMemo(() => {
    if (role === 'student' && currentUser?.email) {
      const cleanEmail = currentUser.email.toLowerCase().trim();
      const userStudent = students.find(s => s.email?.toLowerCase().trim() === cleanEmail);
      if (userStudent) return userStudent;

      if (currentUser.name) {
        const nameMatch = students.find(s => s.name?.toLowerCase().trim() === currentUser.name.toLowerCase().trim());
        if (nameMatch) return nameMatch;
      }
    }
    return students.find(s => s.domainPack === domainPack) || students[0];
  }, [students, domainPack, role, currentUser]);

  // Active postings filtered by domain pack
  const activePostings = useMemo(() => {
    return postings.filter(p => p.domainPack === domainPack);
  }, [postings, domainPack]);

  // Active taxonomy based on domain pack
  const activeTaxonomy = useMemo(() => {
    return domainPack === 'ayush' ? ayushTaxonomy : techTaxonomy;
  }, [domainPack]);

  // Precalculated matches for active student across all active postings
  const studentMatches = useMemo(() => {
    if (!activeStudent) return [];
    return activePostings.map(post => {
      const matchResult = calculateMatchScore(activeStudent, post);
      const gaps = computeGapAnalysis(activeStudent, post, domainPack);
      return {
        posting: post,
        matchResult,
        gaps
      };
    }).sort((a, b) => b.matchResult.matchPercent - a.matchResult.matchPercent);
  }, [activeStudent, activePostings, domainPack]);

  // Batch Curriculum Gap Radar for SPOC
  const batchCurriculumGaps = useMemo(() => {
    const domainStudents = students.filter(s => s.domainPack === domainPack);
    return computeCurriculumGapRadar(domainStudents, activePostings, domainPack, directives);
  }, [students, activePostings, domainPack, directives]);

  // Apply to opportunity
  const applyToPosting = (postingId) => {
    if (!activeStudent) return;

    // Check if already applied
    const existing = (activeStudent.appliedPostings || []).find(a => a.postingId === postingId);
    if (existing) {
      addNotification("Already Applied", "You have already submitted your application for this opportunity.", "amber");
      return;
    }

    const post = postings.find(p => p.id === postingId);
    const score = calculateMatchScore(activeStudent, post);

    const newApplication = {
      postingId,
      appliedAt: new Date().toISOString().split('T')[0],
      status: "Applied",
      matchScore: score.matchPercent,
      gapReport: computeGapAnalysis(activeStudent, post, domainPack)
    };

    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          appliedPostings: [newApplication, ...(s.appliedPostings || [])]
        };
      }
      return s;
    }));

    // Increment applicant count on posting
    setPostings(prev => prev.map(p => {
      if (p.id === postingId) {
        return { ...p, applicantsCount: (p.applicantsCount || 0) + 1 };
      }
      return p;
    }));

    // Persist to backend MongoDB if online
    fetch('http://localhost:5000/api/students/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: activeStudent.id,
        postingId,
        matchScore: score.matchPercent,
        gapReport: computeGapAnalysis(activeStudent, post, domainPack)
      })
    }).catch(err => console.warn("Backend application sync note:", err.message));

    addNotification("Application Submitted", `Successfully applied to ${post?.title} (${score.matchPercent}% Match).`, "emerald");
  };

  // Recruiter action: Shortlist or Reject with feedback
  const updateApplicationStatus = (studentId, postingId, newStatus, rejectionReason = "") => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedApplied = (s.appliedPostings || []).map(a => {
          if (a.postingId === postingId) {
            return {
              ...a,
              status: newStatus,
              rejectionReason: newStatus === "Rejected" ? rejectionReason : null,
              decisionDate: new Date().toISOString().split('T')[0]
            };
          }
          return a;
        });
        return { ...s, appliedPostings: updatedApplied };
      }
      return s;
    }));

    // Sync to backend MongoDB if online
    if (newStatus === "Rejected") {
      fetch('http://localhost:5000/api/recruiter/applications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, postingId, rejectionReason })
      }).catch(err => console.warn("Backend reject sync note:", err.message));
    } else {
      fetch('http://localhost:5000/api/recruiter/applications/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, postingId, newStatus })
      }).catch(err => console.warn("Backend status sync note:", err.message));
    }

    addNotification(
      `Candidate ${newStatus}`,
      `Application updated to ${newStatus}${rejectionReason ? `: "${rejectionReason}"` : ""}.`,
      newStatus === "Shortlisted" ? "emerald" : "rose"
    );
  };

  // SPOC action: Endorse student skill
  const endorseStudentSkill = (studentId, skillId, spocName = "Dr. Arvind Verma") => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedSkills = (s.skills || []).map(sk => {
          if (sk.skillId === skillId) {
            return {
              ...sk,
              verified: true,
              endorsedBy: spocName,
              level: Math.min(5, sk.level + 1) // Endorsement confirms & recognizes verified level
            };
          }
          return sk;
        });

        // Boost verification confidence
        const newConfidence = Math.min(1.0, (s.verificationConfidence || 0.5) + 0.15);

        return {
          ...s,
          skills: updatedSkills,
          verificationConfidence: Number(newConfidence.toFixed(2))
        };
      }
      return s;
    }));

    addNotification("Skill Endorsed by Faculty", `Official SPOC endorsement added. Student verification confidence boosted!`, "emerald");
  };

  // Update student skills from profile or NLP parser
  const updateStudentSkills = (studentId, newSkillsList, additionalData = {}) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          skills: newSkillsList,
          ...additionalData
        };
      }
      return s;
    }));
    addNotification("Profile Updated", "Skill inventory and profile details saved successfully.", "emerald");
  };

  // Recruiter creates a new posting
  const createJobPosting = (newPostingData) => {
    const newPost = {
      ...newPostingData,
      id: `job-${domainPack}-${Date.now().toString().slice(-4)}`,
      domainPack,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0
    };

    setPostings(prev => [newPost, ...prev]);
    addNotification("Opportunity Published", `Successfully posted "${newPost.title}". Live on student feeds.`, "emerald");
  };

  // Recruiter closes or reopens a posting
  const closeJobPosting = (postingId) => {
    const target = postings.find(p => p.id === postingId);
    if (!target) return;
    const newClosed = !target.isClosed;

    setPostings(prev => prev.map(p => {
      if (p.id === postingId) {
        return { ...p, isClosed: newClosed };
      }
      return p;
    }));

    addNotification(
      newClosed ? "Opportunity Closed" : "Opportunity Reopened",
      `"${target.title}" is now ${newClosed ? 'closed to new applicants' : 'active and accepting applicants'}.`,
      newClosed ? "amber" : "emerald"
    );
  };

  // Recruiter deletes a posting
  const deleteJobPosting = (postingId) => {
    setPostings(prev => prev.filter(p => p.id !== postingId));
    addNotification("Opportunity Deleted", "Posting permanently removed from active listings.", "rose");
  };

  // 1. Skill Assessment Completion Handler
  const completeSkillAssessment = (assessmentResult) => {
    if (!activeStudent) return;

    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        const currentSkills = [...(s.skills || [])];

        // Merge or update verified skills
        (assessmentResult.verifiedSkills || []).forEach(vSkill => {
          const existingIdx = currentSkills.findIndex(sk => sk.skillId === vSkill.skillId);
          if (existingIdx !== -1) {
            currentSkills[existingIdx] = {
              ...currentSkills[existingIdx],
              level: Math.max(currentSkills[existingIdx].level, vSkill.level),
              verified: true,
              endorsedBy: vSkill.endorsedBy
            };
          } else {
            currentSkills.push(vSkill);
          }
        });

        // Boost verification confidence
        const newConfidence = Math.min(0.95, (s.verificationConfidence || 0.6) + 0.20);

        return {
          ...s,
          skills: currentSkills,
          verificationConfidence: Number(newConfidence.toFixed(2))
        };
      }
      return s;
    }));
  };

  // 2. Faculty FDP Application Handler
  const applyToFdp = (fdpId) => {
    setFdpPrograms(prev => prev.map(f => {
      if (f.id === fdpId) {
        return { ...f, applicantsCount: (f.applicantsCount || 0) + 1 };
      }
      return f;
    }));
  };

  // 3. Mentorship Slot Booking Handler
  const bookMentorshipSlot = (collabId) => {
    setCollaborationItems(prev => prev.map(c => {
      if (c.id === collabId && c.slotsAvailable > 0) {
        return { ...c, slotsAvailable: c.slotsAvailable - 1 };
      }
      return c;
    }));
  };

  // 4. Learning Program Enrollment Handler
  const enrollInLearningProgram = (program) => {
    setLearningPrograms(prev => prev.map(p => {
      if (p.id === program.id) {
        return { ...p, enrolledCount: (p.enrolledCount || 0) + 1 };
      }
      return p;
    }));
  };

  // 5. Internship Progress Milestone Submission Handler
  const submitInternshipMilestone = ({ title, notes }) => {
    if (!internshipProgress) return;

    const newMilestone = {
      weekNumber: (internshipProgress.milestones?.length || 0) + 1,
      title,
      status: "Under Review",
      submittedDate: new Date().toISOString().split('T')[0],
      mentorFeedback: notes || "Milestone submitted to industry mentor for evaluation."
    };

    setInternshipProgress(prev => ({
      ...prev,
      currentWeek: prev.currentWeek + 1,
      overallProgressPercent: Math.min(100, prev.overallProgressPercent + 10),
      milestones: [newMilestone, ...(prev.milestones || [])]
    }));
  };

  // 6. National Policy Directive Handlers
  const addDirective = (directive) => {
    const newDir = {
      id: `dir-${Date.now()}`,
      title: directive.title,
      target: directive.target || (domainPack === 'ayush' ? 'All 482 Affiliated BAMS Institutions' : 'All 850 Affiliated Engineering Colleges'),
      domainPack: directive.domainPack || domainPack,
      issuedAt: 'Just Now',
      status: 'Active',
      skillsImpacted: directive.skillsImpacted || [directive.title],
      adoptedInstitutions: []
    };
    setDirectives(prev => [newDir, ...prev]);
    addNotification("National Directive Broadcast", `Ministry issued: "${newDir.title}". Transmitted to all college SPOC radars.`, "emerald");
    return newDir;
  };

  const adoptDirective = (directiveId, institutionId = 'inst-aiia-01') => {
    setDirectives(prev => prev.map(d => {
      if (d.id === directiveId) {
        const adopted = d.adoptedInstitutions || [];
        if (!adopted.includes(institutionId)) {
          return { ...d, adoptedInstitutions: [...adopted, institutionId] };
        }
      }
      return d;
    }));
    addNotification("Curriculum Directive Adopted", "Syllabus revision initiated. Course modules scheduled for upcoming semester.", "emerald");
  };

  const updateStudentInstitution = (studentId, inst) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          institutionId: inst.id,
          institutionName: `${inst.name}, ${inst.location}`
        };
      }
      return s;
    }));
    addNotification("Institution Updated", `Affiliated with ${inst.name}.`, "emerald");
  };

  // Student verifies academic credentials via DigiLocker / MeriPehchaan DPI
  const verifyStudentDigiLocker = async (studentId, digiLockerPayload = {}) => {
    // 1. Update in-memory state immediately
    setStudents(prev => prev.map(s => {
      if (s.id === studentId || (activeStudent && (s.id === activeStudent.id || (s.email && activeStudent.email && s.email.toLowerCase() === activeStudent.email.toLowerCase())))) {
        let apaarId = s.apaarId;
        if (!apaarId || !apaarId.startsWith('IN-APAAR')) {
          const nameCode = (s.name || 'STUD').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'STUD';
          apaarId = `IN-APAAR-2026-${nameCode}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        return {
          ...s,
          digiLockerVerified: true,
          verificationConfidence: Math.max(0.95, s.verificationConfidence || 0.6),
          apaarId,
          digiLockerData: {
            verifiedAt: new Date().toISOString(),
            aadhaarMasked: digiLockerPayload.aadhaarMasked || 'XXXX-XXXX-3891',
            docTypes: digiLockerPayload.docTypes || ['APAAR / ABC ID Card', 'Class XII Marksheet', 'Degree Transcript'],
            issuer: 'Ministry of Electronics & IT / NeGD'
          }
        };
      }
      return s;
    }));

    // 2. Persist to backend MongoDB
    try {
      const targetId = activeStudent ? (activeStudent.email || activeStudent.id) : studentId;
      await fetch(`http://localhost:5000/api/students/${targetId}/verify-digilocker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(digiLockerPayload)
      });
    } catch (e) {
      console.warn("MongoDB DigiLocker sync note:", e.message);
    }

    addNotification(
      "DigiLocker Verified & Stored",
      "Digital credentials verified via MeitY DPI. Verification Confidence boosted to 95%!",
      "emerald"
    );
  };

  return (
    <DataContext.Provider
      value={{
        students,
        postings: activePostings,
        allPostings: postings,
        institutions,
        directives,
        addDirective,
        adoptDirective,
        updateStudentInstitution,
        activeStudent,
        activeTaxonomy,
        studentMatches,
        batchCurriculumGaps,
        applyToPosting,
        updateApplicationStatus,
        endorseStudentSkill,
        updateStudentSkills,
        verifyStudentDigiLocker,
        createJobPosting,
        closeJobPosting,
        deleteJobPosting,
        dbStatus,
        dataSource,
        seedDatabaseNow,
        fdpPrograms,
        collaborationItems,
        learningPrograms,
        internshipProgress,
        completeSkillAssessment,
        applyToFdp,
        bookMentorshipSlot,
        enrollInLearningProgram,
        submitInternshipMilestone
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
