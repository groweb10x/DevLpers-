export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e4e5e7' }} />
      <div style={{ height: '200px', background: '#1a1a2e' }} />
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 5%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ height: '160px', background: '#fff', borderRadius: '12px', border: '1px solid #e4e5e7', padding: '1.5rem' }}>
            <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', width: '60%', marginBottom: '1rem' }} />
            <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '80%', marginBottom: '0.5rem' }} />
            <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '40%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}