import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Compressor Online — Reduce File Size | DevLpers',
  description: 'Compress PNG, JPG and WebP images online for free. Reduce file size without losing quality. Bulk compression, no uploads, no signup, unlimited files.',
  keywords: 'image compressor, compress image online, reduce image size, photo compressor, jpg compressor, png compressor, free image compression',
  alternates: { canonical: 'https://www.develpers.com/tools/image-compressor' },
  openGraph: {
    title: 'Free Image Compressor — Reduce File Size Online',
    description: 'Compress images in bulk, free and private. No uploads, no limits.',
    url: 'https://www.develpers.com/tools/image-compressor',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}