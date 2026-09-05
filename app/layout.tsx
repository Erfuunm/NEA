import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unknown ✨ ",
  description: "an invitation for Unknown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#03040a] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
