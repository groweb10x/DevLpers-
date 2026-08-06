import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Favicon Generator — Create All Icon Sizes Online | DevLpers',
  description: 'Generate favicons in all sizes from one image: 16x16, 32x32, 180x180 Apple touch icon, 192x192 and 512x512 for Android/PWA. Free, instant, no signup.',
  keywords: 'favicon generator, favicon maker, create favicon online, ico generator, apple touch icon, free favicon tool, website icon generator, favicon all sizes',
  alternates: { canonical: 'https://www.develpers.com/tools/favicon-generator' },
  openGraph: {
    title: 'Free Favicon Generator — All Sizes Instantly',
    description: 'Upload one image, generate every favicon size your website needs. Free, instant, no signup.',
    url: 'https://www.develpers.com/tools/favicon-generator',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}