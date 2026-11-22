
import type { Studio } from "@/lib/types";
import StudioCard from "./StudioCard";

export default function StudioGrid({ studios }: { studios: Studio[] }) {
  if (studios.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-bold text-gray-800">
          No studios found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Please check back later for available studios.
        </p>
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {studios.map((studio) => (
        <StudioCard key={studio._id} studio={studio} />
      ))}
    </div>
  );
}
