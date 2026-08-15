'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';



const mobileStyles = `
@media (max-width: 768px){
  .dev-header{padding:1.25rem 1rem !important;}
  .dev-content{padding:1rem !important;}
  .dev-grid{grid-template-columns:1fr !important;}
  .dev-search{max-width:100% !important;}
  .dev-card{padding:1rem !important;}
  .dev-top{flex-wrap:wrap !important;}
  .dev-meta{flex-direction:column !important;align-items:flex-start !important;gap:.5rem !important;}
}
`;


const skillsList = ['All', 'React', 'Flutter', 'Python', 'Node.js', 'Laravel', 'WordPress', 'Figma', 'React Native', 'TypeScript', 'AWS', 'Docker'];

export default function DevelopersFeed() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const { data, error } = await supabase
        .from('developer_profiles')
        .select('*, seller_levels(*)')
        .order('created_at', { ascending: false });
      if (!error && data) setDevelopers(data);
      setLoading(false);
    };
    fetchDevelopers();
  }, []);

  const filtered = developers.filter(dev => {
    const matchSearch = dev.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      dev.title?.toLowerCase().includes(search.toLowerCase()) ||
      (dev.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchSkill = selectedSkill === 'All' || (dev.skills || []).includes(selectedSkill);
    const matchLevel = selectedLevel === 'All' || dev.seller_levels?.level === Number(selectedLevel);
    return matchSearch && matchSkill && matchLevel;
  });

  const levelLabels: Record<number, string> = { 1: 'Level 1', 2: 'Level 2', 3: 'Level 3' };
  const levelColors: Record<number, string> = { 1: '#92400e', 2: '#4b5563', 3: '#78350f' };
  const levelBg: Record<number, string> = { 1: '#fef3c7', 2: '#f3f4f6', 3: '#fef9c3' };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}><style>{mobileStyles}</style>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: 'clamp(1rem,4vw,2rem) clamp(1rem,5vw,5%)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', marginBottom: '0.5rem', color: 'var(--text)' }}>
              Browse Top Developers
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Find verified developers for your next project
            </p>

            {/* Search */}
            <div style={{ display: 'flex', gap: '0', maxWidth: '500px', width:'100%', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
              <span style={{ padding: '0 14px', display: 'flex', alignItems: 'center', color: 'var(--muted)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by name, skill or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, padding: '11px 0',
                  border: 'none', outline: 'none',
                  fontSize: '0.9rem', color: 'var(--text)', background: '#fff',
                }}
              />
            </div>

            {/* Level Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {['All', '1', '2', '3'].map(l => (
                <button key={l} onClick={() => setSelectedLevel(l)} style={{
                  padding: '5px 14px',
                  background: selectedLevel === l ? 'var(--accent)' : '#fff',
                  border: `1px solid ${selectedLevel === l ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px',
                  color: selectedLevel === l ? '#fff' : 'var(--text2)',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                }}>
                  {l === 'All' ? 'All Levels' : l === '1' ? '🥉 Level 1' : l === '2' ? '🥈 Level 2' : '🥇 Level 3'}
                </button>
              ))}
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {skillsList.map(skill => (
                <button key={skill} onClick={() => setSelectedSkill(skill)} style={{
                  padding: '4px 12px',
                  background: selectedSkill === skill ? '#e8fdf2' : '#fff',
                  border: `1px solid ${selectedSkill === skill ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px',
                  color: selectedSkill === skill ? 'var(--accent)' : 'var(--text2)',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
                }}>{skill}</button>
              ))}
            </div>
          </div>
        </div>

        {/* DEVELOPERS */}
        <div className='dev-content' style={{ padding: '1.5rem 5%', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {loading ? 'Loading...' : `${filtered.length} developers found`}
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Loading developers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', background: '#fff', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💻</div>
              <p style={{ marginBottom: '1rem', fontWeight: 500 }}>No developers found</p>
              <Link href="/signup">
                <button style={{
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '4px', cursor: 'pointer', fontWeight: 600,
                }}>Join as Developer →</button>
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}>
              {filtered.map((dev, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '1.5rem',
                  transition: 'all 0.2s', cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,191,115,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* DevLpers Choice Badge */}
                  {dev.seller_levels?.is_devmarket_choice && (
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: '#fef9c3', color: '#78350f',
                      border: '1px solid #fde68a',
                      borderRadius: '4px', padding: '2px 8px',
                      fontSize: '0.7rem', fontWeight: 600,
                    }}>⭐ DevLpers Choice</div>
                  )}

                  {/* Avatar + Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {dev.avatar_url ? (
                      <img src={dev.avatar_url} alt={dev.full_name}
                        style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: 'var(--accent)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '1.2rem', flexShrink: 0,
                      }}>{dev.full_name?.[0]?.toUpperCase() || '?'}</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                        {dev.full_name || 'Developer'}
                      </div>
                      <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                        {dev.title || 'Developer'}
                      </div>
                      <span style={{
                        background: levelBg[dev.seller_levels?.level || 1],
                        color: levelColors[dev.seller_levels?.level || 1],
                        fontSize: '0.7rem', fontWeight: 600,
                        padding: '2px 8px', borderRadius: '4px',
                      }}>
                        {dev.seller_levels?.level === 1 ? '🥉' : dev.seller_levels?.level === 2 ? '🥈' : '🥇'} {levelLabels[dev.seller_levels?.level || 1]}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {(dev.skills || []).slice(0, 4).map((skill: string) => (
                      <span key={skill} style={{
                        background: '#f5f5f5', color: 'var(--text2)',
                        borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem',
                      }}>{skill}</span>
                    ))}
                    {(dev.skills || []).length > 4 && (
                      <span style={{ background: '#f0fdf4', color: 'var(--accent)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 600 }}>
                        +{dev.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  {dev.bio && (
                    <p style={{ color: 'var(--text2)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {dev.bio.slice(0, 90)}{dev.bio.length > 90 ? '...' : ''}
                    </p>
                  )}

                  {/* Rate + Location + Availability */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>
                      {dev.hourly_rate ? `$${dev.hourly_rate}/hr` : 'Rate: TBD'}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                      📍 {dev.location || 'Remote'}
                    </div>
                  </div>

                  {/* Availability */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      background: dev.availability === 'available' ? '#f0fdf4' : '#fef2f2',
                      color: dev.availability === 'available' ? 'var(--accent)' : '#dc2626',
                      border: `1px solid ${dev.availability === 'available' ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: '100px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {dev.availability === 'available' ? '● Available' : '● Busy'}
                    </span>
                  </div>

                  <Link href={`/developers/${dev.user_id}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', padding: '10px',
                      background: '#fff', border: '1px solid var(--accent)',
                      color: 'var(--accent)', borderRadius: '4px',
                      cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                    >View Profile</button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}