import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Meta Tag Generator — SEO Meta Tags Online | DevLpers',
  description: 'Generate complete HTML meta tags for SEO, Open Graph and Twitter Cards instantly. Free meta tag generator with live preview and character counter. No signup.',
  keywords: 'meta tag generator, seo meta tags, open graph generator, twitter card generator, html meta tags, meta description generator, free meta tag tool',
  alternates: { canonical: 'https://www.develpers.com/meta-tag-generator' },
  openGraph: {
    title: 'Free Meta Tag Generator — SEO Meta Tags Online',
    description: 'Generate complete HTML meta tags for SEO instantly. Free, no signup.',
    url: 'https://www.develpers.com/meta-tag-generator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}