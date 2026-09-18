import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Figtree, Fraunces, IBM_Plex_Mono, Inter, Sora } from "next/font/google";
import { ClarityScript } from "@/components/clarity";
import { AppProviders } from "@/components/providers";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cairose",
  description:
    "No reemplazamos tu web. Cairose añade suscripciones y gift bajo tu marca. Nosotras no vendemos el ramo.",
  icons: { icon: "/cairose-mark.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sora.variable} ${inter.variable} ${fraunces.variable} ${figtree.variable} ${plexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body
        className="flex min-h-full flex-col"
        style={
          {
            "--cao-font-display": "var(--font-sora), system-ui, sans-serif",
            "--cao-font-body": "var(--font-inter), system-ui, sans-serif",
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
