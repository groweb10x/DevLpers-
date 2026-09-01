import Link from 'next/link';
export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#1dbf73' }}>404</h1>
        <h2 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: '#62646a', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <Link href="/">
          <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Go Home →
          </button>
        </Link>
      </div>
    </div>
  );
}