import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator — Calculate % Increase, Decrease & More | DevLpers',
  description: 'Free online percentage calculator. Find percentage of a number, percentage increase or decrease, and percentage difference instantly. No signup required.',
  keywords: 'percentage calculator, percentage calculator online, percentage increase calculator, percentage decrease calculator, find percentage of a number, percentage difference calculator',
  alternates: { canonical: 'https://www.develpers.com/tools/percentage-calculator' },
  openGraph: {
    title: 'Free Percentage Calculator Online',
    description: 'Calculate percentage increase, decrease and difference instantly. Free and simple.',
    url: 'https://www.develpers.com/tools/percentage-calculator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}