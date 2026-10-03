export const experience = [
  { date: "SEP 2025 — PRESENT", employer: "Lowe’s", title: "Software Engineer", team: "Full-Stack & Applied AI", summary: "Building full-stack AI applications that make complex tasks easier to navigate. Work spans web interfaces, backend services, integrations, and production quality.", tags: ["Full-stack", "Applied AI", "Enterprise systems"] },
  { date: "JUN 2024 — SEP 2025", employer: "Lowe’s", title: "Associate Software Engineer", team: "Product Detail Page", summary: "Delivered customer-facing experiences, improved analytics accuracy, extended content management capabilities, and built internal developer tools. Partnered with product and engineering teams on experimentation and application security.", tags: ["Web applications", "Experimentation", "Developer tooling"] },
  { date: "MAY — AUG 2023", employer: "Lowe’s", title: "Front-End Web Development Intern", team: "Web & Mobile Experiences", summary: "Integrated push notifications and native-to-web data flows, with automated testing and continuous integration supporting delivery.", tags: ["React", "Firebase", "Capacitor"] },
  { date: "JUN — SEP 2022", employer: "Hawkeye MedTech", title: "Web Development Intern", team: "Health Technology", summary: "Connected smartwatch health data with user profiles and built interactive visualizations, with attention to cross-device compatibility.", tags: ["API integration", "Data visualization"] },
];
export const contributions = [
  { icon: "workflow", category: "FULL-STACK × APPLIED AI", year: "2026", shortTitle: "Enterprise AI workflows", title: "Turning complex operations into guided workflows.", summary: "Built an AI-powered enterprise assistant that connects a modern web interface, backend services, and business systems to simplify multi-step operations.", tags: ["React / TypeScript", "Python / FastAPI", "LangGraph", "PostgreSQL"], role: "Built across frontend, backend, and enterprise integrations", outcome: "Guided enterprise workflows shipped to production", details: [
    { heading: "The problem", body: "Business operations required navigating multiple systems, understanding specialized fields, and completing dependent steps correctly. A conversational interface needed to make that process easier while preserving control over consequential changes." },
    { heading: "My contribution", body: "Owned substantial work across the React interface, Python backend, data persistence, and integrations. Turned complex requirements into guided interactions and contributed reusable components across the application." },
    { heading: "Engineering decisions", body: "Focused on clear user feedback, understandable next steps, and dependable behavior. Balanced frontend usability with backend quality, testing, and maintainability." },
    { heading: "The result", body: "Shipped guided workflows to production and established reusable foundations for future development. The contribution combined full-stack implementation with practical applied AI." },
  ] },
  { icon: "commerce", category: "APPLIED AI × FULL-STACK", year: "2025–2026", shortTitle: "Conversational commerce", title: "Making business transactions conversational.", summary: "Helped build a customer-facing conversational shopping experience, connecting natural-language interactions with useful application capabilities.", tags: ["Conversational AI", "API integration", "Authentication", "Evaluation"], role: "Co-architected the experience and implemented integrations", outcome: "Customer-facing experience shipped to production", details: [
    { heading: "The problem", body: "Shopping and account workflows often require several screens and manual handoffs. A conversational alternative needed to support useful actions while respecting account boundaries and business rules." },
    { heading: "My contribution", body: "Co-architected the customer-facing experience and implemented application integrations. Worked across conversational behavior, frontend interactions, and production delivery to make the experience more useful and consistent." },
    { heading: "Engineering decisions", body: "Prioritized clear intent, predictable interactions, and evaluation of important user journeys. Used testing and performance evaluation to guide implementation improvements." },
    { heading: "The result", body: "Contributed to a conversational shopping experience delivered to production. Combined applied AI with practical full-stack engineering to support customer tasks." },
  ] },
  { icon: "analytics", category: "FRONTEND × DATA INTEGRITY", year: "2025", shortTitle: "Reliable engagement analytics", title: "Reliable engagement analytics", summary: "Prevented duplicate impression events in React, consolidated page-template tracking, and refactored the tracking interface so product teams could rely on cleaner engagement data.", tags: ["React hooks", "Event deduplication", "API refactoring", "Analytics"], role: "Implemented event deduplication, tracking consolidation, and API refactoring", outcome: "More accurate engagement reporting and less redundant tracking code", details: [
    { heading: "The problem", body: "Component renders and meaningful user interactions are different signals. Tracking needed to reflect intended impressions without counting repeated renders, while page-template data needed a consistent collection path." },
    { heading: "My contribution", body: "Added a React ref-based guard against duplicate impression events. Consolidated page-template tracking, removed redundant logic, and expanded the data available for comparing engagement across page layouts." },
    { heading: "Engineering decisions", body: "Controlled analytics side effects across React re-renders. Refactored an analytics function to accept a named object instead of positional arguments, making calls clearer and the interface easier to extend." },
    { heading: "The result", body: "Eliminated duplicate impression records from the affected interaction and reduced reporting noise. Product and business teams gained cleaner engagement data and more consistent page-template comparisons, while the tracking code became easier to maintain." },
  ] },
  { icon: "tools", category: "DEVELOPER EXPERIENCE", year: "2025", shortTitle: "Tools that help teams", title: "Making the invisible parts of a system visible.", summary: "Built a browser extension to help teams inspect page components and validate changes, making everyday investigation more approachable.", tags: ["Chrome extension", "APIs", "Persistent state", "Documentation"], role: "Designed and developed the browser extension", outcome: "Improved tooling for engineering and QA collaboration", details: [
    { heading: "The problem", body: "Investigating complex page components required manual coordination. Teams needed clearer context when inspecting and validating changes." },
    { heading: "My contribution", body: "Designed and developed a Chrome extension with component highlighting and persistent view preferences. Built an interface that brings useful page context into the team's existing workflow." },
    { heading: "Beyond the interface", body: "Contributed to application maintenance and created development documentation to make onboarding and independent troubleshooting easier." },
    { heading: "The result", body: "Helped engineering, QA, and product teams inspect complex page structures with more shared context. Combined useful tooling with clearer documentation and maintenance practices." },
  ] },
];
export const principles = [
  { title: "Simplify the experience", description: "Understand the workflow first. Let the software carry the complexity so people can focus on their task.", example: "Multi-step business operations, one guided experience." },
  { title: "Design for reality", description: "Permissions, partial failures, and recovery belong in the design from the start.", example: "Approval controls and recoverable execution." },
  { title: "Keep people in control", description: "AI should make useful recommendations, explain uncertainty, and confirm consequential actions.", example: "Human review, clear intent, predictable actions." },
  { title: "Validate with evidence", description: "Measure behavior, test the important paths, and use real feedback to guide the next decision.", example: "Performance evaluation and production experimentation." },
];
export const toolGroups = [
  { id: "frontend", title: "Frontend & Mobile", description: "Customer interfaces, state management and native-to-web integration.", tools: ["React", "TypeScript", "JavaScript", "HTML / CSS", "Redux", "Context API", "Firebase Cloud Messaging", "Capacitor"] },
  { id: "backend", title: "Backend & Languages", description: "Services, API integration and application logic.", tools: ["Python", "FastAPI", "SQLAlchemy", "Node.js", "Express.js", "Java", "C++", "REST APIs"] },
  { id: "data", title: "Data & Messaging", description: "Persistence, caching, event streams and search.", tools: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Elasticsearch"] },
  { id: "ai", title: "Applied AI", description: "ML model serving, conversational workflows and recommendations.", tools: ["LangGraph", "LLM agents", "TF-IDF", "DistilBERT"] },
  { id: "identity", title: "Identity & Integrations", description: "Single sign-on, authentication and directory integration.", tools: ["Azure AD", "MSAL", "Microsoft Graph"] },
  { id: "cloud", title: "Cloud & Deployment", description: "Cloud hosting, containers, reverse proxies and CI/CD.", tools: ["Google Cloud Platform (GCP)", "AWS", "Docker", "nginx", "Jenkins"] },
  { id: "quality", title: "Testing & Quality", description: "Unit, integration, end-to-end and performance testing; security scanning.", tools: ["Jest", "JUnit", "Cypress", "k6", "Unit & integration testing", "Performance testing", "Snyk"] },
  { id: "tools", title: "Developer Tools", description: "Version control, API tooling and development environments.", tools: ["Git", "GitHub", "Postman", "Chrome extensions", "VS Code", "IntelliJ", "Xcode"] },
] as const;

export const education = [
  { degree: "Master of Business Administration (MBA)", concentration: "Concentration in Data Analytics", school: "Louisiana State University Shreveport", dates: "July 2026 — Present" },
  { degree: "B.S. Computer Science", concentration: "", school: "Macaulay Honors College, CUNY", dates: "May 2024 · GPA 3.90" },
];
