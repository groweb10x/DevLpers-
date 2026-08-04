import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free .htaccess Generator — Apache Configuration Tool | DevLpers',
  description: 'Generate .htaccess files free. Force HTTPS, enable Gzip compression, browser caching, block bad bots, custom redirects and more. Download ready instantly.',
  keywords: 'htaccess generator, .htaccess generator, apache htaccess, force https htaccess, gzip htaccess, browser cache htaccess, block bots htaccess, free htaccess tool',
  alternates: { canonical: 'https://www.develpers.com/htaccess-generator' },
  openGraph: {
    title: 'Free .htaccess Generator — Apache Configuration Tool',
    description: 'Generate .htaccess with HTTPS, Gzip, caching and bot blocking. Free download.',
    url: 'https://www.develpers.com/htaccess-generator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}