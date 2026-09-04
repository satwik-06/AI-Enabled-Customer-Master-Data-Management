"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

const DEMO_ACCOUNTS = [
  {
    role: "Sales / Account Manager",
    email: "sales@micron.com",
    password: "sales123",
  },
  {
    role: "Data Steward / Admin",
    email: "steward@micron.com",
    password: "steward123",
  },
];

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/search");
  }, [user, isLoading, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.ok) {
        setError(result.error ?? "Unable to sign in.");
        setSubmitting(false);
        return;
      }
      router.replace("/search");
    }, 350);
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 md:grid md:grid-cols-5">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 text-white md:col-span-2 md:flex">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold">
              MD
            </div>
            <h1 className="mt-6 text-xl font-semibold leading-tight">
              MDM Platform
            </h1>
            <p className="mt-1 text-sm text-indigo-200">
              Golden Record Console
            </p>
          </div>
          <div className="space-y-4 text-sm text-indigo-100">
            <p className="text-indigo-300/80">
              Unified customer intelligence, matched and governed across CRM,
              ERP, and Sales systems.
            </p>
            <ul className="space-y-2 text-indigo-200/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                Real-time Customer 360 search
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                AI-assisted duplicate resolution
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                Full data lineage &amp; audit trail
              </li>
            </ul>
          </div>
          <p className="text-xs text-indigo-400/70">
            Access is restricted to authorized internal accounts. There is no
            self-service sign-up for this platform.
          </p>
        </div>

        <div className="p-8 sm:p-10 md:col-span-3">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              MD
            </div>
            <span className="text-sm font-semibold text-slate-900">
              MDM Platform
            </span>
          </div>

          <div className="mb-6 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-slate-900">
              Secure Enterprise Login
            </h2>
          </div>
          <p className="mb-6 text-sm text-slate-500">
            Sign in with your Micron MDM credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@micron.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hackathon demo accounts
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acct) => (
                <button
                  key={acct.email}
                  type="button"
                  onClick={() => fillDemo(acct.email, acct.password)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span>
                    <span className="block font-medium text-slate-800">
                      {acct.role}
                    </span>
                    <span className="text-slate-500">{acct.email}</span>
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-500">
                    use
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            No public registration is available. Contact your MDM
            administrator for access provisioning.
          </p>
        </div>
      </div>
    </div>
  );
}
