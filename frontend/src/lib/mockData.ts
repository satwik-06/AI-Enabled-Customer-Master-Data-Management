import type {
  DQSummary,
  GoldenRecord,
  IngestionLog,
  MatchException,
  SourceBreakdown,
} from "./types";

export const goldenRecords: GoldenRecord[] = [
  {
    goldenId: "GR-100245",
    standardizedName: "Micron Technology Inc.",
    taxId: "94-2404110",
    country: "United States",
    status: "Active",
    industry: "Semiconductors",
    segment: "Enterprise",
    lastSurvivorshipRun: "2026-09-03T18:20:00Z",
    contributingSources: [
      {
        sourceId: "CRM-88213",
        system: "CRM",
        legalName: "Micron Technology, Inc.",
        taxId: "94-2404110",
        country: "USA",
        address: "8000 S Federal Way, Boise, ID",
        lastUpdated: "2026-08-29T10:05:00Z",
        matchConfidence: 0.98,
      },
      {
        sourceId: "ERP-55021",
        system: "ERP",
        legalName: "Micron Technology Incorporated",
        taxId: "94-2404110",
        country: "United States",
        address: "8000 South Federal Way, Boise, Idaho",
        lastUpdated: "2026-09-01T14:40:00Z",
        matchConfidence: 0.95,
      },
      {
        sourceId: "SLS-12987",
        system: "Sales",
        legalName: "Micron Tech",
        taxId: "94-2404110",
        country: "US",
        address: "Boise, ID",
        lastUpdated: "2026-09-02T09:12:00Z",
        matchConfidence: 0.91,
      },
    ],
  },
  {
    goldenId: "GR-100312",
    standardizedName: "Global Foundries Pte Ltd",
    taxId: "SG-201498231K",
    country: "Singapore",
    status: "Active",
    industry: "Semiconductors",
    segment: "Strategic",
    lastSurvivorshipRun: "2026-09-02T11:05:00Z",
    contributingSources: [
      {
        sourceId: "CRM-77410",
        system: "CRM",
        legalName: "GlobalFoundries Pte. Ltd.",
        taxId: "SG-201498231K",
        country: "Singapore",
        address: "60 Woodlands Industrial Park D, Singapore",
        lastUpdated: "2026-08-27T08:00:00Z",
        matchConfidence: 0.97,
      },
      {
        sourceId: "ERP-44902",
        system: "ERP",
        legalName: "Global Foundries Private Limited",
        taxId: "SG-201498231K",
        country: "SGP",
        address: "60 Woodlands Ind Park D",
        lastUpdated: "2026-08-30T16:22:00Z",
        matchConfidence: 0.93,
      },
    ],
  },
  {
    goldenId: "GR-100389",
    standardizedName: "Applied Materials Corp",
    taxId: "94-1655526",
    country: "United States",
    status: "Pending",
    industry: "Semiconductor Equipment",
    segment: "Enterprise",
    lastSurvivorshipRun: "2026-09-04T06:15:00Z",
    contributingSources: [
      {
        sourceId: "CRM-90112",
        system: "CRM",
        legalName: "Applied Materials, Corp",
        taxId: "94-1655526",
        country: "USA",
        address: "3050 Bowers Ave, Santa Clara, CA",
        lastUpdated: "2026-09-03T12:00:00Z",
        matchConfidence: 0.89,
      },
      {
        sourceId: "SLS-33501",
        system: "Sales",
        legalName: "Applied Materials",
        taxId: "94-1655526",
        country: "US",
        address: "Santa Clara, CA",
        lastUpdated: "2026-09-04T05:45:00Z",
        matchConfidence: 0.84,
      },
    ],
  },
];

export const matchExceptions: MatchException[] = [
  {
    exceptionId: "EXC-4471",
    candidateName: "TSMC North America / TSMC NA LLC",
    dqStatus: "Review",
    matchConfidence: 0.72,
    sources: ["CRM", "ERP"],
    flaggedReason: "Legal name divergence exceeds auto-merge threshold (0.85).",
    aiInsight:
      "CRM and ERP records share an identical Tax ID and address, but legal name similarity scored 0.72 due to the 'LLC' suffix in ERP only. Recommend manual confirmation before merge.",
    conflicts: [
      { field: "Legal Name", values: { CRM: "TSMC North America", ERP: "TSMC NA LLC" } },
      { field: "Tax ID", values: { CRM: "77-0192834", ERP: "77-0192834" } },
      { field: "Country", values: { CRM: "USA", ERP: "United States" } },
    ],
    createdAt: "2026-09-04T02:10:00Z",
  },
  {
    exceptionId: "EXC-4488",
    candidateName: "NVIDIA Corp / Nvidia Corporation",
    dqStatus: "Review",
    matchConfidence: 0.68,
    sources: ["CRM", "ERP", "Sales"],
    flaggedReason: "Conflicting Tax ID formats detected across three sources.",
    aiInsight:
      "Sales entry is missing a Tax ID entirely, while CRM and ERP use different regional identifiers for the same entity. System could not auto-resolve which identifier is canonical.",
    conflicts: [
      { field: "Legal Name", values: { CRM: "NVIDIA Corp", ERP: "Nvidia Corporation", Sales: "Nvidia" } },
      { field: "Tax ID", values: { CRM: "94-3177549", ERP: "94-3177549-01", Sales: "—" } },
      { field: "Country", values: { CRM: "USA", ERP: "United States", Sales: "US" } },
    ],
    createdAt: "2026-09-03T21:44:00Z",
  },
  {
    exceptionId: "EXC-4502",
    candidateName: "SK Hynix Americas",
    dqStatus: "Failed",
    matchConfidence: 0.41,
    sources: ["ERP", "Sales"],
    flaggedReason: "Data quality validation failed: malformed address and null country field.",
    aiInsight:
      "ERP record has a null country value and Sales address field contains unparsable characters. Confidence score fell below the review floor (0.5); record requires manual data entry correction, not merge review.",
    conflicts: [
      { field: "Country", values: { ERP: "—", Sales: "US" } },
      { field: "Address", values: { ERP: "1000 Hynix Way", Sales: "###ERR_ENCODING" } },
    ],
    createdAt: "2026-09-02T15:30:00Z",
  },
  {
    exceptionId: "EXC-4517",
    candidateName: "Samsung Semiconductor Inc. / Samsung Semi",
    dqStatus: "Review",
    matchConfidence: 0.79,
    sources: ["CRM", "Sales"],
    flaggedReason: "Abbreviated legal entity name in Sales source below similarity threshold.",
    aiInsight:
      "Fuzzy match on entity name scored 0.79 due to abbreviation ('Semi' vs 'Semiconductor Inc.'). Address and Tax ID match exactly, suggesting high likelihood of same entity.",
    conflicts: [
      { field: "Legal Name", values: { CRM: "Samsung Semiconductor Inc.", Sales: "Samsung Semi" } },
      { field: "Tax ID", values: { CRM: "88-2201934", Sales: "88-2201934" } },
    ],
    createdAt: "2026-09-04T08:02:00Z",
  },
];

export const dqSummary: DQSummary = {
  totalIngested: 48213,
  successfulMatches: 45690,
  activeExceptions: 187,
  autoMergeRate: 0.94,
};

export const sourceBreakdown: SourceBreakdown[] = [
  { system: "CRM", ingested: 19820, exceptions: 74, errorRate: 0.0037 },
  { system: "ERP", ingested: 17640, exceptions: 61, errorRate: 0.0035 },
  { system: "Sales", ingested: 10753, exceptions: 52, errorRate: 0.0048 },
];

export const ingestionLogs: IngestionLog[] = [
  {
    id: "LOG-99201",
    timestamp: "2026-09-04T09:12:00Z",
    system: "ERP",
    event: "Batch ingestion completed — 2,140 records processed",
    status: "Success",
  },
  {
    id: "LOG-99198",
    timestamp: "2026-09-04T08:55:00Z",
    system: "CRM",
    event: "Schema drift detected on field 'tax_id_type'",
    status: "Warning",
  },
  {
    id: "LOG-99187",
    timestamp: "2026-09-04T08:30:00Z",
    system: "Sales",
    event: "Connector timeout after 3 retries",
    status: "Error",
  },
  {
    id: "LOG-99172",
    timestamp: "2026-09-04T07:58:00Z",
    system: "CRM",
    event: "Deduplication pass completed — 312 duplicates resolved",
    status: "Success",
  },
  {
    id: "LOG-99160",
    timestamp: "2026-09-04T07:20:00Z",
    system: "ERP",
    event: "Null constraint violation on 4 records (country field)",
    status: "Warning",
  },
];
