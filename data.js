// ============================================================
//  Portfolio content — Maheen Niazi
//  Everything the site renders lives here, so updating the
//  portfolio is just editing this one file.
// ============================================================

const DATA = {
  // Drop your own pics in assets/photos/ and point a slot at them, e.g.
  //   about: "assets/photos/me.jpg"
  // Empty slots show a little "add a pic" hint instead.
  photos: {
    about: "",
  },

  profile: {
    name: "Maheen Niazi",
    tagline: "CS & Applied Math @ UofT — I build games, AI tools and little things that run offline and don't break. (and yes, I take Spider-Man way too seriously.)",
    // Short punchy lines cycled by the typewriter in the hero
    roles: [
      "cs & applied math @ uoft",
      "i build games from scratch",
      "ai tools that run offline",
      "your friendly neighbourhood tech girl",
    ],
    location: "Mississauga, ON",
    email: "maheen.niazi112@gmail.com",
    phone: "(647) 537-0560",
    links: {
      github: "https://github.com/maheenniazi",
      linkedin: "https://www.linkedin.com/in/maheen-niazi-bb3814342",
      instagram: "https://www.instagram.com/maheenniazi_/",
    },
    about: [
      "Hi, I'm Maheen. I study Computer Science and Applied Math at the University of Toronto Mississauga, and I graduate in 2029.",
      "I like building things end to end and figuring out how they work underneath. Recently that's meant a multiplayer 3D racing game on a WebGL engine I wrote myself, a study assistant that runs entirely offline, and a real-time collaborative code editor. I use AI coding tools to move fast, but I design the systems and do the hard debugging myself, especially physics, networking and retrieval.",
      "Outside of school, I tutor French and web development, help organize DeerHacks, UTM's hackathon, and play guitar.",
    ],
  },

  education: {
    school: "University of Toronto Mississauga",
    location: "Mississauga, ON",
    degree: "Honours BSc — Intended Majors: Computer Science & Applied Mathematics",
    date: "Expected 2029",
  },

  // Grouped exactly like the resume
  skills: [
    {
      group: "Languages",
      items: ["Python", "JavaScript", "SQL", "Swift", "R", "Data Structures & Algorithms"],
    },
    {
      group: "AI & ML",
      items: [
        "LLMs (Ollama + Anthropic / OpenAI / Gemini / Kiro)",
        "RAG",
        "Embeddings",
        "Vector DBs (ChromaDB)",
        "LangChain",
        "OCR (Tesseract)",
        "Prompt Engineering",
        "AI-Assisted Development",
      ],
    },
    {
      group: "Web & Front End",
      items: [
        "React",
        "Monaco Editor",
        "Node.js",
        "Express",
        "Socket.io",
        "WebSockets",
        "WebGL",
        "HTML / CSS",
        "Progressive Web Apps",
      ],
    },
    {
      group: "Tools & Infrastructure",
      items: ["Git", "GitHub Actions (CI/CD)", "Docker", "Streamlit", "PyMuPDF", "Linux / CLI"],
    },
    {
      group: "Spoken",
      items: ["English", "French", "Urdu"],
    },
  ],

  projects: [
    {
      name: "Lumora",
      sticker: "lily",
      color: "#e8c4c8",
      blurb: "RAG Study Assistant",
      stack: ["Python", "LangChain", "ChromaDB", "Ollama", "Docker"],
      repo: "https://github.com/maheenniazi/lumora",
      points: [
        "Local-first study assistant that answers only from a student's uploaded course notes and runs fully offline — no data leaves the machine.",
        "Ingestion pipeline (PyMuPDF + LangChain) chunks PDFs into 500-char segments with 50-char overlap into a per-course ChromaDB store.",
        "RAG retrieves the top 3 relevant chunks per question, grounds a local Llama 3.2 model (via Ollama), and keeps memory for follow-ups.",
        "Hallucination guardrail replies \"I couldn't find that in your notes\" when context is missing; Claude API used only for optional note generation.",
        "Containerized with Docker Compose; GitHub Actions CI runs lint, unit tests, image build and smoke test on every change. UI in Streamlit.",
      ],
    },
    {
      name: "Orbit",
      sticker: "vinyl",
      color: "#d9a7ae",
      blurb: "AI Student Workspace",
      stack: ["Node.js", "Vanilla JS", "OCR", "LLMs"],
      repo: "https://github.com/maheenniazi/orbit",
      points: [
        "Notion-style student workspace — a zero-dependency Node.js app with a vanilla-JS front end and browser storage, runs fully offline with optional AI, Spotify and job-search integrations.",
        "Universal file ingestion reads 12+ formats (PDF incl. scanned, Word, PowerPoint, Excel, OpenDocument, RTF, HTML, CSV, photos/screenshots via Tesseract OCR), with an offline date parser fallback.",
        "Four LLM providers (Anthropic, OpenAI, Gemini, Kiro) behind one interface with a live model picker — parses syllabi, generates notes, powers a schedule-aware chat assistant.",
        "Auto study planner schedules six spaced sessions per exam; focus phases shift theme, pomodoro length and music as exams approach.",
        "Degree planner imports a transcript via OCR and checks program requirements (Canadian credit systems built in); careers module ranks internship listings and tailors resumes.",
        "Calendar with natural-language quick add (\"bio quiz fri 2pm\"), .ics export, and Spotify playback via OAuth PKCE.",
      ],
    },
    {
      name: "Turbo Karts",
      sticker: "star-red",
      color: "#e7c7a3",
      blurb: "Multiplayer Racing Game",
      stack: ["JavaScript", "WebGL", "Node.js", "WebSockets", "PWA"],
      repo: "https://github.com/maheenniazi/turbo-karts",
      points: [
        "3D kart racing game for iPhone, iPad and Mac with online multiplayer for up to 8 players per room — zero dependencies, custom engine, no game libraries.",
        "Custom WebGL renderer and all 3D models written from scratch; every sound effect synthesized in code.",
        "Authoritative netcode: a shared physics/simulation module runs in both the browser and a Node.js WebSocket server that owns the race loop and scoreboard.",
        "6 tracks × 3 difficulties, CPU racers with obstacle avoidance, three-tier drift mini-turbos, an item system, and a Mario Party-style mini-game every three laps.",
        "Shipped as an installable PWA (service worker, manifest, home-screen icons) with keyboard, touch and controller input.",
        "Built AI-first: a spec per system, AI agents implementing each, then physics and multiplayer tested and debugged by hand.",
      ],
    },
    {
      name: "SynCode",
      sticker: "matchbox",
      color: "#c9bca8",
      blurb: "Collaborative Code Editor",
      stack: ["React", "Monaco", "Node.js", "Express", "Socket.io"],
      repo: "https://github.com/maheenniazi/syncode",
      points: [
        "Real-time collaborative code editor — multiple users edit the same file simultaneously with live sync, broadcasting edits over a Node.js/Express + Socket.io server.",
        "Front end built with React and the Monaco editor (the engine behind VS Code), supporting 10+ languages with syntax highlighting and a VS Code-style theme.",
        "Shareable room IDs for sessions plus an in-app chat sidebar for collaborators.",
      ],
    },
  ],

  experience: [
    {
      role: "App Developer Co-op Student",
      org: "Career Education Council",
      location: "Guelph, ON",
      date: "Sep 2024 – Jan 2025",
      points: [
        "Built Learnscape, an iOS learning app for children with neurodevelopmental disorders, in Swift — concept to working app with an engineering mentor.",
        "Iterated through code review and feedback, then presented the finished app and a pitch deck to the program.",
      ],
    },
  ],

  teaching: [
    { role: "Tutor (Elementary, various subjects)", org: "Tutorax", location: "Mississauga, ON", date: "Oct 2026 – Present", note: "Teach elementary students across subjects, breaking complex material into clear, structured steps." },
    { role: "Private French Tutor", org: "Independent", location: "Mississauga, ON", date: "Oct 2026 – Present", note: "Weekly one-on-one French lessons with a Grade 5 student, in French and English." },
    { role: "Web Development Tutor (Volunteer)", org: "Coding Pals", location: "Remote", date: "Nov 2024 – Feb 2025", note: "Taught beginners to build their own web pages; designed lessons and ran my own schedule." },
    { role: "LEGO Robotics Tutor (Volunteer)", org: "Kidnetix", location: "Mississauga, ON", date: "Sep 2024 – Nov 2024", note: "Guided young students through robotics builds, adapting pacing for varied learning needs." },
    { role: "Social Media Content Creator (Volunteer)", org: "Youth in Food Systems", location: "Remote", date: "Jan 2023 – Apr 2023", note: "Created content to promote youth engagement in local food-systems initiatives." },
    { role: "French Reading Buddy (Volunteer)", org: "Canadian Parents for French, Ontario", location: "Remote", date: "Jun 2022 – May 2023", note: "Led one-on-one online French reading sessions with students in Grades 1–4." },
  ],

  leadership: [
    { role: "Externals Associate", org: "Mathematical & Computational Sciences Society (MCSS), UTM", date: "2026 – Present", note: "Support DeerHacks, UTM's annual hackathon, by running sponsor outreach to tech companies." },
    { role: "Events Associate", org: "UTM FinTech Club", date: "2026 – Present", note: "Coordinate student events across finance and technology, from planning through logistics." },
    { role: "Provincial Competitor — DECA", org: "Business Case Competition", date: "2024", note: "Top 10 at the Ontario provincial level — analyzed business cases under time pressure and presented to judges." },
  ],

  certifications: [
    "Introduction to Generative AI — Google Cloud",
    "AI for Business Professionals — HP LIFE",
    "AI for Beginners — HP LIFE",
    "App Development with Swift Associate — Apple",
  ],

  awards: [
    "DECA Top 10 Provincials (2024)",
    "Robotics Ontario District Winners (2022)",
    "Honor Roll (2021/22, 2022/23, 2023/24, 2024/25)",
  ],

  // A little personality — rendered as flip-polaroids in the Interests page.
  // `sticker` is a file in assets/stickers/ (front of the polaroid). `note` is the handwritten caption.
  // Add `photo: "assets/photos/xyz.jpg"` to show your own pic instead of the sticker.
  interests: [
    { icon: "guitar", sticker: "guitar", title: "guitar", note: "always learning a new song (badly, then well)" },
    { icon: "music", sticker: "vinyl-red",  title: "music",  note: "a playlist for every mood & every project" },
    { icon: "flag", sticker: "star-felt", title: "formula 1", note: "lights out and away we go — every sunday" },
    { icon: "tv", sticker: "camera",     title: "tv & film", note: "comfort rewatches + anything with a plot twist" },
    { icon: "spider", sticker: "spidey-hang", title: "spider-man", note: "the whole personality, honestly" },
    { icon: "book", sticker: "wax-rose", title: "reading", note: "fantasy, a bit of everything, cozy corners" },
  ],
};
