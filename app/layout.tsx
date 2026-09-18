import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Figtree, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ClarityScript } from "@/components/clarity";
import { AppProviders } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cairose",
  description:
    "Plataforma white-label para floristerías. Cairose no vende flores.",
  icons: { icon: "/cairose-mark.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${figtree.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={
          {
            "--cao-font-display": "var(--font-fraunces), Georgia, serif",
            "--cao-font-body": "var(--font-figtree), system-ui, sans-serif",
            "--cao-font-mono": "var(--font-plex-mono), ui-monospace, monospace",
          } as CSSProperties
        }
      >
        <ClarityScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
