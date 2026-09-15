/**
 * Seed Datasets for SIH26044 Collaboration, FDPs, Learning Programs & Internship Milestones
 * Supports both AYUSH and Tech domains.
 */

// 1. Faculty Development Programs (FDPs), Industrial Residencies & Research Consultancy for Academicians
export const seedFdpPrograms = [
  // AYUSH Faculty Programs
  {
    id: "fdp-ayush-01",
    title: "Advanced Phytochemical HPLC & Herb Standardization FDP",
    host: "Dabur Research Foundation (Ayurvedic Division)",
    domainPack: "ayush",
    type: "Faculty Industrial Residency (2 Weeks)",
    duration: "2 Weeks (Full-Time)",
    stipendGrant: "₹45,000 Travel & Research Grant",
    mode: "On-site (Ghaziabad R&D Center)",
    eligibility: "BAMS/MD Faculty & Research Scholars",
    description: "Hands-on immersion for AYUSH professors in mass spectrometry, heavy metal toxicology under WHO limits, and Schedule T GMP protocol creation.",
    applicantsCount: 14,
    status: "Open"
  },
  {
    id: "fdp-ayush-02",
    title: "Clinical Trial Protocol Design & AYUSH-GCP Certification",
    host: "All India Institute of Ayurveda (AIIA) - Clinical Research Directorate",
    domainPack: "ayush",
    type: "Faculty Development Program (FDP)",
    duration: "1 Month (Hybrid)",
    stipendGrant: "Ministry of Ayush Sponsored (100% Grant)",
    mode: "Hybrid",
    eligibility: "All AYUSH Affiliated College Faculty",
    description: "Empowering medical educators to design double-blind clinical trials, manage ethical committees, and publish in PubMed/Scopus indexed AYUSH journals.",
    applicantsCount: 28,
    status: "Open"
  },
  {
    id: "fdp-ayush-03",
    title: "Industrial Formulation Consultancy: Standardized Bhasma Scaling",
    host: "Kerala Ayurveda Ltd. / Baidyanath Research Wing",
    domainPack: "ayush",
    type: "Industry Consultancy Project",
    duration: "6 Months Collaborative R&D",
    stipendGrant: "₹3,50,000 Project Consultancy Fund",
    mode: "Remote + Plant Visits",
    eligibility: "Rasashastra & Dravyaguna Department Heads",
    description: "Industry seeking academic consultant to optimize nanoparticle bioavailability in calcined mineral formulations without exceeding temperature thresholds.",
    applicantsCount: 6,
    status: "Open"
  },

  // Tech Faculty Programs
  {
    id: "fdp-tech-01",
    title: "Cloud-Native Microservices & Distributed Systems for Educators",
    host: "Amazon Web Services (AWS) Academy India",
    domainPack: "tech",
    type: "Faculty Development Program (FDP)",
    duration: "3 Weeks (Virtual)",
    stipendGrant: "$1,500 AWS Cloud Lab Credits",
    mode: "Virtual",
    eligibility: "CS / IT Engineering Faculty",
    description: "Comprehensive training for professors in Kubernetes orchestration, serverless microservices, and modern DevOps pipelines for curriculum integration.",
    applicantsCount: 42,
    status: "Open"
  },
  {
    id: "fdp-tech-02",
    title: "Generative AI & LLM Systems Architecture Industrial Sabbatical",
    host: "Google Cloud / DeepTech Labs",
    domainPack: "tech",
    type: "Industry Faculty Sabbatical (3 Months)",
    duration: "3 Months (Hybrid)",
    stipendGrant: "₹1,20,000 / month Honorarium",
    mode: "Hybrid (Bangalore)",
    eligibility: "Associate Professors & PhD Guides",
    description: "Faculty immersion working directly with industry AI researchers on model fine-tuning, RAG architectures, and ethical AI governance.",
    applicantsCount: 19,
    status: "Open"
  }
];

// 2. Industry-Academia Collaboration: Mentorship, Guest Lectures, Innovation Challenges
export const seedCollaborationItems = [
  // AYUSH Collaboration
  {
    id: "collab-ayush-01",
    type: "Mentorship",
    title: "1-on-1 Clinical Mentorship with Senior Vaidya",
    mentorName: "Dr. Arvind Verma (MD, Senior Clinical Specialist)",
    organization: "All India Institute of Ayurveda (AIIA)",
    domainPack: "ayush",
    category: "Panchakarma & Clinical Diagnosis",
    slotsAvailable: 4,
    description: "Personalized 45-minute clinical case review on patient management, Nadi Pariksha verification, and career guidance in AYUSH hospitals.",
    rating: 4.9
  },
  {
    id: "collab-ayush-02",
    type: "Guest Lecture",
    title: "Schedule T GMP and International AYUSH Export Regulations",
    speakerName: "Dr. Meenakshi Sundaram (Chief Quality Officer)",
    organization: "Dabur Research Foundation",
    domainPack: "ayush",
    targetAudience: "BAMS Final Year & PG Scholars",
    format: "Live Interactive Webinar & Q/A",
    date: "2026-09-24 • 11:00 AM IST",
    status: "Scheduled"
  },
  {
    id: "collab-ayush-03",
    type: "Innovation Challenge",
    title: "National Ayush Innovation Grand Challenge 2026",
    host: "Ministry of Ayush & Invest India",
    domainPack: "ayush",
    prizePool: "₹5,00,000 + Incubation at AIIA Innovation Hub",
    deadline: "2026-10-15",
    problemStatement: "Design a portable, low-cost sensor device for real-time standardization of herbal decoctions (Kashayam) during extraction.",
    submissionsCount: 38
  },

  // Tech Collaboration
  {
    id: "collab-tech-01",
    type: "Mentorship",
    title: "1-on-1 Engineering Architecture & System Design",
    mentorName: "Aakash Singhania (Principal Architect)",
    organization: "DeepTech Cloud Systems",
    domainPack: "tech",
    category: "Full-Stack Architecture & Cloud",
    slotsAvailable: 3,
    description: "Review your portfolio code, mock system design interview, and practical guidance for cracking Tier-1 product companies.",
    rating: 4.95
  },
  {
    id: "collab-tech-02",
    type: "Innovation Challenge",
    title: "Autonomous Agentic AI Hackathon 2026",
    host: "NASSCOM & Enterprise Tech Partners",
    domainPack: "tech",
    prizePool: "₹3,50,000 + Fast-track PPIs",
    deadline: "2026-09-30",
    problemStatement: "Build an automated multi-agent workflow for real-time code auditing and vulnerability remediation.",
    submissionsCount: 65
  }
];

// 3. Industry Learning Programs & Certifications (Published by Companies)
export const seedLearningPrograms = [
  // AYUSH Courses
  {
    id: "learn-ayush-01",
    title: "Industrial Quality Control & Phytochemical Assay Bootcamp",
    company: "Dabur Research Foundation",
    companyLogo: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=100&auto=format&fit=crop&q=80",
    domainPack: "ayush",
    duration: "4 Weeks (Online + Lab Kit)",
    enrolledCount: 184,
    skillsCovered: ["Rasashastra", "HPLC Analytics", "Schedule T GMP"],
    certification: "Industry Certified Phytochemical Specialist",
    stipendEligible: true,
    description: "Designed directly by Dabur senior scientists to prepare students for direct entry into QC/QA pharma trainee roles."
  },
  {
    id: "learn-ayush-02",
    title: "Panchakarma Protocol Mastery & IPD Case Documentation",
    company: "All India Institute of Ayurveda (AIIA)",
    companyLogo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=80",
    domainPack: "ayush",
    duration: "6 Weeks (Clinical Video Logs & Live Rounds)",
    enrolledCount: 310,
    skillsCovered: ["Panchakarma Protocol", "Kayachikitsa", "Nadi Pariksha"],
    certification: "AIIA Clinical Fellowship Credential",
    stipendEligible: false,
    description: "Comprehensive step-by-step training on preparatory and main therapies (Virechana, Basti) with emergency management."
  },

  // Tech Courses
  {
    id: "learn-tech-01",
    title: "Enterprise Full-Stack React & Node Engineering Cohort",
    company: "DeepTech Cloud Systems",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    domainPack: "tech",
    duration: "6 Weeks (Project-Based)",
    enrolledCount: 420,
    skillsCovered: ["React.js", "Node.js", "PostgreSQL", "Docker"],
    certification: "Certified Enterprise Full-Stack Developer",
    stipendEligible: true,
    description: "Master production-grade microservices, caching with Redis, and containerized deployment with live code reviews."
  }
];

// 4. Active Internship Progress & Milestone Logs
export const seedInternshipProgress = {
  postingId: "job-ayush-01",
  jobTitle: "Clinical Panchakarma Resident & Research Fellow",
  company: "All India Institute of Ayurveda (AIIA)",
  mentorName: "Dr. Arvind Verma, Head of Panchakarma IPD",
  startDate: "2026-08-01",
  expectedEndDate: "2026-11-30",
  currentWeek: 6,
  totalWeeks: 12,
  overallProgressPercent: 50,
  mentorRating: 4.8,
  milestones: [
    {
      weekNumber: 1,
      title: "Orientation & Bio-Hazard Protocol Compliance",
      status: "Approved",
      submittedDate: "2026-08-07",
      mentorFeedback: "Excellent adherence to AIIA clinical hygiene and IPD safety regulations."
    },
    {
      weekNumber: 2,
      title: "Supervised Vamana & Virechana Pre-operative Regimens",
      status: "Approved",
      submittedDate: "2026-08-14",
      mentorFeedback: "Accurate calculation of Snehana dosages and digestive fire (Agni) assessment."
    },
    {
      weekNumber: 3,
      title: "Ashtavidha Pariksha Diagnostics Log (20 In-Patients)",
      status: "Approved",
      submittedDate: "2026-08-21",
      mentorFeedback: "Comprehensive diagnostic notes; pulse palpation skills improving visibly."
    },
    {
      weekNumber: 4,
      title: "Basti Formulation Preparation & Patient Logbook Entry",
      status: "Approved",
      submittedDate: "2026-08-28",
      mentorFeedback: "Followed classical text measures with modern volumetric precision."
    },
    {
      weekNumber: 5,
      title: "Mid-Term Clinical Competency Evaluation",
      status: "Approved",
      submittedDate: "2026-09-05",
      mentorFeedback: "Demonstrated 90%+ diagnostic accuracy. Cleared for semi-independent ward duty."
    },
    {
      weekNumber: 6,
      title: "Current Clinical Case Log Submission",
      status: "Under Review",
      submittedDate: "2026-09-12",
      mentorFeedback: "Submitted, awaiting ward consultant signature."
    }
  ],
  certificate: {
    isIssued: false,
    credentialId: "AIIA-INTERN-2026-9941",
    issueDate: "Pending Completion (Week 12)"
  }
};
