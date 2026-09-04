"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { matchExceptions as initialExceptions } from "@/lib/mockData";
import type { DQStatus, MatchException } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const FILTERS: Array<{ label: string; value: DQStatus | "All" }> = [
  { label: "All", value: "All" },
  { label: "Review", value: "Review" },
  { label: "Failed", value: "Failed" },
];

function ComparisonPanel({
  exception,
  onApprove,
  onOverride,
  actionState,
}: {
  exception: MatchException;
  onApprove: () => void;
  onOverride: () => void;
  actionState?: "approved" | "overridden";
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {exception.exceptionId}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {exception.candidateName}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge label={exception.dqStatus} />
            {exception.sources.map((s) => (
              <Badge key={s} label={s} />
            ))}
            <span className="text-xs text-slate-400">
              Flagged {formatDate(exception.createdAt)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Match Confidence
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {(exception.matchConfidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="mb-4 text-sm text-slate-600">{exception.flaggedReason}</p>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Side-by-Side Field Comparison
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-2.5 font-medium">Field</th>
                {exception.sources.map((s) => (
                  <th key={s} className="px-4 py-2.5 font-medium">
                    <Badge label={s} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exception.conflicts.map((conflict) => (
                <tr key={conflict.field} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-slate-700">
                    {conflict.field}
                  </td>
                  {exception.sources.map((s) => (
                    <td key={s} className="px-4 py-2.5 text-slate-600">
                      {conflict.values[s] ?? (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI Insight
          </div>
          <p className="text-sm text-indigo-900/80">{exception.aiInsight}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={onApprove}
            disabled={!!actionState}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve Merge
          </button>
          <button
            onClick={onOverride}
            disabled={!!actionState}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Override / Edit
          </button>
          {actionState === "approved" && (
            <span className="text-sm font-medium text-emerald-600">
              ✓ Merge approved
            </span>
          )}
          {actionState === "overridden" && (
            <span className="text-sm font-medium text-amber-600">
              ✎ Sent for manual edit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StewardshipContent() {
  const [exceptions] = useState(initialExceptions);
  const [filter, setFilter] = useState<DQStatus | "All">("All");
  const [selectedId, setSelectedId] = useState(exceptions[0]?.exceptionId ?? "");
  const [actions, setActions] = useState<Record<string, "approved" | "overridden">>({});

  const filtered = useMemo(
    () =>
      filter === "All"
        ? exceptions
        : exceptions.filter((e) => e.dqStatus === filter),
    [exceptions, filter]
  );

  const selected =
    filtered.find((e) => e.exceptionId === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Stewardship & Match Review
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review low-confidence matches and data quality exceptions before
            they merge into Golden Records.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Data Steward access
        </span>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-3">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === f.value
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-medium">Candidate</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exc) => (
                  <tr
                    key={exc.exceptionId}
                    onClick={() => setSelectedId(exc.exceptionId)}
                    className={`cursor-pointer border-b border-slate-50 transition last:border-0 hover:bg-slate-50 ${
                      selected?.exceptionId === exc.exceptionId
                        ? "bg-indigo-50/70"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {exc.candidateName}
                      </p>
                      <p className="font-mono text-xs text-slate-400">
                        {exc.exceptionId} · {(exc.matchConfidence * 100).toFixed(0)}%
                        confidence
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={actions[exc.exceptionId] === "approved" ? "Passed" : exc.dqStatus} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-400">
                      No exceptions in this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          {selected ? (
            <ComparisonPanel
              exception={selected}
              actionState={actions[selected.exceptionId]}
              onApprove={() =>
                setActions((prev) => ({ ...prev, [selected.exceptionId]: "approved" }))
              }
              onOverride={() =>
                setActions((prev) => ({ ...prev, [selected.exceptionId]: "overridden" }))
              }
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-400">
              Select an exception to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StewardshipPage() {
  return (
    <ProtectedRoute allowedRoles={["steward"]}>
      <AppShell>
        <StewardshipContent />
      </AppShell>
    </ProtectedRoute>
  );
}
