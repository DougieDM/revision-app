import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revisionary",
  description: "A supportive Year 7 and Year 8 science revision quiz app."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
