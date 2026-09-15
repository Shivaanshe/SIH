import { StudentProfile } from '../models/StudentProfile.js';
import { JobPosting } from '../models/JobPosting.js';
import { SkillTaxonomy } from '../models/SkillTaxonomy.js';

/**
 * Core Matching Algorithm Implementation
 * Formula: Match % = (w1 * SkillScore) + (w2 * ProjectRelevance) + (w3 * Eligibility) + (w4 * VerificationConfidence)
 */
function computeScore(student, posting) {
  if (!student || !posting) return { matchPercent: 0, gaps: [] };

  const weights = posting.weights || {
    w1_skill: 0.45,
    w2_project: 0.20,
    w3_eligibility: 0.15,
    w4_verification: 0.20
  };

  // 1. Skill Score
  const studentSkillMap = new Map();
  (student.skills || []).forEach(s => studentSkillMap.set(s.skillId, s));

  let totalSkillWeight = 0;
  let earnedSkillPoints = 0;
  const gaps = [];

  (posting.requiredSkills || []).forEach(req => {
    const importanceWeight = req.importance === 'must-have' ? 1.5 : 1.0;
    const baseWeight = (req.weight || (1 / posting.requiredSkills.length)) * importanceWeight;
    totalSkillWeight += baseWeight;

    const studentSkill = studentSkillMap.get(req.skillId);
    let scoreRatio = 0;

    if (studentSkill) {
      scoreRatio = Math.min(1.0, (studentSkill.level || 1) / (req.minLevel || 1));
    }

    earnedSkillPoints += scoreRatio * baseWeight;

    const gapSize = Math.max(0, (req.minLevel || 1) - (studentSkill ? studentSkill.level : 0));
    if (gapSize > 0) {
      gaps.push({
        skillId: req.skillId,
        skillName: req.name,
        requiredLevel: req.minLevel || 1,
        studentLevel: studentSkill ? studentSkill.level : 0,
        gapSize,
        importance: req.importance,
        priorityScore: gapSize * (req.importance === 'must-have' ? 2 : 1)
      });
    }
  });

  const skillScore = totalSkillWeight > 0 ? (earnedSkillPoints / totalSkillWeight) : 0;

  // 2. Project Relevance
  const projectScore = (student.projects || []).length > 0 ? 0.8 : 0.2;

  // 3. Eligibility Score
  let eligibilityScore = 1.0;
  if (posting.eligibility?.minCgpa && student.cgpa < posting.eligibility.minCgpa) {
    eligibilityScore -= 0.35;
  }

  // 4. Verification Confidence
  const verificationScore = student.verificationConfidence || 0.55;

  const composite = (
    (weights.w1_skill * skillScore) +
    (weights.w2_project * projectScore) +
    (weights.w3_eligibility * eligibilityScore) +
    (weights.w4_verification * verificationScore)
  );

  const matchPercent = Math.min(100, Math.max(15, Math.round(composite * 100)));
  return { matchPercent, gaps: gaps.sort((a, b) => b.priorityScore - a.priorityScore) };
}

/**
 * ============================================================================
 * FUNCTION: getMatchesForStudent
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read student ID from req.params.studentId.
 * 2. Fetch student profile from MongoDB.
 * 3. Fetch all active job postings matching the student's domainPack ('ayush' or 'tech').
 * 4. Run the 4-factor matching engine for each posting.
 * 5. Attach computed Match % and prioritized Gap Analysis to each opportunity.
 * 6. Sort results by highest match score descending.
 * 7. Return 200 OK with { success: true, count, matches: [...] }.
 *
 * HTTP METHOD & ROUTE: GET /api/matching/student/:studentId
 * ACCESS: Private (Student / SPOC)
 */
export async function getMatchesForStudent(req, res, next) {
  try {
    const { studentId } = req.params;
    const student = await StudentProfile.findOne({
      $or: [{ id: studentId }, { email: studentId }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found for ID: ${studentId}`
      });
    }

    const postings = await JobPosting.find({ domainPack: student.domainPack });
    const matches = postings.map(post => {
      const { matchPercent, gaps } = computeScore(student, post);
      return {
        posting: post,
        matchPercent,
        gaps
      };
    }).sort((a, b) => b.matchPercent - a.matchPercent);

    res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: getRankedCandidatesForJob
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read posting ID from req.params.jobId.
 * 2. Fetch the target JobPosting from MongoDB.
 * 3. Query all student profiles in the corresponding domainPack.
 * 4. Run matching formula for each student against this job.
 * 5. Sort candidate list by Match % descending.
 * 6. Return 200 OK with { success: true, count, candidates: [...] }.
 *
 * HTTP METHOD & ROUTE: GET /api/matching/job/:jobId/candidates
 * ACCESS: Private (Recruiter / HR)
 */
export async function getRankedCandidatesForJob(req, res, next) {
  try {
    const { jobId } = req.params;
    const job = await JobPosting.findOne({ id: jobId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job posting not found for ID: ${jobId}`
      });
    }

    const candidates = await StudentProfile.find({ domainPack: job.domainPack });
    const ranked = candidates.map(stud => {
      const { matchPercent, gaps } = computeScore(stud, job);
      return {
        student: stud,
        matchPercent,
        gaps
      };
    }).sort((a, b) => b.matchPercent - a.matchPercent);

    res.status(200).json({
      success: true,
      count: ranked.length,
      candidates: ranked
    });
  } catch (error) {
    next(error);
  }
}
