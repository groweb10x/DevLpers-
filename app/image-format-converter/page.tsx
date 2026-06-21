'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

type ImageItem = {
  id: string;
  fileName: string;
  originalFormat: string;
  originalUrl: string;
  convertedUrl: string | null;
  originalSize: number;
  convertedSize: number;
  status: 'pending' | 'converting' | 'done';
};

const formatOptions = [
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/bmp', label: 'BMP', ext: 'bmp' },
  { value: 'image/gif', label: 'GIF', ext: 'gif' },
  { value: 'image/avif', label: 'AVIF', ext: 'avif' },
];

export default function ImageConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState('0.9');
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [converting, setConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.type.match('image/(png|jpeg|jpg|webp|bmp|gif)'));
    if (validFiles.length === 0) {
      alert('Please upload PNG, JPG, WebP, BMP or GIF images');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ImageItem = {
          id: Math.random().toString(36).slice(2),
          fileName: file.name.replace(/\.(png|jpe?g|webp|bmp|gif)$/i, ''),
          originalFormat: file.type,
          originalUrl: e.target?.result as string,
          convertedUrl: null,
          originalSize: file.size,
          convertedSize: 0,
          status: 'pending',
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertImage = (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (targetFormat === 'image/jpeg' || targetFormat === 'image/bmp') {
          ctx!.fillStyle = '#ffffff';
          ctx?.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx?.drawImage(image, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ ...img, convertedUrl: url, convertedSize: blob.size, status: 'done' });
          } else {
            resolve({ ...img, status: 'done' });
          }
        }, targetFormat, parseFloat(quality));
      };
      image.src = img.originalUrl;
    });
  };

  const convertAll = async () => {
    setConverting(true);
    setImages(prev => prev.map(img => ({ ...img, status: 'converting' as const, convertedUrl: null })));

    for (const img of images) {
      const converted = await convertImage(img);
      setImages(prev => prev.map(i => i.id === converted.id ? converted : i));
    }
    setConverting(false);

    if (targetFormat === 'image/avif') {
      setTimeout(() => {
        setImages(prev => {
          const failed = prev.some(img => img.convertedUrl && img.convertedSize === 0);
          if (failed) alert('AVIF export is not supported in this browser. Try Chrome or Edge.');
          return prev;
        });
      }, 500);
    }
  };

  const getExt = () => formatOptions.find(f => f.value === targetFormat)?.ext || 'webp';

  const downloadOne = (img: ImageItem) => {
    if (!img.convertedUrl) return;
    const a = document.createElement('a');
    a.href = img.convertedUrl;
    a.download = `${img.fileName}.${getExt()}`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach(img => {
      if (img.convertedUrl) setTimeout(() => downloadOne(img), 100);
    });
  };

  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));
  const clearAll = () => setImages([]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatLabel = (mime: string) => {
    if (mime.includes('png')) return 'PNG';
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'JPG';
    if (mime.includes('webp')) return 'WebP';
    if (mime.includes('bmp')) return 'BMP';
    if (mime.includes('gif')) return 'GIF';
    if (mime.includes('avif')) return 'AVIF';
    return mime;
  };

  const doneCount = images.filter(img => img.status === 'done').length;
  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalConverted = images.reduce((sum, img) => sum + img.convertedSize, 0);
  const totalSavedPercent = totalOriginal > 0 && totalConverted > 0
    ? (((totalOriginal - totalConverted) / totalOriginal) * 100).toFixed(0)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '2rem 5%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '0.75rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: '#404145', marginBottom: '0.5rem' }}>
              🖼️ Image Format Converter
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Convert images between PNG, JPG, WebP, BMP, GIF and AVIF — free, fast, and entirely in your browser. No uploads, no waiting, no limits.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>

            {/* Upload Zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
              style={{
                border: '2px dashed #e4e5e7', borderRadius: '12px',
                padding: '2.5rem 2rem', textAlign: 'center',
                cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: '1.5rem',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
              <p style={{ color: '#404145', fontWeight: 600, marginBottom: '0.4rem' }}>
                Click to upload or drag & drop multiple images
              </p>
              <p style={{ color: '#95979d', fontSize: '0.85rem' }}>PNG, JPG, WebP, BMP, GIF — no limit on number of files</p>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/bmp,image/gif" multiple onChange={e => e.target.files && handleFiles(e.target.files)} style={{ display: 'none' }} />
            </div>

            {/* Convert To Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.6rem' }}>
                Convert To:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {formatOptions.map(f => (
                  <button key={f.value} onClick={() => setTargetFormat(f.value)} style={{
                    padding: '9px 20px',
                    background: targetFormat === f.value ? '#1dbf73' : '#fff',
                    border: `1px solid ${targetFormat === f.value ? '#1dbf73' : '#e4e5e7'}`,
                    borderRadius: '8px',
                    color: targetFormat === f.value ? '#fff' : '#62646a',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                  }}>{f.label}</button>
                ))}
              </div>
            </div>

            {images.length > 0 && (
              <>
                {targetFormat !== 'image/png' && targetFormat !== 'image/bmp' && targetFormat !== 'image/gif' && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                      Quality: {Math.round(parseFloat(quality) * 100)}%
                    </label>
                    <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(e.target.value)}
                      style={{ width: '100%', accentColor: '#1dbf73' }} />
                  </div>
                )}

                <div style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {images.length} image{images.length !== 1 ? 's' : ''} · {doneCount} converted
                </div>

                {doneCount > 0 && Number(totalSavedPercent) > 0 && (
                  <div style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: '8px', padding: '0.85rem', textAlign: 'center',
                    color: '#1dbf73', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.25rem',
                  }}>
                    🎉 Saved {totalSavedPercent}% total — {formatSize(totalOriginal)} → {formatSize(totalConverted)}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {images.map(img => (
                    <div key={img.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7',
                    }}>
                      <img src={img.convertedUrl || img.originalUrl} alt={img.fileName} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {img.fileName}.{img.status === 'done' ? getExt() : formatLabel(img.originalFormat).toLowerCase()}
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem' }}>
                          {formatLabel(img.originalFormat)} · {formatSize(img.originalSize)}
                          {img.status === 'done' && img.convertedSize > 0 && ` → ${formatLabel(targetFormat)} ${formatSize(img.convertedSize)}`}
                        </div>
                      </div>
                      {img.status === 'converting' && <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>⏳</span>}
                      {img.status === 'done' && (
                        <button onClick={() => downloadOne(img)} style={{
                          background: '#1dbf73', color: '#fff', border: 'none',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem',
                          cursor: 'pointer', fontWeight: 600, flexShrink: 0,
                        }}>⬇️</button>
                      )}
                      <button onClick={() => removeImage(img.id)} style={{
                        background: 'transparent', border: 'none', color: '#dc2626',
                        cursor: 'pointer', fontSize: '1rem', flexShrink: 0,
                      }}>✕</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={convertAll} disabled={converting} style={{
                    flex: 1, padding: '12px',
                    background: converting ? '#a7f3d0' : '#1dbf73',
                    border: 'none', borderRadius: '6px', color: '#fff',
                    fontWeight: 700, fontSize: '0.95rem', cursor: converting ? 'not-allowed' : 'pointer',
                  }}>{converting ? 'Converting...' : `Convert All to ${formatLabel(targetFormat)}`}</button>
                  {doneCount > 0 && (
                    <button onClick={downloadAll} style={{
                      padding: '12px 20px',
                      background: '#fff', border: '1px solid #1dbf73', borderRadius: '6px',
                      color: '#1dbf73', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    }}>⬇️ Download All ({doneCount})</button>
                  )}
                  <button onClick={clearAll} style={{
                    padding: '12px 20px', background: '#fff',
                    border: '1px solid #e4e5e7', borderRadius: '6px',
                    color: '#62646a', cursor: 'pointer', fontSize: '0.9rem',
                  }}>Clear All</button>
                </div>
              </>
            )}
          </div>

          {/* SEO CONTENT BLOCK */}
          <div style={{ marginTop: '2rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>
              Free Online Image Format Converter
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Convert images between PNG, JPG, WebP, BMP, GIF and AVIF formats instantly — completely free, with no file size limits and no signup required.
              Whether you need to convert PNG to WebP for faster website loading, JPG to PNG for transparency, or any other combination, this tool handles it all
              directly in your browser. Your images never leave your device, making it fast, private and secure.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Upload as many images as you like, choose your target format, adjust quality if needed, and convert them all in one click. Perfect for developers,
              designers, and website owners who need quick image format conversion without installing any software.
            </p>
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Unit Converter', slug: 'tools/unit-converter', icon: '📏' },
                { name: 'BMI Calculator', slug: 'tools/bmi-calculator', icon: '⚖️' },
                { name: 'Loan EMI Calculator', slug: 'tools/loan-emi-calculator', icon: '🏦' },
              ].map(t => (
                <a key={t.slug} href={`/${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px',
                    padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#62646a',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>{t.icon} {t.name}</div>
                </a>
              ))}
            </div>
          </div>

          {/* CREDIT */}
          <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1.5rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px' }}>
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