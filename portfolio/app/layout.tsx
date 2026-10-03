import type { Metadata } from "next";
import { sitePath } from "@/lib/site-path";
import "./globals.css";
const portfolioUrl = "https://marcokorcak.github.io/personal-website/";
const socialImage = {
  url: `${portfolioUrl}images/social-preview.png`,
  width: 1200,
  height: 630,
  alt: "Marco Korcak — Software Engineer. Full-stack engineering and applied AI, with the editorial MK mark and an amber-lit workstation.",
};
export const metadata: Metadata = {
  metadataBase: new URL(portfolioUrl),
  title: "Marco Korcak — Full-Stack Engineering & Applied AI",
  description: "Marco Korcak is a software engineer building full-stack applications and applied AI systems. Explore professional experience, production contributions, and engineering approach.",
  alternates: { canonical: portfolioUrl },
  icons: {
    icon: [{ url: sitePath("/favicon.svg"), type: "image/svg+xml" }, { url: sitePath("/favicon-32.png"), type: "image/png", sizes: "32x32" }],
    shortcut: sitePath("/favicon.svg"),
    apple: { url: sitePath("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" },
  },
  openGraph: { title: "Marco Korcak — Software Engineer", description: "Full-stack engineering and applied AI. Thoughtful software for complex business workflows.", type: "website", siteName: "Marco Korcak", url: portfolioUrl, images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Marco Korcak — Software Engineer", description: "Full-stack engineering and applied AI. Thoughtful software for complex business workflows.", images: [socialImage] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}
