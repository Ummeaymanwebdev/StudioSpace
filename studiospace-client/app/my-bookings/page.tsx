
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cancelBooking, getMyBookings } from "@/lib/api";
import type { Booking } from "@/lib/types";

export default function MyBookings() {
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const email = session?.user?.email;

  async function load(userEmail: string) {
    try {
      setLoading(true);
      const bookings = await getMyBookings(userEmail);
      setItems(bookings);
    } catch {
      toast.error("Could not load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setItems([]);
      setLoading(false);
      return;
    }

    load(email);
  }, [email, isPending]);

  async function cancel(id: string) {
    if (!email) return;

    try {
      await cancelBooking(id, email);
      toast.success("Booking cancelled successfully");
      await load(email);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Cancel failed"
      );
    }
  }

  if (isPending || loading) {
    return (
      <div className="container section">
        <div className="mb-7 h-10 w-48 animate-pulse rounded-lg bg-green-100" />

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card flex flex-col gap-4 p-4 animate-pulse sm:flex-row sm:items-center"
            >
              <div className="h-28 w-full rounded-xl bg-green-100 sm:w-40" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-green-100" />
                <div className="h-4 w-1/2 rounded bg-green-100" />
                <div className="h-4 w-1/4 rounded bg-green-100" />
              </div>

              <div className="h-8 w-20 rounded-full bg-green-100" />
              <div className="h-10 w-32 rounded-full bg-green-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="container section">
        <h1 className="section-title">My Bookings</h1>
        <p>Please login to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">My Bookings</h1>

      {items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((b) => (
            <div
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              key={b._id}
            >
              <img
                src={b.studioImage}
                alt={b.studioTitle}
                className="h-28 w-full rounded-xl object-cover sm:w-40"
              />

              <div className="flex-1">
                <b>{b.studioTitle}</b>
                <p className="text-sm text-gray-600">
                  {b.date} · {b.startTime}–{b.endTime}
                </p>
                <p className="font-bold text-green-700">
                  ${b.totalPrice}
                </p>
              </div>

              <span className="badge">{b.status}</span>

              {b.status === "Pending" && (
                <button
                  className="btn btn-outline"
                  onClick={() => cancel(b._id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <h2 className="font-bold">No bookings yet</h2>
          <p className="my-2 text-sm text-gray-600">
            When you reserve a studio, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
