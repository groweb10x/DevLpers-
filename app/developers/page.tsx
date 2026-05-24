'use client';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const skillsList = ['All', 'React', 'Flutter', 'Python', 'Node.js', 'Laravel', 'WordPress', 'Figma', 'React Native', 'TypeScript', 'AWS', 'Docker'];

const levelColors: Record<number, string> = {
  1: '#cd7f32',
  2: '#c0c0c0',
  3: '#ffd700',
};

const levelIcons: Record<number, string> = {
  1: '🥉',
  2: '🥈',
  3: '🥇',
};

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <Navbar />

      <div style={{ paddingTop: '80px' }}>

        {/* HERO SEARCH */}
        <div style={{
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 5%',
        }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>
            Browse Top Developers 👨‍💻
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Find verified developers for your next project
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '1.5rem' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, skill or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px 12px 40px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '10px', color: 'var(--text)',
                fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Level Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {['All', '1', '2', '3'].map(l => (
              <button key={l} onClick={() => setSelectedLevel(l)} style={{
                padding: '6px 16px',
                background: selectedLevel === l ? 'rgba(108,99,255,0.15)' : 'transparent',
                border: `1px solid ${selectedLevel === l ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '100px', color: selectedLevel === l ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
              }}>
                {l === 'All' ? 'All Levels' : l === '1' ? '🥉 Level 1' : l === '2' ? '🥈 Level 2' : '🥇 Level 3'}
              </button>
            ))}
          </div>

          {/* Skills Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {skillsList.map(skill => (
              <button key={skill} onClick={() => setSelectedSkill(skill)} style={{
                padding: '5px 14px',
                background: selectedSkill === skill ? 'rgba(108,99,255,0.15)' : 'transparent',
                border: `1px solid ${selectedSkill === skill ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '100px', color: selectedSkill === skill ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s',
              }}>{skill}</button>
            ))}
          </div>
        </div>

        {/* DEVELOPERS LIST */}
        <div style={{ padding: '2rem 5%' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {loading ? 'Loading...' : `${filtered.length} developers found`}
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Loading developers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💻</div>
              <p style={{ marginBottom: '1rem' }}>No developers found</p>
              <Link href="/signup">
                <button style={{
                  background: 'var(--accent)', color: '#fff',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Syne', fontWeight: 600,
                }}>Join as Developer →</button>
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {filtered.map((dev, i) => (
                <div key={i} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.75rem',
                  transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* DevMarket Choice Badge */}
                  {dev.seller_levels?.is_devmarket_choice && (
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: 'rgba(108,99,255,0.15)',
                      border: '1px solid rgba(108,99,255,0.3)',
                      borderRadius: '6px', padding: '2px 8px',
                      fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600,
                    }}>⭐ DevLpers Choice</div>
                  )}

                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne', fontWeight: 700, fontSize: '1.3rem', color: '#fff',
                      flexShrink: 0,
                    }}>{dev.full_name?.[0]?.toUpperCase() || '?'}</div>
                    <div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem' }}>
                        {dev.full_name || 'Developer'}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{dev.title || 'Developer'}</div>
                      <div style={{
                        color: levelColors[dev.seller_levels?.level || 1],
                        fontSize: '0.75rem', fontWeight: 600,
                      }}>
                        {levelIcons[dev.seller_levels?.level || 1]} Level {dev.seller_levels?.level || 1}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {(dev.skills || []).slice(0, 4).map((skill: string) => (
                      <span key={skill} style={{
                        background: 'rgba(108,99,255,0.08)',
                        border: '1px solid rgba(108,99,255,0.2)',
                        borderRadius: '6px', padding: '3px 10px',
                        fontSize: '0.75rem', color: 'var(--accent)',
                      }}>{skill}</span>
                    ))}
                  </div>

                  {/* Bio */}
                  {dev.bio && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {dev.bio.slice(0, 100)}{dev.bio.length > 100 ? '...' : ''}
                    </p>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', fontSize: '1rem' }}>
                      {dev.hourly_rate ? `$${dev.hourly_rate}/hr` : 'Rate: TBD'}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      📍 {dev.location || 'Remote'}
                    </div>
                  </div>

                  {/* Availability */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      background: dev.availability === 'available' ? 'rgba(0,212,170,0.1)' : 'rgba(255,101,132,0.1)',
                      color: dev.availability === 'available' ? 'var(--green)' : 'var(--accent2)',
                      border: `1px solid ${dev.availability === 'available' ? 'rgba(0,212,170,0.3)' : 'rgba(255,101,132,0.3)'}`,
                      borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {dev.availability === 'available' ? '● Available' : '● Busy'}
                    </span>
                  </div>

                  <Link href={`/developers/${dev.user_id}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', padding: '10px',
                      background: 'transparent', border: '1px solid var(--border)',
                      color: 'var(--text)', borderRadius: '8px',
                      cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                    >View Profile →</button>
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