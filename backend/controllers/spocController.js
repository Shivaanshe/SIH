import { StudentProfile } from '../models/StudentProfile.js';
import { JobPosting } from '../models/JobPosting.js';
import { SkillTaxonomy } from '../models/SkillTaxonomy.js';

/**
 * ============================================================================
 * FUNCTION: getCohortStudents
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'institutionId' from req.query or req.user.institutionId.
 * 2. Fetch all student profiles matching the institution.
 * 3. Return 200 OK with { success: true, count, students }.
 *
 * HTTP METHOD & ROUTE: GET /api/spoc/cohort
 * ACCESS: Private (Academia SPOC)
 */
export async function getCohortStudents(req, res, next) {
  try {
    const { institutionId, domainPack = 'ayush' } = req.query;
    const filter = { domainPack };
    if (institutionId) filter.institutionId = institutionId;

    const students = await StudentProfile.find(filter).sort({ cgpa: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: endorseStudentSkill
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'studentId', 'skillId', and 'facultyName' from req.body.
 * 2. Find the student's profile.
 * 3. Locate the skill in the student's skills array and set:
 *    - verified = true
 *    - endorsedBy = facultyName
 * 4. Increase verificationConfidence (e.g. up to 0.85 - 0.95).
 * 5. Save updated profile in MongoDB.
 * 6. Return 200 OK with { success: true, message: "Skill endorsed successfully", profile }.
 *
 * HTTP METHOD & ROUTE: POST /api/spoc/endorse-skill
 * ACCESS: Private (Academia SPOC / Faculty)
 */
export async function endorseStudentSkill(req, res, next) {
  try {
    const { studentId, skillId, facultyName = 'Faculty SPOC' } = req.body;

    if (!studentId || !skillId) {
      return res.status(400).json({
        success: false,
        message: 'studentId and skillId are required.'
      });
    }

    const student = await StudentProfile.findOne({
      $or: [{ id: studentId }, { email: studentId }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found for ID: ${studentId}`
      });
    }

    let found = false;
    student.skills = (student.skills || []).map(sk => {
      if (sk.skillId === skillId) {
        found = true;
        return {
          ...sk.toObject ? sk.toObject() : sk,
          verified: true,
          endorsedBy: facultyName
        };
      }
      return sk;
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: `Skill ${skillId} not found in student's profile.`
      });
    }

    // Boost verification confidence
    student.verificationConfidence = Math.min(0.95, (student.verificationConfidence || 0.6) + 0.1);
    await student.save();

    res.status(200).json({
      success: true,
      message: `Skill successfully endorsed by ${facultyName}.`,
      profile: student
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: getCurriculumGapRadar
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'institutionId' and 'domainPack' from req.query.
 * 2. Fetch all cohort students and all active industry job postings.
 * 3. For each canonical skill in SkillTaxonomy:
 *    - Count how many industry postings require it (demand frequency).
 *    - Count how many cohort students are deficient (proficiency < required).
 *    - Compute batch deficiency percentage and leverage score.
 * 4. Sort skills by highest leverage score descending.
 * 5. Return 200 OK with { success: true, radar: [...] }.
 *
 * HTTP METHOD & ROUTE: GET /api/spoc/curriculum-radar
 * ACCESS: Private (Academia SPOC)
 */
export async function getCurriculumGapRadar(req, res, next) {
  try {
    const { domainPack = 'ayush' } = req.query;

    const taxonomy = await SkillTaxonomy.find({ domainPack }).lean();
    const students = await StudentProfile.find({ domainPack }).lean();
    const postings = await JobPosting.find({ domainPack }).lean();

    const radar = taxonomy.map(skill => {
      // 1. Calculate industry demand
      let demandCount = 0;
      postings.forEach(p => {
        (p.requiredSkills || []).forEach(reqSkill => {
          if (reqSkill.skillId === skill.id) {
            demandCount += reqSkill.importance === 'must-have' ? 2 : 1;
          }
        });
      });

      // 2. Calculate batch deficiency
      let deficientCount = 0;
      students.forEach(stud => {
        const foundSkill = (stud.skills || []).find(s => s.skillId === skill.id);
        const level = foundSkill ? foundSkill.level : 0;
        if (level < 3) deficientCount += 1;
      });

      const totalStudents = students.length || 1;
      const deficiencyRate = Math.round((deficientCount / totalStudents) * 100);
      const leverageScore = Math.round((demandCount * deficiencyRate) / 10);

      return {
        skillId: skill.id,
        name: skill.name,
        category: skill.category,
        industryDemandCount: demandCount,
        deficiencyRate,
        leverageScore,
        resources: skill.resources || []
      };
    }).sort((a, b) => b.leverageScore - a.leverageScore);

    res.status(200).json({
      success: true,
      count: radar.length,
      radar
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: generateCurriculumActionPlan
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'domainPack' from req.query.
 * 2. Analyze top 3 highest-leverage curriculum gaps from radar calculation.
 * 3. Return structured recommendations:
 *    - Elective courses to introduce
 *    - Practical CME / workshop topics
 *    - Lab equipment / standardization protocols to acquire
 * 4. Return 200 OK with { success: true, actionPlan }.
 *
 * HTTP METHOD & ROUTE: POST /api/spoc/action-plan
 * ACCESS: Private (Academia SPOC)
 */
export async function generateCurriculumActionPlan(req, res, next) {
  try {
    const { domainPack = 'ayush' } = req.body;

    const actionPlan = domainPack === 'ayush' ? {
      title: 'AIIA National Curriculum Alignment Plan (AYUSH 2026-27)',
      focusAreas: [
        {
          priority: 'High',
          skill: 'Rasashastra Formulation QA & Schedule T GMP',
          recommendation: 'Introduce a 30-hour intensive HPLC and phytochemistry laboratory elective.'
        },
        {
          priority: 'High',
          skill: 'AYUSH Good Clinical Practice & Clinical Trial Documentation',
          recommendation: 'Mandate GCP certification via SWAYAM/CCRAS for all final year BAMS interns.'
        }
      ],
      generatedDate: new Date().toISOString().split('T')[0]
    } : {
      title: 'Technical Curriculum Modernization Roadmap (2026)',
      focusAreas: [
        {
          priority: 'High',
          skill: 'Cloud Systems Architecture (Docker & AWS)',
          recommendation: 'Add hands-on containerization labs to Distributed Systems course.'
        }
      ],
      generatedDate: new Date().toISOString().split('T')[0]
    };

    res.status(200).json({
      success: true,
      actionPlan
    });
  } catch (error) {
    next(error);
  }
}
