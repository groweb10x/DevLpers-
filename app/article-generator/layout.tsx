import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Article Generator — Better Than Competitor Content | DevLpers',
  description: 'Generate high-quality articles from any competitor content using AI. Supports Urdu, English, Arabic and 8+ languages. Free, no signup, powered by Llama 3.',
  keywords: 'ai article generator, article rewriter, competitor article rewriter, urdu article generator, content generator ai, free article writer, seo article generator, llama ai writer',
  alternates: { canonical: 'https://www.develpers.com//article-generator' },
  openGraph: {
    title: 'Free AI Article Generator — Better Than Competitor Content',
    description: 'Generate advanced articles from competitor content in seconds. Free, supports 8+ languages.',
    url: 'https://www.develpers.com//article-generator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}