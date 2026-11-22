
import Link from "next/link";
import type { Studio } from "@/lib/types";
import { MapPin, Star, ArrowUpRight } from "lucide-react";

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="card group">
      <Link
        href={`/studios/${studio._id}`}
        className="relative block h-52 overflow-hidden"
      >
        <img
          src={studio.image || "https://picsum.photos/seed/studio/900/600"}
          alt={studio.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="badge absolute left-3 top-3">
          {studio.category}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold">
          <Star className="mr-1 inline h-3 w-3 fill-amber-400 text-amber-500" />
          {studio.rating || "New"} ({studio.reviewsCount || 0})
        </span>
      </Link>

      <div className="p-4">
        <h3 className="font-extrabold">{studio.title}</h3>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p>
            <b className="text-lg text-green-700">${studio.hourlyRate}</b>
            <span className="text-sm text-gray-500"> / hr</span>
          </p>

          <span className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin size={13} />
            {studio.location}
          </span>
        </div>

        <Link
          className="btn btn-primary mt-3 w-full"
          href={`/studios/${studio._id}`}
        >
          View Details <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
