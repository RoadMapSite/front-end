import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ReactNode } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "로드맵",
  description: "입시관리형 독서실 로드맵",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
