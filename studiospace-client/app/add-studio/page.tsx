
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStudio } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Upload, ImagePlus, X } from "lucide-react";

export default function AddStudio() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState<any>({
    title: "",
    category: "Photo Studio",
    hourlyRate: 45,
    securityDeposit: 100,
    maxCapacity: 10,
    location: "",
    image: "",
    amenities: "Natural light, WiFi",
    overview: "",
  });

  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  function change(key: string, value: any) {
    setForm((previous: any) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      change("image", result.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first");
      return;
    }

    if (!form.image) {
      toast.error("Please upload a studio image");
      return;
    }

    setBusy(true);

    try {
      await createStudio({
        ...form,
        hourlyRate: Number(form.hourlyRate),
        securityDeposit: Number(form.securityDeposit),
        maxCapacity: Number(form.maxCapacity),
        amenities: form.amenities
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean),
      });

      toast.success("Studio created successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create studio"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section max-w-3xl">
      <p className="eyebrow">Share your creative space</p>

      <h1 className="section-title mt-1">
        Add New Studio
      </h1>

      <form
        onSubmit={submit}
        className="card grid gap-4 p-6 sm:grid-cols-2"
      >
        <label className="text-sm font-bold">
          Studio title
          <input
            className="input mt-1"
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Location / address
          <input
            className="input mt-1"
            value={form.location}
            onChange={(e) => change("location", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Hourly rate ($)
          <input
            className="input mt-1"
            type="number"
            min="1"
            value={form.hourlyRate}
            onChange={(e) => change("hourlyRate", e.target.value)}
            required
          />
        </label>

        <label className="text-sm font-bold">
          Security deposit ($)
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
          Max capacity
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
          Category
          <select
            className="input mt-1"
            value={form.category}
            onChange={(e) => change("category", e.target.value)}
          >
            {[
              "Photo Studio",
              "Film Stage",
              "Podcast Lounge",
              "Music Suite",
              "Workshop",
            ].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-2">
          <label className="text-sm font-bold">
            Studio Image
          </label>

          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-300 bg-lime-50 p-6 text-center transition hover:bg-lime-100">
            {uploading ? (
              <Upload className="mb-2 animate-bounce text-green-700" size={30} />
            ) : (
              <ImagePlus className="mb-2 text-green-700" size={30} />
            )}

            <span className="font-bold text-green-800">
              {uploading ? "Uploading image..." : "Choose an image"}
            </span>

            <span className="mt-1 text-xs text-gray-500">
              Select an image from your device
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
              disabled={uploading}
            />
          </label>

          {form.image && (
            <div className="relative mt-4">
              <img
                src={form.image}
                alt="Studio preview"
                className="h-56 w-full rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={() => change("image", "")}
                className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <label className="text-sm font-bold">
          Host name
          <input
            className="input mt-1"
            value={session?.user?.name || ""}
            readOnly
          />
        </label>

        <label className="text-sm font-bold">
          Host email
          <input
            className="input mt-1"
            type="email"
            value={session?.user?.email || ""}
            readOnly
          />
        </label>

        <label className="text-sm font-bold sm:col-span-2">
          Amenities (comma separated)
          <input
            className="input mt-1"
            value={form.amenities}
            onChange={(e) => change("amenities", e.target.value)}
            placeholder="WiFi, Natural light, Parking"
          />
        </label>

        <label className="text-sm font-bold sm:col-span-2">
          Detailed overview
          <textarea
            className="input mt-1 min-h-28"
            value={form.overview}
            onChange={(e) => change("overview", e.target.value)}
            required
          />
        </label>

        <button
          disabled={busy || uploading || !session?.user}
          className="btn btn-primary sm:col-span-2"
        >
          {busy ? "Saving..." : "Create Studio Listing"}
        </button>
      </form>
    </div>
  );
}
