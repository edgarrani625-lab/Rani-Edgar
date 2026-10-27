import { SampleJd } from '../types/fairhire';

export const SAMPLE_JDS: SampleJd[] = [
  {
    id: 'normal-jd',
    title: 'Senior Full-Stack Engineer',
    tag: 'Balanced & Competency-Based',
    badgeType: 'normal',
    seniority: 'Senior',
    description: 'A well-structured JD emphasizing verifiable technical skills, cross-functional collaboration, and measurable outcomes without exclusionary tropes.',
    content: `Role: Senior Full-Stack Engineer
Department: Product Engineering
Reports to: Engineering Manager
Location: Remote (US-aligned hours)

About the Role:
We are seeking a Senior Full-Stack Engineer to architect, build, and maintain high-throughput web applications powering our customer workflow platform. You will collaborate closely with product managers, UX designers, and platform engineers to deliver resilient customer-facing features.

Core Responsibilities:
- Design, build, and deploy production-grade full-stack features using TypeScript, React, and Node.js microservices.
- Lead architectural decisions for API design, database schemas (PostgreSQL), and asynchronous queue processing.
- Maintain test suites (unit, integration, end-to-end) with continuous integration and automated deployment pipelines.
- Conduct thorough, constructive code reviews and mentor mid-level software engineers.
- Participate in on-call incident rotation with defined runbooks and blameless post-mortems.

Required Competencies & Qualifications:
- 5+ years of software engineering experience developing and operating distributed web applications.
- Demonstrated proficiency with TypeScript or modern JavaScript, React, and backend services (Node.js/Express or similar).
- Practical experience with relational database design, query optimization, and transaction boundaries.
- Proven track record of decomposing ambiguous business requirements into testable technical specifications.
- Commitment to accessible UI engineering (WCAG AA standards) and test automation.

Working at Our Company:
We offer flexible core hours (10am–3pm EST), comprehensive healthcare coverage, 401(k) matching, and structured professional development stipends. We welcome applicants of all backgrounds and provide accommodations upon request.`,
  },
  {
    id: 'biased-jd',
    title: 'Growth Product Lead / Ninja Rockstar',
    tag: 'High Bias & Exclusionary Tropes',
    badgeType: 'biased',
    seniority: 'Senior',
    description: 'Contains frequent subtle and overt bias red flags: ageism ("digital native"), gendered aggression ("rockstar hunter"), vague culture fit, ableist physical requirements, and pedigree bias.',
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
  {
    id: 'technical-jd',
    title: 'Lead Distributed Systems Architect',
    tag: 'Deep Technical & Scalability',
    badgeType: 'technical',
    seniority: 'Staff / Principal',
    description: 'Technical specification focusing on distributed consensus, high availability, fault tolerance, and cross-team system governance.',
    content: `Title: Lead Distributed Systems Architect
Organization: Core Infrastructure & Cloud Reliability
Level: Staff / Principal Architect
Location: Hybrid or Remote

Position Overview:
We are looking for a Lead Distributed Systems Architect to direct the evolution of our global event-streaming and high-availability data infrastructure. This individual will set technical standards for low-latency messaging, partition-tolerant storage systems, and multi-region disaster recovery.

Key Responsibilities:
- Formulate 3-year technical roadmaps for multi-region active-active cloud infrastructure handling over 500,000 events/second.
- Evaluate and benchmark consensus protocols (Raft, Paxos), distributed caches, and log-structured storage engines.
- Establish architectural review boards (ARBs) and publish Architecture Decision Records (ADRs) across 12 distributed squads.
- Diagnose and resolve complex P0/P1 production anomalies involving network partitions, memory leaks, and cascading failures.
- Mentor principal and senior staff engineers on capacity planning, chaos engineering, and observable telemetry.

Competencies Evaluated:
- Deep theoretical and applied understanding of distributed system invariants, CAP/PACELC theorems, and vector clocks.
- Proven experience engineering systems with 99.999% availability SLAs in regulated financial or mission-critical environments.
- Exceptional written documentation skills capable of aligning engineering leaders and non-technical executive stakeholders.
- Pragmatic approach to balancing technical debt reduction with product delivery velocity.`,
  },
];

export const SAMPLE_OUTCOME_CSV = `group,interviewed,selected
Male,120,48
Female,90,18
Non-Binary,15,2
Undisclosed,20,5`;
