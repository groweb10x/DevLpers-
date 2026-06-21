import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Resizer Online — Resize Photos & Pictures | DevLpers',
  description: 'Resize images online for free. Custom dimensions or presets for Instagram, Facebook, YouTube and Twitter. Bulk resize, no uploads, no signup.',
  keywords: 'image resizer, resize image online, photo resizer, resize picture, image dimensions changer, free image resizer, bulk image resize',
  alternates: { canonical: 'https://develpers.com/image-resizer' },
  openGraph: {
    title: 'Free Image Resizer — Resize Photos Online',
    description: 'Resize images to any dimension or social media preset, free and private.',
    url: 'https://develpers.com/image-resizer',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}