import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Password Game Challenge - BAIUST Computer Club",
  description: "Complete the password challenge and win 3 VIP tickets to YouthGEN Event! By BAIUST Computer Club × TECHious",
  keywords: "password game, challenge, BAIUST, computer club, TECHious, YouthGEN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-comic">{children}</body>
    </html>
  );
}
