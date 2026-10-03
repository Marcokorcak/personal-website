import type { Metadata } from "next";
import { sitePath } from "@/lib/site-path";
import "./globals.css";
export const metadata: Metadata = {
  title: "Marco Korcak — Full-Stack Engineering & Applied AI",
  description: "Marco Korcak is a software engineer building full-stack applications and applied AI systems. Explore professional experience, production contributions, and engineering approach.",
  icons: { icon: sitePath("/favicon.svg"), shortcut: sitePath("/favicon.svg") },
  openGraph: { title: "Marco Korcak — Software Engineer", description: "Full-stack engineering and applied AI. Thoughtful software for complex business workflows.", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}
