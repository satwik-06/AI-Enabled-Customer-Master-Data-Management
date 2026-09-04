export type UserRole = "sales" | "steward";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  team: string;
}

export type SourceSystem = "CRM" | "ERP" | "Sales";

export type DQStatus = "Passed" | "Review" | "Failed";

export interface SourceRecord {
  sourceId: string;
  system: SourceSystem;
  legalName: string;
  taxId: string;
  country: string;
  address: string;
  lastUpdated: string;
  matchConfidence: number;
}

export interface GoldenRecord {
  goldenId: string;
  standardizedName: string;
  taxId: string;
  country: string;
  status: "Active" | "Inactive" | "Pending";
  industry: string;
  segment: string;
  lastSurvivorshipRun: string;
  contributingSources: SourceRecord[];
}

export interface FieldConflict {
  field: string;
  values: Partial<Record<SourceSystem, string>>;
}

export interface MatchException {
  exceptionId: string;
  candidateName: string;
  dqStatus: DQStatus;
  matchConfidence: number;
  sources: SourceSystem[];
  flaggedReason: string;
  aiInsight: string;
  conflicts: FieldConflict[];
  createdAt: string;
}

export interface DQSummary {
  totalIngested: number;
  successfulMatches: number;
  activeExceptions: number;
  autoMergeRate: number;
}

export interface SourceBreakdown {
  system: SourceSystem;
  ingested: number;
  exceptions: number;
  errorRate: number;
}

export interface IngestionLog {
  id: string;
  timestamp: string;
  system: SourceSystem;
  event: string;
  status: "Success" | "Warning" | "Error";
}
