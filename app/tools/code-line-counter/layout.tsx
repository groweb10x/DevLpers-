import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Line Counter Online — Count Lines of Code Free | DevLpers',
  description: 'Count lines of code online free. Get total lines, code lines, comment lines, blank lines, functions and imports instantly. Works with JavaScript, Python, PHP and all languages.',
  keywords: 'code line counter, count lines of code online, loc counter, lines of code counter, count code lines, source code line counter, free code counter tool',
  alternates: { canonical: 'https://www.develpers.com/tools/code-line-counter' },
  openGraph: {
    title: 'Code Line Counter — Count Lines of Code Online Free',
    description: 'Instant breakdown of code lines, comments, blanks, functions and imports. Works with any language.',
    url: 'https://www.develpers.com/tools/code-line-counter',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}