export const techTaxonomy = [
  {
    id: "tech-react-01",
    name: "React & Modern Frontend Architecture",
    aliases: ["React", "ReactJS", "Next.js", "Hooks", "Redux", "Component Design", "TypeScript Frontend"],
    category: "Frontend Engineering",
    domainPack: "tech",
    description: "Component lifecycle, state management, custom hooks, and high-performance Web application architectures.",
    resources: [
      {
        title: "Advanced React & Design Patterns",
        provider: "NPTEL / IIT Madras",
        url: "https://nptel.ac.in/courses/advanced-web-tech",
        type: "Interactive Track",
        estMinutes: 120
      }
    ],
    projectIdea: "Build an interactive, accessible dashboard with server-side rendering and optimistic UI updates."
  },
  {
    id: "tech-node-02",
    name: "Node.js & Scalable REST/GraphQL APIs",
    aliases: ["Node.js", "Express", "NestJS", "REST API", "GraphQL", "JWT Auth", "Microservices"],
    category: "Backend Engineering",
    domainPack: "tech",
    description: "Asynchronous backend runtimes, distributed event loops, role-based authorization middleware, and API design.",
    resources: [
      {
        title: "Building Resilient Microservices with Node.js",
        provider: "SWAYAM / IIT Kharagpur",
        url: "https://swayam.gov.in/backend-dev",
        type: "Online Course",
        estMinutes: 140
      }
    ],
    projectIdea: "Design a rate-limited API gateway with Redis token-bucket algorithm and JWT refresh token rotation."
  },
  {
    id: "tech-db-03",
    name: "Database Systems & Data Modeling (SQL / NoSQL)",
    aliases: ["MongoDB", "PostgreSQL", "Data Modeling", "Aggregation Pipeline", "Indexing", "ACID Transactions"],
    category: "Data & Storage",
    domainPack: "tech",
    description: "Schema design, compound indexing, query optimization, and distributed database consistency.",
    resources: [
      {
        title: "Database Management Systems",
        provider: "NPTEL / IIT Bombay",
        url: "https://nptel.ac.in/courses/dbms",
        type: "Video Course",
        estMinutes: 180
      }
    ],
    projectIdea: "Design and benchmark a polymorphic schema in MongoDB with sharding and geospatial indexing."
  },
  {
    id: "tech-nlp-04",
    name: "Natural Language Processing & Semantic Search",
    aliases: ["NLP", "Sentence Transformers", "spaCy", "Vector Embeddings", "Cosine Similarity", "NER"],
    category: "AI & Machine Learning",
    domainPack: "tech",
    description: "Vector embeddings, Named Entity Recognition, cosine similarity indexing, and semantic retrieval.",
    resources: [
      {
        title: "Applied Natural Language Processing",
        provider: "NPTEL / IIT Kanpur",
        url: "https://nptel.ac.in/courses/nlp",
        type: "Video Track",
        estMinutes: 200
      }
    ],
    projectIdea: "Build an open-source resume skill extractor using spaCy NER pipelines and cosine similarity search."
  },
  {
    id: "tech-cloud-05",
    name: "Docker, Kubernetes & CI/CD Pipelines",
    aliases: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Containerization", "DevOps"],
    category: "DevOps & Cloud",
    domainPack: "tech",
    description: "Multi-stage container builds, automated unit/integration testing pipelines, and declarative infrastructure.",
    resources: [
      {
        title: "Cloud Computing & DevOps Practices",
        provider: "NPTEL / IIT Patna",
        url: "https://nptel.ac.in/courses/cloud-computing",
        type: "Comprehensive Course",
        estMinutes: 160
      }
    ],
    projectIdea: "Construct a multi-stage Docker build with zero-downtime deployment script and automated GitHub Actions test matrix."
  }
];
