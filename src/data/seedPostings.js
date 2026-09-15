export const seedPostings = [
  // AYUSH Postings
  {
    id: "job-ayush-01",
    title: "Clinical Panchakarma Resident & Research Fellow",
    company: "All India Institute of Ayurveda (AIIA) - Clinical Wing",
    companyLogo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=80",
    sector: "Apex Healthcare & Clinical Research",
    domainPack: "ayush",
    location: "New Delhi (On-Campus IPD/OPD)",
    stipend: "₹38,000 / month",
    type: "Internship & Clinical Fellowship",
    mode: "On-site",
    description: "Seeking enthusiastic BAMS graduates/interns to manage specialized Panchakarma therapies (Virechana, Basti) in AIIA's 200-bed hospital and participate in CCRAS-funded protocol research.",
    eligibility: {
      degree: ["BAMS", "MD (Ayurveda)"],
      minCgpa: 7.5,
      year: ["Final Year", "Internship Year", "Graduated"],
      maxBacklogs: 0
    },
    requiredSkills: [
      { skillId: "ayush-pk-01", name: "Panchakarma Protocol & Procedures", minLevel: 4, importance: "must-have", weight: 0.40 },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", minLevel: 3, importance: "must-have", weight: 0.30 },
      { skillId: "ayush-dravya-03", name: "Dravyaguna & Herb Identification", minLevel: 3, importance: "nice-to-have", weight: 0.15 },
      { skillId: "ayush-yoga-06", name: "Yoga Therapy & Lifestyle Prescription", minLevel: 2, importance: "nice-to-have", weight: 0.15 }
    ],
    weights: {
      w1_skill: 0.45,
      w2_project: 0.20,
      w3_eligibility: 0.15,
      w4_verification: 0.20
    },
    applicantsCount: 18,
    postedDate: "2026-09-01"
  },
  {
    id: "job-ayush-02",
    title: "Ayush Formulation QA & Phytochemical Analyst",
    company: "Dabur Research Foundation (Ayurvedic Division)",
    companyLogo: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=100&auto=format&fit=crop&q=80",
    sector: "Ayurvedic Pharma & Nutraceuticals",
    domainPack: "ayush",
    location: "Ghaziabad / Sahibabad Plant (Hybrid)",
    stipend: "₹42,000 / month",
    type: "Graduate Engineer / Scientist Trainee",
    mode: "Hybrid",
    description: "Join India's premier Ayurvedic formulations R&D unit. Responsible for HPLC standardization, microbial limits, and Rasashastra stability testing under Schedule T GMP regulations.",
    eligibility: {
      degree: ["BAMS", "MD (Rasashastra)", "B.Pharm (Ayurveda)"],
      minCgpa: 7.0,
      year: ["Final Year", "Graduated"],
      maxBacklogs: 0
    },
    requiredSkills: [
      { skillId: "ayush-rasa-04", name: "Rasashastra & Formulation Quality Control", minLevel: 4, importance: "must-have", weight: 0.40 },
      { skillId: "ayush-dravya-03", name: "Dravyaguna & Herb Identification", minLevel: 4, importance: "must-have", weight: 0.35 },
      { skillId: "ayush-reg-07", name: "Clinical Trial Documentation & AYUSH GCP", minLevel: 3, importance: "nice-to-have", weight: 0.25 }
    ],
    weights: {
      w1_skill: 0.45,
      w2_project: 0.20,
      w3_eligibility: 0.15,
      w4_verification: 0.20
    },
    applicantsCount: 26,
    postedDate: "2026-09-04"
  },
  {
    id: "job-ayush-03",
    title: "Anorectal & Para-Surgical Clinical Associate",
    company: "Patanjali Yogpeeth & Wellness Research",
    companyLogo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=80",
    sector: "Integrative Hospital & Wellness Care",
    domainPack: "ayush",
    location: "Haridwar, Uttarakhand",
    stipend: "₹35,000 / month + Accommodation",
    type: "Clinical Internship",
    mode: "On-site",
    description: "Opportunity for candidates with strong foundational training in Shalya Tantra and Ksharasutra procedures to work alongside senior surgeons in holistic fistula and wound care.",
    eligibility: {
      degree: ["BAMS", "MS (Shalya Tantra)"],
      minCgpa: 7.2,
      year: ["Internship Year", "Graduated"],
      maxBacklogs: 1
    },
    requiredSkills: [
      { skillId: "ayush-shalya-05", name: "Shalya Tantra & Ksharasutra Therapy", minLevel: 4, importance: "must-have", weight: 0.50 },
      { skillId: "ayush-pk-01", name: "Panchakarma Protocol & Procedures", minLevel: 3, importance: "nice-to-have", weight: 0.25 },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", minLevel: 3, importance: "nice-to-have", weight: 0.25 }
    ],
    weights: {
      w1_skill: 0.45,
      w2_project: 0.20,
      w3_eligibility: 0.15,
      w4_verification: 0.20
    },
    applicantsCount: 12,
    postedDate: "2026-08-28"
  },

  // Tech Postings
  {
    id: "job-tech-01",
    title: "Full-Stack HealthTech Systems Intern",
    company: "Tata Health / AyushGrid Platform",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80",
    sector: "Digital Health Public Infrastructure",
    domainPack: "tech",
    location: "Bengaluru (Hybrid)",
    stipend: "₹50,000 / month",
    type: "Software Engineering Internship",
    mode: "Hybrid",
    description: "Build robust telemedicine and electronic medical record (EMR) interfaces conforming to ABDM (Ayushman Bharat Digital Mission) standards using React, Node, and vector search.",
    eligibility: {
      degree: ["B.Tech CS/IT", "MCA", "Dual Degree"],
      minCgpa: 8.0,
      year: ["Final Year"],
      maxBacklogs: 0
    },
    requiredSkills: [
      { skillId: "tech-react-01", name: "React & Modern Frontend Architecture", minLevel: 4, importance: "must-have", weight: 0.35 },
      { skillId: "tech-node-02", name: "Node.js & Scalable REST/GraphQL APIs", minLevel: 4, importance: "must-have", weight: 0.35 },
      { skillId: "tech-cloud-05", name: "Docker, Kubernetes & CI/CD Pipelines", minLevel: 3, importance: "nice-to-have", weight: 0.30 }
    ],
    weights: {
      w1_skill: 0.45,
      w2_project: 0.20,
      w3_eligibility: 0.15,
      w4_verification: 0.20
    },
    applicantsCount: 45,
    postedDate: "2026-09-05"
  }
];
