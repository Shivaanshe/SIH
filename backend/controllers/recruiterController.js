import { Application } from '../models/Application.js';
import { JobPosting } from '../models/JobPosting.js';
import { StudentProfile } from '../models/StudentProfile.js';

/**
 * ============================================================================
 * FUNCTION: updateCandidateStatus
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'studentId', 'postingId', and 'newStatus' ('Shortlisted', 'Applied') from req.body.
 * 2. Find and update the Application record in MongoDB.
 * 3. Update the corresponding entry inside StudentProfile.appliedPostings array.
 * 4. Return 200 OK with { success: true, message: "Status updated", status: newStatus }.
 *
 * HTTP METHOD & ROUTE: PUT /api/recruiter/applications/status
 * ACCESS: Private (Recruiter / HR)
 */
export async function updateCandidateStatus(req, res, next) {
  try {
    const { studentId, postingId, newStatus } = req.body;

    if (!studentId || !postingId || !newStatus) {
      return res.status(400).json({
        success: false,
        message: 'studentId, postingId, and newStatus are required.'
      });
    }

    // Update Application document
    await Application.findOneAndUpdate(
      { studentId, postingId },
      { $set: { status: newStatus } }
    );

    // Update StudentProfile array
    await StudentProfile.findOneAndUpdate(
      { $or: [{ id: studentId }, { email: studentId }], 'appliedPostings.postingId': postingId },
      { $set: { 'appliedPostings.$.status': newStatus } }
    );

    res.status(200).json({
      success: true,
      message: `Candidate application status updated to "${newStatus}".`,
      status: newStatus
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: rejectWithFeedback
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read 'studentId', 'postingId', and 'rejectionReason' from req.body.
 * 2. Validate that a constructive rejection reason is provided.
 * 3. Update Application document with status="Rejected" and rejectionReason.
 * 4. Update the student's appliedPostings array with the rejectionReason so the
 *    student sees actionable feedback instead of a silent rejection.
 * 5. Return 200 OK with { success: true, message: "Feedback sent to student" }.
 *
 * HTTP METHOD & ROUTE: POST /api/recruiter/applications/reject
 * ACCESS: Private (Recruiter / HR)
 */
export async function rejectWithFeedback(req, res, next) {
  try {
    const { studentId, postingId, rejectionReason } = req.body;

    if (!studentId || !postingId) {
      return res.status(400).json({
        success: false,
        message: 'studentId and postingId are required.'
      });
    }

    const reason = rejectionReason || 'Candidate currently does not meet minimum clinical/technical requirements.';

    // Update Application
    await Application.findOneAndUpdate(
      { studentId, postingId },
      { $set: { status: 'Rejected', rejectionReason: reason } }
    );

    // Update StudentProfile
    await StudentProfile.findOneAndUpdate(
      { $or: [{ id: studentId }, { email: studentId }], 'appliedPostings.postingId': postingId },
      { $set: { 'appliedPostings.$.status': 'Rejected', 'appliedPostings.$.rejectionReason': reason } }
    );

    res.status(200).json({
      success: true,
      message: 'Explainable rejection feedback recorded and delivered to candidate.',
      rejectionReason: reason
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ============================================================================
 * FUNCTION: getRecruiterAnalytics
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Read recruiter ID from req.user._id (or postingId from query).
 * 2. Calculate applicant metrics:
 *    - Total applications received
 *    - Shortlisted count
 *    - Average applicant match score
 * 3. Return 200 OK with { success: true, analytics }.
 *
 * HTTP METHOD & ROUTE: GET /api/recruiter/analytics
 * ACCESS: Private (Recruiter / HR)
 */
export async function getRecruiterAnalytics(req, res, next) {
  try {
    const totalPostings = await JobPosting.countDocuments();
    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });

    res.status(200).json({
      success: true,
      analytics: {
        totalPostings,
        totalApplications,
        shortlistedCount,
        placementFunnelEfficiency: totalApplications > 0 ? `${Math.round((shortlistedCount / totalApplications) * 100)}%` : '0%'
      }
    });
  } catch (error) {
    next(error);
  }
}
