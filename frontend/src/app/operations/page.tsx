"use client";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  dqSummary,
  ingestionLogs,
  sourceBreakdown,
} from "@/lib/mockData";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatNumber(n: number) {
  return n.toLocaleString();
}

const SUMMARY_CARDS = [
  {
    label: "Total Ingested",
    value: formatNumber(dqSummary.totalIngested),
    hint: "records across all sources",
    accent: "text-slate-900",
  },
  {
    label: "Successful Matches",
    value: formatNumber(dqSummary.successfulMatches),
    hint: `${((dqSummary.successfulMatches / dqSummary.totalIngested) * 100).toFixed(1)}% match rate`,
    accent: "text-emerald-600",
  },
  {
    label: "Active Exceptions",
    value: formatNumber(dqSummary.activeExceptions),
    hint: "awaiting stewardship review",
    accent: "text-amber-600",
  },
  {
    label: "Auto-Merge Rate",
    value: `${(dqSummary.autoMergeRate * 100).toFixed(0)}%`,
    hint: "resolved without manual review",
    accent: "text-indigo-600",
  },
];

function OperationsContent() {
  const maxIngested = Math.max(...sourceBreakdown.map((s) => s.ingested));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Data Quality & Monitoring
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pipeline health, ingestion volume, and exception trends across
          source systems.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {card.label}
            </p>
            <p className={`mt-2 text-2xl font-semibold ${card.accent}`}>
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-semibold text-slate-900">
            Exceptions by Source System
          </p>
          <div className="space-y-4">
            {sourceBreakdown.map((s) => (
              <div key={s.system}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge label={s.system} />
                    <span className="text-slate-500">
                      {formatNumber(s.ingested)} ingested
                    </span>
                  </div>
                  <span className="text-slate-700">
                    {s.exceptions} exceptions ·{" "}
                    {(s.errorRate * 100).toFixed(2)}% error rate
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(s.ingested / maxIngested) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-semibold text-slate-900">
            Recent Pipeline Activity
          </p>
          <ul className="space-y-4">
            {ingestionLogs.map((log) => (
              <li key={log.id} className="flex gap-3">
                <div className="mt-1">
                  <span
                    className={`block h-2 w-2 rounded-full ${
                      log.status === "Success"
                        ? "bg-emerald-500"
                        : log.status === "Warning"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge label={log.system} />
                    <Badge label={log.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{log.event}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function OperationsPage() {
  return (
    <ProtectedRoute allowedRoles={["sales", "steward"]}>
      <AppShell>
        <OperationsContent />
      </AppShell>
    </ProtectedRoute>
  );
}
