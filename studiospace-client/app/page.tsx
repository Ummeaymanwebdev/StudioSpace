
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  Mic2,
  Music,
  Palette,
  Search,
  CalendarDays,
  CheckCircle2,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import StudioGrid from "@/components/StudioGrid";
import { getStudios } from "@/lib/api";

const categories = [
  ["Photo Studios", Camera, "from-yellow-100"],
  ["Film Stages", Clapperboard, "from-green-100"],
  ["Podcast Rooms", Mic2, "from-blue-100"],
  ["Music Suites", Music, "from-lime-100"],
  ["Art Workshops", Palette, "from-emerald-100"],
];

export default async function Home() {
  let studios: any[] = [];

  try {
    studios = (await getStudios()).slice(0, 6);
  } catch {}

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fbfbdc] via-[#f3f7d2] to-[#e7f2c9]">
        <div className="container grid min-h-[430px] items-center gap-8 py-10 md:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="eyebrow">A space for every big idea</p>

            <h1 className="mt-3 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Find the Perfect{" "}
              <span className="text-green-700">Creative</span> Space
            </h1>

            <p className="mt-5 max-w-lg text-lg text-gray-700">
              Book professional studios for your next project — from
              photography to podcasting and more.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href="/studios">
                Explore Studios <ArrowRight size={17} />
              </Link>

              <Link className="btn btn-outline" href="/add-studio">
                Host Your Space
              </Link>
            </div>

            <div className="mt-6 flex gap-2">
              <i className="h-2.5 w-2.5 rounded-full bg-green-700" />
              <i className="h-2.5 w-2.5 rounded-full bg-green-200" />
              <i className="h-2.5 w-2.5 rounded-full bg-green-200" />
            </div>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-[28px] shadow-xl md:h-[360px]">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
              alt="Bright creative photography studio"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="eyebrow">Handpicked spaces</p>
            <h2 className="section-title mt-1">Featured Studios</h2>
          </div>

          <Link className="font-bold text-green-700" href="/studios">
            See all studios →
          </Link>
        </div>

        {studios.length ? (
          <StudioGrid studios={studios} />
        ) : (
          <div className="card p-10 text-center">
            <h3 className="text-xl font-bold">Studios are getting ready</h3>

            <p className="mt-2 text-gray-600">
              Start by exploring the sample listings after running the server
              seed command.
            </p>

            <Link className="btn btn-primary mt-4" href="/studios">
              Explore Studios
            </Link>
          </div>
        )}
      </section>

      <section className="section container">
        <p className="eyebrow">Find your creative corner</p>

        <h2 className="section-title mt-1">
          Browse by Studio Categories
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(([label, Icon, bg]: any) => (
            <Link
              key={label}
              href={`/studios?category=${encodeURIComponent(
                label.replace("s", "")
              )}`}
              className={`flex items-center justify-between rounded-2xl border border-green-900/5 bg-gradient-to-r ${bg} to-white p-5 font-bold shadow-sm`}
            >
              <span className="flex items-center gap-3">
                <Icon className="text-green-800" />
                {label}
              </span>

              <ArrowRight className="text-green-700" />
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="section container">
        <p className="eyebrow">Simple from start to finish</p>

        <h2 className="section-title mt-1">How Booking Works</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Search, "Discover Spaces", "Browse a wide range of studios."],
            [CalendarDays, "Select Shoot Hours", "Choose your preferred time."],
            [CheckCircle2, "Book Instantly", "Confirm your booking securely."],
            [Rocket, "Create & Produce", "Bring your vision to life."],
          ].map(([Icon, title, desc]: any, i) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl bg-white/70 p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-700 font-bold text-white">
                {i + 1}
              </span>

              <Icon className="mt-1 text-green-800" />

              <div>
                <b>{title}</b>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="container mb-10 flex flex-col items-start gap-4 rounded-3xl bg-[#e8f3c8] p-6 sm:flex-row sm:items-center"
      >
        <ShieldCheck className="h-12 w-12 shrink-0 text-green-800" />

        <div className="flex-1">
          <h2 className="text-xl font-black">
            Host Guarantee & Creator Support
          </h2>

          <p className="text-sm text-gray-700">
            Your safety and creativity are our priority. Enjoy liability
            protection, verified profiles, equipment safety and helpful host
            support.
          </p>
        </div>

        <Link href="/studios" className="btn btn-primary">
          Learn More <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
