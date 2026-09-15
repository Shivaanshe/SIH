import { ayushTaxonomy } from '../data/ayushTaxonomy';
import { techTaxonomy } from '../data/techTaxonomy';
import { matchStudentSkill } from './matchingEngine';

/**
 * KaushalSetu Gap Analysis Engine (PRD §11.3 & §11.4)
 * Generates ranked missing/weak skills per opportunity with prescriptive learning pathways.
 */

export function computeGapAnalysis(student, posting, domainPack = "ayush") {
  if (!student || !posting) return [];

  const taxonomy = domainPack === "ayush" ? ayushTaxonomy : techTaxonomy;
  const allTaxonomy = [...ayushTaxonomy, ...techTaxonomy];
  const taxonomyMap = new Map();
  allTaxonomy.forEach(item => taxonomyMap.set(item.id, item));

  const gaps = [];

  (posting.requiredSkills || []).forEach(req => {
    const matchedResult = matchStudentSkill(req, student.skills || [], allTaxonomy);
    const matchedSkill = matchedResult?.skill;
    const studentLevel = matchedSkill ? matchedSkill.level : 0;
    const requiredLevel = req.minLevel || 1;
    const gapSize = Math.max(0, requiredLevel - studentLevel);

    if (gapSize > 0) {
      const taxonomyItem = taxonomyMap.get(req.skillId) || {};
      const importanceWeight = req.importance === "must-have" ? 2.0 : 1.0;
      const priorityScore = gapSize * importanceWeight;

      gaps.push({
        skillId: req.skillId,
        skillName: req.name,
        requiredLevel,
        studentLevel,
        gapSize,
        importance: req.importance,
        priorityScore,
        category: taxonomyItem.category || "General",
        resources: taxonomyItem.resources || [
          {
            title: `Mastering ${req.name}`,
            provider: "SWAYAM / NPTEL",
            url: "https://swayam.gov.in",
            type: "Online Certification",
            estMinutes: 90
          }
        ],
        projectIdea: taxonomyItem.projectIdea || `Design a practical case log demonstration of ${req.name}.`
      });
    }
  });

  // Sort by highest priority score (importance * gapSize)
  return gaps.sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Aggregates batch-wide curriculum gaps across an institution's students vs. active postings (PRD §10.3)
 */
export function computeCurriculumGapRadar(students, postings, domainPack = "ayush") {
  const taxonomy = domainPack === "ayush" ? ayushTaxonomy : techTaxonomy;
  const taxonomyMap = new Map();
  taxonomy.forEach(t => taxonomyMap.set(t.id, t));

  const skillDeficiencyMap = new Map();

  taxonomy.forEach(t => {
    skillDeficiencyMap.set(t.id, {
      skillId: t.id,
      name: t.name,
      category: t.category,
      batchDeficientCount: 0,
      totalStudentsEvaluated: students.length,
      industryDemandCount: 0,
      avgBatchProficiency: 0,
      deficiencyRate: 0,
      leverageScore: 0
    });
  });

  // 1. Calculate how many postings require this skill
  postings.forEach(p => {
    (p.requiredSkills || []).forEach(req => {
      if (skillDeficiencyMap.has(req.skillId)) {
        const item = skillDeficiencyMap.get(req.skillId);
        item.industryDemandCount += (req.importance === "must-have" ? 2 : 1);
      }
    });
  });

  // 2. Calculate student proficiencies & deficiencies
  students.forEach(stud => {
    const studentSkillMap = new Map();
    (stud.skills || []).forEach(s => studentSkillMap.set(s.skillId, s.level));

    taxonomy.forEach(t => {
      const level = studentSkillMap.get(t.id) || 0;
      const item = skillDeficiencyMap.get(t.id);
      item.avgBatchProficiency += level;
      if (level < 3) {
        item.batchDeficientCount += 1;
      }
    });
  });

  // 3. Finalize rates and leverage scores
  const results = [];
  skillDeficiencyMap.forEach(item => {
    const total = students.length || 1;
    item.avgBatchProficiency = (item.avgBatchProficiency / total).toFixed(1);
    item.deficiencyRate = Math.round((item.batchDeficientCount / total) * 100);
    // Leverage score = industry demand frequency * deficiency rate
    item.leverageScore = Math.round((item.industryDemandCount * item.deficiencyRate) / 10);
    results.push(item);
  });

  return results.sort((a, b) => b.leverageScore - a.leverageScore);
}
