import type { Metadata, Viewport } from "next";
import { Archivo, Cormorant_Garamond } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ImpressionTracker } from "@/components/impression-tracker";
import { SessionIntro } from "@/components/session-intro";
import { getViewer } from "@/lib/data";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "K-VERSATION — Korea, in conversation with the world",
    template: "%s — K-VERSATION",
  },
  description:
    "K-VERSATION explores Korea through original conversations, dispatches, culture, history, and the people shaping what comes next.",
  applicationName: "K-VERSATION",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "K-VERSATION",
    title: "K-VERSATION — Korea, in conversation with the world",
    description:
      "Original films and stories connecting Korea with people around the world.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-VERSATION",
    description:
      "Original films and stories connecting Korea with people around the world.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2efe8",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer();
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SessionIntro />
        <Header viewer={viewer} />
        <ImpressionTracker />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
