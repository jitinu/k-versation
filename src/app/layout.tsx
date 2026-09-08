import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import { siteConfig } from "@/lib/site";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-grotesk",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${display.variable}`}>
      <body className="bg-canvas text-ink">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
