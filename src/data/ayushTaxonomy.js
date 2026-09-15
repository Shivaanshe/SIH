export const ayushTaxonomy = [
  // Clinical / Panchakarma
  {
    id: "ayush-pk-01",
    name: "Panchakarma Protocol & Procedures",
    aliases: ["Panchakarma", "Vamana", "Virechana", "Basti Therapy", "Nasya", "Raktamokshana", "Purvakarma", "Snehana", "Swedana"],
    category: "Clinical Procedures",
    domainPack: "ayush",
    description: "Hands-on expertise in administering standard 5 cleansing therapies and preparatory Purvakarma under clinical supervision.",
    resources: [
      {
        title: "Clinical Guidelines in Panchakarma Therapy",
        provider: "CCRAS / Ministry of Ayush",
        url: "https://ccras.nic.in/content/clinical-guidelines-panchakarma",
        type: "Official Clinical Manual",
        estMinutes: 120
      },
      {
        title: "Standardized Protocol for Basti & Vamana Admin",
        provider: "All India Institute of Ayurveda (AIIA)",
        url: "https://aiia.gov.in/panchakarma-protocols",
        type: "CME Video Series",
        estMinutes: 90
      }
    ],
    projectIdea: "Document a comparative case log of 5 patients undergoing Virechana with standardized assessment of Vega and Lakshana."
  },
  {
    id: "ayush-kaya-02",
    name: "Kayachikitsa (Internal Medicine & Diagnostics)",
    aliases: ["Kayachikitsa", "Nadi Pariksha", "Rog Nidana", "Ashtavidha Pariksha", "Dosha Dhatu Mala Assessment"],
    category: "Diagnostics & Therapeutics",
    domainPack: "ayush",
    description: "Ayurvedic internal medicine differential diagnosis, pulse assessment (Nadi Pariksha), and holistic constitutional management.",
    resources: [
      {
        title: "Nidan Panchak & Advanced Kayachikitsa",
        provider: "SWAYAM / UGC",
        url: "https://swayam.gov.in/nc_details/NIDAN_KAYA",
        type: "Interactive Course",
        estMinutes: 180
      },
      {
        title: "Nadi Pariksha: Clinical Diagnostics Atlas",
        provider: "National Institute of Ayurveda (NIA)",
        url: "https://nia.nic.in/publications/nadi-atlas",
        type: "E-Book & Protocol Guide",
        estMinutes: 60
      }
    ],
    projectIdea: "Formulate an evidence-based clinical management plan for Metabolic Syndrome (Prameha) integrating lifestyle & herbs."
  },
  {
    id: "ayush-dravya-03",
    name: "Dravyaguna & Herb Identification",
    aliases: ["Dravyaguna", "Medicinal Plants", "Pharmacognosy", "Herb Taxonomy", "Herb Quality Testing", "Rasa Panchaka"],
    category: "Pharmacognosy & Raw Materials",
    domainPack: "ayush",
    description: "Macroscopic/microscopic botanical identification, organoleptic testing, and active phytochemical evaluation of classical herbs.",
    resources: [
      {
        title: "Medicinal Plants of India & Pharmacognosy",
        provider: "NPTEL / IIT Roorkee",
        url: "https://nptel.ac.in/courses/medicinal-plants",
        type: "Lecture Series",
        estMinutes: 150
      },
      {
        title: "Ayurvedic Pharmacopoeia of India (API) Monograph Reader",
        provider: "Pharmacopoeia Commission for Indian Medicine (PCIM&H)",
        url: "https://pcimh.gov.in/monographs",
        type: "Standard Pharmacopoeial Guidelines",
        estMinutes: 75
      }
    ],
    projectIdea: "Prepare a physical or digital herbarium of 20 adulterant-prone Ayurvedic raw drugs with chromatographic test references."
  },
  {
    id: "ayush-rasa-04",
    name: "Rasashastra & Formulation Quality Control",
    aliases: ["Rasashastra", "Bhasma Preparation", "Bhaishajya Kalpana", "Ayush GMP", "Stability Testing", "Formulation QA"],
    category: "Manufacturing & QA/QC",
    domainPack: "ayush",
    description: "Classical and modern pharmaceutical processing, Shodhana, Marana, microbial limit testing, and Schedule T GMP compliance.",
    resources: [
      {
        title: "Schedule T & GMP Regulations for Ayurvedic Pharma",
        provider: "Ministry of Ayush / AIIA Training",
        url: "https://ayush.gov.in/gmp-compliance",
        type: "Regulatory Compliance Workshop",
        estMinutes: 110
      },
      {
        title: "Quality Control of Classical Herbo-Mineral Formulations",
        provider: "CCRAS Research Series",
        url: "https://ccras.nic.in/research/qc-bhasma",
        type: "Research Paper & SOP Guide",
        estMinutes: 80
      }
    ],
    projectIdea: "Draft an SOP for Ashwagandharishta preparation complying with microbial limit and alcohol percentage thresholds."
  },
  {
    id: "ayush-shalya-05",
    name: "Shalya Tantra & Ksharasutra Therapy",
    aliases: ["Shalya Tantra", "Ksharasutra", "Anorectal Procedures", "Wound Care", "Vranaropana", "Ayurvedic Surgery"],
    category: "Surgical & Para-Surgical",
    domainPack: "ayush",
    description: "Para-surgical techniques including Ksharasutra ligation for Bhagandara (fistula-in-ano), Agnikarma, and specialized sterile wound dressing.",
    resources: [
      {
        title: "Ksharasutra Technique for Anorectal Disorders",
        provider: "AIIA Shalya Department",
        url: "https://aiia.gov.in/shalya-ksharasutra-sop",
        type: "Procedural Video Tutorial",
        estMinutes: 90
      }
    ],
    projectIdea: "Create a sterile prep checklist and post-procedure wound management card for patients treated with Apamarga Ksharasutra."
  },
  {
    id: "ayush-yoga-06",
    name: "Yoga Therapy & Lifestyle Prescription",
    aliases: ["Yoga Therapy", "Pathya-Apathya", "Swasthavritta", "Pranayama Protocols", "Dinacharya Coaching"],
    category: "Preventive & Lifestyle",
    domainPack: "ayush",
    description: "Customized therapeutic asana, pranayama prescription for chronic lifestyle disorders, and circadian Dinacharya integration.",
    resources: [
      {
        title: "Therapeutic Yoga Protocols for Common Ailments",
        provider: "Morarji Desai National Institute of Yoga (MDNIY)",
        url: "https://mdniy.nic.in/therapeutic-protocols",
        type: "Certified Guideline",
        estMinutes: 100
      }
    ],
    projectIdea: "Design a 6-week progressive yoga protocol for hypertension with pre/post blood pressure and HRV logging."
  },
  {
    id: "ayush-reg-07",
    name: "Clinical Trial Documentation & AYUSH GCP",
    aliases: ["AYUSH GCP", "Good Clinical Practice", "CTRI Registration", "Pharmacovigilance in Ayush", "Ethics Committee Filing"],
    category: "Clinical Research & Regulatory",
    domainPack: "ayush",
    description: "Designing AYUSH clinical trial protocols conforming to ICMR and Ministry of Ayush ethical guidelines and CTRI filing.",
    resources: [
      {
        title: "Good Clinical Practice Guidelines for AYUSH Research",
        provider: "Ministry of Ayush",
        url: "https://ayush.gov.in/guidelines/gcp",
        type: "Regulatory Course",
        estMinutes: 130
      }
    ],
    projectIdea: "Draft a Case Report Form (CRF) and Patient Informed Consent Form for a randomized controlled trial on Guduchi."
  }
];
