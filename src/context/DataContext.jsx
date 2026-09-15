import React, { createContext, useContext, useState, useMemo } from 'react';
import { useApp } from './AppContext';
import { seedStudents } from '../data/seedStudents';
import { seedPostings } from '../data/seedPostings';
import { seedInstitutions } from '../data/seedInstitutions';
import { ayushTaxonomy } from '../data/ayushTaxonomy';
import { techTaxonomy } from '../data/techTaxonomy';
import { calculateMatchScore } from '../engine/matchingEngine';
import { computeCurriculumGapRadar, computeGapAnalysis } from '../engine/gapAnalysis';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { domainPack, addNotification } = useApp();

  const [students, setStudents] = useState(seedStudents);
  const [postings, setPostings] = useState(seedPostings);
  const [institutions] = useState(seedInstitutions);

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
        createJobPosting
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
