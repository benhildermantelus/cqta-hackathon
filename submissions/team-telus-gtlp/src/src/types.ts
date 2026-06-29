export interface ExperimentPlan {
  target_service: string;
  traffic_load: string;
  fault_type: string;
  environment: string;
  slo_focus: string;
  is_business_phrased?: boolean;
  original_phrasing_type?: "business" | "technical" | "mixed";
  business_translation?: string;
  technical_translation?: string;
}

export interface Finding {
  id: string;
  title: string;
  technical_description: string;
  business_description: string;
  metric: string;
  status: "success" | "warning" | "danger";
}

export interface RecommendedFix {
  title: string;
  technical_description: string;
  business_description: string;
  file_path: string;
  diff: string;
}

export interface ResilienceReport {
  verdict: "PASSED" | "DEGRADED" | "FAILED";
  summary: string;
  findings: Finding[];
  recommended_fix: RecommendedFix;
}

export interface Message {
  id: string;
  sender: "user" | "keel";
  text: string;
  timestamp: string;
  // Keel's multi-stage response states
  stage?: 1 | 2 | 3 | 4;
  isPending?: boolean;
  
  // Embedded payloads
  plan?: ExperimentPlan;
  report?: ResilienceReport;
  
  // Custom states
  isBusinessPhrasedInput?: boolean;
  businessTranslation?: string;
  technicalTranslation?: string;
}
