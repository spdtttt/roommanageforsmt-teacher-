import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "สำหรับคุณครู",
  description: "สำหรับคุณครู โรงเรียนเมืองสุราษฎร์ธานี",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Mitr:wght@200;300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`flex ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto pl-35 md:pl-10 lg:pl-20 pr-2.5 md:pr-5">
          {children}
        </main>
      </body>
    </html>
  );
}
