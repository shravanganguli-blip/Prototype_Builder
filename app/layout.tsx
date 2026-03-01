import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creditas Journey Builder",
  description: "Build and share interactive bank customer journey prototypes in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
