import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Freelancer Rate Calculator — Know Your Hourly Rate | DevLpers',
  description: 'Calculate your ideal freelance hourly rate based on income goals, working hours, taxes and profit margin. Free calculator for developers and designers.',
  keywords: 'freelancer rate calculator, hourly rate calculator, freelance rate calculator, how much to charge freelance, freelance pricing calculator, developer rate calculator',
  alternates: { canonical: 'https://www.develpers.com/tools/freelancer-rate-calculator' },
  openGraph: {
    title: 'Freelancer Rate Calculator — Know Your Worth',
    description: 'Calculate your ideal freelance hourly rate based on income goals, taxes and profit margin.',
    url: 'https://www.develpers.com/tools/freelancer-rate-calculator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}