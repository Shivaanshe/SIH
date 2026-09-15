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
  const { domainPack, addNotification } = useApp();

  const [students, setStudents] = useState(seedStudents);
  const [postings, setPostings] = useState(seedPostings);
  const [institutions] = useState(seedInstitutions);

  // New official feature datasets
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

          // If database already contains data, fetch live records
          if (data.hasData) {
            setDataSource('api');
            const [jobsRes, studentsRes] = await Promise.allSettled([
              fetch('http://localhost:5000/api/jobs'),
              fetch('http://localhost:5000/api/spoc/cohort')
            ]);

            if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
              const jobsData = await jobsRes.value.json();
              if (jobsData.postings && jobsData.postings.length > 0) {
                setPostings(jobsData.postings);
              }
            }

            if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
              const studsData = await studentsRes.value.json();
              if (studsData.students && studsData.students.length > 0) {
                setStudents(studsData.students);
              }
            }
          }
        } else {
          setDbStatus(prev => ({ ...prev, checked: true, isOffline: true }));
        }
      } catch (err) {
        // Backend offline — keep using local fallback seed data safely
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

  // Active student based on domain pack
  const activeStudent = useMemo(() => {
    return students.find(s => s.domainPack === domainPack) || students[0];
  }, [students, domainPack]);

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
    return computeCurriculumGapRadar(domainStudents, activePostings, domainPack);
  }, [students, activePostings, domainPack]);

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
  const updateStudentSkills = (studentId, newSkillsList) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          skills: newSkillsList
        };
      }
      return s;
    }));
    addNotification("Profile Updated", "Skill inventory and proficiency levels saved successfully.", "emerald");
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

  return (
    <DataContext.Provider
      value={{
        students,
        postings: activePostings,
        allPostings: postings,
        institutions,
        activeStudent,
        activeTaxonomy,
        studentMatches,
        batchCurriculumGaps,
        applyToPosting,
        updateApplicationStatus,
        endorseStudentSkill,
        updateStudentSkills,
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
