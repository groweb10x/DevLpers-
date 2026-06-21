'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function PngToWebp() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [quality, setQuality] = useState('0.9');
  const [converting, setConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.match('image/(png|jpeg|jpg)')) {
      alert('Please upload a PNG or JPG image');
      return;
    }
    setFileName(file.name.replace(/\.(png|jpe?g)$/i, ''));
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setConvertedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const convertToWebp = () => {
    if (!originalImage || !canvasRef.current) return;
    setConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setConvertedImage(url);
          setConvertedSize(blob.size);
        }
        setConverting(false);
      }, 'image/webp', parseFloat(quality));
    };
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!convertedImage) return;
    const a = document.createElement('a');
    a.href = convertedImage;
    a.download = `${fileName}.webp`;
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savedPercent = originalSize > 0 && convertedSize > 0
    ? (((originalSize - convertedSize) / originalSize) * 100).toFixed(0)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '2rem 5%' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '0.75rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: '#404145', marginBottom: '0.5rem' }}>
              🖼️ PNG to WebP Converter
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.92rem' }}>
              Convert PNG or JPG images to WebP instantly — right in your browser. No upload, no waiting.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>

            {/* Upload Zone */}
            {!originalImage ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                style={{
                  border: '2px dashed #e4e5e7', borderRadius: '12px',
                  padding: '3rem 2rem', textAlign: 'center',
                  cursor: 'pointer', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e4e5e7'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
                <p style={{ color: '#404145', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Click to upload or drag & drop
                </p>
                <p style={{ color: '#95979d', fontSize: '0.85rem' }}>PNG or JPG, up to 10MB</p>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
              </div>
            ) : (
              <>
                {/* Preview */}
                <div style={{ display: 'grid', gridTemplateColumns: convertedImage ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ color: '#62646a', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600 }}>Original</div>
                    <img src={originalImage} alt="Original" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e4e5e7' }} />
                    <div style={{ color: '#95979d', fontSize: '0.78rem', marginTop: '0.4rem' }}>{formatSize(originalSize)}</div>
                  </div>
                  {convertedImage && (
                    <div>
                      <div style={{ color: '#1dbf73', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600 }}>WebP</div>
                      <img src={convertedImage} alt="Converted" style={{ width: '100%', borderRadius: '8px', border: '1px solid #bbf7d0' }} />
                      <div style={{ color: '#1dbf73', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>{formatSize(convertedSize)}</div>
                    </div>
                  )}
                </div>

                {/* Quality Slider */}
                {!convertedImage && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                      Quality: {Math.round(parseFloat(quality) * 100)}%
                    </label>
                    <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(e.target.value)}
                      style={{ width: '100%', accentColor: '#1dbf73' }} />
                  </div>
                )}

                {/* Savings Badge */}
                {convertedImage && Number(savedPercent) > 0 && (
                  <div style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: '8px', padding: '0.85rem', textAlign: 'center',
                    color: '#1dbf73', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem',
                  }}>
                    🎉 {savedPercent}% smaller file size!
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {!convertedImage ? (
                    <button onClick={convertToWebp} disabled={converting} style={{
                      flex: 1, padding: '12px',
                      background: converting ? '#a7f3d0' : '#1dbf73',
                      border: 'none', borderRadius: '6px', color: '#fff',
                      fontWeight: 700, fontSize: '0.95rem', cursor: converting ? 'not-allowed' : 'pointer',
                    }}>{converting ? 'Converting...' : 'Convert to WebP'}</button>
                  ) : (
                    <button onClick={downloadImage} style={{
                      flex: 1, padding: '12px',
                      background: '#1dbf73', border: 'none', borderRadius: '6px',
                      color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                    }}>⬇️ Download WebP</button>
                  )}
                  <button onClick={() => { setOriginalImage(null); setConvertedImage(null); }} style={{
                    padding: '12px 20px', background: '#fff',
                    border: '1px solid #e4e5e7', borderRadius: '6px',
                    color: '#62646a', cursor: 'pointer', fontSize: '0.9rem',
                  }}>Upload New</button>
                </div>
              </>
            )}
          </div>

          {/* RELATED TOOLS */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Image Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'JPG to PNG', slug: 'jpg-to-png', icon: '🔄' },
                { name: 'Image Compressor', slug: 'image-compressor', icon: '🗜️' },
                { name: 'Image Resizer', slug: 'image-resizer', icon: '📐' },
              ].map(t => (
                <a key={t.slug} href={`/tools/${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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