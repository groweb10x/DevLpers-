import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Urdu Word Counter Online — اردو ورڈ کاؤنٹر | DevLpers',
  description: 'Free online Urdu word counter. Count words, characters, sentences and paragraphs in Urdu text instantly. اردو الفاظ، حروف اور جملے گنیں — مفت آن لائن ٹول۔',
  keywords: 'urdu word counter, اردو ورڈ کاؤنٹر, urdu character counter, count urdu words online, urdu text counter, urdu word count tool, online urdu counter',
  alternates: { canonical: 'https://develpers.com/urdu-word-counter' },
  openGraph: {
    title: 'Urdu Word Counter Online — اردو ورڈ کاؤنٹر',
    description: 'Count words, characters and sentences in Urdu text instantly — free and private.',
    url: 'https://develpers.com/urdu-word-counter',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}