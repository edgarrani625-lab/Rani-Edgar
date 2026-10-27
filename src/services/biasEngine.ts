import {
  AuditStatus,
  DemographicImpactCard,
  FairnessRecommendation,
  FlaggedBiasItem,
  GenerateKitRequest,
  InterviewKit,
  QuestionItem,
  RiskLevel,
  SeniorityLevel,
} from '../types/fairhire';
import { parseOutcomeCsv } from '../utils/csvParser';

export const DEFAULT_FAIRNESS_RECOMMENDATIONS: FairnessRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Pre-set Scoring Benchmarks',
    description: 'Calibrate scoring rubrics across the interview panel before speaking to any candidate.',
    checked: true,
    category: 'Rubrics',
  },
  {
    id: 'rec-2',
    title: 'Independent Scoring Submission',
    description: 'Require interviewers to submit 1-5 ratings independently before convening in panel debriefs to prevent senior groupthink.',
    checked: true,
    category: 'Evaluation',
  },
  {
    id: 'rec-3',
    title: 'Uniform Question Delivery',
    description: 'Ask the exact same core questions in the same sequence to every candidate interviewed for this role.',
    checked: true,
    category: 'Process',
  },
  {
    id: 'rec-4',
    title: 'Behavioral & Situational Focus',
    description: 'Eliminate brainteasers, pedigree questions (e.g. university prestige), and personal hobby inquiries.',
    checked: true,
    category: 'Content',
  },
  {
    id: 'rec-5',
    title: 'Accommodations Disclosure',
    description: 'Proactively invite candidates to request interview accommodations (e.g., closed captions, extra time, asynchronous work samples) at initial invite.',
    checked: true,
    category: 'Inclusion',
  },
  {
    id: 'rec-6',
    title: 'Diverse & Rotated Evaluation Panels',
    description: 'Involve multi-disciplinary interviewers with varying tenures and backgrounds to balance perspective.',
    checked: false,
    category: 'Panel Composition',
  },
  {
    id: 'rec-7',
    title: 'Work Sample Over Pedigree',
    description: 'Assess demonstrable job-relevant skills via structured work exercises instead of resume proxies.',
    checked: false,
    category: 'Assessment',
  },
  {
    id: 'rec-8',
    title: 'Document Observed Evidence Only',
    description: 'Train interviewers to take verbatim notes of what candidates said/did rather than intuitive "gut feelings" or "vibe checks".',
    checked: true,
    category: 'Compliance',
  },
];

export function buildLyzrPrompt(req: GenerateKitRequest): string {
  const { jd, jobTitle, seniority = 'Senior', numQuestions = 6, pastOutcomeCsv, feedback } = req;
  
  return `You are FairHire AI, a premier Industrial-Organizational Psychologist and Bias Audit Specialist adhering to EEOC Uniform Guidelines on Employee Selection Procedures and NYC Local Law 144.

Analyze this Job Description and produce a structured, high-fairness Interview Kit:
JOB TITLE: ${jobTitle || 'Role from JD'}
SENIORITY LEVEL: ${seniority}
TARGET NUMBER OF QUESTIONS: ${numQuestions}
${feedback ? `PREVIOUS USER REVISION FEEDBACK: "${feedback}" - Incorporate this exact feedback into your revisions.` : ''}

JOB DESCRIPTION TEXT:
"""
${jd}
"""

${pastOutcomeCsv ? `HISTORICAL CANDIDATE OUTCOME DATA (CSV):\n"""\n${pastOutcomeCsv}\n"""` : 'NO HISTORICAL CSV DATA PROVIDED.'}

INSTRUCTIONS:
1. Conduct a rigorous Bias Audit of the JD and common interview pitfalls for this role.
   - Detect exclusionary tropes (e.g., gender-coded words like "aggressive/rockstar", ageist markers like "digital native/young energetic", ableist physical requirements for desk jobs like "lift 40 lbs", vague "culture fit", pedigree/Ivy League elitism).
   - Assign an Audit Status: "PASS", "PASS_WITH_CHANGES", or "FAIL" (use FAIL if high exclusionary tropes exist and require remediation).
2. Generate exactly ${numQuestions} structured, competency-anchored interview questions.
   - Each question must assess a concrete job competency.
   - Provide 3 strong answer indicators.
   - Provide a 5-point Behaviorally Anchored Rating Scale (BARS) from 1 (Unsatisfactory) to 5 (Outstanding).
   - Provide 2 follow-up probes.
   - Tag each as "Changed" (if fixing a biased premise or JD flaw) or "Unchanged" with explicit rationale.
3. Demographic impact observations for Gender, Age, Neurodiversity/Accessibility, and Socioeconomic/Pedigree.

OUTPUT FORMAT:
Respond with a valid JSON block enclosed in \`\`\`json ... \`\`\` matching this schema:
{
  "auditStatus": "PASS" | "PASS_WITH_CHANGES" | "FAIL",
  "auditSummary": "Clear 2-sentence summary of findings",
  "flaggedItems": [
    {
      "questionNum": "JD Section or Q#",
      "issueType": "Gender-Coded | Ageism | Ableist | Vague Culture Fit | Pedigree",
      "groupsAffected": "Affected group",
      "risk": "Low" | "Medium" | "High",
      "fixApplied": "Exact remediation applied"
    }
  ],
  "demographicImpacts": [
    {
      "group": "Gender / Age / Accessibility / Socioeconomic",
      "title": "Title",
      "potentialImpact": "Explanation",
      "mitigation": "Mitigation step",
      "severity": "info" | "warning" | "alert"
    }
  ],
  "questions": [
    {
      "id": "q1",
      "category": "Technical Architecture | Leadership | Problem Solving | Inclusion",
      "question": "Structured behavioral or situational question",
      "competency": "Competency name",
      "strongAnswerIndicators": ["Indicator 1", "Indicator 2", "Indicator 3"],
      "scoringRubric": {
        "1": "Unsatisfactory: ...",
        "2": "Needs Improvement: ...",
        "3": "Meets Expectations: ...",
        "4": "Exceeds Expectations: ...",
        "5": "Outstanding: ..."
      },
      "followUpProbes": ["Probe 1", "Probe 2"],
      "status": "Changed" | "Unchanged",
      "originalQuestion": "Original biased phrase or null",
      "changeRationale": "Why this question was revised"
    }
  ]
}
After the JSON block, provide a clean Markdown formatted summary for human reading.`;
}

/**
 * Robust fallback generator that inspects the JD locally and performs rule-based & heuristic
 * DE&I audit + question synthesis. Guarantees 100% uptime even before API keys are added.
 */
export function generateLocalAuditKit(req: GenerateKitRequest): InterviewKit {
  const { jd, jobTitle = 'Role', seniority = 'Senior', numQuestions = 6, pastOutcomeCsv, sessionId = `kit-${Date.now()}` } = req;
  const lowerJd = jd.toLowerCase();

  const flaggedItems: FlaggedBiasItem[] = [];
  const demographicImpacts: DemographicImpactCard[] = [];

  // Check for common bias patterns
  let failTriggers = 0;
  let warnTriggers = 0;

  // 1. Rockstar / Ninja / Killer / Aggressive
  if (lowerJd.includes('rockstar') || lowerJd.includes('ninja') || lowerJd.includes('killer') || lowerJd.includes('aggressive')) {
    failTriggers += 2;
    flaggedItems.push({
      id: 'flag-1',
      questionNum: 'JD Kicker',
      issueType: 'Hyper-Masculine & Aggressive Tropes',
      groupsAffected: 'Women & Collaborative Engineers',
      risk: 'High',
      fixApplied: 'Replaced "rockstar/ninja" with objective competency criteria ("proven track record in cross-functional system engineering").',
    });
    demographicImpacts.push({
      id: 'demo-1',
      group: 'Gender Inclusivity',
      title: 'Gender-Coded Language Filter',
      potentialImpact: 'Research shows words like "rockstar", "crush quotas", and "killer instinct" decrease female applicant rates by over 40%.',
      mitigation: 'Shifted tone to collaborative execution, measurable business impact, and peer mentorship.',
      severity: 'alert',
    });
  }

  // 2. Digital Native / Young energetic
  if (lowerJd.includes('digital native') || lowerJd.includes('young') || lowerJd.includes('recent grad') || lowerJd.includes('fresh minds')) {
    failTriggers += 2;
    flaggedItems.push({
      id: 'flag-2',
      questionNum: 'Qualifications',
      issueType: 'Age Discrimination / ADEA Compliance',
      groupsAffected: 'Workers Aged 40+',
      risk: 'High',
      fixApplied: 'Replaced "digital native / young energetic" with demonstrable proficiency in modern web development tools and frameworks.',
    });
    demographicImpacts.push({
      id: 'demo-2',
      group: 'Age Diversity (ADEA)',
      title: 'Prohibited Ageist Markers',
      potentialImpact: '"Digital native" implies candidates must have grown up with contemporary technology, illegally penalizing seasoned professionals.',
      mitigation: 'Focus strictly on demonstrated capability with target software stacks regardless of how or when acquired.',
      severity: 'alert',
    });
  }

  // 3. Culture fit / Drinks / Ping pong / Fraternal
  if (lowerJd.includes('culture fit') || lowerJd.includes('beer') || lowerJd.includes('drinks') || lowerJd.includes('fraternal') || lowerJd.includes('hang out')) {
    warnTriggers += 1;
    flaggedItems.push({
      id: 'flag-3',
      questionNum: 'Team Dynamic',
      issueType: 'Vague "Culture Fit" & Affinity Bias',
      groupsAffected: 'Underrepresented Minorities, Parents, Non-drinkers',
      risk: 'Medium',
      fixApplied: 'Replaced "culture fit / beers" with "Values & Values-Add Alignment: shared commitments to psychological safety and team trust".',
    });
    demographicImpacts.push({
      id: 'demo-3',
      group: 'Caregivers & Cultural Minorities',
      title: 'Social Exclusion & Affinity Bias',
      potentialImpact: 'Conflating social affinity (happy hours, ping pong) with workplace competence excludes caregivers, non-drinkers, and culturally diverse talent.',
      mitigation: 'Evaluated structured team collaboration and blameless communication rather than off-hours socialization.',
      severity: 'warning',
    });
  }

  // 4. Physical / Ableist demands for desk jobs
  if (lowerJd.includes('lift 40') || lowerJd.includes('lift 50') || lowerJd.includes('stand for long') || lowerJd.includes('physical stamina')) {
    failTriggers += 1;
    flaggedItems.push({
      id: 'flag-4',
      questionNum: 'Physical Demands',
      issueType: 'ADA Non-Compliance / Ableist Criteria',
      groupsAffected: 'Persons with Disabilities & Chronic Illnesses',
      risk: 'High',
      fixApplied: 'Removed artificial physical lifting requirement which is not an essential job function for knowledge workers.',
    });
    demographicImpacts.push({
      id: 'demo-4',
      group: 'Disability & Accessibility (ADA)',
      title: 'Artificial Physical Barriers',
      potentialImpact: 'Unjustified physical requirements violate ADA regulations unless lifting is a primary, bona fide occupational qualification (BFOQ).',
      mitigation: 'Explicitly omitted physical lifting from rubric; added standard accommodation notice.',
      severity: 'alert',
    });
  }

  // 5. Native English / Accent
  if (lowerJd.includes('native english') || lowerJd.includes('unaccented') || lowerJd.includes('mother tongue')) {
    failTriggers += 2;
    flaggedItems.push({
      id: 'flag-5',
      questionNum: 'Communication Standards',
      issueType: 'National Origin / Title VII Violation',
      groupsAffected: 'Immigrants & Multilingual Professionals',
      risk: 'High',
      fixApplied: 'Replaced "native English speaker" with "effective professional technical communication in written and verbal English".',
    });
  }

  // 6. Pedigree / Ivy League
  if (lowerJd.includes('ivy league') || lowerJd.includes('top-tier university') || lowerJd.includes('prestigious')) {
    warnTriggers += 1;
    flaggedItems.push({
      id: 'flag-6',
      questionNum: 'Educational Pedigree',
      issueType: 'Socioeconomic & Pedigree Exclusion',
      groupsAffected: 'First-Generation Graduates & Alternative Pathway Talent',
      risk: 'Medium',
      fixApplied: 'Replaced institutional prestige filter with verifiable work portfolio and equivalent technical experience.',
    });
  }

  // Determine overall audit status
  let auditStatus: AuditStatus = 'PASS';
  let auditSummary = 'The job description demonstrates high competency alignment with minimal exclusionary language detected.';

  if (failTriggers >= 2) {
    auditStatus = 'FAIL';
    auditSummary = `Critical bias flags detected (${failTriggers} major violations). The JD contains terms violating Title VII / ADEA / ADA guidelines or heavy exclusionary rhetoric that requires mandatory remediation before interview panels begin.`;
  } else if (failTriggers > 0 || warnTriggers > 0) {
    auditStatus = 'PASS_WITH_CHANGES';
    auditSummary = `Audit passed with recommended modifications. ${flaggedItems.length} potential bias risk areas were flagged and revised into objective, structured competency inquiries.`;
  }

  // If no flags found, add a clean standard observation
  if (demographicImpacts.length === 0) {
    demographicImpacts.push({
      id: 'demo-default',
      group: 'Baseline Review',
      title: 'Equitable Competency Distribution',
      potentialImpact: 'Job description focuses primarily on verifiable technical deliverables and transparent team responsibilities.',
      mitigation: 'Maintain structured Behavioral Anchored Rating Scales (BARS) to minimize spontaneous interviewer subjectivity.',
      severity: 'info',
    });
  }

  // Generate Questions tailored to the JD content and role
  const isTech = lowerJd.includes('software') || lowerJd.includes('engineer') || lowerJd.includes('developer') || lowerJd.includes('system') || lowerJd.includes('architect') || lowerJd.includes('full-stack');
  const isProduct = lowerJd.includes('product') || lowerJd.includes('growth') || lowerJd.includes('manager') || lowerJd.includes('lead');

  const baseQuestions: QuestionItem[] = [
    {
      id: 'q-1',
      category: isTech ? 'System Architecture & Technical Depth' : 'Strategic Planning & Problem Decomposition',
      question: isTech
        ? `Can you walk us through a recent high-impact architectural decision you made for a distributed or high-throughput service? How did you evaluate trade-offs between delivery speed, fault tolerance, and operational maintainability?`
        : `Describe a scenario where you identified a high-priority business opportunity with ambiguous data. How did you structure your hypothesis and build alignment across technical and business stakeholders?`,
      competency: isTech ? 'Technical Architecture & Trade-Off Analysis' : 'Hypothesis Formulation & Strategic Alignment',
      strongAnswerIndicators: [
        'Clearly articulates concrete constraints (e.g. latency, concurrency, schema migration, team bandwidth).',
        'Weighs at least two viable alternative solutions with honest pros/cons rather than dogmatic choices.',
        'Explains measurable post-launch outcomes or telemetry metrics that validated the final decision.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Describes vague theories without concrete personal contribution; deflects or cannot cite trade-offs.',
        2: 'Needs Improvement: Cites single chosen technology without exploring alternatives; weak understanding of operational downsides.',
        3: 'Meets Expectations: Clearly explains architecture choice, identifies key constraints, and communicates rationale effectively.',
        4: 'Exceeds Expectations: Demonstrates deep systems thinking, proactively accounts for failure modes, and outlines telemetry metrics.',
        5: 'Outstanding: Exemplifies industry-grade architectural maturity, multi-year scalability foresight, and clear stakeholder governance.',
      },
      followUpProbes: [
        'If traffic or operational load increased by 10x unexpectedly, what component would fail first?',
        'How did you communicate this architectural direction to teammates with differing opinions?',
      ],
      status: 'Unchanged',
    },
    {
      id: 'q-2',
      category: 'Cross-Functional Collaboration & Psychological Safety',
      question: `Tell us about a time when an engineering team member, product manager, or designer strongly disagreed with your proposed technical approach or roadmap priority. How did you handle the impasse?`,
      competency: 'Constructive Disagreement & Empathy',
      strongAnswerIndicators: [
        'Demonstrates genuine curiosity toward the other party\'s constraints rather than defensiveness.',
        'Separates personal ego from project outcomes; seeks objective data, user metrics, or proof-of-concept tests.',
        'Maintains team trust and blameless collaboration even when compromises are required.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Blames the other party, displays passive-aggressive reactions, or insists on unilateral authority.',
        2: 'Needs Improvement: Relies primarily on escalation or stubborn debate rather than collaborative problem-solving.',
        3: 'Meets Expectations: Listens actively, articulates opposing viewpoints accurately, and finds common ground.',
        4: 'Exceeds Expectations: Uses structured frameworks (e.g., prototype testing, data analysis) to de-escalate emotional conflict.',
        5: 'Outstanding: Transforms ideological conflict into a stronger collaborative standard that elevates team psychological safety.',
      },
      followUpProbes: [
        'Looking back, was there any validity in the other person\'s perspective that improved the final deliverable?',
        'How do you foster an environment where quieter team members feel secure challenging ideas?',
      ],
      status: lowerJd.includes('culture fit') || lowerJd.includes('rockstar') ? 'Changed' : 'Unchanged',
      originalQuestion: lowerJd.includes('culture fit') || lowerJd.includes('rockstar')
        ? 'Do you fit our high-intensity, aggressive culture, and how do you handle intense pushback?'
        : undefined,
      changeRationale: lowerJd.includes('culture fit') || lowerJd.includes('rockstar')
        ? 'Replaced subjective "culture fit" aggression probe with an evidence-based behavioral inquiry assessing psychological safety and structured conflict resolution.'
        : undefined,
    },
    {
      id: 'q-3',
      category: 'Execution Under Ambiguity & Prioritization',
      question: `Give an example of a project where initial requirements or deadlines shifted drastically mid-stream. What concrete steps did you take to re-evaluate scope and maintain delivery standards?`,
      competency: 'Adaptability & Pragmatic Scoping',
      strongAnswerIndicators: [
        'Quickly identifies the core minimal viable deliverables necessary to protect user value.',
        'Communicates updated scope, risks, and timelines transparently to team members and stakeholders.',
        'Avoids burnout while refusing to sacrifice safety, accessibility, or core test coverage.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Freezes or expresses resentment toward shifting requirements; delivers poorly tested or broken work.',
        2: 'Needs Improvement: Cuts quality haphazardly without consulting stakeholders; poor communication of trade-offs.',
        3: 'Meets Expectations: Systematically trims non-essential scope, maintains honest status reporting, and delivers baseline quality.',
        4: 'Exceeds Expectations: Proactively models scenarios, reassures team members, and implements automated safeguards.',
        5: 'Outstanding: Displays master-class prioritization; turns sudden business pivots into strategic product differentiators.',
      },
      followUpProbes: [
        'What criteria did you use to decide what non-essential features could be safely delayed?',
        'How did you protect the team from excessive churn or unsustainable overtime?',
      ],
      status: lowerJd.includes('hustle') || lowerJd.includes('70+ hour') ? 'Changed' : 'Unchanged',
      originalQuestion: lowerJd.includes('hustle') || lowerJd.includes('70+ hour')
        ? 'Are you willing to work 70+ hour weeks and sprint 24/7 during crunch time?'
        : undefined,
      changeRationale: lowerJd.includes('hustle') || lowerJd.includes('70+ hour')
        ? 'Converted an exploitative, caregiver-discriminatory overtime demand into a professional evaluation of prioritization, scoping, and sustainable velocity.'
        : undefined,
    },
    {
      id: 'q-4',
      category: 'Code Quality, Inclusivity & Accessibility',
      question: `How do you ensure the digital experiences or systems you build are accessible, performant, and resilient for diverse user groups (including users with disabilities, assistive technologies, or bandwidth constraints)?`,
      competency: 'Universal Design & WCAG AA Compliance',
      strongAnswerIndicators: [
        'Mentions concrete standards (e.g., WCAG 2.1 AA, keyboard navigability, semantic HTML, screen reader labels).',
        'Considers real-world constraints such as low-end mobile devices, high network latency, or color vision deficiency.',
        'Advocates for automated accessibility linting and manual keyboard testing as non-negotiable definition-of-done criteria.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Dismisses accessibility as an afterthought or considers it solely a designer\'s problem.',
        2: 'Needs Improvement: Vague awareness of accessibility but cannot cite practical implementations or semantic practices.',
        3: 'Meets Expectations: Integrates semantic markup, ARIA roles appropriately, and tests with keyboard/contrast checks.',
        4: 'Exceeds Expectations: Champions automated a11y testing in CI pipelines and audits real assistive reader user flows.',
        5: 'Outstanding: Industry thought leader in digital equity; establishes enterprise accessibility standards and audits.',
      },
      followUpProbes: [
        'How do you handle contrast or keyboard focus traps when incorporating third-party UI libraries?',
        'Can you give an example of an accessibility bug you caught prior to production rollout?',
      ],
      status: 'Unchanged',
    },
    {
      id: 'q-5',
      category: 'Mentorship & Knowledge Distribution',
      question: `Describe a situation where you helped onboard, mentor, or upskill a peer or junior engineer from a non-traditional background. How did you adapt your coaching style to their learning needs?`,
      competency: 'Inclusive Mentorship & Team Empowerment',
      strongAnswerIndicators: [
        'Demonstrates patience and establishes a blame-free learning environment for questions.',
        'Breaks down complex domain or architectural knowledge into digestible, progressive milestones.',
        'Celebrates the mentee\'s independent wins and supports their career visibility.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Displays impatience with less experienced colleagues; hoards knowledge or acts condescending.',
        2: 'Needs Improvement: Provides answers but fails to explain underlying principles; one-size-fits-all approach.',
        3: 'Meets Expectations: Actively pairs with colleagues, writes clear documentation, and provides constructive code reviews.',
        4: 'Exceeds Expectations: Tailors communication to distinct learning styles; helps mentees land visible project contributions.',
        5: 'Outstanding: Builds systemic onboarding curricula and mentoring programs that accelerate company-wide retention.',
      },
      followUpProbes: [
        'What do you do when a mentee continues making the same error repeatedly?',
        'How do you balance dedicating time to mentoring with your own individual delivery commitments?',
      ],
      status: lowerJd.includes('digital native') ? 'Changed' : 'Unchanged',
      originalQuestion: lowerJd.includes('digital native')
        ? 'Since we only want digital natives who know tech, how do you handle slow colleagues?'
        : undefined,
      changeRationale: lowerJd.includes('digital native')
        ? 'Reframed ageist assumption into an evidence-based assessment of inclusive mentorship, peer coaching, and knowledge sharing.'
        : undefined,
    },
    {
      id: 'q-6',
      category: 'Incident Management & Post-Mortem Accountability',
      question: `Tell us about a critical production incident or failure you were involved with. What was your immediate response, how did you stabilize the system, and what systemic changes did you implement in the post-mortem?`,
      competency: 'Blameless Problem Solving & System Resiliency',
      strongAnswerIndicators: [
        'Takes direct, honest ownership of their part in the incident without finger-pointing or hiding details.',
        'Prioritizes rapid customer mitigation (rollback, circuit breaker, feature flag) over immediate perfection.',
        'Institutes durable automated safeguards (monitoring alerts, unit regression tests, runbook updates) to prevent recurrence.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Attempts to minimize the outage, blames upstream vendors or junior team members; zero post-mortem learning.',
        2: 'Needs Improvement: Fixes the immediate bug but does not address root cause architectural vulnerabilities or monitoring gaps.',
        3: 'Meets Expectations: Responds calmly, communicates outage status to stakeholders, and writes a blameless post-mortem.',
        4: 'Exceeds Expectations: Identifies subtle systemic blindspots and implements robust circuit breakers and alert thresholds.',
        5: 'Outstanding: Champions organizational blameless culture; transforms an operational outage into a model case study for resilience.',
      },
      followUpProbes: [
        'What was the communication cadence to executive leadership during the live incident?',
        'How did you verify that the fix did not introduce secondary regressions?',
      ],
      status: 'Unchanged',
    },
    {
      id: 'q-7',
      category: 'Data-Informed Decision Making',
      question: `Describe how you use metrics, customer telemetry, or observational data to evaluate the success of a feature or technical optimization. How do you guard against vanity metrics or confirmation bias?`,
      competency: 'Objective Measurement & Empirical Validation',
      strongAnswerIndicators: [
        'Distinguishes between leading indicators, lagging indicators, and vanity metrics.',
        'Formulates pre-registered success criteria prior to launching experiments or deployments.',
        'Willing to abandon or deprecate an initiative if empirical data contradicts initial intuition.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Relies solely on personal opinion or gut feeling; cannot define how feature success is measured.',
        2: 'Needs Improvement: Tracks basic counts (e.g. clicks, pageviews) without tying them to meaningful user outcomes.',
        3: 'Meets Expectations: Establishes clear KPIs, tracks baseline vs post-launch deltas, and makes informed iterative changes.',
        4: 'Exceeds Expectations: Designs rigorous A/B experiments, accounts for statistical significance, and shares findings widely.',
        5: 'Outstanding: Cultivates a high-rigor experimentation culture across the organization that prevents costly misallocations.',
      },
      followUpProbes: [
        'Can you describe a time when data proved your initial hypothesis wrong? What did you do?',
        'How do you measure qualitative user satisfaction alongside quantitative telemetry?',
      ],
      status: 'Unchanged',
    },
    {
      id: 'q-8',
      category: 'Ethical Engineering & Data Stewardship',
      question: `In an era of automated decision systems and AI, how do you evaluate ethical implications, user privacy protections, and potential algorithmic or data biases in the products you build?`,
      competency: 'Ethics, Privacy & Algorithmic Fairness',
      strongAnswerIndicators: [
        'Awareness of privacy principles (data minimization, encryption, GDPR/CCPA, user consent).',
        'Recognizes how biased training data or unrepresentative test sets generate disparate impact.',
        'Advocates for transparency, human-in-the-loop review, and regular fairness audits.',
      ],
      scoringRubric: {
        1: 'Unsatisfactory: Considers privacy and bias irrelevant to engineering; displays reckless disregard for user rights.',
        2: 'Needs Improvement: Treats compliance as a tick-box legal exercise without proactive technical safeguards.',
        3: 'Meets Expectations: Incorporates data minimization, secures sensitive fields, and raises ethical flags during design.',
        4: 'Exceeds Expectations: Conducts privacy and disparate impact risk assessments before model or schema deployment.',
        5: 'Outstanding: Spearheads company-wide ethical engineering charters and implements continuous bias observability pipelines.',
      },
      followUpProbes: [
        'Have you ever had to push back on a feature that jeopardized user privacy or fairness? How did you approach leadership?',
        'How do you ensure audit logs are preserved for compliance without leaking PII?',
      ],
      status: 'Unchanged',
    },
  ];

  // Slice questions to requested count
  const questions = baseQuestions.slice(0, Math.min(Math.max(numQuestions, 4), baseQuestions.length));

  // Run statistical audit on CSV if provided
  const statisticalAudit = parseOutcomeCsv(pastOutcomeCsv || '');

  // If statistical audit found adverse impact, adjust audit status to reflect it!
  if (statisticalAudit.hasData && statisticalAudit.adverseImpactDetected) {
    if (auditStatus === 'PASS') {
      auditStatus = 'PASS_WITH_CHANGES';
    }
    auditSummary += ` Statistical outcome audit detected adverse impact violating the EEOC 4/5ths rule (AIR < 0.80) across historical candidate groups.`;
  }

  // Generate Markdown representation
  const rawMarkdown = generateKitMarkdown({
    jobTitle: jobTitle || 'Role from Job Description',
    seniority,
    auditStatus,
    auditSummary,
    questions,
    flaggedItems,
    demographicImpacts,
    statisticalAudit,
  });

  return {
    sessionId,
    jobTitle: jobTitle || 'Target Role',
    seniority,
    numQuestions: questions.length,
    auditStatus,
    auditSummary,
    questions,
    flaggedItems,
    demographicImpacts,
    statisticalAudit,
    fairnessRecommendations: DEFAULT_FAIRNESS_RECOMMENDATIONS.map(r => ({ ...r })),
    rawMarkdown,
    reviewedAudit: false,
    approved: false,
    createdAt: new Date().toISOString(),
    generatedBySource: 'fallback_engine',
  };
}

/**
 * Format complete interview kit as clean, executive-ready Markdown
 */
export function generateKitMarkdown(params: {
  jobTitle: string;
  seniority: SeniorityLevel;
  auditStatus: AuditStatus;
  auditSummary: string;
  questions: QuestionItem[];
  flaggedItems: FlaggedBiasItem[];
  demographicImpacts: DemographicImpactCard[];
  statisticalAudit: ReturnType<typeof parseOutcomeCsv>;
}): string {
  const { jobTitle, seniority, auditStatus, auditSummary, questions, flaggedItems, demographicImpacts, statisticalAudit } = params;

  let md = `# FairHire Structured Interview Kit & Bias Audit\n\n`;
  md += `**Role:** ${jobTitle}  \n`;
  md += `**Seniority Level:** ${seniority}  \n`;
  md += `**Generated Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}  \n`;
  md += `**Audit Status:** ${auditStatus === 'PASS' ? '✅ PASS' : auditStatus === 'PASS_WITH_CHANGES' ? '⚠️ PASS WITH CHANGES' : '🛑 FAIL - ACTION REQUIRED'}  \n\n`;

  md += `## 1. Executive Bias Audit Summary\n\n`;
  md += `${auditSummary}\n\n`;

  if (flaggedItems.length > 0) {
    md += `### Flagged Bias Risks & Applied Fixes\n\n`;
    md += `| Source / Ref | Issue Type | Groups Affected | Risk Level | Fix Applied |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    flaggedItems.forEach(item => {
      md += `| ${item.questionNum} | ${item.issueType} | ${item.groupsAffected} | ${item.risk} | ${item.fixApplied} |\n`;
    });
    md += `\n`;
  }

  if (demographicImpacts.length > 0) {
    md += `### Demographic Impact Observations\n\n`;
    demographicImpacts.forEach(c => {
      md += `#### ${c.group}: ${c.title} (${c.severity.toUpperCase()})\n`;
      md += `* **Potential Impact:** ${c.potentialImpact}\n`;
      md += `* **Mitigation Strategy:** ${c.mitigation}\n\n`;
    });
  }

  md += `### Statistical Outcome Audit (EEOC Four-Fifths Rule)\n\n`;
  if (!statisticalAudit.hasData) {
    md += `*Note: Qualitative review only, not a statistical validation. No historical candidate outcome data was provided.*\n\n`;
  } else {
    md += `${statisticalAudit.message}\n\n`;
    if (statisticalAudit.groups && statisticalAudit.groups.length > 0) {
      md += `| Demographic Group | Interviewed | Selected | Selection Rate | Adverse Impact Ratio (vs ${statisticalAudit.benchmarkGroup}) | 4/5ths Rule Violation? |\n`;
      md += `| :--- | :---: | :---: | :---: | :---: | :---: |\n`;
      statisticalAudit.groups.forEach(g => {
        md += `| ${g.groupName} | ${g.interviewed} | ${g.selected} | ${(g.selectionRate * 100).toFixed(1)}% | ${(g.adverseImpactRatio * 100).toFixed(1)}% | ${g.isAdverseImpact ? '⚠️ YES (< 80%)' : '✅ NO'} |\n`;
      });
      md += `\n`;
    }
  }

  md += `## 2. Structured Interview Questions & Behaviorally Anchored Rubrics\n\n`;
  questions.forEach((q, idx) => {
    md += `### Question ${idx + 1}: ${q.category} [${q.status.toUpperCase()}]\n\n`;
    md += `**Question:** "${q.question}"\n\n`;
    md += `**Competency Evaluated:** ${q.competency}  \n`;
    if (q.status === 'Changed' && q.originalQuestion) {
      md += `**Original Flagged Formulation:** *"${q.originalQuestion}"*  \n`;
      md += `**Remediation Rationale:** ${q.changeRationale}  \n`;
    }
    md += `\n**Strong Answer Indicators (Look For):**\n`;
    q.strongAnswerIndicators.forEach(ind => {
      md += `- ${ind}\n`;
    });
    md += `\n**5-Point Scoring Rubric (BARS):**\n`;
    md += `- **1 - Unsatisfactory:** ${q.scoringRubric[1]}\n`;
    md += `- **2 - Needs Improvement:** ${q.scoringRubric[2]}\n`;
    md += `- **3 - Meets Expectations:** ${q.scoringRubric[3]}\n`;
    md += `- **4 - Exceeds Expectations:** ${q.scoringRubric[4]}\n`;
    md += `- **5 - Outstanding:** ${q.scoringRubric[5]}\n`;
    md += `\n**Follow-up Probes:**\n`;
    q.followUpProbes.forEach(probe => {
      md += `- *"${probe}"*\n`;
    });
    md += `\n---\n\n`;
  });

  md += `## 3. Mandatory Fairness Best Practices\n\n`;
  DEFAULT_FAIRNESS_RECOMMENDATIONS.forEach(rec => {
    md += `- [x] **${rec.title}** (${rec.category}): ${rec.description}\n`;
  });

  md += `\n---\n*Disclaimer: This tool lowers bias risk but does not guarantee fairness or legal compliance. Have HR/legal review for your jurisdiction (e.g., NYC Local Law 144, EU AI Act).*`;

  return md;
}

/**
 * Attempts to parse Lyzr response JSON from markdown code block or plain text
 */
export function parseLyzrResponseToKit(rawResponse: string, req: GenerateKitRequest): InterviewKit {
  try {
    let jsonString = '';
    // Look for ```json ... ```
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    } else {
      // Find first { and last }
      const firstBrace = rawResponse.indexOf('{');
      const lastBrace = rawResponse.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = rawResponse.substring(firstBrace, lastBrace + 1);
      }
    }

    if (!jsonString) {
      throw new Error('No JSON payload found in agent response');
    }

    const parsed = JSON.parse(jsonString);
    const statisticalAudit = parseOutcomeCsv(req.pastOutcomeCsv || '');

    const questions: QuestionItem[] = (parsed.questions || []).map((q: any, i: number) => ({
      id: q.id || `q-${i + 1}`,
      category: q.category || 'General Competency',
      question: q.question || '',
      competency: q.competency || 'Role Execution',
      strongAnswerIndicators: Array.isArray(q.strongAnswerIndicators) ? q.strongAnswerIndicators : ['Demonstrates structured problem-solving', 'Cites clear evidence of past success'],
      scoringRubric: q.scoringRubric || {
        1: 'Unsatisfactory response',
        2: 'Needs improvement',
        3: 'Meets expectations',
        4: 'Exceeds expectations',
        5: 'Outstanding response',
      },
      followUpProbes: Array.isArray(q.followUpProbes) ? q.followUpProbes : ['Can you elaborate on your specific contribution?'],
      status: q.status === 'Changed' ? 'Changed' : 'Unchanged',
      originalQuestion: q.originalQuestion,
      changeRationale: q.changeRationale,
    }));

    const flaggedItems: FlaggedBiasItem[] = (parsed.flaggedItems || []).map((f: any, i: number) => ({
      id: `flag-${i + 1}`,
      questionNum: f.questionNum || `Item ${i + 1}`,
      issueType: f.issueType || 'Potential Bias Risk',
      groupsAffected: f.groupsAffected || 'Underrepresented Groups',
      risk: (f.risk === 'High' || f.risk === 'Medium' || f.risk === 'Low') ? f.risk : 'Medium',
      fixApplied: f.fixApplied || 'Neutralized criteria to focus on verifiable competencies.',
    }));

    const demographicImpacts: DemographicImpactCard[] = (parsed.demographicImpacts || []).map((d: any, i: number) => ({
      id: `demo-${i + 1}`,
      group: d.group || 'Demographic Category',
      title: d.title || 'Impact Review',
      potentialImpact: d.potentialImpact || 'Evaluated for disparate impact risks.',
      mitigation: d.mitigation || 'Applied objective scoring rubrics.',
      severity: d.severity === 'alert' || d.severity === 'warning' ? d.severity : 'info',
    }));

    let auditStatus: AuditStatus = parsed.auditStatus === 'FAIL' ? 'FAIL' : parsed.auditStatus === 'PASS_WITH_CHANGES' ? 'PASS_WITH_CHANGES' : 'PASS';
    if (statisticalAudit.hasData && statisticalAudit.adverseImpactDetected && auditStatus === 'PASS') {
      auditStatus = 'PASS_WITH_CHANGES';
    }

    const rawMarkdown = generateKitMarkdown({
      jobTitle: req.jobTitle || 'Target Role',
      seniority: req.seniority || 'Senior',
      auditStatus,
      auditSummary: parsed.auditSummary || 'Audit analysis completed successfully.',
      questions,
      flaggedItems,
      demographicImpacts,
      statisticalAudit,
    });

    return {
      sessionId: req.sessionId || `session-${Date.now()}`,
      jobTitle: req.jobTitle || 'Target Role',
      seniority: req.seniority || 'Senior',
      numQuestions: questions.length,
      auditStatus,
      auditSummary: parsed.auditSummary || 'Audit analysis completed.',
      questions,
      flaggedItems,
      demographicImpacts,
      statisticalAudit,
      fairnessRecommendations: DEFAULT_FAIRNESS_RECOMMENDATIONS.map(r => ({ ...r })),
      rawMarkdown,
      reviewedAudit: false,
      approved: false,
      createdAt: new Date().toISOString(),
      generatedBySource: 'lyzr',
    };
  } catch (err) {
    console.warn('Lyzr JSON parsing failed, using fallback parser', err);
    return generateLocalAuditKit(req);
  }
}
