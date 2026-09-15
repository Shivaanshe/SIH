import { JobPosting } from '../models/JobPosting.js';
import { Application } from '../models/Application.js';
import { StudentProfile } from '../models/StudentProfile.js';

/**
 * ============================================================================
 * FUNCTION: getAllJobs
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read query params: domainPack ('ayush' or 'tech'), sector, search (title/company).
 * 2. Build MongoDB query filter based on active parameters.
 * 3. Fetch matching jobs sorted by createdAt descending.
 * 4. Return 200 OK with { success: true, count, postings: jobs }.
 *
 * HTTP METHOD & ROUTE: GET /api/jobs
 * ACCESS: Public
 */
export async function getAllJobs(req, res, next) {
  try {
    const { domainPack, sector, search } = req.query;
    const filter = {};

    if (domainPack) filter.domainPack = domainPack;
    if (sector) filter.sector = sector;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await JobPosting.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      postings: jobs
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: getJobById
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read job ID from req.params.id.
 * 2. Query JobPosting in MongoDB by custom 'id' or Mongo '_id'.
 * 3. If job not found, return 404 Not Found.
 * 4. Return 200 OK with { success: true, posting: job }.
 *
 * HTTP METHOD & ROUTE: GET /api/jobs/:id
 * ACCESS: Public
 */
export async function getJobById(req, res, next) {
  try {
    const queryId = req.params.id;
    const job = await JobPosting.findOne({
      $or: [{ id: queryId }, { _id: queryId.match(/^[0-9a-fA-F]{24}$/) ? queryId : null }]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job posting not found for ID: ${queryId}`
      });
    }

    res.status(200).json({
      success: true,
      posting: job
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: createJob
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read job fields from req.body: title, company, sector, domainPack, location,
 *    stipend, type, mode, description, eligibility, requiredSkills, weights.
 * 2. Validate that title, company, and at least one required skill are provided.
 * 3. Generate a unique job ID (e.g. 'job-ayush-' + Date.now()).
 * 4. Save the JobPosting document to MongoDB.
 * 5. Return 201 Created with { success: true, message: "Job created successfully", posting: newJob }.
 *
 * HTTP METHOD & ROUTE: POST /api/jobs
 * ACCESS: Private (Recruiter / HR)
 */
export async function createJob(req, res, next) {
  try {
    const {
      title,
      company,
      sector = 'General',
      domainPack = 'ayush',
      location = 'New Delhi',
      stipend = 'Competitive',
      type = 'Internship',
      mode = 'On-site',
      description = '',
      eligibility = {},
      requiredSkills = [],
      weights = {}
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title and company name.'
      });
    }

    const uniqueId = `job-${domainPack}-${Date.now().toString().slice(-5)}`;

    const newJob = await JobPosting.create({
      id: uniqueId,
      title,
      company,
      sector,
      domainPack,
      location,
      stipend,
      type,
      mode,
      description,
      eligibility,
      requiredSkills,
      weights,
      applicantsCount: 0,
      recruiterId: req.user?._id
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      posting: newJob
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: getJobApplicants
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read job ID from req.params.id.
 * 2. Find all Application records where postingId matches.
 * 3. For each application, retrieve the student's profile details.
 * 4. Return 200 OK with { success: true, count, applicants: [...] }.
 *
 * HTTP METHOD & ROUTE: GET /api/jobs/:id/applicants
 * ACCESS: Private (Recruiter / HR)
 */
export async function getJobApplicants(req, res, next) {
  try {
    const postingId = req.params.id;
    const applications = await Application.find({ postingId });

    const studentIds = applications.map(a => a.studentId);
    const students = await StudentProfile.find({ id: { $in: studentIds } });

    const applicants = applications.map(app => {
      const student = students.find(s => s.id === app.studentId);
      return {
        applicationId: app._id,
        status: app.status,
        matchScore: app.matchScore,
        appliedAt: app.appliedAt,
        student
      };
    });

    res.status(200).json({
      success: true,
      count: applicants.length,
      applicants
    });
  } catch (error) {
    next(error);
  }
}
