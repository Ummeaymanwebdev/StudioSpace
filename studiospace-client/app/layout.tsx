import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
export const metadata: Metadata = { title: "StudioSpace | Find your creative space", description: "Book professional creative studios." };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body><Navbar/><main className="min-h-[65vh]">{children}</main><Footer/><Toaster richColors position="top-right"/></body></html>;
}
