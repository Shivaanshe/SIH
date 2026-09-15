/**
 * KaushalSetu Backend Seed Datasets
 * Pre-configured with AYUSH and Tech domain packs for conditional zero-state bootstrapping.
 */

export const seedTaxonomy = [
  // AYUSH Taxonomy
  {
    id: "ayush-pk-01",
    name: "Panchakarma Protocol & Procedures",
    aliases: ["Panchakarma", "Virechana", "Vamana", "Basti Therapy", "Nasya"],
    category: "Clinical Procedures",
    domainPack: "ayush",
    resources: [
      { title: "Standard Panchakarma Operating Protocols (SOP)", provider: "CCRAS / AIIA Portal", url: "https://ccras.nic.in", type: "Clinical Handbook", estMinutes: 120 }
    ],
    projectIdea: "Execute 10 supervised Shirodhara and Kati Basti procedures documenting patient clinical bio-markers."
  },
  {
    id: "ayush-kaya-02",
    name: "Kayachikitsa (Internal Medicine & Diagnostics)",
    aliases: ["Internal Medicine", "Nadi Pariksha", "Ashtavidha Pariksha", "Dosha Vitiation Diagnosis"],
    category: "Clinical Diagnostics",
    domainPack: "ayush",
    resources: [
      { title: "Advanced Kayachikitsa Differential Diagnosis", provider: "SWAYAM / AIIA Faculty", url: "https://swayam.gov.in", type: "Video Lecture Series", estMinutes: 90 }
    ],
    projectIdea: "Compile a 15-patient observational case log on Amavata management through classical formulations."
  },
  {
    id: "ayush-rasa-04",
    name: "Rasashastra & Formulation Quality Control",
    aliases: ["Rasashastra", "Bhasma Preparation", "Formulation QA", "Schedule T GMP"],
    category: "Pharma & Formulation",
    domainPack: "ayush",
    resources: [
      { title: "Schedule T GMP and Standardization of Herbo-Minerals", provider: "Pharmacopoeia Commission for Indian Medicine", url: "https://pcim.gov.in", type: "Official Regulatory Manual", estMinutes: 180 }
    ],
    projectIdea: "Conduct heavy metal assay and microbial limit testing on an in-house Triphala Guggulu batch."
  },

  // Tech Taxonomy
  {
    id: "tech-react-01",
    name: "React.js & Frontend Architecture",
    aliases: ["React", "ReactJS", "Next.js", "Redux", "Hooks"],
    category: "Frontend Development",
    domainPack: "tech",
    resources: [
      { title: "Complete Modern React & Vite Deep Dive", provider: "NPTEL / Open Source", url: "https://react.dev", type: "Documentation & Code Labs", estMinutes: 120 }
    ],
    projectIdea: "Build a state-managed reactive real-time dashboard with custom hooks and WebSockets."
  },
  {
    id: "tech-node-02",
    name: "Node.js & Express API Engineering",
    aliases: ["Node", "NodeJS", "Express", "REST API", "Backend"],
    category: "Backend Development",
    domainPack: "tech",
    resources: [
      { title: "Building Scalable RESTful APIs with Node and Express", provider: "SWAYAM", url: "https://swayam.gov.in", type: "Course Modules", estMinutes: 150 }
    ],
    projectIdea: "Design an RBAC API gateway with JWT rotation, rate limiting, and MongoDB integration."
  }
];

export const seedStudents = [
  {
    id: "stud-ayush-01",
    name: "Dr. Aanya Sharma",
    email: "aanya.sharma@aiia.gov.in",
    domainPack: "ayush",
    institutionId: "inst-aiia-01",
    institutionName: "All India Institute of Ayurveda (AIIA), New Delhi",
    degree: "Bachelor of Ayurvedic Medicine & Surgery (BAMS)",
    year: "Final Year (Batch 2026)",
    cgpa: 8.7,
    apaarId: "IN-APAAR-2026-AYUSH-9941",
    digiLockerVerified: true,
    verificationConfidence: 0.85,
    skills: [
      { skillId: "ayush-pk-01", name: "Panchakarma Protocol & Procedures", level: 4, verified: true, endorsedBy: "Dr. Arvind Verma" },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", level: 4, verified: true, endorsedBy: "Dr. Arvind Verma" },
      { skillId: "ayush-rasa-04", name: "Rasashastra & Formulation Quality Control", level: 2, verified: false }
    ],
    projects: [
      {
        title: "Clinical Efficacy of Shirodhara in Anxiety Biomarkers",
        description: "Evaluated 25 patients at AIIA IPD monitoring HAM-A and salivary cortisol levels.",
        tags: ["Kayachikitsa", "Panchakarma", "Clinical Trial"]
      }
    ],
    appliedPostings: []
  },
  {
    id: "stud-tech-01",
    name: "Rohan Mehta",
    email: "rohan.mehta@dtu.ac.in",
    domainPack: "tech",
    institutionId: "inst-dtu-04",
    institutionName: "Delhi Technological University (DTU)",
    degree: "B.Tech Computer Science & Engineering",
    year: "Final Year (Batch 2026)",
    cgpa: 8.9,
    apaarId: "IN-APAAR-2026-TECH-8821",
    digiLockerVerified: true,
    verificationConfidence: 0.90,
    skills: [
      { skillId: "tech-react-01", name: "React.js & Frontend Architecture", level: 4, verified: true, endorsedBy: "Prof. S. Mukherjee" },
      { skillId: "tech-node-02", name: "Node.js & Express API Engineering", level: 4, verified: true, endorsedBy: "Prof. S. Mukherjee" }
    ],
    projects: [
      {
        title: "Distributed Microservices E-Commerce Core",
        description: "Engineered scalable event-driven backend handling 5k RPS with Kafka.",
        tags: ["Node.js", "Docker", "Microservices"]
      }
    ],
    appliedPostings: []
  }
];

export const seedJobs = [
  {
    id: "job-ayush-01",
    title: "Clinical Panchakarma Resident & Research Fellow",
    company: "All India Institute of Ayurveda (AIIA) - Clinical Wing",
    sector: "Apex Healthcare & Clinical Research",
    domainPack: "ayush",
    location: "New Delhi (On-Campus IPD)",
    stipend: "₹38,000 / month",
    type: "Fellowship & Clinical Internship",
    mode: "On-site",
    description: "Seeking enthusiastic BAMS graduates to supervise specialized Panchakarma procedures in AIIA 200-bed hospital.",
    eligibility: { degree: ["BAMS", "MD (Ayurveda)"], minCgpa: 7.5, year: ["Final Year", "Graduated"] },
    requiredSkills: [
      { skillId: "ayush-pk-01", name: "Panchakarma Protocol & Procedures", minLevel: 4, importance: "must-have", weight: 0.50 },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", minLevel: 3, importance: "must-have", weight: 0.30 },
      { skillId: "ayush-rasa-04", name: "Rasashastra & Formulation Quality Control", minLevel: 3, importance: "nice-to-have", weight: 0.20 }
    ],
    weights: { w1_skill: 0.45, w2_project: 0.20, w3_eligibility: 0.15, w4_verification: 0.20 },
    applicantsCount: 12
  },
  {
    id: "job-tech-01",
    title: "Full-Stack Software Engineering Intern",
    company: "DeepTech Cloud Solutions",
    sector: "Enterprise Software & Cloud Platforms",
    domainPack: "tech",
    location: "Bangalore / Remote",
    stipend: "₹45,000 / month",
    type: "Engineering Internship",
    mode: "Hybrid",
    description: "Join our core platform engineering team building high-performance scalable web applications.",
    eligibility: { degree: ["B.Tech CS", "B.E. IT"], minCgpa: 7.5, year: ["Final Year", "Graduated"] },
    requiredSkills: [
      { skillId: "tech-react-01", name: "React.js & Frontend Architecture", minLevel: 4, importance: "must-have", weight: 0.50 },
      { skillId: "tech-node-02", name: "Node.js & Express API Engineering", minLevel: 4, importance: "must-have", weight: 0.50 }
    ],
    weights: { w1_skill: 0.45, w2_project: 0.20, w3_eligibility: 0.15, w4_verification: 0.20 },
    applicantsCount: 24
  }
];
