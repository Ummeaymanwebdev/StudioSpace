
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteStudio, getMyListings } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/lib/types";
import { Trash2, Pencil, Plus, X } from "lucide-react";

export default function MyListings() {
  const { data: session, isPending } = authClient.useSession();

  const [items, setItems] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setItems([]);
      setLoading(false);
      return;
    }

    getMyListings(email)
      .then(setItems)
      .catch((error) => {
        console.error(error);
        toast.error("Could not load listings");
      })
      .finally(() => setLoading(false));
  }, [email, isPending]);

  async function removeStudio() {
    if (!deleteId) return;

    setDeleting(true);

    try {
      await deleteStudio(deleteId);
      setItems((previous) =>
        previous.filter((studio) => studio._id !== deleteId)
      );
      toast.success("Studio listing deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Delete failed"
      );
    } finally {
      setDeleting(false);
    }
  }

  
if (isPending || loading) {
  return (
    <div className="container section">
      <div className="mb-7 flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-36 animate-pulse rounded bg-green-100" />
          <div className="h-9 w-56 animate-pulse rounded bg-green-100" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-full bg-green-100" />
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="card flex flex-col gap-4 p-4 animate-pulse sm:flex-row sm:items-center"
          >
            <div className="h-36 w-full rounded-xl bg-green-100 sm:w-44" />

            <div className="flex-1 space-y-3">
              <div className="h-5 w-20 rounded bg-green-100" />
              <div className="h-5 w-2/3 rounded bg-green-100" />
              <div className="h-4 w-1/2 rounded bg-green-100" />
            </div>

            <div className="flex gap-2">
              <div className="h-10 w-24 rounded-full bg-green-100" />
              <div className="h-10 w-24 rounded-full bg-green-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


  if (!email) {
    return (
      <div className="container section text-center">
        <h1 className="section-title">Please Login First</h1>
        <Link href="/login" className="btn btn-primary mt-5">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Manage your spaces</p>
          <h1 className="section-title mt-1">My Studio Listings</h1>
        </div>

        <Link href="/add-studio" className="btn btn-primary">
          <Plus size={17} />
          Add New Studio
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((studio) => (
            <div
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              key={studio._id}
            >
              <img
                className="h-36 w-full rounded-xl object-cover sm:w-44"
                src={studio.image}
                alt={studio.title}
              />

              <div className="flex-1">
                <span className="badge">{studio.category}</span>
                <h2 className="mt-2 font-extrabold">
                  {studio.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  ${studio.hourlyRate}/hr · {studio.location}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  className="btn btn-outline"
                  href={`/studios/edit/${studio._id}`}
                >
                  <Pencil size={16} />
                  Update
                </Link>

                <button
                  className="btn btn-primary"
                  onClick={() => setDeleteId(studio._id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <h2 className="font-bold">No listings yet</h2>
          <p className="my-2 text-sm text-gray-600">
            Your studio listings will appear here.
          </p>
          <Link href="/add-studio" className="btn btn-primary">
            Add your first studio
          </Link>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Delete Studio?</h2>
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <p className="my-5 text-sm text-gray-600">
              Are you sure you want to delete this studio listing?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="btn btn-outline"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={removeStudio}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
