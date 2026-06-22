import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools — Calculators, Image Tools & More | DevLpers',
  description: 'Free online tools built by developers: image converter, image compressor, image resizer, favicon generator, BMI calculator, loan EMI calculator, unit converter, percentage calculator. No signup, no limits.',
  keywords: 'free online tools, image converter, image compressor, image resizer, favicon generator, bmi calculator, loan emi calculator, unit converter, percentage calculator, developer tools, free web tools',
  alternates: { canonical: 'https://develpers.com/tools' },
  openGraph: {
    title: 'Free Online Tools — Calculators, Image Tools & More | DevLpers',
    description: 'Free tools built by developers. No signup, no limits, no uploads.',
    url: 'https://develpers.com/tools',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}