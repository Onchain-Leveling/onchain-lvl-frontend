import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FarcasterProvider } from "../components/FarcasterProvider";
import { Web3Provider } from "../components/Web3Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onchain Leveling",
  description: "Level up your onchain experience through real-world activities",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"),
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: "Onchain Leveling",
    description: "Level up your onchain experience through real-world activities",
    images: ["/api/og"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/api/og",
    "fc:frame:button:1": "Start Quest",
    "fc:frame:post_url": "/api/frame",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Web3Provider>
          <FarcasterProvider>
            {children}
          </FarcasterProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
