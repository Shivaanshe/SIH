export const seedStudents = [
  // AYUSH Students
  {
    id: "stud-ayush-01",
    name: "Aanya Sharma",
    avatar: "https://images.unsplash.com/photo-1594824813501-48c9735d491f?w=150&auto=format&fit=crop&q=80",
    email: "aanya.sharma@aiia.gov.in",
    domainPack: "ayush",
    institutionId: "inst-aiia-01",
    institutionName: "All India Institute of Ayurveda (AIIA), New Delhi",
    degree: "Bachelor of Ayurvedic Medicine & Surgery (BAMS)",
    year: "Final Year (Batch 2026)",
    cgpa: 8.7,
    apaarId: "IN-APAAR-2026-AYUSH-9941",
    digiLockerVerified: true,
    verificationConfidence: 0.85, // SPOC endorsed
    skills: [
      { skillId: "ayush-pk-01", name: "Panchakarma Protocol & Procedures", level: 4, verified: true, endorsedBy: "Dr. Arvind Verma" },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", level: 4, verified: true, endorsedBy: "Dr. Arvind Verma" },
      { skillId: "ayush-dravya-03", name: "Dravyaguna & Herb Identification", level: 3, verified: true, endorsedBy: "Dr. Arvind Verma" },
      { skillId: "ayush-yoga-06", name: "Yoga Therapy & Lifestyle Prescription", level: 4, verified: false },
      { skillId: "ayush-rasa-04", name: "Rasashastra & Formulation Quality Control", level: 2, verified: false }
    ],
    projects: [
      {
        title: "Clinical Efficacy of Shirodhara with Ashwagandha Taila in Generalized Anxiety Disorder",
        description: "Evaluated 25 patients at AIIA IPD using Hamilton Anxiety Rating Scale (HAM-A) and salivary cortisol biomarkers.",
        tags: ["Kayachikitsa", "Panchakarma", "Clinical Trial", "Biomarkers"]
      },
      {
        title: "Taxonomical Survey of Himalayan High-Altitude Medicinal Shrubs",
        description: "Conducted field study in Himachal Pradesh documenting morphological phenotypes and folk therapeutics of 35 herbs.",
        tags: ["Dravyaguna", "Herb Taxonomy", "Pharmacognosy"]
      }
    ],
    appliedPostings: [
      {
        postingId: "job-ayush-01",
        appliedAt: "2026-09-08",
        status: "Shortlisted",
        matchScore: 89,
        gapReport: []
      },
      {
        postingId: "job-ayush-02",
        appliedAt: "2026-09-11",
        status: "Applied",
        matchScore: 74,
        gapReport: []
      }
    ]
  },
  {
    id: "stud-ayush-02",
    name: "Vikramaditya Rao",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    email: "vikram.rao@nia.nic.in",
    domainPack: "ayush",
    institutionId: "inst-nia-02",
    institutionName: "National Institute of Ayurveda (NIA), Jaipur",
    degree: "BAMS (Clinical Intern)",
    year: "Internship Year",
    cgpa: 8.2,
    apaarId: "IN-APAAR-2026-AYUSH-4182",
    digiLockerVerified: true,
    verificationConfidence: 0.70,
    skills: [
      { skillId: "ayush-pk-01", name: "Panchakarma Protocol & Procedures", level: 5, verified: true, endorsedBy: "Dr. Meenakshi Joshi" },
      { skillId: "ayush-shalya-05", name: "Shalya Tantra & Ksharasutra Therapy", level: 4, verified: true, endorsedBy: "Dr. Meenakshi Joshi" },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", level: 3, verified: false },
      { skillId: "ayush-rasa-04", name: "Rasashastra & Formulation Quality Control", level: 1, verified: false }
    ],
    projects: [
      {
        title: "Comparative Study of Apamarga vs. Snuhi Ksharasutra in High Anal Fistulae",
        description: "Assisted in 40 Ksharasutra procedures; recorded unit cutting time and healing index.",
        tags: ["Shalya Tantra", "Ksharasutra", "Para-Surgical"]
      }
    ],
    appliedPostings: [
      {
        postingId: "job-ayush-03",
        appliedAt: "2026-09-02",
        status: "Shortlisted",
        matchScore: 92,
        gapReport: []
      }
    ]
  },
  {
    id: "stud-ayush-03",
    name: "Dr. Priya Sundaram",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    email: "priya.sundaram@itra.edu.in",
    domainPack: "ayush",
    institutionId: "inst-itra-03",
    institutionName: "Institute of Teaching and Research in Ayurveda (ITRA)",
    degree: "MD (Ayurveda) - Rasashastra & Bhaishajya Kalpana",
    year: "Postgraduate Final Year",
    cgpa: 9.1,
    apaarId: "IN-APAAR-2026-AYUSH-1092",
    digiLockerVerified: true,
    verificationConfidence: 0.95,
    skills: [
      { skillId: "ayush-rasa-04", name: "Rasashastra & Formulation Quality Control", level: 5, verified: true, endorsedBy: "Dr. Rajesh Kothari" },
      { skillId: "ayush-dravya-03", name: "Dravyaguna & Herb Identification", level: 4, verified: true, endorsedBy: "Dr. Rajesh Kothari" },
      { skillId: "ayush-reg-07", name: "Clinical Trial Documentation & AYUSH GCP", level: 4, verified: true, endorsedBy: "Dr. Rajesh Kothari" },
      { skillId: "ayush-kaya-02", name: "Kayachikitsa (Internal Medicine & Diagnostics)", level: 3, verified: false }
    ],
    projects: [
      {
        title: "Standardization and Heavy Metal Toxicity Profiling of Swarna Bhasma using ICP-MS",
        description: "Validation of safety parameters in herbo-metallic bhasma formulation compliant with WHO guidelines.",
        tags: ["Rasashastra", "Formulation QA", "ICP-MS", "Heavy Metals"]
      }
    ],
    appliedPostings: [
      {
        postingId: "job-ayush-02",
        appliedAt: "2026-09-09",
        status: "Applied",
        matchScore: 95,
        gapReport: []
      }
    ]
  },

  // Tech Students
  {
    id: "stud-tech-01",
    name: "Rohan Mehta",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    email: "rohan.mehta@dtu.ac.in",
    domainPack: "tech",
    institutionId: "inst-dtu-04",
    institutionName: "Delhi Technological University (DTU)",
    degree: "B.Tech Computer Science & Engineering",
    year: "Final Year (Batch 2026)",
    cgpa: 8.9,
    apaarId: "IN-APAAR-2026-TECH-8821",
    digiLockerVerified: true,
    verificationConfidence: 0.80,
    skills: [
      { skillId: "tech-react-01", name: "React & Modern Frontend Architecture", level: 4, verified: true, endorsedBy: "Prof. S. K. Gupta" },
      { skillId: "tech-node-02", name: "Node.js & Scalable REST/GraphQL APIs", level: 4, verified: true, endorsedBy: "Prof. S. K. Gupta" },
      { skillId: "tech-db-03", name: "Database Systems & Data Modeling (SQL / NoSQL)", level: 3, verified: false },
      { skillId: "tech-nlp-04", name: "Natural Language Processing & Semantic Search", level: 2, verified: false },
      { skillId: "tech-cloud-05", name: "Docker, Kubernetes & CI/CD Pipelines", level: 1, verified: false }
    ],
    projects: [
      {
        title: "Real-time Telemetry & Health Monitoring Dashboard",
        description: "Engineered high-throughput WebSocket streams handling 50k events/sec with React Virtualized.",
        tags: ["React", "Node.js", "WebSocket", "Performance"]
      }
    ],
    appliedPostings: [
      {
        postingId: "job-tech-01",
        appliedAt: "2026-09-10",
        status: "Applied",
        matchScore: 84,
        gapReport: []
      }
    ]
  }
];
