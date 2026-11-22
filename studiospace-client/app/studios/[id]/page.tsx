
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getStudio, createBooking } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/lib/types";
import LoadingGrid from "@/components/LoadingGrid";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  CalendarDays,
  Mail,
} from "lucide-react";

export default function StudioDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session } = authClient.useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingBusy, setBookingBusy] = useState(false);

  const [booking, setBooking] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  // Close booking modal with Escape key
  useEffect(() => {
    if (!bookingOpen || bookingBusy) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setBookingOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [bookingOpen, bookingBusy]);

  useEffect(() => {
    if (!id) return;

    getStudio(id)
      .then(setStudio)
      .catch((err) => {
        console.error("Failed to load studio:", err);
        setError(err.message || "Could not load studio");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container section">
        <LoadingGrid />
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="container section text-center">
        <h1 className="text-2xl font-black">Studio not found</h1>
        <p className="mt-2 text-gray-500">
          {error || "This studio may have been removed."}
        </p>
        <button
          onClick={() => router.push("/studios")}
          className="btn btn-primary mt-5"
        >
          Back to Studios
        </button>
      </div>
    );
  }

  const details = studio as Studio & {
    ownerName?: string;
    ownerEmail?: string;
    reviews?: {
      _id?: string;
      name?: string;
      rating?: number;
      comment?: string;
      date?: string;
    }[];
  };

  const amenities = Array.isArray(studio.amenities)
    ? studio.amenities
    : [];

  const gallery = Array.isArray(studio.gallery)
    ? studio.gallery
    : [];

  const images = [studio.image, ...gallery].filter(Boolean);

  const reviews = Array.isArray(details.reviews)
    ? details.reviews
    : [];

  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  function changeBooking(key: string, value: string) {
    setBooking((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function openBooking() {
    if (!session?.user) {
      toast.error("Please login to book this studio");
      router.push("/login");
      return;
    }

    setBookingOpen(true);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (booking.endTime <= booking.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setBookingBusy(true);

    try {
      await createBooking({
        studioId: id,
        guestName: session.user.name,
        guestEmail: session.user.email,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });

      toast.success("Booking request submitted!");
      setBookingOpen(false);
      setBooking({
        date: "",
        startTime: "",
        endTime: "",
      });

      router.push("/my-bookings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Booking failed"
      );
    } finally {
      setBookingBusy(false);
    }
  }

  return (
    <div className="container section">
      <Link
        href="/studios"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-green-700"
      >
        <ArrowLeft size={17} />
        Back to Studios
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Gallery Carousel */}
        <section className="relative">
          <img
            src={images[activeImage] || studio.image}
            alt={studio.title}
            className="h-72 w-full object-cover sm:h-96"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImage(
                    (activeImage - 1 + images.length) % images.length
                  )
                }
                className="absolute left-3 top-1/2 rounded-full bg-white/90 p-2 shadow"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveImage((activeImage + 1) % images.length)
                }
                className="absolute right-3 top-1/2 rounded-full bg-white/90 p-2 shadow"
                aria-label="Next image"
              >
                <ChevronRight />
              </button>

              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {activeImage + 1} / {images.length}
              </span>
            </>
          )}
        </section>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto p-4">
            {images.map((image, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setActiveImage(index)}
                className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                  activeImage === index
                    ? "border-green-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-16 w-24 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="p-5 sm:p-8">
          <span className="badge">{studio.category}</span>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            {studio.title}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            {studio.location}
          </p>

          {/* Studio Information */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card p-4">
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p className="mt-1 text-2xl font-black text-green-700">
                ${studio.hourlyRate}
              </p>
            </div>

            <div className="card p-4">
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="mt-1 flex items-center gap-2 text-xl font-bold">
                <Users size={18} />
                {studio.maxCapacity || "N/A"} People
              </p>
            </div>

            <div className="card p-4">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="mt-1 flex items-center gap-2 text-xl font-bold">
                <Star className="fill-amber-400 text-amber-500" />
                {studio.rating || "New"}
                <span className="text-sm text-gray-500">
                  ({studio.reviewsCount || 0} reviews)
                </span>
              </p>
            </div>
          </div>

          {/* Overview */}
          <section className="mt-8">
            <h2 className="text-xl font-black">About This Studio</h2>
            <p className="mt-3 leading-7 text-gray-600">
              {studio.overview}
            </p>
          </section>

          {/* Amenities */}
          <section className="mt-8">
            <h2 className="text-xl font-black">
              Amenities & Facilities
            </h2>

            {amenities.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {amenities.map((item, index) => (
                  <p
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-green-600"
                    />
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-gray-500">
                No amenities listed.
              </p>
            )}
          </section>

          {/* Host Details */}
          <section className="mt-8 rounded-xl border border-green-100 bg-lime-50 p-5">
            <h2 className="text-xl font-black">Hosted By</h2>

            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3 text-green-700">
                <User size={24} />
              </div>

              <div>
                <p className="font-bold">
                  {details.ownerName || "Studio Host"}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={15} />
                  {details.ownerEmail || "Host contact unavailable"}
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-8">
            <h2 className="text-xl font-black">Guest Reviews</h2>

            {reviews.length > 0 ? (
              <div className="mt-4 grid gap-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold">
                        {review.name || "Guest"}
                      </p>

                      <p className="flex items-center gap-1 text-amber-500">
                        <Star size={16} className="fill-amber-400" />
                        {review.rating || 5}
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {review.comment || "No review comment."}
                    </p>

                    {review.date && (
                      <p className="mt-2 text-xs text-gray-400">
                        {review.date}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-gray-50 p-6 text-center">
                <Star className="mx-auto text-amber-400" size={28} />
                <p className="mt-2 font-bold">No reviews yet</p>
                <p className="mt-1 text-sm text-gray-500">
                  Guest reviews will appear here.
                </p>
              </div>
            )}
          </section>

          {/* Security Deposit */}
          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500">
              Security Deposit
            </p>
            <p className="mt-1 text-xl font-bold">
              ${studio.securityDeposit || 0}
            </p>
          </div>

          <button
            type="button"
            onClick={openBooking}
            className="btn btn-primary mt-6 w-full sm:w-auto"
          >
            <Clock size={17} />
            Book This Studio
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Reserve your workspace</p>
                <h2
                  id="booking-modal-title"
                  className="mt-1 text-2xl font-black"
                >
                  Book This Studio
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setBookingOpen(false)}
                disabled={bookingBusy}
                className="rounded-full bg-gray-100 p-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close booking modal"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {studio.title}
            </p>

            <form
              onSubmit={submitBooking}
              className="mt-5 grid gap-4"
            >
              <label className="text-sm font-bold">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Booking Date
                </span>
                <input
                  type="date"
                  className="input mt-2"
                  min={localToday}
                  value={booking.date}
                  onChange={(e) =>
                    changeBooking("date", e.target.value)
                  }
                  required
                />
              </label>

              <label className="text-sm font-bold">
                Start Time
                <input
                  type="time"
                  className="input mt-2"
                  value={booking.startTime}
                  onChange={(e) =>
                    changeBooking("startTime", e.target.value)
                  }
                  required
                />
              </label>

              <label className="text-sm font-bold">
                End Time
                <input
                  type="time"
                  className="input mt-2"
                  value={booking.endTime}
                  onChange={(e) =>
                    changeBooking("endTime", e.target.value)
                  }
                  required
                />
              </label>

              <div className="rounded-xl bg-lime-50 p-4">
                <p className="text-sm text-gray-600">
                  Hourly Rate
                </p>
                <p className="text-xl font-black text-green-700">
                  ${studio.hourlyRate} / hour
                </p>
              </div>

              <button
                type="submit"
                disabled={bookingBusy}
                className="btn btn-primary w-full"
              >
                {bookingBusy
                  ? "Submitting..."
                  : "Confirm Booking Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
