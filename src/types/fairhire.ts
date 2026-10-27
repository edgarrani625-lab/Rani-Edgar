export type SeniorityLevel = 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Executive / Director';

export type AuditStatus = 'PASS' | 'PASS_WITH_CHANGES' | 'FAIL';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ScoringRubric {
  1: string; // Unsatisfactory
  2: string; // Needs Improvement
  3: string; // Meets Expectations
  4: string; // Exceeds Expectations
  5: string; // Outstanding
}

export interface QuestionItem {
  id: string;
  category: string;
  question: string;
  competency: string;
  strongAnswerIndicators: string[];
  scoringRubric: ScoringRubric;
  followUpProbes: string[];
  status: 'Changed' | 'Unchanged';
  originalQuestion?: string;
  changeRationale?: string;
}

export interface FlaggedBiasItem {
  id: string;
  questionNum: string | number;
  issueType: string;
  groupsAffected: string;
  risk: RiskLevel;
  fixApplied: string;
}

export interface DemographicImpactCard {
  id: string;
  group: string;
  title: string;
  potentialImpact: string;
  mitigation: string;
  severity: 'info' | 'warning' | 'alert';
}

export interface DemographicRow {
  groupName: string;
  interviewed: number;
  selected: number;
  selectionRate: number; // e.g. 0.45 = 45%
  adverseImpactRatio: number; // vs benchmark group (e.g. 0.72)
  isAdverseImpact: boolean; // AIR < 0.80 (EEOC 4/5ths rule violation)
}

export interface StatisticalAudit {
  hasData: boolean;
  message: string;
  groups?: DemographicRow[];
  benchmarkGroup?: string;
  benchmarkRate?: number;
  adverseImpactDetected?: boolean;
  totalInterviewed?: number;
  totalSelected?: number;
}

export interface FairnessRecommendation {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  category: string;
}

export interface InterviewKit {
  sessionId: string;
  jobTitle: string;
  seniority: SeniorityLevel;
  numQuestions: number;
  auditStatus: AuditStatus;
  auditSummary: string;
  questions: QuestionItem[];
  flaggedItems: FlaggedBiasItem[];
  demographicImpacts: DemographicImpactCard[];
  statisticalAudit: StatisticalAudit;
  fairnessRecommendations: FairnessRecommendation[];
  rawMarkdown?: string;
  reviewedAudit: boolean;
  approved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  generatedBySource: 'lyzr' | 'fallback_engine';
}

export interface GenerateKitRequest {
  jd: string;
  jobTitle?: string;
  seniority?: SeniorityLevel;
  numQuestions?: number;
  pastOutcomeCsv?: string;
  sessionId?: string;
  feedback?: string;
  userId?: string;
}

export interface SampleJd {
  id: string;
  title: string;
  tag: string;
  badgeType: 'normal' | 'biased' | 'technical';
  description: string;
  seniority: SeniorityLevel;
  content: string;
}
