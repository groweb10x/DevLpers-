'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

type ImageItem = {
  id: string;
  fileName: string;
  originalUrl: string;
  compressedUrl: string | null;
  originalSize: number;
  compressedSize: number;
  status: 'pending' | 'compressing' | 'done';
};

export default function ImageCompressor() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState('0.7');
  const [compressing, setCompressing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.type.match('image/(png|jpeg|jpg|webp)'));
    if (validFiles.length === 0) {
      alert('Please upload PNG, JPG or WebP images');
      return;
    }
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ImageItem = {
          id: Math.random().toString(36).slice(2),
          fileName: file.name.replace(/\.(png|jpe?g|webp)$/i, ''),
          originalUrl: e.target?.result as string,
          compressedUrl: null,
          originalSize: file.size,
          compressedSize: 0,
          status: 'pending',
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ ...img, compressedUrl: url, compressedSize: blob.size, status: 'done' });
          } else {
            resolve({ ...img, status: 'done' });
          }
        }, 'image/jpeg', parseFloat(quality));
      };
      image.src = img.originalUrl;
    });
  };

  const compressAll = async () => {
    setCompressing(true);
    setImages(prev => prev.map(img => ({ ...img, status: 'compressing' as const })));
    for (const img of images) {
      const compressed = await compressImage(img);
      setImages(prev => prev.map(i => i.id === compressed.id ? compressed : i));
    }
    setCompressing(false);
  };

  const downloadOne = (img: ImageItem) => {
    if (!img.compressedUrl) return;
    const a = document.createElement('a');
    a.href = img.compressedUrl;
    a.download = `${img.fileName}-compressed.jpg`;
    a.click();
  };

  const downloadAll = () => images.forEach(img => { if (img.compressedUrl) setTimeout(() => downloadOne(img), 100); });
  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));
  const clearAll = () => setImages([]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const doneCount = images.filter(img => img.status === 'done').length;
  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressed = images.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavedPercent = totalOriginal > 0 && totalCompressed > 0
    ? (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(0) : 0;

  const faqs = [
    { q: 'Does compressing reduce image quality?', a: 'Some quality loss happens with JPG compression, but you control the level with the quality slider. At 70-80% quality, the difference is barely visible while file size drops significantly.' },
    { q: 'Is there a file size or upload limit?', a: 'No. Upload as many images as you want, of any size. Everything runs in your browser, so there are no server-side limits.' },
    { q: 'Are my images uploaded to a server?', a: 'No. All compression happens locally in your browser using JavaScript. Your images never leave your device, making this 100% private and secure.' },
    { q: 'What image formats are supported?', a: 'You can upload PNG, JPG, or WebP images. Compressed output is saved as optimized JPG for maximum compatibility and smallest file size.' },
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
              🗜️ Free Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.75rem' }}>
              Image Compressor — Reduce File Size Online
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Compress PNG, JPG and WebP images in bulk without losing visible quality. 100% free, no uploads to any server, unlimited files.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>

          {/* TOOL CARD */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2.5rem' }}>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
              style={{ border: '2px dashed #e4e5e7', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: '1.5rem' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
              <p style={{ color: '#404145', fontWeight: 600, marginBottom: '0.4rem' }}>Click to upload or drag & drop images</p>
              <p style={{ color: '#95979d', fontSize: '0.85rem' }}>PNG, JPG, WebP — unlimited files</p>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e => e.target.files && handleFiles(e.target.files)} style={{ display: 'none' }} />
            </div>

            {images.length > 0 && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                    Compression Level: {Math.round(parseFloat(quality) * 100)}% quality
                  </label>
                  <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(e.target.value)} style={{ width: '100%', accentColor: '#1dbf73' }} />
                </div>

                <div style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {images.length} image{images.length !== 1 ? 's' : ''} · {doneCount} compressed
                </div>

                {doneCount > 0 && Number(totalSavedPercent) > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem', textAlign: 'center', color: '#1dbf73', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    🎉 Reduced by {totalSavedPercent}% — {formatSize(totalOriginal)} → {formatSize(totalCompressed)}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {images.map(img => (
                    <div key={img.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7' }}>
                      <img src={img.compressedUrl || img.originalUrl} alt={img.fileName} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.fileName}</div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>
                          {formatSize(img.originalSize)}{img.status === 'done' && img.compressedSize > 0 && ` → ${formatSize(img.compressedSize)}`}
                        </div>
                      </div>
                      {img.status === 'compressing' && <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>⏳</span>}
                      {img.status === 'done' && (
                        <button onClick={() => downloadOne(img)} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>⬇️</button>
                      )}
                      <button onClick={() => removeImage(img.id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>✕</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={compressAll} disabled={compressing} style={{ flex: 1, padding: '12px', background: compressing ? '#a7f3d0' : '#1dbf73', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: compressing ? 'not-allowed' : 'pointer' }}>
                    {compressing ? 'Compressing...' : `Compress All (${images.length})`}
                  </button>
                  {doneCount > 0 && (
                    <button onClick={downloadAll} style={{ padding: '12px 20px', background: '#fff', border: '1px solid #1dbf73', borderRadius: '6px', color: '#1dbf73', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>⬇️ Download All</button>
                  )}
                  <button onClick={clearAll} style={{ padding: '12px 20px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer', fontSize: '0.9rem' }}>Clear All</button>
                </div>
              </>
            )}
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { step: '1', icon: '📤', title: 'Upload Images', desc: 'Drag and drop or select multiple images' },
                { step: '2', icon: '🎚️', title: 'Set Quality', desc: 'Adjust the compression level with the slider' },
                { step: '3', icon: '⚡', title: 'Compress', desc: 'Process happens instantly in your browser' },
                { step: '4', icon: '⬇️', title: 'Download', desc: 'Save individually or download all at once' },
              ].map(s => (
                <div key={s.step} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
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
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>About This Image Compressor</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Large image files slow down websites, fill up storage, and make file sharing harder. This free online image compressor reduces file size while
              keeping images looking sharp. Whether you are optimizing photos for a website, reducing attachment sizes for email, or saving storage space,
              this tool gets it done in seconds — entirely in your browser, with no signup and no file limits.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Unlike many online compressors, your images are never uploaded to a server. All processing happens locally using your browser's built-in
              capabilities, which means faster results and complete privacy for your files.
            </p>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Image Format Converter', slug: 'image-format-converter', icon: '🖼️' },
                { name: 'Image Resizer', slug: 'image-resizer', icon: '📐' },
                { name: 'Favicon Generator', slug: 'favicon-generator', icon: '🔖' },
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