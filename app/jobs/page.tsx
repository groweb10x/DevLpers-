'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const skillsList = ['All', 'React', 'Flutter', 'Python', 'Node.js', 'Laravel', 'WordPress', 'Figma', 'React Native'];

export default function JobsFeed() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [saved, setSaved] = useState<string[]>([]);
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setDbJobs(data);
      setLoadingJobs(false);
    };
    fetchJobs();
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
            Dev<span style={{ color: 'var(--text)' }}>Market</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard">
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 18px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            }}>Dashboard</button>
          </Link>
          <Link href="/post-job">
            <button style={{
              background: 'var(--accent)', border: 'none',
              color: '#fff', padding: '8px 18px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            }}>Post a Job</button>
          </Link>
        </div>
      </nav>

      <div style={{ paddingTop: '80px' }}>
        <div style={{
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 5%',
        }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1.5rem' }}>
            Find Your Next Project 🚀
          </h1>

          <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '1.5rem' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search jobs or skills..."
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

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Fixed', 'Hourly'].map(t => (
                <button key={t} onClick={() => setSelectedType(t)} style={{
                  padding: '6px 16px',
                  background: selectedType === t ? 'var(--accent)' : 'transparent',
                  border: `1px solid ${selectedType === t ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '100px', color: selectedType === t ? '#fff' : 'var(--muted)',
                  cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Entry', 'Intermediate', 'Expert'].map(l => (
                <button key={l} onClick={() => setSelectedLevel(l)} style={{
                  padding: '6px 16px',
                  background: selectedLevel === l ? 'rgba(0,212,170,0.15)' : 'transparent',
                  border: `1px solid ${selectedLevel === l ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: '100px', color: selectedLevel === l ? 'var(--green)' : 'var(--muted)',
                  cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
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

        <div style={{ padding: '2rem 5%' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {loadingJobs ? 'Loading...' : `${filtered.length} jobs found`}
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
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.5rem',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem' }}>{job.title}</h3>
                        <span style={{
                          background: job.budget_type === 'Hourly' ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)',
                          color: job.budget_type === 'Hourly' ? 'var(--green)' : 'var(--accent)',
                          border: `1px solid ${job.budget_type === 'Hourly' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}`,
                          borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                        }}>{job.budget_type}</span>
                        <span style={{
                          background: 'rgba(255,101,132,0.1)', color: 'var(--accent2)',
                          border: '1px solid rgba(255,101,132,0.3)',
                          borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem',
                        }}>{job.level}</span>
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {job.description?.slice(0, 150)}{job.description?.length > 150 ? '...' : ''}
                      </p>
                    </div>
                    <button onClick={() => toggleSave(job.id)} style={{
                      background: 'transparent', border: 'none',
                      fontSize: '1.3rem', cursor: 'pointer', marginLeft: '1rem',
                    }}>
                      {saved.includes(job.id) ? '🔖' : '📄'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {(job.skills || []).map((skill: string) => (
                      <span key={skill} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: '6px', padding: '3px 10px',
                        fontSize: '0.78rem', color: 'var(--muted)',
                      }}>{skill}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--muted)', fontSize: '0.82rem' }}>
                      <span>📁 {job.category}</span>
                      <span>⏱️ {job.duration}</span>
                      <span>📊 {job.status}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', fontSize: '1rem' }}>
                        ${job.budget_min}{job.budget_max ? ` - $${job.budget_max}` : '/hr'}
                      </span>
                      <Link href={`/jobs/${job.id}`}>
                        <button style={{
                          background: 'var(--accent)', color: '#fff',
                          border: 'none', padding: '8px 20px',
                          borderRadius: '8px', cursor: 'pointer',
                          fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem',
                        }}>Apply Now</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {!loadingJobs && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p>No jobs found</p>
                  <Link href="/post-job">
                    <button style={{
                      marginTop: '1rem', background: 'var(--accent)',
                      color: '#fff', border: 'none', padding: '10px 24px',
                      borderRadius: '8px', cursor: 'pointer',
                      fontFamily: 'Syne', fontWeight: 600,
                    }}>Post a Job</button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}