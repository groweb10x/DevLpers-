import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan EMI Calculator Free — Home, Car & Personal Loan EMI Online | DevLpers',
  description: 'Calculate monthly EMI for home, car or personal loans instantly. See month-wise breakdown, total interest and repayment schedule. Free, accurate, no signup.',
  keywords: 'loan emi calculator, personal loan emi calculator, home loan emi calculator, car loan emi calculator, emi calculator online free, emi calculator month wise, loan interest calculator',
  alternates: { canonical: 'https://www.develpers.com/tools/loan-emi-calculator' },
  openGraph: {
    title: 'Free Loan EMI Calculator — Home, Car & Personal Loans',
    description: 'Calculate your monthly EMI with full month-wise breakdown. Free and instant.',
    url: 'https://www.develpers.com/tools/loan-emi-calculator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}