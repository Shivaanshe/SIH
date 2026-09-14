import { ayushTaxonomy } from '../data/ayushTaxonomy';
import { techTaxonomy } from '../data/techTaxonomy';

/**
 * Simulated Client-Side NLP & NER Resume Parser (PRD §11.5)
 * Extracts structured entities: degree, CGPA, email, matched skills with confidence.
 * Outputs a human-in-the-loop review draft.
 */

export function parseResumeText(rawText, domainPack = "ayush") {
  const taxonomy = domainPack === "ayush" ? ayushTaxonomy : techTaxonomy;
  const text = (rawText || "").toLowerCase();

  // 1. Email extraction via regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const extractedEmail = emailMatch ? emailMatch[0] : "";

  // 2. CGPA extraction
  const cgpaMatch = rawText.match(/(\b[0-9]\.[0-9]{1,2}\b)(\s*\/\s*10|\s*cgpa)/i) || rawText.match(/cgpa\s*[:=-]?\s*([0-9]\.[0-9]{1,2})/i);
  const extractedCgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : 8.5;

  // 3. Degree extraction
  let extractedDegree = domainPack === "ayush" 
    ? "Bachelor of Ayurvedic Medicine & Surgery (BAMS)" 
    : "B.Tech Computer Science";
  if (text.includes("bams")) extractedDegree = "BAMS (Ayurveda)";
  else if (text.includes("bhms")) extractedDegree = "BHMS (Homoeopathy)";
  else if (text.includes("md (ayurveda)") || text.includes("md")) extractedDegree = "MD (Ayurveda)";
  else if (text.includes("b.tech") || text.includes("computer science")) extractedDegree = "B.Tech CS";

  // 4. NER Skill Keyword Matching
  const extractedSkills = [];

  taxonomy.forEach(item => {
    let confidence = 0;
    let matchedAlias = "";

    // Check main name
    if (text.includes(item.name.toLowerCase())) {
      confidence = 0.95;
      matchedAlias = item.name;
    } else {
      // Check aliases
      for (const alias of (item.aliases || [])) {
        if (text.includes(alias.toLowerCase())) {
          confidence = 0.85;
          matchedAlias = alias;
          break;
        }
      }
    }

    if (confidence > 0) {
      // Estimate proficiency based on occurrences or context
      let level = 3;
      if (text.includes("advanced " + matchedAlias.toLowerCase()) || text.includes("specialized in " + matchedAlias.toLowerCase()) || text.includes("4 years")) {
        level = 4;
      } else if (text.includes("lead") || text.includes("expert") || text.includes("published")) {
        level = 5;
      }

      extractedSkills.push({
        skillId: item.id,
        name: item.name,
        matchedPhrase: matchedAlias,
        confidence: Math.round(confidence * 100),
        level,
        category: item.category,
        verified: false,
        isHumanConfirmed: false
      });
    }
  });

  return {
    rawLength: rawText.length,
    extractedName: rawText.split("\n")[0]?.replace(/[^a-zA-Z\s]/g, "").trim() || "Candidate Profile",
    extractedEmail,
    extractedCgpa,
    extractedDegree,
    extractedSkills,
    summary: `NLP Entity Extractor identified ${extractedSkills.length} clinical/technical competencies with ${extractedSkills.length > 0 ? "high" : "moderate"} confidence.`
  };
}

export const sampleAyushResume = `Dr. Aanya Sharma, BAMS Intern
Email: aanya.sharma@aiia.gov.in | Phone: +91-98765-43210
AIIA (All India Institute of Ayurveda), New Delhi

EDUCATION
Bachelor of Ayurvedic Medicine & Surgery (BAMS) - Batch 2022-2026
AIIA, New Delhi | CGPA: 8.7 / 10.0

CLINICAL SKILLS & EXPERTISE
- Administered complete Panchakarma procedures: Vamana, Virechana, and Basti therapy across 60+ IPD admissions.
- Proficient in Kayachikitsa differential diagnosis, Ashtavidha Pariksha, and Nadi Pariksha.
- Studied Dravyaguna herb taxonomy, macroscopic identification of raw drugs, and organoleptic testing.
- Formulated Rasashastra classical preparation protocols under Schedule T GMP guidelines.
- Prescribed personalized therapeutic Yoga and Swasthavritta Dinacharya routines.

PROJECTS & PUBLICATIONS
1. Clinical study on Shirodhara with Ashwagandha Taila in stress-induced insomnia.
2. Field ethnobotanical documentation of medicinal plants in Kangra Valley.`;

export const sampleTechResume = `Rohan Mehta
Email: rohan.mehta@dtu.ac.in | Phone: +91-98123-45678
Delhi Technological University (DTU), New Delhi

EDUCATION
B.Tech in Computer Science & Engineering - Batch 2022-2026
DTU, New Delhi | CGPA: 8.9 / 10.0

CORE TECHNICAL COMPETENCIES
- Frontend: ReactJS, Next.js, Redux Toolkit, TypeScript, WebGL, TailwindCSS
- Backend: Node.js, Express, REST APIs, Microservices, Redis Caching
- Databases: MongoDB Aggregation, PostgreSQL, Indexing & Query Optimization
- NLP & AI: Vector Embeddings, spaCy NER, Cosine Similarity search, Transformers
- DevOps: Docker containerization, Kubernetes basics, CI/CD GitHub Actions

PROJECTS
1. Real-time Telemetry & Health Monitoring Engine with WebSocket pipelines.
2. Resume Skill Extractor using Sentence-Transformers and FastAPI.`;
