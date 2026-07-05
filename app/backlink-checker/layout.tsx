import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Backlink Checker — Find 100-200 Real Backlinks Online | DevLpers',
  description: 'Check backlinks and referring domains of any website free using Common Crawl public data. See 100-200+ real backlinks instantly. No signup, no API needed.',
  keywords: 'backlink checker, free backlink checker, check backlinks online, referring domains checker, website backlinks, backlink analysis tool, free backlink tool',
  alternates: { canonical: 'https://develpers.com/backlink-checker' },
  openGraph: {
    title: 'Free Backlink Checker — Find Real Backlinks Online',
    description: 'Check 100-200+ real backlinks for any domain using Common Crawl. Free, no signup.',
    url: 'https://develpers.com/backlink-checker',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}