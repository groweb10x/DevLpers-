'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

type Developer = {
  id: string;
  user_id: string;
  full_name: string;
  title: string;
  bio: string;
  hourly_rate: number;
  skills: string[];
  location: string;
  availability: string;
  avatar_url: string | null;
  created_at: string;
  rating?: number;
  total_reviews?: number;
  is_verified?: boolean;
  is_devmarket_choice?: boolean;
  level?: number;
};

const skillOptions = ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'PHP', 'Laravel', 'WordPress', 'Flutter', 'React Native', 'Vue.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'GraphQL', 'Swift', 'Kotlin'];
const availabilityOptions = ['All', 'available', 'busy', 'part-time'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'rate_low', label: 'Rate: Low to High' },
  { value: 'rate_high', label: 'Rate: High to Low' },
];

export default function Developers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [filtered, setFiltered] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchDevelopers();
    };
    init();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [developers, search, selectedSkills, availability, sortBy, minRate, maxRate, location]);

  const fetchDevelopers = async () => {
    setLoading(true);

    const { data: profiles } = await supabase
      .from('developer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profiles) { setLoading(false); return; }

    // Fetch ratings
    const { data: reviews } = await supabase
      .from('reviews')
      .select('reviewee_id, rating');

    // Fetch seller levels
    const { data: levels } = await supabase
      .from('seller_levels')
      .select('user_id, level, is_devmarket_choice');

    // Fetch user status
    const { data: statuses } = await supabase
      .from('user_status')
      .select('user_id, is_verified');

    const enriched = profiles.map(p => {
      const devReviews = reviews?.filter(r => r.reviewee_id === p.user_id) || [];
      const avgRating = devReviews.length > 0
        ? devReviews.reduce((s, r) => s + r.rating, 0) / devReviews.length
        : 0;
      const sellerLevel = levels?.find(l => l.user_id === p.user_id);
      const status = statuses?.find(s => s.user_id === p.user_id);

      return {
        ...p,
        rating: Math.round(avgRating * 10) / 10,
        total_reviews: devReviews.length,
        is_devmarket_choice: sellerLevel?.is_devmarket_choice || false,
        is_verified: status?.is_verified || false,
        level: sellerLevel?.level || 1,
      };
    });

    setDevelopers(enriched);
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...developers];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.full_name?.toLowerCase().includes(q) ||
        d.title?.toLowerCase().includes(q) ||
        d.bio?.toLowerCase().includes(q) ||
        d.location?.toLowerCase().includes(q) ||
        d.skills?.some(s => s.toLowerCase().includes(q))
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      result = result.filter(d =>
        selectedSkills.every(skill =>
          d.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Availability
    if (availability !== 'All') {
      result = result.filter(d => d.availability === availability);
    }

    // Location
    if (location.trim()) {
      result = result.filter(d =>
        d.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Rate range
    if (minRate) result = result.filter(d => (d.hourly_rate || 0) >= parseFloat(minRate));
    if (maxRate) result = result.filter(d => (d.hourly_rate || 0) <= parseFloat(maxRate));

    // Sort
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'rate_low') result.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
    else if (sortBy === 'rate_high') result.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));

    // DevLpers Choice first
    result.sort((a, b) => (b.is_devmarket_choice ? 1 : 0) - (a.is_devmarket_choice ? 1 : 0));

    setFiltered(result);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setAvailability('All');
    setSortBy('newest');
    setMinRate('');
    setMaxRate('');
    setLocation('');
  };

  const activeFilterCount = [
    selectedSkills.length > 0,
    availability !== 'All',
    minRate !== '',
    maxRate !== '',
    location !== '',
  ].filter(Boolean).length;

  const levelIcons: Record<number, string> = { 1: '🥉', 2: '🥈', 3: '🥇' };

  const StarRating = ({ rating }: { rating: number }) => (
    <div style={{ display: 'flex', gap: '1px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: '11px', color: s <= Math.round(rating) ? '#f59e0b' : '#e4e5e7' }}>★</span>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '2.5rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', marginBottom: '0.5rem' }}>
              Find Top Developers 🚀
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {developers.length} verified developers ready to work
            </p>

            {/* Search */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#95979d' }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, skill or location..."
                  style={{ width: '100%', padding: '13px 14px 13px 42px', border: 'none', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', color: '#404145', boxSizing: 'border-box' }}
                />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '13px 16px', border: 'none', borderRadius: '8px', fontSize: '0.88rem', color: '#404145', cursor: 'pointer', outline: 'none' }}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={() => setShowFilters(!showFilters)} style={{
                padding: '13px 20px',
                background: showFilters ? '#1dbf73' : 'rgba(255,255,255,0.15)',
                border: `1px solid ${showFilters ? '#1dbf73' : 'rgba(255,255,255,0.3)'}`,
                borderRadius: '8px', color: '#fff', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 600,
              }}>
                ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div style={{ background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '1.5rem 5%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

                {/* Availability */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</label>
                  <select value={availability} onChange={e => setAvailability(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', cursor: 'pointer' }}>
                    {availabilityOptions.map(a => <option key={a} value={a}>{a === 'All' ? 'All' : a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Pakistan, USA..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {/* Min Rate */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Rate ($/hr)</label>
                  <input type="number" value={minRate} onChange={e => setMinRate(e.target.value)} placeholder="0" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {/* Max Rate */}
                <div>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Rate ($/hr)</label>
                  <input type="number" value={maxRate} onChange={e => setMaxRate(e.target.value)} placeholder="Any" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.85rem', color: '#404145', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Skills Filter */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#62646a', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Filter by Skills {selectedSkills.length > 0 && `(${selectedSkills.length} selected)`}
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {skillOptions.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill)} style={{
                      padding: '5px 12px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
                      background: selectedSkills.includes(skill) ? '#1dbf73' : '#fff',
                      border: `1px solid ${selectedSkills.includes(skill) ? '#1dbf73' : '#e4e5e7'}`,
                      color: selectedSkills.includes(skill) ? '#fff' : '#62646a',
                    }}>{skill}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ color: '#62646a', fontSize: '0.85rem' }}>
                  Showing <strong>{filtered.length}</strong> of <strong>{developers.length}</strong> developers
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                    ✕ Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 5%' }}>

          {/* Results Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ color: '#62646a', fontSize: '0.88rem' }}>
              {loading ? 'Loading...' : `${filtered.length} developer${filtered.length !== 1 ? 's' : ''} found`}
              {search && ` for "${search}"`}
            </div>
            {!user && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href="/login"><button style={{ background: 'transparent', border: '1px solid #e4e5e7', color: '#404145', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>Login</button></Link>
                <Link href="/signup"><button style={{ background: '#1dbf73', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Join Free</button></Link>
              </div>
            )}
          </div>

          {/* DEVELOPERS GRID */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f0f0', marginBottom: '1rem' }} />
                  <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '70%', marginBottom: '0.5rem' }} />
                  <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '50%' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e4e5e7' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💻</div>
              <h3 style={{ fontWeight: 700, color: '#404145', marginBottom: '0.75rem' }}>No developers found</h3>
              <p style={{ color: '#62646a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try adjusting your filters</p>
              <button onClick={clearFilters} style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {filtered.map(dev => (
                <Link key={dev.user_id} href={`/developers/${dev.user_id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: `1px solid ${dev.is_devmarket_choice ? '#fde68a' : '#e4e5e7'}`,
                    borderRadius: '12px', padding: '1.5rem',
                    transition: 'all 0.2s', cursor: 'pointer',
                    boxShadow: dev.is_devmarket_choice ? '0 2px 12px rgba(245,158,11,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                    position: 'relative', height: '100%', boxSizing: 'border-box',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dev.is_devmarket_choice ? '0 2px 12px rgba(245,158,11,0.15)' : '0 1px 4px rgba(0,0,0,0.04)'; }}
                  >
                    {/* DevLpers Choice Badge */}
                    {dev.is_devmarket_choice && (
                      <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', borderRadius: '100px', padding: '3px 14px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        ⭐ DevLpers Choice
                      </div>
                    )}

                    {/* Header */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', marginTop: dev.is_devmarket_choice ? '0.5rem' : '0' }}>
                      {dev.avatar_url ? (
                        <img src={dev.avatar_url} alt={dev.full_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e4e5e7', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', flexShrink: 0 }}>
                          {dev.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {dev.full_name || 'Developer'}
                          </div>
                          {dev.is_verified && <span style={{ color: '#1dbf73', fontSize: '0.8rem' }}>✓</span>}
                          <span style={{ fontSize: '0.75rem' }}>{levelIcons[dev.level || 1]}</span>
                        </div>
                        <div style={{ color: '#62646a', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {dev.title || 'Developer'}
                        </div>
                        {dev.location && (
                          <div style={{ color: '#95979d', fontSize: '0.75rem' }}>📍 {dev.location}</div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {(dev.total_reviews ?? 0) > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                        <StarRating rating={dev.rating || 0} />
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#f59e0b' }}>{dev.rating}</span>
                        <span style={{ color: '#95979d', fontSize: '0.75rem' }}>({dev.total_reviews})</span>
                      </div>
                    )}

                    {/* Bio */}
                    {dev.bio && (
                      <p style={{ color: '#62646a', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dev.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {dev.skills && dev.skills.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {dev.skills.slice(0, 4).map(skill => (
                          <span key={skill} style={{
                            background: selectedSkills.includes(skill) ? '#1dbf73' : '#f0fdf4',
                            color: selectedSkills.includes(skill) ? '#fff' : '#1dbf73',
                            border: `1px solid ${selectedSkills.includes(skill) ? '#1dbf73' : '#bbf7d0'}`,
                            borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 500,
                          }}>{skill}</span>
                        ))}
                        {dev.skills.length > 4 && (
                          <span style={{ color: '#95979d', fontSize: '0.7rem', padding: '2px 4px' }}>+{dev.skills.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                      <div>
                        {dev.hourly_rate ? (
                          <span style={{ fontWeight: 800, color: '#1dbf73', fontSize: '0.9rem' }}>${dev.hourly_rate}/hr</span>
                        ) : (
                          <span style={{ color: '#95979d', fontSize: '0.82rem' }}>Rate not set</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          background: dev.availability === 'available' ? '#f0fdf4' : dev.availability === 'busy' ? '#fef2f2' : '#fffbeb',
                          color: dev.availability === 'available' ? '#1dbf73' : dev.availability === 'busy' ? '#dc2626' : '#f59e0b',
                          border: `1px solid ${dev.availability === 'available' ? '#bbf7d0' : dev.availability === 'busy' ? '#fecaca' : '#fde68a'}`,
                          borderRadius: '100px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600,
                        }}>
                          {dev.availability === 'available' ? '● Available' : dev.availability === 'busy' ? '● Busy' : '● Part-time'}
                        </span>
                        <span style={{ background: '#1dbf73', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Post Job CTA */}
          <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', borderRadius: '12px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '0.3rem', fontSize: '1rem' }}>Ready to hire?</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Post a job and get proposals from top developers</p>
            </div>
            <Link href="/post-job">
              <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Post a Job →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}