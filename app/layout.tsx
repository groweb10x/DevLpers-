import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://develpers.com'),
  title: {
    default: 'DevLpers — Hire Top Developers | Global Freelance Marketplace',
    template: '%s | DevLpers',
  },
  description: 'DevLpers is a global developer marketplace. Hire verified developers or find remote jobs. Post projects, submit proposals, use 21+ free tools and 12 AI agents. Free to join.',
  keywords: [
    'hire developers', 'freelance developers', 'remote developer jobs',
    'developer marketplace', 'hire react developer', 'hire python developer',
    'freelance programmer', 'web developer for hire', 'devlpers',
    'hire flutter developer', 'hire nodejs developer', 'freelance marketplace pakistan',
    'ai tools for developers', 'free developer tools', 'code reviewer ai',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://develpers.com',
    siteName: 'DevLpers',
    title: 'DevLpers — Global Developer Marketplace',
    description: 'Hire verified developers or find remote jobs. Free tools, AI agents, escrow payments.',
    images: [{ url: 'https://develpers.com/og-image.png', width: 1200, height: 630, alt: 'DevLpers — Global Developer Marketplace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevLpers — Global Developer Marketplace',
    description: 'Hire developers or find jobs. 21+ free tools + 12 AI agents.',
    site: '@devlpers',
    images: ['https://develpers.com/og-image.png'],
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
    canonical: 'https://develpers.com',
  },
  verification: {
    google: 'Zugs9Aqmh_Y-u0QTBAujd5loH2jT7TgSd0xPiKjYl7Y',
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://develpers.com/#website",
      "url": "https://develpers.com",
      "name": "DevLpers",
      "description": "Global Developer Marketplace — Hire top developers or get hired worldwide",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://develpers.com/jobs?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://develpers.com/#organization",
      "name": "DevLpers",
      "url": "https://develpers.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://develpers.com/logo.png"
      },
      "sameAs": [
        "https://twitter.com/devlpers",
        "https://linkedin.com/company/devlpers",
        "https://github.com/groweb10x/DevLpers-"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": "https://develpers.com/support"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://develpers.com/#webapp",
      "name": "DevLpers",
      "url": "https://develpers.com",
      "applicationCategory": "BusinessApplication",
      "description": "Global marketplace for hiring top developers and finding freelance work",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "0",
        "offerCount": "500"
      },
      "featureList": [
        "Developer Hiring",
        "Freelance Jobs",
        "Escrow Payments",
        "AI Agents",
        "Free Developer Tools",
        "Real-time Chat",
        "Contract Management"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I hire a developer on DevLpers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Post a job for free, receive proposals from verified developers, chat directly, and pay securely through our escrow system."
          }
        },
        {
          "@type": "Question",
          "name": "Is DevLpers free to join?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Creating an account is 100% free for both developers and clients. We only charge a small 10% commission on successful projects."
          }
        },
        {
          "@type": "Question",
          "name": "How does the escrow payment system work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When you accept a developer's proposal, you deposit funds into escrow. The funds are held safely and released to the developer only after you approve the completed work."
          }
        },
        {
          "@type": "Question",
          "name": "What free tools does DevLpers offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DevLpers offers 21+ free developer tools including image converter, invoice generator, SEO tools, and 12 AI agents powered by Llama 3 AI."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        {/* Viewport + Theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1dbf73" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}