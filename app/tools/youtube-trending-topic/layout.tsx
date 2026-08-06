import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Trending Topic Finder — Find Viral Video Ideas Free | DevLpers',
  description: 'Discover trending YouTube topics and viral video ideas before they peak. Find what your niche audience is searching for right now. Free, no signup.',
  keywords: 'youtube trending topic finder, youtube trending topics, viral video ideas, youtube trend finder free, what to make video about, youtube content ideas generator',
  alternates: { canonical: 'https://www.develpers.com/tools/youtube-trending-topic' },
  openGraph: {
    title: 'YouTube Trending Topic Finder — Free Viral Video Ideas',
    description: 'Find trending YouTube topics before they peak. Free and instant.',
    url: 'https://www.develpers.com/tools/youtube-trending-topic',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}