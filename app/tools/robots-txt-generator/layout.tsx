import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Robots.txt Generator — Block AI Bots & Control Crawling | DevLpers',
  description: 'Generate a perfect robots.txt file free. Block AI bots like GPTBot, control search engine crawling, add sitemap URL. Download ready in seconds. No signup.',
  keywords: 'robots txt generator, robots.txt generator, block ai bots, block gptbot, robots txt file, crawl control, seo robots generator, free robots txt tool',
  alternates: { canonical: 'https://www.develpers.com/tools/robots-txt-generator' },
  openGraph: {
    title: 'Free Robots.txt Generator — Block AI Bots & Control Crawling',
    description: 'Generate robots.txt instantly. Block AI bots, control crawling. Free download.',
    url: 'https://www.develpers.com/tools/robots-txt-generator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}