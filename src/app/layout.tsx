import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { contents } from "@contents";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: contents.site.name,
    template: contents.site.titleTemplate,
  },
  description: contents.site.description,
  keywords: [...contents.site.keywords],
  openGraph: contents.site.openGraph,
  twitter: contents.site.twitter,
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`h-full ${bricolage.variable} ${fraunces.variable} ${outfit.variable}`}
    >
      <body className="min-h-full antialiased bg-evergreen text-parchment">
        {children}
      </body>
    </html>
  );
}
