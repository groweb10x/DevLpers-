'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function UrduWordCounter() {
  const [text, setText] = useState('');

  const countUrduWords = (str: string) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const countUrduChars = (str: string) => str.replace(/\s/g, '').length;
  const countSentences = (str: string) => {
    if (!str.trim()) return 0;
    return str.split(/[۔!؟.!?]+/).filter(s => s.trim().length > 0).length;
  };
  const countParagraphs = (str: string) => {
    if (!str.trim()) return 0;
    return str.split(/\n+/).filter(p => p.trim().length > 0).length;
  };
  const readingTime = (words: number) => {
    const minutes = Math.ceil(words / 150);
    return minutes <= 1 ? '1 minute' : `${minutes} minutes`;
  };

  const words = countUrduWords(text);
  const chars = text.length;
  const charsNoSpace = countUrduChars(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);

  const faqs = [
    { q: 'کیا یہ ٹول اردو متن کے لیے درست گنتی کرتا ہے؟', a: 'جی ہاں، یہ ٹول اردو الفاظ، حروف، جملوں اور پیراگراف کی درست گنتی کرتا ہے۔' },
    { q: 'Is this tool free to use?', a: 'Yes, completely free with no signup, no limits and no ads. Just paste your Urdu text and get instant results.' },
    { q: 'Can I use this for English text too?', a: 'Yes, this tool works for any language including English, Urdu, Hindi and Roman Urdu.' },
    { q: 'Is my text saved or stored anywhere?', a: 'No. Everything runs in your browser. Your text is never sent to any server, making it 100% private.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)', borderBottom: '1px solid #e4e5e7', padding: '3rem 5%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '1rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <div style={{ display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              🆓 Free Tool — اردو ورڈ کاؤنٹر
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.5rem' }}>
              Urdu Word Counter — اردو الفاظ گنیں
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Online Urdu word counter — count words, characters, sentences and paragraphs in Urdu text instantly. Free, fast and private.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* TOOL */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'الفاظ / Words', value: words, color: '#1dbf73' },
                { label: 'حروف / Chars', value: chars, color: '#3b82f6' },
                { label: 'بغیر خلا / No Space', value: charsNoSpace, color: '#f59e0b' },
                { label: 'جملے / Sentences', value: sentences, color: '#8b5cf6' },
                { label: 'پیراگراف', value: paragraphs, color: '#ec4899' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: stat.color }}>{stat.value}</div>
                  <div style={{ color: '#95979d', fontSize: '0.72rem', marginTop: '0.2rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Reading time */}
            {words > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', marginBottom: '1rem', color: '#1dbf73', fontSize: '0.88rem', fontWeight: 600 }}>
                📖 Reading time: {readingTime(words)}
              </div>
            )}

            {/* Textarea */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="یہاں اردو متن لکھیں یا پیسٹ کریں...&#10;Type or paste your Urdu text here..."
              rows={12}
              style={{
                width: '100%', padding: '1rem',
                border: '1px solid #e4e5e7', borderRadius: '8px',
                fontSize: '1rem', outline: 'none', resize: 'vertical',
                fontFamily: 'Noto Nastaliq Urdu, Arial, sans-serif',
                color: '#404145', lineHeight: 2,
                direction: 'rtl', textAlign: 'right',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setText('')} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer', fontSize: '0.88rem' }}>
                Clear Text
              </button>
              <button onClick={() => navigator.clipboard.writeText(text)} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer', fontSize: '0.88rem' }}>
                Copy Text
              </button>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How to Use — استعمال کا طریقہ</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '✍️', title: 'Type or Paste', desc: 'Type or paste your Urdu text in the box above' },
                { icon: '⚡', title: 'Instant Count', desc: 'Words, characters and sentences counted in real time' },
                { icon: '📊', title: 'Full Stats', desc: 'Get reading time, paragraphs and character count' },
                { icon: '🔒', title: '100% Private', desc: 'Your text never leaves your device' },
              ].map(s => (
                <div key={s.title} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#404145', marginBottom: '0.3rem' }}>{s.title}</div>
                  <div style={{ color: '#95979d', fontSize: '0.78rem' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>عام سوالات — FAQ</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO CONTENT */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>
              Online Urdu Word Counter — اردو ورڈ کاؤنٹر
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              This free Urdu word counter tool lets you count words, characters, sentences and paragraphs in any Urdu text instantly.
              Whether you are writing an Urdu essay, article, story, or social media post, this tool gives you accurate real-time counts
              without any signup or download required. It works perfectly for Urdu, Roman Urdu, Hindi and English text.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              اردو ورڈ کاؤنٹر ایک مفت آن لائن ٹول ہے جو آپ کے اردو متن میں الفاظ، حروف اور جملوں کی فوری گنتی کرتا ہے۔
              یہ ٹول طلباء، لکھاریوں اور صحافیوں کے لیے بہت مفید ہے۔
            </p>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Freelancer Rate Calculator', slug: 'freelancer-rate-calculator', icon: '💰' },
                { name: 'Password Generator', slug: 'password-generator', icon: '🔐' },
                { name: 'Invoice Generator', slug: 'invoice-generator', icon: '🧾' },
              ].map(t => (
                <a key={t.slug} href={`/${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#62646a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {t.icon} {t.name}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CREDIT */}
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px' }}>
            <p style={{ color: '#62646a', fontSize: '0.85rem' }}>
              Built by <strong style={{ color: '#404145' }}>Dev Zeeshan</strong> on{' '}
              <Link href="/" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>DevLpers</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}