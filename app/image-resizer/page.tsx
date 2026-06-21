'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

type ImageItem = {
  id: string;
  fileName: string;
  originalUrl: string;
  resizedUrl: string | null;
  originalWidth: number;
  originalHeight: number;
  status: 'pending' | 'resizing' | 'done';
};

export default function ImageResizer() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [keepAspect, setKeepAspect] = useState(true);
  const [resizing, setResizing] = useState(false);
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
        const img = new Image();
        img.onload = () => {
          const newImage: ImageItem = {
            id: Math.random().toString(36).slice(2),
            fileName: file.name.replace(/\.(png|jpe?g|webp)$/i, ''),
            originalUrl: e.target?.result as string,
            resizedUrl: null,
            originalWidth: img.width,
            originalHeight: img.height,
            status: 'pending',
          };
setImages(prev => {
  if (prev.length === 0) {
    setWidth(img.width.toString());
    setHeight(img.height.toString());
  }
  return [...prev, newImage];
});
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (keepAspect && images.length > 0) {
      const ratio = images[0].originalHeight / images[0].originalWidth;
      setHeight(Math.round(parseFloat(val) * ratio).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (keepAspect && images.length > 0) {
      const ratio = images[0].originalWidth / images[0].originalHeight;
      setWidth(Math.round(parseFloat(val) * ratio).toString());
    }
  };

  const resizeImage = (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = parseInt(width) || image.width;
        canvas.height = parseInt(height) || image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ ...img, resizedUrl: url, status: 'done' });
          } else {
            resolve({ ...img, status: 'done' });
          }
        }, 'image/png');
      };
      image.src = img.originalUrl;
    });
  };

  const resizeAll = async () => {
    setResizing(true);
    setImages(prev => prev.map(img => ({ ...img, status: 'resizing' as const })));
    for (const img of images) {
      const resized = await resizeImage(img);
      setImages(prev => prev.map(i => i.id === resized.id ? resized : i));
    }
    setResizing(false);
  };

  const downloadOne = (img: ImageItem) => {
    if (!img.resizedUrl) return;
    const a = document.createElement('a');
    a.href = img.resizedUrl;
    a.download = `${img.fileName}-resized.png`;
    a.click();
  };

  const downloadAll = () => images.forEach(img => { if (img.resizedUrl) setTimeout(() => downloadOne(img), 100); });
  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));
  const clearAll = () => setImages([]);

  const presets = [
    { label: 'Instagram Post', w: 1080, h: 1080 },
    { label: 'Facebook Cover', w: 820, h: 312 },
    { label: 'YouTube Thumbnail', w: 1280, h: 720 },
    { label: 'Twitter Header', w: 1500, h: 500 },
  ];

  const doneCount = images.filter(img => img.status === 'done').length;

  const faqs = [
    { q: 'Will resizing stretch or distort my image?', a: 'If "Keep aspect ratio" is enabled, the proportions stay correct. Disable it only if you specifically want a different aspect ratio.' },
    { q: 'What is the maximum size I can resize to?', a: 'There is no hard limit since everything runs in your browser, but very large dimensions may be slower depending on your device.' },
    { q: 'Can I resize multiple images with different dimensions at once?', a: 'Currently all images in a batch are resized to the same target dimensions. Process them in separate batches if you need different sizes.' },
    { q: 'Does this tool reduce file size too?', a: 'Resizing naturally reduces file size since there are fewer pixels. For maximum compression, also try our Image Compressor tool.' },
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
              📐 Free Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.75rem' }}>
              Image Resizer — Resize Photos Online
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Resize images to any dimension or popular social media presets. Bulk resize, free, fast, and entirely in your browser.
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
                {/* Presets */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.5rem' }}>Quick Presets</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {presets.map(p => (
                      <button key={p.label} onClick={() => { setWidth(p.w.toString()); setHeight(p.h.toString()); setKeepAspect(false); }} style={{
                        padding: '6px 14px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '100px',
                        color: '#62646a', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
                      }}>{p.label}</button>
                    ))}
                  </div>
                </div>

                {/* Width/Height */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>Width (px)</label>
                    <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', color: '#404145', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>Height (px)</label>
                    <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', color: '#404145', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={keepAspect} onChange={e => setKeepAspect(e.target.checked)} style={{ accentColor: '#1dbf73' }} />
                  <span style={{ color: '#62646a', fontSize: '0.85rem' }}>Keep aspect ratio</span>
                </label>

                <div style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {images.length} image{images.length !== 1 ? 's' : ''} · {doneCount} resized
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {images.map(img => (
                    <div key={img.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7' }}>
                      <img src={img.resizedUrl || img.originalUrl} alt={img.fileName} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.fileName}</div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>
                          {img.originalWidth} × {img.originalHeight}{img.status === 'done' && ` → ${width} × ${height}`}
                        </div>
                      </div>
                      {img.status === 'resizing' && <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>⏳</span>}
                      {img.status === 'done' && (
                        <button onClick={() => downloadOne(img)} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>⬇️</button>
                      )}
                      <button onClick={() => removeImage(img.id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>✕</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={resizeAll} disabled={resizing} style={{ flex: 1, padding: '12px', background: resizing ? '#a7f3d0' : '#1dbf73', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: resizing ? 'not-allowed' : 'pointer' }}>
                    {resizing ? 'Resizing...' : `Resize All (${images.length})`}
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
                { icon: '📤', title: 'Upload Images', desc: 'Drag and drop or select multiple images' },
                { icon: '📏', title: 'Set Dimensions', desc: 'Enter custom size or pick a preset' },
                { icon: '⚡', title: 'Resize', desc: 'Process happens instantly in your browser' },
                { icon: '⬇️', title: 'Download', desc: 'Save individually or download all at once' },
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
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>About This Image Resizer</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Resizing images correctly is essential for websites, social media, and printing. This free online image resizer lets you change image
              dimensions instantly, with presets for Instagram, Facebook, YouTube and Twitter — or enter your own custom width and height.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              All processing happens directly in your browser, so your images are never uploaded anywhere. Resize as many images as you need, completely free.
            </p>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Image Format Converter', slug: 'image-format-converter', icon: '🖼️' },
                { name: 'Image Compressor', slug: 'image-compressor', icon: '🗜️' },
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