import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free DA PA Checker — Domain Authority Page Authority Tool | DevLpers',
  description: 'Check Domain Authority (DA) and Page Authority (PA) of any website free. Real data from Wayback Machine and Common Crawl. No signup required.',
  keywords: 'da pa checker, domain authority checker, page authority checker, free da checker, moz da pa, domain authority tool, check domain authority online',
  alternates: { canonical: 'https://www.develpers.com/tools/da-pa-checker' },
  openGraph: {
    title: 'Free DA PA Checker — Domain Authority Tool',
    description: 'Check DA and PA of any domain instantly using real public data.',
    url: 'https://www.develpers.com/tools/da-pa-checker',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}