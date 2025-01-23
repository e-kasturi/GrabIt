import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TheBar from "@/components/TheBar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GrabIt",
  description: "Shopping",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TheBar>
          <div className="min-h-screen flex flex-col">
            <main className=" flex-1 p-0 m-0">{children}</main>
          </div>
            <Footer />
        </TheBar>
      </body>
    </html>
  );
}
