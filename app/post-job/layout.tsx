import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post a Job — DevLpers',
  description: 'Post your project on DevLpers and get proposals from top developers within hours. Find the perfect developer for your project.',
  alternates: {
    canonical: 'https://develpers.com/post-job',
  },
  openGraph: {
    title: 'Post a Job — DevLpers',
    description: 'Post your project and get proposals from top developers within hours.',
    url: 'https://develpers.com/post-job',
    type: 'website',
  },
};

export default function PostJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}