import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Invoice Generator for Freelancers — Create PDF Invoices | DevLpers',
  description: 'Create professional invoices free online. Add client details, line items, tax and notes. Save as PDF instantly. No signup, no watermarks, no limits.',
  keywords: 'free invoice generator, invoice maker online, freelancer invoice template, invoice generator pdf, create invoice online free, professional invoice generator',
  alternates: { canonical: 'https://develpers.com/invoice-generator' },
  openGraph: {
    title: 'Free Invoice Generator for Freelancers — Create PDF Invoices',
    description: 'Create professional invoices online free. Save as PDF instantly. No signup required.',
    url: 'https://develpers.com/invoice-generator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}