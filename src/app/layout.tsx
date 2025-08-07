import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StationByte - Innovative Software Solutions",
  description: "StationByte creates powerful, user-friendly software that helps businesses streamline operations and boost productivity.",
  keywords: "SaaS, software, business solutions, time tracking, EazyClock, productivity",
  authors: [{ name: "StationByte LLC" }],
  themeColor: "#4361ee",
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: {
      url: "/logo-full.png",
      sizes: "180x180",
    },
    shortcut: "/favicon.ico",
  },
  other: {
    "msapplication-TileColor": "#4361ee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
