import { ayushTaxonomy } from '../data/ayushTaxonomy';
import { techTaxonomy } from '../data/techTaxonomy';

const allTaxonomy = [...ayushTaxonomy, ...techTaxonomy];

/**
 * Intelligent Skill Matcher: Matches a required posting skill against student skills by:
 * 1. Direct skillId match
 * 2. Exact name match (case-insensitive)
 * 3. Substring inclusion (e.g. "React.js" inside "React.js & Frontend Architecture")
 * 4. Taxonomy aliases (e.g. ReactJS, Next.js, Redux)
 * 5. Semantic keyword root overlap
 */
export function matchStudentSkill(req, studentSkills = [], taxonomy = allTaxonomy) {
  if (!req || !studentSkills || !studentSkills.length) return null;

  const reqNameClean = (req.name || "").toLowerCase().trim();
  const reqId = req.skillId;

  // 1. Direct ID match
  if (reqId) {
    const directMatch = studentSkills.find(s => s.skillId === reqId);
    if (directMatch) return { skill: directMatch, matchType: 'exact_id', confidence: 1.0 };
  }

  // Look up taxonomy item for aliases
  const taxItem = taxonomy.find(t =>
    t.id === reqId ||
    t.name.toLowerCase() === reqNameClean ||
    (t.aliases || []).some(a => a.toLowerCase() === reqNameClean)
  );

  const aliases = [
    ...(req.aliases || []),
    ...(taxItem?.aliases || [])
  ].map(a => a.toLowerCase().trim());

  const filterWords = new Set(['and', '&', 'the', 'for', 'with', 'in', 'of', 'to', 'protocol', 'procedures', 'architecture', 'engineering']);
  const reqTokens = reqNameClean.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length >= 3 && !filterWords.has(t));

  let bestMatch = null;
  let bestScore = 0;

  for (const s of studentSkills) {
    const sNameClean = (s.name || "").toLowerCase().trim();
    if (!sNameClean) continue;

    // Direct ID match fallback
    if (taxItem && s.skillId === taxItem.id) {
      return { skill: s, matchType: 'taxonomy_id', confidence: 1.0 };
    }

    // Exact name match
    if (sNameClean === reqNameClean) {
      return { skill: s, matchType: 'exact_name', confidence: 1.0 };
    }

    // Substring inclusion (e.g. "React.js" in "React.js & Frontend Architecture")
    if (reqNameClean.includes(sNameClean) || sNameClean.includes(reqNameClean)) {
      const score = 1.0;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { skill: s, matchType: 'substring_exact', confidence: 1.0 };
      }
    }

    // Taxonomy Alias match
    const aliasMatched = aliases.some(alias =>
      sNameClean === alias || sNameClean.includes(alias) || alias.includes(sNameClean)
    );
    if (aliasMatched) {
      const score = 0.95;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { skill: s, matchType: 'alias_match', confidence: 1.0 };
      }
    }

    // Keyword root token overlap
    const sTokens = sNameClean.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length >= 3 && !filterWords.has(t));
    const tokenOverlap = sTokens.some(st => reqTokens.includes(st) || reqTokens.some(rt => rt.includes(st) || st.includes(rt)));
    if (tokenOverlap) {
      const score = 0.90;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { skill: s, matchType: 'token_match', confidence: 1.0 };
      }
    }
  }

  return bestMatch;
}

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
  const requiredSkills = posting.requiredSkills || [];
  let totalSkillWeight = 0;
  let earnedSkillPoints = 0;
  const skillBreakdown = [];

  requiredSkills.forEach(req => {
    const importanceWeight = req.importance === "must-have" ? 1.5 : 1.0;
    const baseWeight = (req.weight || (1 / requiredSkills.length)) * importanceWeight;
    totalSkillWeight += baseWeight;

    const matchedResult = matchStudentSkill(req, student.skills || [], allTaxonomy);
    const matchedSkill = matchedResult?.skill;

    let matchType = "missing";
    let scoreRatio = 0;
    let studentProficiency = 0;

    if (matchedSkill) {
      studentProficiency = matchedSkill.level || 1;
      scoreRatio = Math.min(1.0, studentProficiency / (req.minLevel || 1));
      matchType = scoreRatio >= 1.0 ? "exact_full" : "exact_partial";
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
      isVerified: matchedSkill ? Boolean(matchedSkill.verified) : false,
      endorsedBy: matchedSkill ? matchedSkill.endorsedBy : null
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
