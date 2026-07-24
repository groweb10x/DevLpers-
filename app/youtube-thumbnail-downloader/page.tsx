'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

type Thumbnail = {
  quality: string;
  label: string;
  url: string;
  size: string;
};

export default function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const fetchThumbnails = () => {
    if (!url.trim()) { setError('Please enter a YouTube URL'); return; }
    setLoading(true);
    setError('');
    setThumbnails([]);

    const id = extractVideoId(url.trim());
    if (!id) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      setLoading(false);
      return;
    }

    setVideoId(id);
    const thumbs: Thumbnail[] = [
      { quality: 'maxresdefault', label: 'Max Resolution', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, size: '1280×720' },
      { quality: 'sddefault', label: 'Standard Quality', url: `https://img.youtube.com/vi/${id}/sddefault.jpg`, size: '640×480' },
      { quality: 'hqdefault', label: 'High Quality', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, size: '480×360' },
      { quality: 'mqdefault', label: 'Medium Quality', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, size: '320×180' },
      { quality: 'default', label: 'Default', url: `https://img.youtube.com/vi/${id}/default.jpg`, size: '120×90' },
      { quality: '1', label: 'Thumbnail 1', url: `https://img.youtube.com/vi/${id}/1.jpg`, size: '120×90' },
      { quality: '2', label: 'Thumbnail 2', url: `https://img.youtube.com/vi/${id}/2.jpg`, size: '120×90' },
      { quality: '3', label: 'Thumbnail 3', url: `https://img.youtube.com/vi/${id}/3.jpg`, size: '120×90' },
    ];
    setThumbnails(thumbs);
    setLoading(false);
  };

  const downloadThumbnail = async (thumb: Thumbnail) => {
    try {
      const response = await fetch(thumb.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `youtube-thumbnail-${videoId}-${thumb.quality}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(thumb.url, '_blank');
    }
  };

  const faqs = [
    { q: 'How do I download a YouTube thumbnail?', a: 'Paste any YouTube video URL in the box above and click "Get Thumbnails". All available thumbnail sizes will appear instantly. Click "Download" to save any size.' },
    { q: 'What thumbnail sizes are available?', a: 'YouTube provides thumbnails in Max Resolution (1280×720), Standard (640×480), High Quality (480×360), Medium (320×180) and Default (120×90).' },
    { q: 'Is this tool free?', a: 'Yes, completely free with no signup, no limits and no watermarks. Download as many thumbnails as you need.' },
    { q: 'Can I use downloaded thumbnails?', a: 'Thumbnails are owned by the video creator. Use them only for personal reference, SEO analysis or with permission from the creator.' },
    { q: 'Does this work for YouTube Shorts?', a: 'Yes! This tool works for regular YouTube videos, YouTube Shorts and unlisted videos.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)', padding: '3.5rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '100px', padding: '5px 18px', fontSize: '0.82rem', color: '#fff', fontWeight: 700, marginBottom: '1.25rem' }}>
              🎬 Free YouTube Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              YouTube Thumbnail Downloader
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Download YouTube video thumbnails in all sizes — Max HD, Standard, High Quality and more. Free, instant, no signup.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['🎬 All Sizes', '⚡ Instant', '🆓 Free', '📱 Shorts Support', '🔒 No Signup'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '100px', padding: '4px 14px', fontSize: '0.78rem', color: '#fff' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* TOOL */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>Enter YouTube Video URL</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchThumbnails()}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ flex: 1, minWidth: '200px', padding: '12px 16px', border: '2px solid #e4e5e7', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', color: '#404145' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#ff0000'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
              />
              <button onClick={fetchThumbnails} disabled={loading} style={{
                padding: '12px 28px', background: '#ff0000', border: 'none', borderRadius: '8px',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>🎬 Get Thumbnails</button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', color: '#dc2626', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            {thumbnails.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: '#404145', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  ✅ {thumbnails.length} thumbnails found — Video ID: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{videoId}</code>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {thumbnails.map(thumb => (
                    <div key={thumb.quality} style={{ border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden', background: '#fafafa' }}>
                      <div style={{ position: 'relative', background: '#000' }}>
                        <img
                          src={thumb.url}
                          alt={thumb.label}
                          style={{ width: '100%', display: 'block', minHeight: '80px', objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#404145', marginBottom: '0.2rem' }}>{thumb.label}</div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem', marginBottom: '0.6rem' }}>{thumb.size}</div>
                        <button onClick={() => downloadThumbnail(thumb)} style={{
                          width: '100%', padding: '7px', background: '#ff0000', border: 'none',
                          borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                        }}>⬇️ Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How to Download YouTube Thumbnails</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '🔗', title: 'Copy URL', desc: 'Copy the YouTube video URL from your browser' },
                { icon: '📋', title: 'Paste URL', desc: 'Paste the URL in the box above' },
                { icon: '🎬', title: 'Get Thumbnails', desc: 'Click button to load all thumbnail sizes' },
                { icon: '⬇️', title: 'Download', desc: 'Click Download on your preferred size' },
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
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>Free YouTube Thumbnail Downloader</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Download YouTube video thumbnails in all available qualities — Max Resolution HD (1280×720), Standard Definition (640×480),
              High Quality (480×360), Medium Quality (320×180) and Default size (120×90). Works for regular YouTube videos,
              YouTube Shorts and unlisted videos. No software download required, works directly in your browser.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              YouTube thumbnails are used by content creators, SEO analysts, marketers and designers to analyze competitor content,
              create inspiration boards, or reference thumbnail designs. This tool makes it fast and free.
            </p>
          </div>

          {/* RELATED */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Meta Tag Generator', slug: 'meta-tag-generator', icon: '🏷️' },
                { name: 'Robots.txt Generator', slug: 'robots-txt-generator', icon: '🤖' },
                { name: '.htaccess Generator', slug: 'htaccess-generator', icon: '⚙️' },
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