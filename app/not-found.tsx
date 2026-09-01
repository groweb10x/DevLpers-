import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | DevLpers',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '8rem', color: '#1dbf73', lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
              Go Home →
            </button>
          </Link>
          <Link href="/jobs" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#fff', color: '#404145', border: '1px solid #e4e5e7', padding: '12px 28px', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}>
              Browse Jobs
            </button>
          </Link>
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Browse Developers', href: '/developers' },
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'AI Tools', href: '/ai-agents' },
            { label: 'Free Tools', href: '/tools' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}