import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Fakestagram",
  description: "Instagram clone — teaching project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Toaster richColors position="top-right" />
        <Sidebar />

        <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
        
      </body>
    </html>
  );
}
