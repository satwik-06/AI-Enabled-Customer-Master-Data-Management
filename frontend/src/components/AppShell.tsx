"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS: {
  href: string;
  label: string;
  description: string;
  roles: Array<"sales" | "steward">;
}[] = [
  {
    href: "/search",
    label: "Customer 360",
    description: "Search & golden records",
    roles: ["sales", "steward"],
  },
  {
    href: "/stewardship",
    label: "Stewardship",
    description: "Exceptions & merge review",
    roles: ["steward"],
  },
  {
    href: "/operations",
    label: "Operations",
    description: "Logs & data quality",
    roles: ["sales", "steward"],
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const items = NAV_ITEMS.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
            MD
          </div>
          <div>
            <p className="text-sm font-semibold text-white">MDM Platform</p>
            <p className="text-xs text-slate-400">Golden Record Console</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group rounded-lg px-3 py-2.5 transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p
                  className={`text-xs ${
                    active ? "text-indigo-100" : "text-slate-500 group-hover:text-slate-400"
                  }`}
                >
                  {item.description}
                </p>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
              {user ? initials(user.name) : ""}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">
                {user?.role === "steward" ? "Data Steward" : "Sales / Account Mgmt"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="mt-3 w-full rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
