import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.develpers.com'),
  title: 'DevLpers — The Global Developer Marketplace',
  description: 'Hire top developers or get hired on DevLpers. Post jobs, submit proposals, and work with the best global talent. The future of developer hiring is here.',
  keywords: 'hire developers, freelance developers, developer marketplace, ...',
  openGraph: {
    title: 'DevLpers — The Global Developer Marketplace',
    description: 'Hire top developers or get hired. Post jobs, submit proposals, and work with the best talent worldwide.',
    url: 'https://www.develpers.com',
    siteName: 'DevLpers',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevLpers — The Global Developer Marketplace',
    description: 'Hire top developers or get hired on DevLpers.',
    site: '@devlpers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.develpers.com',
  },
  verification: {
    google: 'Zugs9Aqmh_Y-u0QTBAujd5loH2jT7TgSd0xPiKjYl7Y',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6c63ff" />
        <link rel="icon" href="/favicon.ico" />
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://www.develpers.com/#website",
                  "url": "https://www.develpers.com",
                  "name": "DevLpers",
                  "description": "The Global Developer Marketplace",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://www.develpers.com/jobs?search={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.develpers.com/#organization",
                  "name": "DevLpers",
                  "url": "https://www.develpers.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.develpers.com/logo.png"
                  },
                  "sameAs": [
                    "https://twitter.com/devlpers",
                    "https://linkedin.com/company/devlpers",
                    "https://github.com/groweb10x/DevLpers-"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "url": "https://www.develpers.com/support"
                  }
                },
                {
                  "@type": "MarketPlace",
                  "@id": "https://www.develpers.com/#marketplace",
                  "name": "DevLpers Marketplace",
                  "url": "https://www.develpers.com",
                  "description": "Global marketplace for hiring top developers and finding freelance work",
                  "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "USD",
                    "lowPrice": "0",
                    "offerCount": "12000"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}