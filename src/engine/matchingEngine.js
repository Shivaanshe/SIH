/**
 * KaushalSetu Core Matching Engine (PRD §11.2)
 * Formula: Match % = (w1 * SkillScore) + (w2 * ProjectRelevance) + (w3 * Eligibility) + (w4 * VerificationConfidence)
 */

export function calculateMatchScore(student, posting) {
  if (!student || !posting) {
    return {
      matchPercent: 0,
      skillScore: 0,
      projectScore: 0,
      eligibilityScore: 0,
      verificationScore: 0,
      formulaBreakdown: {},
      skillBreakdown: []
    };
  }

  const weights = posting.weights || {
    w1_skill: 0.45,
    w2_project: 0.20,
    w3_eligibility: 0.15,
    w4_verification: 0.20
  };

  // 1. Skill Score Calculation
  const studentSkillMap = new Map();
  (student.skills || []).forEach(s => {
    studentSkillMap.set(s.skillId, s);
  });

  const requiredSkills = posting.requiredSkills || [];
  let totalSkillWeight = 0;
  let earnedSkillPoints = 0;
  const skillBreakdown = [];

  requiredSkills.forEach(req => {
    const importanceWeight = req.importance === "must-have" ? 1.5 : 1.0;
    const baseWeight = (req.weight || (1 / requiredSkills.length)) * importanceWeight;
    totalSkillWeight += baseWeight;

    const studentSkill = studentSkillMap.get(req.skillId);
    let matchType = "missing";
    let scoreRatio = 0;
    let studentProficiency = 0;

    if (studentSkill) {
      studentProficiency = studentSkill.level || 1;
      scoreRatio = Math.min(1.0, studentProficiency / (req.minLevel || 1));
      matchType = scoreRatio >= 1.0 ? "exact_full" : "exact_partial";
    } else {
      // Check for partial semantic/category overlap if any student skill shares the category
      const partialSkill = (student.skills || []).find(s => {
        return (req.aliases || []).some(alias => 
          (s.name && s.name.toLowerCase().includes(alias.toLowerCase())) ||
          (alias.toLowerCase().includes(s.name ? s.name.toLowerCase() : ""))
        );
      });

      if (partialSkill) {
        studentProficiency = partialSkill.level || 1;
        scoreRatio = Math.min(0.70, (studentProficiency / (req.minLevel || 1)) * 0.70); // 30% discount for semantic synonym
        matchType = "semantic_partial";
      }
    }

    earnedSkillPoints += scoreRatio * baseWeight;

    skillBreakdown.push({
      skillId: req.skillId,
      name: req.name,
      requiredLevel: req.minLevel || 1,
      studentLevel: studentProficiency,
      importance: req.importance,
      matchType,
      scoreContribution: Math.round(scoreRatio * 100),
      isVerified: studentSkill ? Boolean(studentSkill.verified) : false,
      endorsedBy: studentSkill ? studentSkill.endorsedBy : null
    });
  });

  const skillScore = totalSkillWeight > 0 ? (earnedSkillPoints / totalSkillWeight) : 0;

  // 2. Project Relevance Calculation
  let projectPoints = 0;
  const postingKeywords = [
    posting.title,
    posting.sector,
    posting.description,
    ...(posting.requiredSkills || []).map(s => s.name)
  ].join(" ").toLowerCase();

  const studentProjects = student.projects || [];
  if (studentProjects.length > 0) {
    studentProjects.forEach(proj => {
      const projText = [
        proj.title,
        proj.description,
        ...(proj.tags || [])
      ].join(" ").toLowerCase();

      // Check keyword overlap
      let hits = 0;
      (posting.requiredSkills || []).forEach(req => {
        if (projText.includes(req.name.toLowerCase())) hits += 2;
        (req.aliases || []).forEach(alias => {
          if (projText.includes(alias.toLowerCase())) hits += 1;
        });
      });

      if (hits >= 2) projectPoints += 0.5;
      else if (hits >= 1) projectPoints += 0.3;
    });
    projectPoints = Math.min(1.0, projectPoints);
  }
  const projectScore = Math.max(0.2, projectPoints); // Baseline baseline for having hands-on work

  // 3. Eligibility Gate & Score
  let eligibilityScore = 1.0;
  const elig = posting.eligibility || {};
  if (elig.minCgpa && student.cgpa < elig.minCgpa) {
    eligibilityScore -= 0.35;
  }
  if (elig.degree && elig.degree.length > 0) {
    const hasMatchingDegree = elig.degree.some(d => 
      student.degree && student.degree.toLowerCase().includes(d.toLowerCase())
    );
    if (!hasMatchingDegree) eligibilityScore -= 0.40;
  }
  eligibilityScore = Math.max(0, eligibilityScore);

  // 4. Verification Confidence Score
  // Self-rated baseline is 0.50. Spoc endorsed or DigiLocker raises it to 0.85 - 1.0.
  let verificationScore = student.verificationConfidence || 0.55;
  if (student.digiLockerVerified) verificationScore = Math.max(verificationScore, 0.75);

  // Combine weighted components
  const compositeScore = (
    (weights.w1_skill * skillScore) +
    (weights.w2_project * projectScore) +
    (weights.w3_eligibility * eligibilityScore) +
    (weights.w4_verification * verificationScore)
  );

  const matchPercent = Math.min(100, Math.max(12, Math.round(compositeScore * 100)));

  return {
    matchPercent,
    skillScore: Math.round(skillScore * 100),
    projectScore: Math.round(projectScore * 100),
    eligibilityScore: Math.round(eligibilityScore * 100),
    verificationScore: Math.round(verificationScore * 100),
    weights: {
      w1: Math.round(weights.w1_skill * 100),
      w2: Math.round(weights.w2_project * 100),
      w3: Math.round(weights.w3_eligibility * 100),
      w4: Math.round(weights.w4_verification * 100)
    },
    formulaBreakdown: {
      skillComponent: Math.round(weights.w1_skill * skillScore * 100),
      projectComponent: Math.round(weights.w2_project * projectScore * 100),
      eligibilityComponent: Math.round(weights.w3_eligibility * eligibilityScore * 100),
      verificationComponent: Math.round(weights.w4_verification * verificationScore * 100)
    },
    skillBreakdown
  };
}
