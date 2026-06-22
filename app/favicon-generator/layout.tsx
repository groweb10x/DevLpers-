import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Format Converter — PNG, JPG, WebP, BMP, GIF, AVIF | DevLpers',
  description: 'Convert images between PNG, JPG, WebP, BMP, GIF and AVIF instantly — free, fast, bulk conversion, no signup, no upload limits. 100% browser-based and private.',
  keywords: 'image format converter, png to webp, jpg to png, webp to jpg, png to jpg, convert image online free, bulk image converter, image converter no upload',
  alternates: { canonical: 'https://develpers.com/image-format-converter' },
  openGraph: {
    title: 'Free Image Format Converter — PNG, JPG, WebP, BMP, GIF, AVIF',
    description: 'Convert images between formats instantly, free and private. No uploads, no limits.',
    url: 'https://develpers.com/image-format-converter',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}