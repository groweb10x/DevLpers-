import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devlpers Backlink Indexer — Index 1000s of URLs Instantly | developers.com",
  description:
    "The fastest backlink indexer tool online. Submit your URLs and backlinks to Google index using Ping, RSS, and GSC signals. Free 3 URLs/day. Pro plans from $5/month.",
  keywords: [
    "backlink indexer",
    "fast url indexer",
    "google index backlinks",
    "index backlinks fast",
    "seo indexer tool",
    "instant backlink indexer",
    "url indexer online",
    "free backlink indexer",
    "index urls google",
    "bulk url indexer",
  ],
  authors: [{ name: "developers.com" }],
  creator: "developers.com",
  publisher: "developers.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developers.com/tools/backlink-indexer",
    siteName: "developers.com",
    title: "Devlpers Backlink Indexer — Index URLs Instantly",
    description:
      "Submit your backlinks and URLs to Google index in minutes. Ping + RSS + GSC signals combined. Free plan available. Pro from $5/month.",
    images: [
      {
        url: "https://developers.com/og/backlink-indexer.png",
        width: 1200,
        height: 630,
        alt: "Devlpers Backlink Indexer Tool — developers.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devlpers Backlink Indexer — Index 1000s of URLs Instantly",
    description:
      "The fastest backlink indexer. Free 3 URLs/day. Pro plans from $5/month. Submit backlinks to Google instantly.",
    images: ["https://developers.com/og/backlink-indexer.png"],
    creator: "@developerscom",
  },
  alternates: {
    canonical: "https://developers.com/tools/backlink-indexer",
  },
  category: "technology",
};

export default function IndexerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Devlpers Backlink Indexer",
            applicationCategory: "SEOApplication",
            operatingSystem: "Web",
            url: "https://developers.com/tools/backlink-indexer",
            description:
              "Fast backlink and URL indexer tool. Submits URLs to Google using Ping, RSS, and GSC signals for rapid indexing.",
            offers: [
              {
                "@type": "Offer",
                name: "Free Plan",
                price: "0",
                priceCurrency: "USD",
                description: "3 URLs per day, free forever",
              },
              {
                "@type": "Offer",
                name: "Starter Plan",
                price: "5",
                priceCurrency: "USD",
                description: "100 links per month",
              },
              {
                "@type": "Offer",
                name: "Pro Plan",
                price: "10",
                priceCurrency: "USD",
                description: "500 links per month",
              },
              {
                "@type": "Offer",
                name: "Agency Plan",
                price: "20",
                priceCurrency: "USD",
                description: "2000 links per month",
              },
            ],
            provider: {
              "@type": "Organization",
              name: "developers.com",
              url: "https://developers.com",
            },
          }),
        }}
      />
      {children}
    </>
  );
}