import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Spam Score Checker — Domain Safety Analysis | DevLpers',
  description: 'Check spam score of any domain free. Analyze TLD, domain age, patterns and crawl data to identify spammy websites. No signup required.',
  keywords: 'spam score checker, domain spam score, moz spam score, check domain spam, website spam checker, domain safety checker, free spam score tool',
  alternates: { canonical: 'https://develpers.com/spam-score-checker' },
  openGraph: {
    title: 'Free Spam Score Checker — Domain Safety Analysis',
    description: 'Check if a domain is spammy or safe using real public data signals.',
    url: 'https://develpers.com/spam-score-checker',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}