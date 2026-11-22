
import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#063b20] text-white">
      <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-black">
            <Aperture className="text-lime-400" />
            StudioSpace
          </div>
          <p className="mt-3 text-sm text-green-100">
            Share spaces. Create more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <b>Quick Links</b>
          <div className="mt-3 flex flex-col gap-2 text-sm text-green-100">
            <Link href="/">Home</Link>
            <Link href="/studios">Explore Studios</Link>
            <a href="/#how">How It Works</a>
            <a href="/#about">About Us</a>
          </div>
        </div>

        {/* Popular Categories */}
        <div>
          <b>Popular Categories</b>
          <div className="mt-3 flex flex-col gap-2 text-sm text-green-100">
            <Link href="/studios?category=Photo%20Studio">Photo Studios</Link>
            <Link href="/studios?category=Film%20Stage">Film Stages</Link>
            <Link href="/studios?category=Podcast%20Lounge">Podcast Rooms</Link>
            <Link href="/studios?category=Music%20Suite">Music Suites</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <b>Newsletter</b>
          <p className="mt-3 text-sm text-green-100">
            Get the latest studios and offers.
          </p>

          <form className="mt-3 flex">
            <input
              type="email"
              className="min-w-0 w-full rounded-l-full px-3 py-2 text-sm text-gray-900 outline-none"
              placeholder="Enter your email"
            />
            <button
              type="button"
              className="rounded-r-full bg-lime-500 px-4 text-sm font-bold text-green-950"
            >
              Join
            </button>
          </form>
        </div>

        {/* Follow Us */}
        <div>
          <b>Follow Us</b>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-green-100">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              𝕏
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20 px-4 py-4 text-center text-xs text-green-100">
        © 2026 StudioSpace. All rights reserved. · Terms & Conditions · Privacy Policy
      </div>
    </footer>
  );
}
