import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans — DevLpers',
  description: 'Choose the right plan. Free, Weekly Pro and Monthly Elite. Unlimited bids, featured listings and priority support.',
  alternates: {
    canonical: 'https://develpers.com/pricing',
  },
  openGraph: {
    title: 'Pricing Plans — DevLpers',
    description: 'Simple and transparent pricing for developers and buyers.',
    url: 'https://develpers.com/pricing',
    type: 'website',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}