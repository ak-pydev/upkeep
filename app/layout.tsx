import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Upkeep | Instant answers from machine PDFs",
  description:
    "Upload a machine PDF, ask a question in plain language, and get a source-backed answer with likely parts and a saved fix."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
