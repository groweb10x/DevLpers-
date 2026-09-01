export default function Loading() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <div style={{ width: '260px', background: '#fff', borderRight: '1px solid #e4e5e7' }} />
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ height: '40px', background: '#f0f0f0', borderRadius: '8px', width: '200px', marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: '100px', background: '#f0f0f0', borderRadius: '8px' }} />)}
        </div>
        <div style={{ height: '300px', background: '#f0f0f0', borderRadius: '8px' }} />
      </div>
    </div>
  );
}