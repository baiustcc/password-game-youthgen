import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Password Game Challenge - BAIUST Computer Club",
  description: "Complete the password challenge and test your skills! By BAIUST Computer Club",
  keywords: "password game, challenge, BAIUST, computer club",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sketch">{children}</body>
    </html>
  );
}
