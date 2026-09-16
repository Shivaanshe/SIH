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
 * Aggregates batch-wide curriculum gaps across an institution's students vs. active postings & ministry directives (PRD §10.3)
 */
export function computeCurriculumGapRadar(students, postings, domainPack = "ayush", directives = []) {
  const taxonomy = domainPack === "ayush" ? ayushTaxonomy : techTaxonomy;
  const skillDeficiencyMap = new Map();

  // Populate base taxonomy
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
      leverageScore: 0,
      isMinistryMandated: false,
      directiveTitle: null
    });
  });

  // 1. Calculate how many postings require this skill (including custom HR skills)
  postings.forEach(p => {
    (p.requiredSkills || []).forEach(req => {
      let matchedKey = null;
      if (skillDeficiencyMap.has(req.skillId)) {
        matchedKey = req.skillId;
      } else {
        // Match by name or substring
        for (const [key, item] of skillDeficiencyMap.entries()) {
          const reqName = (req.name || '').toLowerCase();
          const itemName = item.name.toLowerCase();
          if (reqName && (itemName.includes(reqName) || reqName.includes(itemName))) {
            matchedKey = key;
            break;
          }
        }
      }

      if (matchedKey) {
        const item = skillDeficiencyMap.get(matchedKey);
        item.industryDemandCount += (req.importance === "must-have" ? 2 : 1);
      } else if (req.name) {
        // Register custom skill added by HR into the college radar
        const customId = req.skillId || `custom-${req.name.toLowerCase().replace(/\s+/g, '-')}`;
        skillDeficiencyMap.set(customId, {
          skillId: customId,
          name: req.name,
          category: req.category || 'Industry Emerging',
          batchDeficientCount: 0,
          totalStudentsEvaluated: students.length,
          industryDemandCount: req.importance === "must-have" ? 2 : 1,
          avgBatchProficiency: 0,
          deficiencyRate: 0,
          leverageScore: 0,
          isMinistryMandated: false,
          directiveTitle: null
        });
      }
    });
  });

  // 2. Inject Ministry Directives into Demand Pipeline
  (directives || []).forEach(dir => {
    if (dir.domainPack && dir.domainPack !== domainPack) return;
    const dirLower = (dir.title || '').toLowerCase();

    let foundMatch = false;
    for (const [, item] of skillDeficiencyMap.entries()) {
      const itemName = item.name.toLowerCase();
      // Check if directive mentions this skill or vice versa
      const words = itemName.split(/[\s,&/-]+/).filter(w => w.length > 3);
      const matchesWord = words.some(w => dirLower.includes(w));

      if (dirLower.includes(itemName) || itemName.includes(dirLower) || matchesWord) {
        item.isMinistryMandated = true;
        item.directiveTitle = dir.title;
        item.industryDemandCount += 3; // Ministry directives give highest national weight
        foundMatch = true;
      }
    }

    // If directive introduces an entirely new mandatory domain topic
    if (!foundMatch && dir.title) {
      const dirId = `mandate-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      skillDeficiencyMap.set(dirId, {
        skillId: dirId,
        name: dir.title,
        category: 'National Policy Mandate',
        batchDeficientCount: students.length, // Unprepared by default
        totalStudentsEvaluated: students.length,
        industryDemandCount: 4, // Maximum multiplier
        avgBatchProficiency: 1.0,
        deficiencyRate: 95,
        leverageScore: 90,
        isMinistryMandated: true,
        directiveTitle: dir.title
      });
    }
  });

  // 3. Calculate student proficiencies & deficiencies
  students.forEach(stud => {
    const studentSkillMap = new Map();
    (stud.skills || []).forEach(s => {
      studentSkillMap.set(s.skillId, s.level);
      if (s.name) studentSkillMap.set(s.name.toLowerCase(), s.level);
    });

    skillDeficiencyMap.forEach((item, key) => {
      let level = studentSkillMap.get(key) || 0;
      if (!level && item.name) {
        level = studentSkillMap.get(item.name.toLowerCase()) || 0;
      }
      item.avgBatchProficiency += level;
      if (level < 3) {
        item.batchDeficientCount += 1;
      }
    });
  });

  // 4. Finalize rates and leverage scores
  const results = [];
  skillDeficiencyMap.forEach(item => {
    const total = students.length || 1;
    item.avgBatchProficiency = (item.avgBatchProficiency / total).toFixed(1);
    item.deficiencyRate = Math.min(100, Math.round((item.batchDeficientCount / total) * 100));
    // Leverage score = industry demand frequency * deficiency rate
    item.leverageScore = Math.round((item.industryDemandCount * item.deficiencyRate) / 10);
    results.push(item);
  });

  return results.sort((a, b) => b.leverageScore - a.leverageScore);
}
