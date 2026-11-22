
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudio, updateStudio } from "@/lib/api";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export default function EditStudio() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getStudio(id)
      .then(setForm)
      .catch(() => toast.error("Studio not found"))
      .finally(() => setLoading(false));
  }, [id]);

  function change(key: string, value: string | number | string[]) {
    setForm((previous) =>
      previous ? { ...previous, [key]: value } : previous
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setBusy(true);

    try {
      await updateStudio(id, {
        ...form,
        hourlyRate: Number(form.hourlyRate),
        securityDeposit: Number(form.securityDeposit),
        maxCapacity: Number(form.maxCapacity),
        amenities: Array.isArray(form.amenities)
          ? form.amenities
          : [],
        gallery: Array.isArray(form.gallery) ? form.gallery : [],
      });

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="container section">
        <p className="text-center text-gray-500">
          Loading studio...
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container section text-center">
        <h2 className="text-xl font-bold">Studio not found</h2>
        <button
          className="btn btn-primary mt-4"
          onClick={() => router.push("/my-listings")}
        >
          Back to My Listings
        </button>
      </div>
    );
  }

  return (
    <div className="container section max-w-3xl">
      <p className="eyebrow">Manage your creative space</p>
      <h1 className="section-title mt-1">Update Studio</h1>

      <form
        onSubmit={save}
        className="card mt-6 grid gap-4 p-6 sm:grid-cols-2"
      >
        <label className="text-sm font-bold">
          Studio Title
          <input
            className="input mt-1"
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Category
          <select
            className="input mt-1"
            value={form.category}
            onChange={(e) => change("category", e.target.value)}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-bold">
          Hourly Rate ($)
          <input
            className="input mt-1"
            type="number"
            min="0"
            value={form.hourlyRate}
            onChange={(e) => change("hourlyRate", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Security Deposit ($)
          <input
            className="input mt-1"
            type="number"
            min="0"
            value={form.securityDeposit}
            onChange={(e) => change("securityDeposit", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Maximum Capacity
          <input
            className="input mt-1"
            type="number"
            min="1"
            value={form.maxCapacity}
            onChange={(e) => change("maxCapacity", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Location / Address
          <input
            className="input mt-1"
            value={form.location}
            onChange={(e) => change("location", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold sm:col-span-2">
          Main Image URL
          <input
            className="input mt-1"
            type="url"
            value={form.image}
            onChange={(e) => change("image", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold sm:col-span-2">
          Amenities (comma separated)
          <input
            className="input mt-1"
            value={(form.amenities || []).join(", ")}
            onChange={(e) =>
              change(
                "amenities",
                e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
              )
            }
          />
        </label>

        <label className="text-sm font-bold sm:col-span-2">
          Gallery Image URLs (comma separated)
          <textarea
            className="input mt-1 min-h-24"
            value={(form.gallery || []).join(", ")}
            onChange={(e) =>
              change(
                "gallery",
                e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
              )
            }
          />
        </label>

        <label className="text-sm font-bold sm:col-span-2">
          Detailed Overview
          <textarea
            className="input mt-1 min-h-32"
            value={form.overview}
            onChange={(e) => change("overview", e.target.value)}
            required
          />
        </label>

        <div className="sm:col-span-2">
          <h2 className="mb-3 font-bold">Host Information (Read Only)</h2>

          <label className="mb-3 block text-sm font-bold">
            Host Name
            <input
              className="input mt-1"
              value={form.ownerName || ""}
              readOnly
            />
          </label>

          <label className="block text-sm font-bold">
            Host Email
            <input
              className="input mt-1"
              value={form.ownerEmail || ""}
              readOnly
            />
          </label>
        </div>

        <button
          className="btn btn-primary sm:col-span-2"
          disabled={busy}
        >
          {busy ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
