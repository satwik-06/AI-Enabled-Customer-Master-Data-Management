const STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Passed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Review: "bg-amber-50 text-amber-700 ring-amber-200",
  Warning: "bg-amber-50 text-amber-700 ring-amber-200",
  Failed: "bg-rose-50 text-rose-700 ring-rose-200",
  Error: "bg-rose-50 text-rose-700 ring-rose-200",
  CRM: "bg-sky-50 text-sky-700 ring-sky-200",
  ERP: "bg-violet-50 text-violet-700 ring-violet-200",
  Sales: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function Badge({ label }: { label: string }) {
  const style = STYLES[label] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  );
}
