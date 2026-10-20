import type { Metadata, Viewport } from "next";
import { Courier_Prime, Mona_Sans } from "next/font/google";

import { Providers } from "@/components/site/providers";

import "./globals.css";

const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const title = "shotlist - Production planning, simplified.";
const description =
  "A screenplay editor and a shot list that actually talk to each other. Every shot is pinned to its scene, so rewrites never break your plan. Open source and self-hosted.";

export const metadata: Metadata = {
  metadataBase: new URL("https://shotlist.video"),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "shotlist",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mona.variable} ${courier.variable}`}>
      <body className="min-h-full overflow-x-clip">
        <Providers>{children}</Providers>
        <div
          aria-hidden
          className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.07] mix-blend-overlay"
        />
      </body>
    </html>
  );
}
