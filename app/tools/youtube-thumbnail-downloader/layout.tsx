import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Downloader — Download HD Thumbnails Free | DevLpers',
  description: 'Download YouTube video thumbnails in all sizes — Max HD 1280x720, Standard, High Quality and more. Free, instant, no signup. Works for YouTube Shorts too.',
  keywords: 'youtube thumbnail downloader, download youtube thumbnail, youtube thumbnail grabber, youtube thumbnail extractor, youtube thumbnail hd, free thumbnail downloader',
  alternates: { canonical: 'https://www.develpers.com/tools/youtube-thumbnail-downloader' },
  openGraph: {
    title: 'YouTube Thumbnail Downloader — Download HD Thumbnails Free',
    description: 'Download YouTube thumbnails in all sizes instantly. Free, no signup required.',
    url: 'https://www.develpers.com/tools/youtube-thumbnail-downloader',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}