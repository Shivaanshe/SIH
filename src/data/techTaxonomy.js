export const techTaxonomy = [
  {
    id: "tech-react-01",
    name: "React & Modern Frontend Architecture",
    aliases: ["React", "React.js", "ReactJS", "Next.js", "Hooks", "Redux", "Component Design", "TypeScript Frontend"],
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
    aliases: ["Node.js", "Node", "Express", "Express.js", "NestJS", "REST API", "REST APIs", "GraphQL", "JWT", "bcryptjs", "Microservices"],
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
    aliases: ["MongoDB", "Mongoose", "PostgreSQL", "MySQL", "SQL", "Oracle AI Database", "Data Modeling", "Aggregation Pipeline", "Indexing"],
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
    id: "tech-java-06",
    name: "Java & Enterprise Backend Engineering",
    aliases: ["Java", "Core Java", "Programming in JAVA", "Spring Boot", "JVM", "OOP", "Hibernate"],
    category: "Backend Engineering",
    domainPack: "tech",
    description: "Object-oriented paradigm, concurrency, memory management, and robust backend microservice frameworks.",
    resources: [
      {
        title: "Programming in Java Certification",
        provider: "NPTEL / IIT Kharagpur",
        url: "https://nptel.ac.in/courses/java",
        type: "Online Course",
        estMinutes: 160
      }
    ],
    projectIdea: "Architect an asynchronous order-matching queue using Spring Boot and Kafka message brokers."
  },
  {
    id: "tech-cpp-07",
    name: "C / C++ & Data Structures (DSA)",
    aliases: ["C++", "C", "Data Structure", "Data Structure and Algorithm", "Algorithms", "DSA", "Leetcode", "HackerRank", "GeeksforGeeks"],
    category: "Core Computer Science",
    domainPack: "tech",
    description: "Memory pointers, low-level optimization, algorithmic complexity analysis, and competitive programming.",
    resources: [
      {
        title: "Data Structures & Algorithms in C++",
        provider: "NPTEL / IIT Delhi",
        url: "https://nptel.ac.in/courses/dsa",
        type: "Video Course",
        estMinutes: 180
      }
    ],
    projectIdea: "Implement a lock-free concurrent hash map in modern C++ (C++20) using atomic memory fences."
  },
  {
    id: "tech-fullstack-08",
    name: "Full-Stack Architecture & Modern Web Platforms",
    aliases: ["Full-Stack", "Full-Stack Architecture", "HTML5", "CSS3", "JavaScript", "ES6+", "MERN Stack", "MERN", "Netlify", "Render"],
    category: "Web Engineering",
    domainPack: "tech",
    description: "End-to-end full-stack architectures, client-server handshake, reactive state rendering, and cloud hosting.",
    resources: [
      {
        title: "Modern Full Stack Web Development",
        provider: "SWAYAM / IIT Roorkee",
        url: "https://swayam.gov.in/fullstack",
        type: "Comprehensive Track",
        estMinutes: 150
      }
    ],
    projectIdea: "Develop a full-featured collaborative workspace with real-time WebSockets and cloud deployment."
  },
  {
    id: "tech-android-09",
    name: "Android & Mobile App Architecture",
    aliases: ["Kotlin", "Jetpack Compose", "Media3", "Android", "Room", "Coroutines", "ExoPlayer", "Retrofit", "yt-dlp"],
    category: "Mobile Engineering",
    domainPack: "tech",
    description: "Modern declarative Android UI with Jetpack Compose, asynchronous coroutines/flow, and media streaming pipelines.",
    resources: [
      {
        title: "Modern Android Development with Jetpack Compose",
        provider: "Google Developers / NPTEL",
        url: "https://developer.android.com",
        type: "Code Lab",
        estMinutes: 130
      }
    ],
    projectIdea: "Build a cache-first audio streaming engine with background playback service and media notification controls."
  },
  {
    id: "tech-git-11",
    name: "Version Control, DevOps & Deployment",
    aliases: ["Git", "GitHub", "Netlify", "Render", "CI/CD", "Docker", "Kubernetes", "DevOps"],
    category: "DevOps & Tooling",
    domainPack: "tech",
    description: "Trunk-based branch workflows, distributed Git internals, automated deployment triggers, and cloud hosting.",
    resources: [
      {
        title: "Git & GitHub for Collaborative Engineering",
        provider: "Open Source Academy",
        url: "https://github.com",
        type: "Interactive Workshop",
        estMinutes: 90
      }
    ],
    projectIdea: "Configure automated multi-environment staging pipelines with secret encryption and pull request health checks."
  },
  {
    id: "tech-soft-12",
    name: "Engineering Soft Skills & Collaborative Leadership",
    aliases: ["Problem-solving", "Team Collaboration", "Adaptability", "Continuous Learning", "Public Speaking", "Communication"],
    category: "Professional Competencies",
    domainPack: "tech",
    description: "Cross-functional team collaboration, agile sprint retrospectives, clear technical documentation, and adaptability.",
    resources: [
      {
        title: "Effective Communication & Engineering Leadership",
        provider: "SWAYAM / IIM Bangalore",
        url: "https://swayam.gov.in/soft-skills",
        type: "Executive Track",
        estMinutes: 100
      }
    ],
    projectIdea: "Lead a distributed team sprint with daily standups, issue tracking, and peer code reviews."
  },
  {
    id: "tech-nlp-04",
    name: "Natural Language Processing & Semantic Search",
    aliases: ["NLP", "Sentence Transformers", "spaCy", "Vector Embeddings", "Cosine Similarity", "NER", "Oracle AI"],
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
    id: "tech-python-05",
    name: "Python & Machine Learning Foundations",
    aliases: ["Python", "Py-a-thon", "Machine Learning", "Data Science", "Pandas", "NumPy", "PyTorch", "TensorFlow", "Scikit-Learn"],
    category: "AI & Data Science",
    domainPack: "tech",
    description: "Python scripting, algorithmic data processing, statistical modeling, and machine learning pipelines.",
    resources: [
      {
        title: "Joy of Computing using Python",
        provider: "NPTEL / IIT Ropar",
        url: "https://nptel.ac.in/courses/python",
        type: "Online Course",
        estMinutes: 180
      }
    ],
    projectIdea: "Develop a predictive analytics model and data processing pipeline with Pandas and Scikit-Learn."
  }
];
