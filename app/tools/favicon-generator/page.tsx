'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

type FaviconSize = { size: number; label: string };

const faviconSizes: FaviconSize[] = [
  { size: 16, label: '16×16' },
  { size: 32, label: '32×32' },
  { size: 48, label: '48×48' },
  { size: 64, label: '64×64' },
  { size: 180, label: '180×180 (Apple)' },
  { size: 192, label: '192×192 (Android)' },
  { size: 512, label: '512×512 (PWA)' },
];

export default function FaviconGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('favicon');
  const [generatedIcons, setGeneratedIcons] = useState<{ size: number; url: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.match('image/(png|jpeg|jpg|webp|svg)')) {
      alert('Please upload a PNG, JPG, WebP or SVG image');
      return;
    }
    setFileName(file.name.replace(/\.(png|jpe?g|webp|svg)$/i, ''));
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setGeneratedIcons([]);
    };
    reader.readAsDataURL(file);
  };

  const generateFavicons = async () => {
    if (!originalImage) return;
    setGenerating(true);

    const image = new Image();
    image.onload = () => {
      const icons: { size: number; url: string }[] = [];
      let processed = 0;

      faviconSizes.forEach(({ size }) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0, size, size);

        canvas.toBlob((blob) => {
          if (blob) {
            icons.push({ size, url: URL.createObjectURL(blob) });
          }
          processed++;
          if (processed === faviconSizes.length) {
            icons.sort((a, b) => a.size - b.size);
            setGeneratedIcons(icons);
            setGenerating(false);
          }
        }, 'image/png');
      });
    };
    image.src = originalImage;
  };

  const downloadOne = (icon: { size: number; url: string }) => {
    const a = document.createElement('a');
    a.href = icon.url;
    a.download = `favicon-${icon.size}x${icon.size}.png`;
    a.click();
  };

  const downloadAll = () => {
    generatedIcons.forEach((icon, i) => setTimeout(() => downloadOne(icon), i * 100));
  };

  const faqs = [
    { q: 'What image should I upload?', a: 'A square image works best, ideally at least 512×512 pixels. Logos with simple, bold shapes look clearest at small favicon sizes.' },
    { q: 'Which sizes do I actually need?', a: '32×32 and 16×16 cover standard browser tabs. 180×180 is for Apple touch icons, and 192×192/512×512 are used for Android home screens and PWAs.' },
    { q: 'How do I add the favicon to my website?', a: 'Place the favicon.ico or PNG files in your site root, then link them in your HTML head using <link rel="icon" href="/favicon-32x32.png">.' },
    { q: 'Is this tool free for commercial use?', a: 'Yes, completely free for personal and commercial projects with no attribution required.' },
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
              🔖 Free Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.75rem' }}>
              Favicon Generator — Create All Sizes Instantly
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Upload one image and generate every favicon size your website needs — browser tabs, Apple touch icons, Android and PWA icons.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* TOOL CARD */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2.5rem' }}>
            {!originalImage ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                style={{ border: '2px dashed #e4e5e7', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
                <p style={{ color: '#404145', fontWeight: 600, marginBottom: '0.4rem' }}>Click to upload your logo or image</p>
                <p style={{ color: '#95979d', fontSize: '0.85rem' }}>PNG, JPG or WebP — square images work best</p>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <img src={originalImage} alt="Original" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e4e5e7' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#404145', marginBottom: '0.5rem' }}>{fileName}</div>
                    <button onClick={() => { setOriginalImage(null); setGeneratedIcons([]); }} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', padding: '7px 16px', color: '#62646a', cursor: 'pointer', fontSize: '0.82rem' }}>
                      Change Image
                    </button>
                  </div>
                </div>

                {generatedIcons.length === 0 ? (
                  <button onClick={generateFavicons} disabled={generating} style={{
                    width: '100%', padding: '12px',
                    background: generating ? '#a7f3d0' : '#1dbf73', border: 'none', borderRadius: '6px',
                    color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: generating ? 'not-allowed' : 'pointer',
                  }}>{generating ? 'Generating...' : '✨ Generate All Favicon Sizes'}</button>
                ) : (
                  <>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem',
                    }}>
                      {generatedIcons.map(icon => (
                        <div key={icon.size} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.85rem', textAlign: 'center' }}>
                          <img src={icon.url} alt={`${icon.size}x${icon.size}`} style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                          <div style={{ color: '#62646a', fontSize: '0.72rem', marginBottom: '0.5rem' }}>{icon.size}×{icon.size}</div>
                          <button onClick={() => downloadOne(icon)} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600, width: '100%' }}>⬇️</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={downloadAll} style={{ flex: 1, padding: '12px', background: '#1dbf73', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                        ⬇️ Download All Sizes
                      </button>
                      <button onClick={() => setGeneratedIcons([])} style={{ padding: '12px 20px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer', fontSize: '0.9rem' }}>
                        Regenerate
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📤', title: 'Upload Logo', desc: 'Upload your logo or icon image' },
                { icon: '✨', title: 'Generate', desc: 'We create all 7 standard favicon sizes' },
                { icon: '👀', title: 'Preview', desc: 'See exactly how each size looks' },
                { icon: '⬇️', title: 'Download', desc: 'Get all icons in one click' },
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
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
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
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>About This Favicon Generator</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              A favicon is the small icon shown in browser tabs, bookmarks, and mobile home screens — but different platforms require different sizes.
              This free favicon generator creates all standard sizes from a single image upload: 16×16 and 32×32 for browser tabs, 180×180 for Apple
              devices, and 192×192 plus 512×512 for Android and Progressive Web Apps.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              No design software needed. Upload your logo, generate every size instantly, and download them all ready to use on your website —
              completely free, with everything processed locally in your browser.
            </p>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Image Format Converter', slug: 'image-format-converter', icon: '🖼️' },
                { name: 'Image Compressor', slug: 'image-compressor', icon: '🗜️' },
                { name: 'Image Resizer', slug: 'image-resizer', icon: '📐' },
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