
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Building2,
  CalendarDays,
  PlusCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fffef0]">
        <p className="font-semibold text-green-800">Loading dashboard...</p>
      </main>
    );
  }

  const actions = [
    {
      title: "Add New Studio",
      description: "List your studio and reach more creators.",
      href: "/add-studio",
      icon: PlusCircle,
    },
    {
      title: "My Studio Listings",
      description: "Manage your studio listings.",
      href: "/my-listings",
      icon: Building2,
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings.",
      href: "/my-bookings",
      icon: CalendarDays,
    },
  ];

  return (
    <main className="min-h-[70vh] bg-[#fffef0] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-green-900">
          Welcome, {session.user.name || "User"}!
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your StudioSpace activities from one place.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-2xl border border-green-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon className="h-9 w-9 text-green-700" />

                <h2 className="mt-4 text-xl font-bold text-green-900">
                  {action.title}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
