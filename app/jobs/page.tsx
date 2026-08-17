'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget_min: number;
  budget_max: number;
  budget_type: string;
  level: string;
  duration: string;
  status: string;
  created_at: string;
  buyer_id: string;
};

const categories = ['All', 'Web Development', 'Mobile App', 'Design', 'SEO', 'Content Writing', 'Data Science', 'DevOps', 'WordPress', 'Other'];
const levels = ['All', 'Entry', 'Intermediate', 'Expert'];
const budgetTypes = ['All', 'Fixed', 'Hourly'];
const durations = ['All', 'Less than 1 week', '1-2 weeks', '1 month', '3+ months'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget_high', label: 'Budget: High to Low' },
  { value: 'budget_low', label: 'Budget: Low to High' },
];

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [budgetType, setBudgetType] = useState('All');
  const [duration, setDuration] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchJobs();
    };
    init();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, search, category, level, budgetType, duration, sortBy, minBudget, maxBudget, skillSearch]);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'Open')
      .order('created_at', { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...jobs];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.category?.toLowerCase().includes(q) ||
        j.skills?.some(s => s.toLowerCase().includes(q))
      );
    }

    // Skill search
    if (skillSearch.trim()) {
      result = result.filter(j =>
        j.skills?.some(s => s.toLowerCase().includes(skillSearch.toLowerCase()))
      );
    }

    // Category
    if (category !== 'All') result = result.filter(j => j.category === category);

    // Level
    if (level !== 'All') result = result.filter(j => j.level === level);

    // Budget Type
    if (budgetType !== 'All') result = result.filter(j => j.budget_type === budgetType);

    // Duration
    if (duration !== 'All') result = result.filter(j => j.duration === duration);

    // Budget Range
    if (minBudget) result = result.filter(j => j.budget_min >= parseFloat(minBudget));
    if (maxBudget) result = result.filter(j => j.budget_max <= parseFloat(maxBudget));

    // Sort
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sortBy === 'budget_high') result.sort((a, b) => (b.budget_max || b.budget_min) - (a.budget_max || a.budget_min));
    else if (sortBy === 'budget_low') result.sort((a, b) => (a.budget_min) - (b.budget_min));

    setFiltered(result);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setBudgetType('All');
    setDuration('All');
    setSortBy('newest');
    setMinBudget('');
    setMaxBudget('');
    setSkillSearch('');
  };

  const activeFilterCount = [
    category !== 'All',
    level !== 'All',
    budgetType !== 'All',
    duration !== 'All',
    minBudget !== '',
    maxBudget !== '',
    skillSearch !== '',
  ].filter(Boolean).length;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const levelColors: Record<string, { bg: string; color: string; border: string }> = {
    Entry: { bg: '#f0fdf4', color: '#1dbf73', border: '#bbf7d0' },
    Intermediate: { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
    Expert: { bg: '#faf5ff', color: '#8b5cf6', border: '#e9d5ff' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '2.5rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', marginBottom: '0.5rem' }}>
              Find Your Next Project 🚀
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {jobs.length} open jobs · Browse and apply instantly
            </p>

            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#95979d', fontSize: '1rem' }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search jobs by title, skill or keyword..."
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px',
                    border: 'none', borderRadius: '8px',
                    fontSize: '0.92rem', outline: 'none', color: '#404145',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                padding: '13px 16px', border: 'none', borderRadius: '8px',
                fontSize: '0.88rem', color: '#404145', cursor: 'pointer', outline: 'none',
              }}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={() => setShowFilters(!showFilters)} style={{
                padding: '13px 20px',
                background: showFilters ? '#1dbf73' : 'rgba(255,255,255,0.15)',
                border: `1px solid ${showFilters ? '#1dbf73' : 'rgba(255,255,255,0.3)'}`,
                borderRadius: '8px', color: '#fff', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>
        </div>

        {/* FILTERS PANEL */}
        {showFilters && (
          <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '1.5rem 5%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', cursor: 'pointer' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience Level</label>
                  <select value={level} onChange={e => setLevel(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', cursor: 'pointer' }}>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Budget Type */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget Type</label>
                  <select value={budgetType} onChange={e => setBudgetType(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', cursor: 'pointer' }}>
                    {budgetTypes.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', cursor: 'pointer' }}>
                    {durations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Min Budget */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Budget ($)</label>
                  <input type="number" value={minBudget} onChange={e => setMinBudget(e.target.value)} placeholder="0" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {/* Max Budget */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Budget ($)</label>
                  <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="Any" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {/* Skill Search */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill</label>
                  <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="e.g. React, Python..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ color: '#62646a', fontSize: '0.85rem' }}>
                  Showing <strong>{filtered.length}</strong> of <strong>{jobs.length}</strong> jobs
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                    ✕ Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 5%' }}>

          {/* Quick Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '6px 16px', borderRadius: '100px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s',
                background: category === cat ? '#1a1a2e' : '#fff',
                border: `1px solid ${category === cat ? '#1a1a2e' : '#e4e5e7'}`,
                color: category === cat ? '#fff' : '#62646a',
              }}>{cat}</button>
            ))}
          </div>

          {/* Results Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ color: '#62646a', fontSize: '0.88rem' }}>
              {loading ? 'Loading...' : `${filtered.length} job${filtered.length !== 1 ? 's' : ''} found`}
              {search && ` for "${search}"`}
            </div>
            {!user && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href="/login">
                  <button style={{ background: 'transparent', border: '1px solid #e4e5e7', color: '#404145', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>Login</button>
                </Link>
                <Link href="/signup">
                  <button style={{ background: '#1dbf73', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Join Free</button>
                </Link>
              </div>
            )}
          </div>

          {/* JOBS LIST */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem', animation: 'pulse 1.5s infinite' }}>
                  <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', width: '60%', marginBottom: '0.75rem' }} />
                  <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '80%', marginBottom: '0.5rem' }} />
                  <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '40%' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e4e5e7' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontWeight: 700, color: '#404145', marginBottom: '0.75rem' }}>No jobs found</h3>
              <p style={{ color: '#62646a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your filters or search terms
              </p>
              <button onClick={clearFilters} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map((job) => {
                const lvlStyle = levelColors[job.level] || levelColors.Entry;
                return (
                  <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff', border: '1px solid #e4e5e7',
                      borderRadius: '12px', padding: '1.5rem',
                      transition: 'all 0.2s', cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1dbf73'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,191,115,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e5e7'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {/* Job Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', margin: 0, flex: 1 }}>
                          {job.title}
                        </h2>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1dbf73', flexShrink: 0 }}>
                          {job.budget_type === 'Fixed'
                            ? `$${job.budget_min?.toLocaleString()} - $${job.budget_max?.toLocaleString()}`
                            : `$${job.budget_min}/hr`}
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description}
                      </p>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {job.skills.slice(0, 5).map(skill => (
                            <span key={skill} style={{
                              background: '#f0fdf4', color: '#1dbf73',
                              border: '1px solid #bbf7d0',
                              borderRadius: '4px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 500,
                            }}>{skill}</span>
                          ))}
                          {job.skills.length > 5 && (
                            <span style={{ color: '#95979d', fontSize: '0.75rem', padding: '3px 6px' }}>+{job.skills.length - 5} more</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ ...lvlStyle, borderRadius: '4px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${lvlStyle.border}` }}>
                            {job.level}
                          </span>
                          <span style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600 }}>
                            {job.budget_type}
                          </span>
                          {job.duration && (
                            <span style={{ color: '#95979d', fontSize: '0.75rem' }}>⏱️ {job.duration}</span>
                          )}
                          <span style={{ color: '#95979d', fontSize: '0.75rem' }}>📁 {job.category}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ color: '#95979d', fontSize: '0.75rem' }}>🕐 {timeAgo(job.created_at)}</span>
                          <span style={{ background: '#1dbf73', color: '#fff', borderRadius: '4px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600 }}>
                            Apply →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Post Job CTA */}
          {user && (
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', borderRadius: '12px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '0.3rem', fontSize: '1rem' }}>Need to hire a developer?</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Post your job and get proposals within hours</p>
              </div>
              <Link href="/post-job">
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  Post a Job →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}