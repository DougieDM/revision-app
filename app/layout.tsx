import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Readispark",
  description: "Prepare for your next science test with revision notes, focused practice and a personal readiness dashboard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
