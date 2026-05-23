import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join DevLpers — Sign Up Free',
  description: 'Create your free DevLpers account. Join as a developer to get hired or as a buyer to find top talent worldwide.',
  alternates: {
    canonical: 'https://develpers.com/signup',
  },
  openGraph: {
    title: 'Join DevLpers — Sign Up Free',
    description: 'Create your free DevLpers account today.',
    url: 'https://develpers.com/signup',
    type: 'website',
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}