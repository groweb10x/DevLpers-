import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Unit Converter — Length, Weight, Temperature & More | DevLpers',
  description: 'Convert length, weight, temperature, speed and volume units instantly online. Simple, fast and accurate unit conversion tool. Free, no signup needed.',
  keywords: 'unit converter, unit converter online, length converter, weight converter, temperature converter, cm to inches converter, kg to lbs converter, free unit conversion tool',
  alternates: { canonical: 'https://www.develpers.com/tools/unit-converter' },
  openGraph: {
    title: 'Free Unit Converter — Length, Weight, Temperature & More',
    description: 'Convert any unit instantly — length, weight, temperature and more. Free and accurate.',
    url: 'https://www.develpers.com/tools/unit-converter',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}