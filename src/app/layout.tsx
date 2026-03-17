import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoDev — Local Developer Knowledge Copilot",
  description:
    "Understand your codebase and generate technical content entirely on-device.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-stone-950 text-stone-100">
        {children}
      </body>
    </html>
  );
}
