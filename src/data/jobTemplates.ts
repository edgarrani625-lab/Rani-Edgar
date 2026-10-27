import { SeniorityLevel } from '../types/fairhire';

export interface JobTemplate {
  id: string;
  title: string;
  seniority: SeniorityLevel;
  roleCategory: string;
  accentColor: string; // 'indigo' | 'violet' | 'teal' | 'orange' | 'sky' | 'pink' | 'emerald' | 'rose' | 'red'
  iconName: string;
  tagline: string;
  content: string;
  isSpecial?: boolean;
  isCustom?: boolean;
}

export interface InterviewStyleOption {
  id: string;
  title: string;
  duration: string;
  questionCount: number;
  description: string;
  instructionPrompt: string;
  iconName: string;
}

export const INTERVIEW_STYLES: InterviewStyleOption[] = [
  {
    id: 'standard-kit',
    title: 'Standard Kit',
    duration: '45–60 min',
    questionCount: 8,
    description: 'Balanced distribution across technical competencies, execution, and collaborative values.',
    instructionPrompt: 'Style: Standard structured panel (45-60 min). Balance core technical competencies, problem-solving, and cross-functional communication.',
    iconName: 'Layers',
  },
  {
    id: 'quick-screen',
    title: 'Quick Screen',
    duration: '30 min',
    questionCount: 6,
    description: 'Rapid competency verification and initial qualification checks for first-round screens.',
    instructionPrompt: 'Style: Quick 30-minute screening interview. Focus on essential minimum qualification thresholds and core operational capability.',
    iconName: 'Clock',
  },
  {
    id: 'technical-deepdive',
    title: 'Technical Deep-Dive',
    duration: '60 min',
    questionCount: 8,
    description: 'High-rigor focus on architecture, system trade-offs, scalability, and code hygiene.',
    instructionPrompt: 'Style: Technical Deep-Dive. Prioritize distributed architecture, failure recovery, data models, and hands-on technical problem decomposition.',
    iconName: 'Cpu',
  },
  {
    id: 'behavioral-focus',
    title: 'Behavioral Focus (STAR)',
    duration: '45 min',
    questionCount: 6,
    description: 'In-depth evaluation of past behavior, conflict resolution, resilience, and psychological safety.',
    instructionPrompt: 'Style: Behavioral Focus. Emphasize STAR-framework inquiries evaluating empathy, blameless post-mortems, ethics, and team trust.',
    iconName: 'UserCheck',
  },
  {
    id: 'panel-interview',
    title: 'Panel Interview',
    duration: '60–75 min',
    questionCount: 10,
    description: 'Multi-interviewer rotation with independent scoring dimensions for each panelist.',
    instructionPrompt: 'Style: Comprehensive Panel Interview with distinct questions calibrated for cross-functional evaluators (hiring manager, peer engineer, cross-functional partner).',
    iconName: 'Users',
  },
];

export const PRESET_JOB_TEMPLATES: JobTemplate[] = [
  {
    id: 'tmpl-backend-dev',
    title: 'Backend Developer',
    seniority: 'Mid-Level',
    roleCategory: 'Engineering',
    accentColor: 'indigo',
    iconName: 'Server',
    tagline: 'High-throughput microservices, API architecture, and SQL transactions.',
    content: `Role: Backend Developer (Mid-Level)
Department: Platform Engineering
Reports to: Engineering Manager
Location: Remote or Hybrid

About the Role:
We are seeking a Mid-Level Backend Developer to engineer scalable APIs and resilient background workers powering our financial messaging platform. You will collaborate with product designers, frontend engineers, and DevOps to deliver reliable, test-driven microservices.

Key Responsibilities:
- Design, implement, and maintain RESTful and gRPC APIs using Node.js / TypeScript and PostgreSQL.
- Build resilient message consumers utilizing Kafka or RabbitMQ with exponential backoff and dead-letter queues.
- Write thorough unit and integration tests (Jest, Supertest) ensuring high test coverage and regression protection.
- Participate in constructive peer code reviews and contribute to architecture documentation (ADRs).
- Monitor production services using Prometheus and Grafana; participate in scheduled on-call rotations.

Required Competencies:
- 3+ years of professional backend development experience in production web services.
- Solid understanding of relational database indexing, transaction isolation levels, and query optimization.
- Experience decomposing business logic into clean domain layers with testable boundaries.
- Clear written communication and commitment to empathetic team collaboration.`,
  },
  {
    id: 'tmpl-frontend-dev',
    title: 'Frontend Developer',
    seniority: 'Entry-Level',
    roleCategory: 'Engineering',
    accentColor: 'violet',
    iconName: 'Layout',
    tagline: 'Accessible React UI, state management, and modern component systems.',
    content: `Role: Frontend Developer (Junior / Early Career)
Department: Client Experience Team
Location: Hybrid

About the Role:
Join our design systems and web application team as a Frontend Developer. You will turn design prototypes into semantic, accessible, and responsive user interfaces used by hundreds of thousands of daily active users.

Responsibilities:
- Build modular, accessible web components in React and TypeScript following WCAG 2.1 AA standards.
- Integrate REST and GraphQL endpoints with optimistic UI updates and robust error boundaries.
- Write unit tests using React Testing Library and component tests in Storybook.
- Partner with product designers in Figma to refine interaction details, animations, and micro-copy.
- Optimize client-side bundle sizes and Core Web Vitals (LCP, INP, CLS).

Required Qualifications:
- 1–2 years of hands-on experience or equivalent portfolio building modern React web applications.
- Working knowledge of semantic HTML, responsive CSS (Tailwind/modern CSS), and modern JavaScript.
- Understanding of web accessibility fundamentals (ARIA labels, keyboard navigation, contrast ratios).
- Eagerness to learn, ask thoughtful questions, and receive constructive code feedback.`,
  },
  {
    id: 'tmpl-data-analyst',
    title: 'Data Analyst',
    seniority: 'Mid-Level',
    roleCategory: 'Data & Analytics',
    accentColor: 'teal',
    iconName: 'BarChart2',
    tagline: 'SQL querying, BI dashboard engineering, and business metric storytelling.',
    content: `Job Title: Data Analyst
Department: Business Intelligence & Operations
Reports to: Head of Analytics
Location: Remote

Position Summary:
We are looking for a Data Analyst to translate raw behavioral telemetry and financial records into actionable executive insights. You will own KPI definitions, build self-serve dashboards, and conduct cohort retention analyses.

Key Responsibilities:
- Author performant, complex SQL queries across BigQuery/Snowflake data warehouses to extract business metrics.
- Design interactive, intuitive Tableau/Looker dashboards used by product managers and executive stakeholders.
- Partner with marketing and finance leaders to analyze customer acquisition cost (CAC), LTV, and churn funnels.
- Validate data pipeline integrity alongside analytics engineers; document data dictionaries and metric definitions.
- Present quarterly findings to cross-functional leadership in clear, jargon-free business narratives.

Qualifications:
- 3+ years in analytics, business intelligence, or quantitative research.
- Advanced SQL proficiency (window functions, CTEs, query plan profiling) and experience with BI visualization tools.
- Demonstrated ability to question assumptions, identify data anomalies, and explain statistical nuances to non-technical partners.`,
  },
  {
    id: 'tmpl-sales-exec',
    title: 'Sales Executive',
    seniority: 'Senior',
    roleCategory: 'Go-To-Market',
    accentColor: 'orange',
    iconName: 'Briefcase',
    tagline: 'Enterprise B2B discovery, consultative closing, and pipeline stewardship.',
    content: `Job Title: Senior Enterprise Sales Executive
Division: Global Enterprise Solutions
Compensation: Base + Uncapped Commission

Overview:
We are seeking a consultative, client-focused Senior Sales Executive to lead our expansion into mid-market and enterprise enterprise software accounts. You will manage the complete lifecycle from consultative discovery through multi-stakeholder contract negotiation.

Responsibilities:
- Conduct rigorous discovery calls to uncover customer operational pain points and map software solutions to executive ROI.
- Lead tailored product demonstrations in partnership with sales engineering specialists.
- Navigate procurement, information security, and legal review cycles with enterprise buying committees.
- Maintain transparent pipeline forecasts in Salesforce; maintain disciplined follow-up cadences.
- Act as the voice of the customer by sharing structured feedback with product management.

Required Capabilities:
- 5+ years of quota-carrying B2B SaaS sales experience with average contract values exceeding $50k.
- Proven track record of consistent quota attainment through disciplined discovery rather than high-pressure tactics.
- Outstanding active listening and relationship-building capabilities.`,
  },
  {
    id: 'tmpl-customer-support',
    title: 'Customer Support Specialist',
    seniority: 'Entry-Level',
    roleCategory: 'Operations',
    accentColor: 'sky',
    iconName: 'Headphones',
    tagline: 'Empathetic issue de-escalation, omnichannel troubleshooting, and customer advocacy.',
    content: `Position: Customer Support Specialist
Department: Customer Experience
Schedule: Full-time (Rotational shift availability)

Role Overview:
Our Customer Support Specialists are the frontline ambassadors of our brand. You will provide rapid, empathetic, and accurate technical assistance to users facing account, billing, or workflow hurdles across chat, email, and scheduled video sessions.

Core Tasks:
- Resolve tier-1 and tier-2 customer support tickets within established first-response and resolution SLAs.
- Troubleshoot browser compatibility, permission errors, and integration sync issues with step-by-step guidance.
- Author clear, accessible help center articles and internal runbooks for frequent troubleshooting scenarios.
- De-escalate frustrated users with patience, empathy, and active listening.
- Log reproducible software defects in Jira with thorough replication steps for our engineering squads.

Competencies:
- 1–3 years in customer support, client relations, or technical helpdesk environments.
- Exceptional written English communication with an empathetic, clear, and reassuring tone.
- Natural problem-solving persistence and attention to operational details.`,
  },
  {
    id: 'tmpl-product-manager',
    title: 'Product Manager',
    seniority: 'Senior',
    roleCategory: 'Product',
    accentColor: 'pink',
    iconName: 'Compass',
    tagline: 'Strategic roadmapping, customer discovery, and cross-functional alignment.',
    content: `Role: Senior Product Manager
Organization: Core Platform & Workflows
Reports to: VP of Product

About the Opportunity:
We are hiring a Senior Product Manager to own the vision, discovery, and execution of our core workflow automation platform. You will balance customer feedback, quantitative analytics, and technical feasibility to deliver high-retention features.

Key Responsibilities:
- Define product strategy and measurable outcome objectives (OKRs) for a cross-functional squad of 8 engineers and designers.
- Lead continuous customer discovery interviews and synthesize customer pain points into crisp PRDs and user stories.
- Prioritize the product backlog using objective value-vs-effort frameworks; make difficult trade-offs transparently.
- Partner with product marketing and customer success for launch readiness and go-to-market enablement.
- Track post-launch adoption, engagement funnels, and customer satisfaction metrics to iterate rapidly.

Required Qualifications:
- 5+ years of product management experience in B2B SaaS or workflow platforms.
- Deep comfort with data-driven decision making (A/B testing, user journey analytics).
- Outstanding cross-functional leadership, facilitation, and executive storytelling skills.`,
  },
  {
    id: 'tmpl-hr-coordinator',
    title: 'HR Coordinator',
    seniority: 'Entry-Level',
    roleCategory: 'People & Culture',
    accentColor: 'emerald',
    iconName: 'HeartHandshake',
    tagline: 'Structured onboarding, HRIS data stewardship, and inclusive culture initiatives.',
    content: `Title: HR & People Operations Coordinator
Department: People Experience
Location: Hybrid

Position Overview:
We are looking for an organized, compassionate HR Coordinator to maintain our people systems and support our growing team. You will administer new hire onboarding, coordinate benefits enrollments, and support equitable workplace programs.

Responsibilities:
- Coordinate the end-to-end new hire onboarding process, ensuring every employee feels welcomed and equipped on day one.
- Maintain employee records, compensation changes, and compliance documentation within our HRIS (BambooHR/Workday).
- Assist employees with inquiries regarding benefits, leave policies, and workplace accommodations with discretion.
- Coordinate compliance reporting and support internal diversity, equity, and inclusion learning sessions.
- Facilitate employee departure workflows with respect, dignity, and structured exit interview collection.

Requirements:
- 1–2 years of experience in HR, recruiting coordination, or office administration.
- Unwavering integrity regarding confidentiality and personal employee data.
- Detail-oriented organizational skills and warm, inclusive interpersonal communication.`,
  },
  {
    id: 'tmpl-registered-nurse',
    title: 'Registered Nurse',
    seniority: 'Mid-Level',
    roleCategory: 'Healthcare',
    accentColor: 'rose',
    iconName: 'Activity',
    tagline: 'Evidence-based patient care, triage protocols, and multidisciplinary advocacy.',
    content: `Position: Registered Nurse (Staff RN - Medical / Surgical)
Facility: Regional Health Care Center
Shift: 12-Hour Rotational Shifts

Job Summary:
Provide direct, compassionate, evidence-based nursing care to adult medical-surgical patients. Collaborate with attending physicians, clinical specialists, pharmacists, and patient families to ensure safe clinical outcomes and dignified care.

Key Responsibilities:
- Conduct comprehensive head-to-toe patient assessments and document findings in Epic EHR systems.
- Administer medications, intravenous therapies, and specialized wound care in accordance with physician orders.
- Monitor patient vital signs, detect clinical deteriorations rapidly, and initiate emergency protocols as needed.
- Educate patients and caregivers on disease management, post-discharge instructions, and medication regimens.
- Champion patient safety standards (fall prevention, infection control, medication barcode scanning).

Licensure & Qualifications:
- Active, unencumbered State Registered Nurse (RN) license.
- BLS/ACLS certification from the American Heart Association.
- Minimum 2 years of acute care hospital experience.
- Strong clinical decision-making, calm prioritization under pressure, and empathetic bedside manner.`,
  },
  {
    id: 'tmpl-biased-demo',
    title: 'Biased JD Demo',
    seniority: 'Senior',
    roleCategory: 'Auditor Test Case',
    accentColor: 'red',
    iconName: 'AlertOctagon',
    tagline: 'Deliberately contains overt & subtle red flags to test the automated bias auditor.',
    isSpecial: true,
    content: `Job Title: Growth Product Lead - Rockstar Ninja Wanted!
Team: Fast-Paced Core Growth Squad
Compensation: Equity-heavy package

Who We Are:
We are a disruptive, hard-charging venture-backed startup in rapid hypergrowth mode. We live by a work-hard, play-hard ethos and believe in moving fast and breaking things.

What We're Looking For:
We need an aggressive, relentless growth rockstar and digital native who breathes social media algorithms and growth hacks. If you are a hungry hunter with a competitive killer instinct who loves winning at all costs, this is for you.

Key Requirements:
- Young, energetic go-getter who can sprint in a 24/7 hustle environment with 70+ hour work weeks and weekend sprints.
- Native English speaker with flawless unaccented communication skills.
- Must have graduated with a degree from a top-tier Ivy League or equivalent university.
- Absolute culture fit who thrives in a fraternal environment, enjoys Friday beers, hackathon sleepovers, and ping pong tournaments.
- Ability to stand for long periods and occasionally lift 40 lbs of trade-show equipment.
- Digital native who grew up with modern mobile apps and doesn't need to be trained on tech.

What You'll Do:
- Crush quarterly acquisition quotas through aggressive outreach funnels.
- Ruthlessly prioritize conversion funnels and eliminate low-performing features.
- Dominate cross-functional alignment meetings and enforce accountability.`,
  },
];
