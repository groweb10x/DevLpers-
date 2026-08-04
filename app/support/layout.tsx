import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Center — DevLpers',
  description: 'Get help from the DevLpers support team. Submit tickets, report issues, and get answers within 24 hours.',
  alternates: {
    canonical: 'https://www.develpers.com/support',
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}