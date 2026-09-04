"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { goldenRecords } from "@/lib/mockData";
import type { GoldenRecord } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function LineagePanel({ record }: { record: GoldenRecord }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Source Lineage
          </p>
          <p className="text-xs text-slate-500">
            {record.contributingSources.length} contributing source
            {record.contributingSources.length === 1 ? "" : "s"} mapped via
            cross-reference table
          </p>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">System</th>
                  <th className="px-5 py-3 font-medium">Source ID</th>
                  <th className="px-5 py-3 font-medium">Legal Name (raw)</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">Match Confidence</th>
                  <th className="px-5 py-3 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {record.contributingSources.map((src) => (
                  <tr key={src.sourceId} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3">
                      <Badge label={src.system} />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">
                      {src.sourceId}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{src.legalName}</td>
                    <td className="px-5 py-3 text-slate-500">{src.address}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${src.matchConfidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {(src.matchConfidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(src.lastUpdated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function GoldenRecordCard({ record }: { record: GoldenRecord }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Golden Record · {record.goldenId}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            {record.standardizedName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {record.industry} · {record.segment} segment
          </p>
        </div>
        <Badge label={record.status} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Standardized Name
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {record.standardizedName}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Tax ID</p>
          <p className="mt-1 font-mono text-sm font-medium text-slate-800">
            {record.taxId}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Active Status
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {record.status}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Country</p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {record.country}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Read-only view. Last survivorship run {formatDate(record.lastSurvivorshipRun)}.
        Contact a Data Steward to request corrections.
      </div>
    </div>
  );
}

function SearchContent() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(goldenRecords[0]?.goldenId ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return goldenRecords;
    return goldenRecords.filter((r) =>
      [r.standardizedName, r.goldenId, r.taxId, r.country]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const selected =
    results.find((r) => r.goldenId === selectedId) ?? results[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Customer 360 Search
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search unified, trusted customer profiles across all source
          systems.
        </p>
      </header>

      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by customer name, Golden Record ID, Tax ID, or country…"
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          {results.map((r) => (
            <button
              key={r.goldenId}
              onClick={() => setSelectedId(r.goldenId)}
              className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                selected?.goldenId === r.goldenId
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-medium text-slate-900">
                {r.standardizedName}
              </p>
              <p className="mt-0.5 font-mono text-xs text-slate-500">
                {r.goldenId}
              </p>
              <div className="mt-2">
                <Badge label={r.status} />
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
              No matching customers found.
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selected ? (
            <>
              <GoldenRecordCard record={selected} />
              <LineagePanel record={selected} />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-400">
              Select a customer to view their Golden Record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <ProtectedRoute allowedRoles={["sales", "steward"]}>
      <AppShell>
        <SearchContent />
      </AppShell>
    </ProtectedRoute>
  );
}
