'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

const skillsList = ['All', 'React', 'Flutter', 'Python', 'Node.js', 'Laravel', 'WordPress', 'Figma', 'React Native', 'TypeScript'];

export default function JobsFeed() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [saved, setSaved] = useState<string[]>([]);
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data, error } = await supabase
        .from('jobs').select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setDbJobs(data);
      setLoadingJobs(false);
    };
    fetchData();
  }, []);

  const toggleSave = (id: string) => {
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const filtered = dbJobs.filter(job => {
    const matchSearch = job.title?.toLowerCase().includes(search.toLowerCase()) ||
      (job.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchSkill = selectedSkill === 'All' || (job.skills || []).includes(selectedSkill);
    const matchType = selectedType === 'All' || job.budget_type === selectedType;
    const matchLevel = selectedLevel === 'All' || job.level === selectedLevel;
    return matchSearch && matchSkill && matchType && matchLevel;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '2rem 5%',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', marginBottom: '1rem', color: 'var(--text)' }}>
              Find Your Next Project
            </h1>

            {/* Search */}
            <div style={{ display: 'flex', gap: '0', maxWidth: '600px', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
              <span style={{ padding: '0 14px', display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: '1rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Search jobs or skills..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, padding: '11px 0',
                  border: 'none', outline: 'none',
                  fontSize: '0.9rem', color: 'var(--text)',
                  background: '#fff',
                }}
              />
              <button style={{
                padding: '11px 20px',
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer',
              }}>Search</button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Type */}
              {['All', 'Fixed', 'Hourly'].map(t => (
                <button key={t} onClick={() => setSelectedType(t)} style={{
                  padding: '5px 14px',
                  background: selectedType === t ? 'var(--accent)' : '#fff',
                  border: `1px solid ${selectedType === t ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px',
                  color: selectedType === t ? '#fff' : 'var(--text2)',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'all 0.2s',
                }}>{t === 'All' ? 'All Types' : t}</button>
              ))}
              <div style={{ width: '1px', background: 'var(--border)', margin: '0 0.25rem' }} />
              {['All', 'Entry', 'Intermediate', 'Expert'].map(l => (
                <button key={l} onClick={() => setSelectedLevel(l)} style={{
                  padding: '5px 14px',
                  background: selectedLevel === l ? '#f0fdf4' : '#fff',
                  border: `1px solid ${selectedLevel === l ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px',
                  color: selectedLevel === l ? 'var(--accent)' : 'var(--text2)',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'all 0.2s',
                }}>{l === 'All' ? 'All Levels' : l}</button>
              ))}
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
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

        {/* JOBS */}
        <div style={{ padding: '1.5rem 5%', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {loadingJobs ? 'Loading jobs...' : `${filtered.length} jobs found`}
          </p>

          {loadingJobs ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Loading jobs...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map(job => (
                <div key={job.id} style={{
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '1.5rem',
                  transition: 'all 0.2s', cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,191,115,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      {/* Title & Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>{job.title}</h3>
                        <span style={{
                          background: job.budget_type === 'Hourly' ? '#f0fdf4' : '#eff6ff',
                          color: job.budget_type === 'Hourly' ? 'var(--accent)' : '#3b82f6',
                          border: `1px solid ${job.budget_type === 'Hourly' ? '#bbf7d0' : '#bfdbfe'}`,
                          borderRadius: '100px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600,
                        }}>{job.budget_type}</span>
                        <span style={{
                          background: '#fafafa', color: 'var(--text2)',
                          border: '1px solid var(--border)',
                          borderRadius: '100px', padding: '2px 10px', fontSize: '0.72rem',
                        }}>{job.level}</span>
                      </div>

                      {/* Description */}
                      <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                        {job.description?.slice(0, 160)}{job.description?.length > 160 ? '...' : ''}
                      </p>

                      {/* Skills */}
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {(job.skills || []).map((skill: string) => (
                          <span key={skill} style={{
                            background: '#f5f5f5', color: 'var(--text2)',
                            borderRadius: '4px', padding: '3px 10px',
                            fontSize: '0.75rem', fontWeight: 500,
                          }}>{skill}</span>
                        ))}
                      </div>

                      {/* Meta */}
                      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--muted)', fontSize: '0.78rem' }}>
                        <span>📁 {job.category}</span>
                        <span>⏱️ {job.duration}</span>
                        <span>🟢 {job.status}</span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                      <button onClick={() => toggleSave(job.id)} style={{
                        background: 'transparent', border: 'none',
                        fontSize: '1.2rem', cursor: 'pointer', color: saved.includes(job.id) ? 'var(--accent)' : 'var(--muted)',
                      }}>
                        {saved.includes(job.id) ? '🔖' : '📄'}
                      </button>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>
                        ${job.budget_min}{job.budget_max ? ` - $${job.budget_max}` : '/hr'}
                      </div>
                      {user ? (
                        <Link href={`/jobs/${job.id}`}>
                          <button style={{
                            background: 'var(--accent)', color: '#fff',
                            border: 'none', padding: '8px 20px',
                            borderRadius: '4px', cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.85rem',
                            transition: 'background 0.2s',
                          }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent-dark)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent)'}
                          >Apply Now</button>
                        </Link>
                      ) : (
                        <Link href="/login">
                          <button style={{
                            background: 'var(--accent)', color: '#fff',
                            border: 'none', padding: '8px 20px',
                            borderRadius: '4px', cursor: 'pointer',
                            fontWeight: 600, fontSize: '0.85rem',
                          }}>Login to Apply</button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {!loadingJobs && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', background: '#fff', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p style={{ marginBottom: '1rem', fontWeight: 500 }}>No jobs found matching your filters</p>
                  {user && (
                    <Link href="/post-job">
                      <button style={{
                        background: 'var(--accent)', color: '#fff',
                        border: 'none', padding: '10px 24px',
                        borderRadius: '4px', cursor: 'pointer', fontWeight: 600,
                      }}>Post a Job</button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}