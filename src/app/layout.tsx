import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { contents } from "@contents";
import { SITE_URL } from "@shared/config/site";
import Script from "next/dist/client/script";

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

const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: contents.site.openGraph.description,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: contents.site.name,
    template: contents.site.titleTemplate,
  },
  description: contents.site.description,
  keywords: [...contents.site.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...contents.site.openGraph,
    url: "/",
    locale: "en_NG",
    images: [OG_IMAGE],
  },
  twitter: {
    ...contents.site.twitter,
    title: contents.site.openGraph.title,
    description: contents.site.openGraph.description,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  applicationName: contents.site.name,
  appleWebApp: {
    capable: true,
    title: contents.site.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  category: "nonprofit",
};

export const viewport: Viewport = {
  themeColor: "#0d4a3e",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": `${SITE_URL}/#organization`,
      name: contents.site.name,
      url: SITE_URL,
      description: contents.site.description,
      email: contents.site.contact.foundationEmail,
      logo: `${SITE_URL}/icon.svg`,
      image: `${SITE_URL}/og.jpg`,
      foundingLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: contents.site.address.city,
          addressRegion: contents.site.address.state,
          addressCountry: "NG",
        },
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: contents.site.address.city,
        addressRegion: contents.site.address.state,
        addressCountry: "NG",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: contents.site.name,
      description: contents.site.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
      </body>
    </html>
  );
}
