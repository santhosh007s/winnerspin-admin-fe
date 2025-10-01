import type React from "react";
import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
import "./globals.css";
import { ReduxProvider } from "@/components/redux-provider";

export const metadata: Metadata = {
  title: "Winnerspin Admin Panel",
  description: "Admin Panel for promoter-customer system",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
