import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { JobPosting } from '../models/JobPosting.js';
import { SkillTaxonomy } from '../models/SkillTaxonomy.js';
import { Application } from '../models/Application.js';
import { seedTaxonomy, seedStudents, seedJobs, seedUsers } from '../data/seedData.js';

/**
 * ============================================================================
 * FUNCTION: getDatabaseStatus
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Count documents in StudentProfile, JobPosting, and SkillTaxonomy collections.
 * 2. If all collections are 0 (or empty), return hasData = false.
 * 3. If any records exist, return hasData = true.
 * 4. This is used by the frontend to decide whether seed data or seeding prompt should be shown.
 *
 * HTTP METHOD & ROUTE: GET /api/seed/status
 * ACCESS: Public
 */
export async function getDatabaseStatus(req, res, next) {
  try {
    const studentCount = await StudentProfile.countDocuments();
    const jobCount = await JobPosting.countDocuments();
    const skillCount = await SkillTaxonomy.countDocuments();

    const hasData = (studentCount > 0 && jobCount > 0);

    res.status(200).json({
      success: true,
      hasData,
      counts: {
        students: studentCount,
        jobs: jobCount,
        skills: skillCount
      },
      message: hasData
        ? 'Database contains live production records.'
        : 'Database is currently empty (Zero-data state).'
    });
  } catch (error) {
    // If database connection is not yet configured or offline, return safe status
    res.status(200).json({
      success: false,
      hasData: false,
      isOffline: true,
      message: 'MongoDB is offline or unreachable. Frontend using local fallback seed.',
      counts: { students: 0, jobs: 0, skills: 0 }
    });
  }
}

/**
 * ============================================================================
 * FUNCTION: seedDatabaseIfEmpty
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Check if the database already contains StudentProfile or JobPosting data.
 * 2. RULE: IF DATA ALREADY EXISTS -> DO NOT SEED! Return 200 with seeded=false.
 * 3. IF AND ONLY IF DATABASE IS EMPTY:
 *    - Insert seedTaxonomy into SkillTaxonomy collection.
 *    - Insert seedStudents into StudentProfile collection.
 *    - Insert seedJobs into JobPosting collection.
 * 4. Return 201 Created with { success: true, seeded: true, message: "Database seeded successfully" }.
 *
 * HTTP METHOD & ROUTE: POST /api/seed
 * ACCESS: Public / Admin
 */
export async function seedDatabaseIfEmpty(req, res, next) {
  try {
    const studentCount = await StudentProfile.countDocuments();
    const jobCount = await JobPosting.countDocuments();

    // Guard: Only seed if database has no data
    if (studentCount > 0 || jobCount > 0) {
      return res.status(200).json({
        success: true,
        seeded: false,
        message: 'Database already has data. Automatic seeding skipped to prevent data overwrite.',
        counts: { students: studentCount, jobs: jobCount }
      });
    }

    // Database is empty: Populate with initial datasets
    await User.insertMany(seedUsers);
    await SkillTaxonomy.insertMany(seedTaxonomy);
    await StudentProfile.insertMany(seedStudents);
    await JobPosting.insertMany(seedJobs);

    res.status(201).json({
      success: true,
      seeded: true,
      message: 'Empty database successfully bootstrapped with initial AYUSH & Tech seed records and shiv@123 credentials.',
      counts: {
        users: seedUsers.length,
        skills: seedTaxonomy.length,
        students: seedStudents.length,
        jobs: seedJobs.length
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: resetDatabase
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Wipe all collections (User, StudentProfile, JobPosting, SkillTaxonomy, Application).
 * 2. Re-populate with initial seed dataset.
 * 3. Useful for resetting state between demo presentations.
 *
 * HTTP METHOD & ROUTE: POST /api/seed/reset
 * ACCESS: Admin / Developer utility
 */
export async function resetDatabase(req, res, next) {
  try {
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await JobPosting.deleteMany({});
    await SkillTaxonomy.deleteMany({});
    await Application.deleteMany({});

    await User.insertMany(seedUsers);
    await SkillTaxonomy.insertMany(seedTaxonomy);
    await StudentProfile.insertMany(seedStudents);
    await JobPosting.insertMany(seedJobs);

    res.status(200).json({
      success: true,
      message: 'Database completely reset and re-seeded with clean demo baseline and shiv@123 credentials.'
    });
  } catch (error) {
    next(error);
  }
}
