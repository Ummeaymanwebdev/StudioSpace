
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  UserCircle,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending, refetch } = authClient.useSession();

  const user = session?.user;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how" },
    { name: "About Us", href: "/#about" },
  ];

  const linkStyle = (href: string) =>
    `transition hover:text-green-700 ${
      pathname === href
        ? "font-extrabold text-green-700"
        : "font-bold text-gray-700"
    }`;

async function updateProfileImage() {
  const { error } = await authClient.updateUser({
    image: "/profile.jpg",
  });

  if (error) {
    toast.error(error.message);
    return;
  }

  await refetch();
  toast.success("Profile image updated!");
  setProfileOpen(false);
}

  async function handleLogout() {
    try {
      await authClient.signOut();
      setProfileOpen(false);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/10 bg-[#fffef0]/95 backdrop-blur">
      <div className="container flex h-[70px] items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-tight"
        >
          <Aperture className="h-9 w-9 text-green-700" />
          <span>
            Studio<span className="text-green-700">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkStyle(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {isPending ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-green-900/15 px-3 py-2 font-semibold text-gray-800 hover:bg-green-50"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-8 w-8 text-green-700" />
                )}

                <span className="max-w-[120px] truncate">
                  {user.name || "My Account"}
                </span>

                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-green-900/10 bg-[#fffef0] p-2 shadow-xl">
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-100"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/add-studio"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-100"
                  >
                    <PlusCircle size={18} />
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-listings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-100"
                  >
                    <Building2 size={18} />
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-green-100"
                  >
                    <CalendarDays size={18} />
                    My Bookings
                  </Link>

                   <button onClick={updateProfileImage}
                   className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-green-100">
                  <UserCircle size={18} />
                   Update Profile Photo
                     </button>
                     
                  <div className="my-2 border-t border-green-900/10" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="btn btn-outline" href="/login">
                Login
              </Link>
              <Link className="btn btn-primary" href="/register">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="container flex flex-col gap-3 border-t border-green-900/10 pb-4 pt-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={linkStyle(link.href)}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-green-900/10 pt-3" />

          {isPending ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : user ? (
            <>
              <p className="font-semibold text-green-800">
                {user.name || user.email}
              </p>

              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="/add-studio" onClick={() => setOpen(false)}>
                Add New Studio
              </Link>
              <Link href="/my-listings" onClick={() => setOpen(false)}>
                My Studio Listings
              </Link>
              <Link href="/my-bookings" onClick={() => setOpen(false)}>
                My Bookings
              </Link>
               
              <button
                onClick={handleLogout}
                className="text-left font-semibold text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
