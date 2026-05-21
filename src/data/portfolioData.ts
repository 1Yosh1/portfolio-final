// ============================================================
//  PORTFOLIO DATA — EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
//  Add / remove / reorder items freely. The UI auto-updates.
// ============================================================

export const PROFILE = {
  name: "Eyoas Zewd",
  title: "Full-Stack Engineer & Security Architect",
  tagline: "Building high-fidelity interfaces and explainable risk systems.",
  github: "https://github.com/1Yosh1",
  linkedin: "https://linkedin.com/in/eyoas-zewd", // update with real URL
  email: "eyoas@example.com", // update with real email
  location: "Ethiopia / Italy",
  languages: ["English", "Italian", "Amharic"],
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "University of Catania",
      year: "2022 – Present",
    },
  ],
  bio: "I design and build secure, performant web systems — from luxury branding experiences to cryptographic authentication engines. I operate a Karpathy-style AI second brain to keep every project synced and token-efficient.",
};

// ─────────────────────────────────────────────
// DRAWER 2 — SKILLS (shown as labeled folders)
// ─────────────────────────────────────────────
export const SKILLS = [
  { category: "Frontend", items: ["React", "Next.js", "Three.js / R3F", "GSAP", "Tailwind CSS", "Vanilla CSS", "TypeScript"] },
  { category: "Backend", items: ["Go (Golang)", "Spring Boot", "Node.js", "REST APIs", "WebSockets"] },
  { category: "Security", items: ["WebAuthn / FIDO2", "TOTP", "OAuth 2.0", "Rate Limiting", "Threat Modeling"] },
  { category: "Data & AI", items: ["Python", "Jupyter", "Pandas", "scikit-learn", "NLP / Sentiment Analysis"] },
  { category: "DevOps", items: ["Docker", "Docker Compose", "GitHub Actions", "Linux", "Nginx"] },
  { category: "Database", items: ["PostgreSQL", "MySQL", "SQLite", "IoT Sensor Data Pipelines"] },
];

// ─────────────────────────────────────────────
// DRAWER 2 — PROJECTS (add/remove freely)
// ─────────────────────────────────────────────
export const PROJECTS = [
  {
    id: "locanda",
    title: "La Locanda Dei Mori",
    category: "Frontend / Branding",
    status: "live" as const,
    description:
      "A luxury digital branding experience and dynamic QR-menu system built for an authentic Sicilian restaurant in Taormina. Enforces strict asset guidelines and HSL-tailored styling inspired by Mediterranean earth tones.",
    tech: ["Next.js", "Vanilla CSS", "SEO / Schema.org", "WCAG 2.1 AA"],
    github: "https://github.com/1Yosh1/LocandaDeiMori-Website",
    live: null, // add live URL when deployed
    folder: "Projects",
  },
  {
    id: "securegame",
    title: "SecureGame Simulator",
    category: "Backend / Security",
    status: "active" as const,
    description:
      "An educational gamified simulator teaching multi-factor authentication (TOTP & WebAuthn), brute-force defenses, and social engineering. Employs a custom graph-based discrete-event simulation engine.",
    tech: ["Go (Golang)", "Spring Boot", "Docker-Compose", "TOTP / WebAuthn"],
    github: "https://github.com/1Yosh1/securegame",
    live: null,
    folder: "Projects",
  },
  {
    id: "securegame-core",
    title: "SecureGame Core Engine",
    category: "Backend / Security",
    status: "active" as const,
    description:
      "The reusable core simulation engine extracted from SecureGame — a modular discrete-event library for security scenario modeling.",
    tech: ["Go", "Event-Driven Architecture", "Graph Algorithms"],
    github: "https://github.com/1Yosh1/SecureGame-Core",
    live: null,
    folder: "Projects",
  },
  {
    id: "ai-air-canvas",
    title: "AI Air Canvas",
    category: "AI / Computer Vision",
    status: "live" as const,
    description:
      "A gesture-driven drawing application using computer vision and AI to track hand movements in real time, turning air gestures into digital art.",
    tech: ["Python", "OpenCV", "MediaPipe", "NumPy"],
    github: "https://github.com/1Yosh1/ai-air-canvas",
    live: null,
    folder: "Demos",
  },
  {
    id: "financial-sentiment",
    title: "Financial Sentiment Analyzer",
    category: "Data / NLP",
    status: "live" as const,
    description:
      "NLP pipeline that classifies financial news sentiment (bullish / bearish / neutral) using transformer models and custom financial lexicons.",
    tech: ["Python", "Transformers", "HuggingFace", "Pandas", "NLTK"],
    github: "https://github.com/1Yosh1/financial-sentiment-analyzer",
    live: null,
    folder: "Demos",
  },
  {
    id: "credit-scoring",
    title: "Credit Scoring Model",
    category: "Data / ML",
    status: "live" as const,
    description:
      "Machine learning pipeline for credit risk assessment — feature engineering, model selection (XGBoost, LR), and explainability via SHAP values.",
    tech: ["Python", "XGBoost", "scikit-learn", "SHAP", "Jupyter"],
    github: "https://github.com/1Yosh1/credit-scoring-project",
    live: null,
    folder: "Demos",
  },
  {
    id: "maritime",
    title: "Maritime Project",
    category: "Data / Systems",
    status: "live" as const,
    description:
      "A maritime data management and routing system for logistics and vessel tracking across Mediterranean shipping lanes.",
    tech: ["Python", "PostgreSQL", "Routing Algorithms"],
    github: "https://github.com/1Yosh1/maritime-project",
    live: null,
    folder: "Projects",
  },
  {
    id: "database-assignment",
    title: "IoT Air Quality Monitor",
    category: "Data / IoT",
    status: "live" as const,
    description:
      "IoT sensor simulation collecting real-time air quality, temperature, and humidity data with a normalized database schema and query layer.",
    tech: ["Python", "SQLite", "IoT Sensors", "Data Pipelines"],
    github: "https://github.com/1Yosh1/database-assignment",
    live: null,
    folder: "Demos",
  },
  {
    id: "bevvlen",
    title: "Bevvlen",
    category: "Web / App",
    status: "active" as const,
    description:
      "A social beverage discovery and tracking app — log, rate, and share your drink experiences with friends.",
    tech: ["Web", "JavaScript", "CSS"],
    github: "https://github.com/1Yosh1/bevvlen",
    live: null,
    folder: "Projects",
  },
  {
    id: "web-portfolio",
    title: "Web Portfolio (v1)",
    category: "Frontend",
    status: "live" as const,
    description:
      "The first iteration of my personal portfolio — a lightweight, static HTML/CSS/JS showcase of my early projects.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/1Yosh1/web-portfolio",
    live: null,
    folder: "Projects",
  },
];

// ─────────────────────────────────────────────
// DRAWER 3 — WORKS IN PROGRESS
// ─────────────────────────────────────────────
export const WORKS_IN_PROGRESS = [
  {
    id: "wip-portfolio-3d",
    title: "3D Portfolio Website",
    description: "The very site you are looking at — a Tim Burton-style 3D file cabinet experience built with React Three Fiber, Rapier physics, and GSAP.",
    status: 85,
    statusLabel: "Building",
    upcoming: ["Mobile responsiveness polish", "Drawer 4 contact animations", "Performance audit"],
    tech: ["Next.js", "R3F", "Rapier", "GSAP", "Tailwind"],
  },
  {
    id: "wip-securegame",
    title: "SecureGame v2 — Full Release",
    description: "Expanding SecureGame Simulator with multiplayer attack/defend scenarios and a custom WebAuthn flow.",
    status: 40,
    statusLabel: "In Development",
    upcoming: ["Multiplayer lobby system", "Custom WebAuthn ceremony", "Docker orchestration refactor"],
    tech: ["Go", "Spring Boot", "WebAuthn", "Docker"],
  },
  {
    id: "wip-second-brain",
    title: "AI Second Brain Wiki",
    description: "Living Karpathy-style knowledge base linked with Pochi CLI rules for 94%+ token context savings.",
    status: 70,
    statusLabel: "Active",
    upcoming: ["Cross-project semantic search", "Auto-diff summaries", "Obsidian plugin bridge"],
    tech: ["Obsidian", "Markdown", "Shell Hooks", "Mermaid.js"],
  },
  {
    id: "wip-mining",
    title: "Data Mining Research",
    description: "Academic research pipeline exploring association rule mining and clustering on real-world datasets.",
    status: 60,
    statusLabel: "Research Phase",
    upcoming: ["Apriori optimizations", "Visualization layer", "Paper writeup"],
    tech: ["Python", "Jupyter", "scikit-learn", "Matplotlib"],
  },
];
