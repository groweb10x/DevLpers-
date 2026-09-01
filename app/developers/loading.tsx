export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e4e5e7' }} />
      <div style={{ height: '200px', background: '#1a1a2e' }} />
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: '280px', background: '#fff', borderRadius: '12px', border: '1px solid #e4e5e7', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f0f0', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '70%', marginBottom: '0.5rem' }} />
                  <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '50%' }} />
                </div>
              </div>
              <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '90%', marginBottom: '0.5rem' }} />
              <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '70%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}