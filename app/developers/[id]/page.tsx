'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import ReviewSystem from '../../components/ReviewSystem';

export default function DeveloperProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [developer, setDeveloper] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sellerLevel, setSellerLevel] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [proposals, setProposals] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchDeveloper();
    };
    init();
  }, [id]);

  const fetchDeveloper = async () => {
    setLoading(true);

    // Fetch profile
    const { data: profile } = await supabase
      .from('developer_profiles')
      .select('*')
      .eq('user_id', id)
      .maybeSingle();

    if (!profile) { setLoading(false); return; }
    setDeveloper(profile);

    // Fetch seller level
    const { data: level } = await supabase
      .from('seller_levels')
      .select('*')
      .eq('user_id', id)
      .maybeSingle();
    if (level) setSellerLevel(level);

    // Fetch status
    const { data: userStatus } = await supabase
      .from('user_status')
      .select('*')
      .eq('user_id', id)
      .maybeSingle();
    if (userStatus) setStatus(userStatus);

    // Fetch proposals count
    const { count: propCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('developer_id', id);
    setProposals(propCount || 0);

    // Fetch reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', id);

    if (reviews && reviews.length > 0) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      setAvgRating(Math.round(avg * 10) / 10);
      setTotalReviews(reviews.length);
    }

    setLoading(false);
  };

  const sendMessage = async () => {
    if (!user) { window.location.href = '/login'; return; }
    window.location.href = `/messages?with=${id}`;
  };

  const levelIcons: Record<number, string> = { 1: '🥉', 2: '🥈', 3: '🥇' };
  const levelLabels: Record<number, string> = { 1: 'Level 1', 2: 'Level 2', 3: 'Level 3' };
  const levelColors: Record<number, string> = { 1: '#92400e', 2: '#374151', 3: '#78350f' };
  const levelBg: Record<number, string> = { 1: '#fef3c7', 2: '#f3f4f6', 3: '#fef9c3' };

  const StarDisplay = ({ rating, size = 14 }: { rating: number; size?: number }) => (
    <div style={{ display: 'flex', gap: '1px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? '#f59e0b' : '#e4e5e7' }}>★</span>
      ))}
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading profile...</p>
      </div>
    </div>
  );

  if (!developer) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
        <h3 style={{ fontWeight: 700, color: '#404145', marginBottom: '0.75rem' }}>Developer not found</h3>
        <Link href="/developers">
          <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Browse Developers →
          </button>
        </Link>
      </div>
    </div>
  );

  const level = sellerLevel?.level || 1;
  const isOwnProfile = user?.id === id;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO BANNER */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '2.5rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Link href="/developers" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Back to Developers
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5% 3rem' }}>

          {/* PROFILE CARD */}
          <div style={{
            background: '#fff', border: '1px solid #e4e5e7',
            borderRadius: '16px', padding: '2rem',
            marginTop: '-30px', marginBottom: '1.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            position: 'relative',
          }}>

            {/* DevLpers Choice */}
            {sellerLevel?.is_devmarket_choice && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', borderRadius: '100px', padding: '4px 18px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
                ⭐ DevLpers Choice Developer
              </div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: sellerLevel?.is_devmarket_choice ? '0.75rem' : '0' }}>

              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {developer.avatar_url ? (
                  <img src={developer.avatar_url} alt={developer.full_name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1dbf73' }} />
                ) : (
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '2.5rem', border: '3px solid #1dbf73' }}>
                    {developer.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                {/* Online indicator */}
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '14px', height: '14px', borderRadius: '50%', background: developer.availability === 'available' ? '#1dbf73' : '#95979d', border: '2px solid #fff' }} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: '#1a1a2e', margin: 0 }}>
                    {developer.full_name || 'Developer'}
                  </h1>
                  {status?.is_verified && (
                    <span style={{ background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                      ✓ Verified
                    </span>
                  )}
                  <span style={{ background: levelBg[level], color: levelColors[level], borderRadius: '100px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {levelIcons[level]} {levelLabels[level]}
                  </span>
                </div>

                <p style={{ color: '#62646a', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  {developer.title || 'Developer on DevLpers'}
                </p>

                {developer.location && (
                  <p style={{ color: '#95979d', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    📍 {developer.location}
                  </p>
                )}

                {/* Rating */}
                {totalReviews > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <StarDisplay rating={avgRating} size={16} />
                    <span style={{ fontWeight: 700, color: '#f59e0b' }}>{avgRating}</span>
                    <span style={{ color: '#95979d', fontSize: '0.82rem' }}>({totalReviews} reviews)</span>
                  </div>
                )}

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1dbf73' }}>
                      {sellerLevel?.total_jobs || 0}
                    </div>
                    <div style={{ color: '#95979d', fontSize: '0.72rem' }}>Jobs Done</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#3b82f6' }}>{proposals}</div>
                    <div style={{ color: '#95979d', fontSize: '0.72rem' }}>Proposals</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#f59e0b' }}>{totalReviews}</div>
                    <div style={{ color: '#95979d', fontSize: '0.72rem' }}>Reviews</div>
                  </div>
                  {developer.hourly_rate && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#8b5cf6' }}>${developer.hourly_rate}</div>
                      <div style={{ color: '#95979d', fontSize: '0.72rem' }}>Per Hour</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '180px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1dbf73' }}>
                    {developer.hourly_rate ? `$${developer.hourly_rate}/hr` : 'Negotiable'}
                  </div>
                  <div style={{ color: '#62646a', fontSize: '0.75rem', marginTop: '0.2rem' }}>Hourly Rate</div>
                </div>

                <span style={{
                  textAlign: 'center', padding: '6px',
                  background: developer.availability === 'available' ? '#f0fdf4' : developer.availability === 'busy' ? '#fef2f2' : '#fffbeb',
                  color: developer.availability === 'available' ? '#1dbf73' : developer.availability === 'busy' ? '#dc2626' : '#f59e0b',
                  border: `1px solid ${developer.availability === 'available' ? '#bbf7d0' : developer.availability === 'busy' ? '#fecaca' : '#fde68a'}`,
                  borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                }}>
                  {developer.availability === 'available' ? '● Available for Work' : developer.availability === 'busy' ? '● Currently Busy' : '● Part-time Available'}
                </span>

                {!isOwnProfile ? (
                  <>
                    <button onClick={sendMessage} style={{ width: '100%', padding: '11px', background: '#1dbf73', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      💬 Message
                    </button>
                    <Link href="/post-job" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '11px', background: '#fff', border: '1px solid #1dbf73', borderRadius: '8px', color: '#1dbf73', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                        📋 Hire Now
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link href="/profile-setup" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', padding: '11px', background: '#1dbf73', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                      ✏️ Edit Profile
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* TABS + CONTENT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden' }}>
                {[
                  { id: 'overview', label: '📋 Overview' },
                  { id: 'skills', label: '🛠️ Skills' },
                  { id: 'reviews', label: `⭐ Reviews (${totalReviews})` },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: '12px 8px',
                    background: activeTab === tab.id ? '#1a1a2e' : '#fff',
                    border: 'none', color: activeTab === tab.id ? '#fff' : '#62646a',
                    fontWeight: activeTab === tab.id ? 700 : 400,
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s',
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '1rem' }}>About Me</h2>
                  {developer.bio ? (
                    <p style={{ color: '#62646a', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                      {developer.bio}
                    </p>
                  ) : (
                    <p style={{ color: '#95979d', fontSize: '0.88rem', fontStyle: 'italic' }}>
                      No bio added yet.
                    </p>
                  )}

                  {/* Quick Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
                    {[
                      { label: 'Member Since', value: new Date(developer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: '📅' },
                      { label: 'Jobs Completed', value: sellerLevel?.total_jobs || 0, icon: '✅' },
                      { label: 'Total Reviews', value: totalReviews, icon: '⭐' },
                      { label: 'Availability', value: developer.availability || 'Available', icon: '🟢' },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', marginBottom: '0.3rem' }}>{stat.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e' }}>{stat.value}</div>
                        <div style={{ color: '#95979d', fontSize: '0.7rem' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === 'skills' && (
                <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '1.25rem' }}>🛠️ Skills & Expertise</h2>
                  {developer.skills && developer.skills.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {developer.skills.map((skill: string) => (
                          <span key={skill} style={{
                            background: '#f0fdf4', color: '#1dbf73',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px', padding: '6px 16px',
                            fontSize: '0.85rem', fontWeight: 600,
                          }}>{skill}</span>
                        ))}
                      </div>
                      <div style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#62646a', marginBottom: '0.5rem' }}>
                          {developer.skills.length} skills listed
                        </div>
                        <div style={{ color: '#95979d', fontSize: '0.78rem' }}>
                          Looking for someone with specific skills?{' '}
                          <Link href="/post-job" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Post a job →</Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#95979d', fontSize: '0.88rem', fontStyle: 'italic' }}>No skills added yet.</p>
                  )}
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <ReviewSystem
                  revieweeId={id}
                  canReview={!!user && user.id !== id}
                  reviewerRole="client"
                />
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Contact Card */}
              {!isOwnProfile && (
                <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>
                    Ready to work together?
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={sendMessage} style={{ width: '100%', padding: '12px', background: '#1dbf73', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                      💬 Send Message
                    </button>
                    <Link href="/post-job" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #1dbf73', borderRadius: '8px', color: '#1dbf73', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                        📋 Post a Job
                      </button>
                    </Link>
                    {!user && (
                      <Link href="/signup" style={{ textDecoration: 'none' }}>
                        <button style={{ width: '100%', padding: '12px', background: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                          Join Free to Hire →
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Details */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>Profile Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Hourly Rate', value: developer.hourly_rate ? `$${developer.hourly_rate}/hr` : 'Negotiable', icon: '💰' },
                    { label: 'Location', value: developer.location || 'Not specified', icon: '📍' },
                    { label: 'Availability', value: developer.availability || 'Available', icon: '🟢' },
                    { label: 'Level', value: `${levelIcons[level]} ${levelLabels[level]}`, icon: '🏆' },
                    { label: 'Member Since', value: new Date(developer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), icon: '📅' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ color: '#95979d', fontSize: '0.82rem' }}>{item.icon} {item.label}</span>
                      <span style={{ fontWeight: 500, color: '#404145', fontSize: '0.82rem' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Summary */}
              {totalReviews > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '2.5rem', color: '#1a1a2e', lineHeight: 1 }}>{avgRating}</div>
                  <StarDisplay rating={avgRating} size={18} />
                  <div style={{ color: '#95979d', fontSize: '0.78rem', marginTop: '0.4rem' }}>{totalReviews} reviews</div>
                  <button onClick={() => setActiveTab('reviews')} style={{ marginTop: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1dbf73', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                    View All Reviews →
                  </button>
                </div>
              )}

              {/* Share Profile */}
              <div style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ color: '#62646a', fontSize: '0.82rem', marginBottom: '0.75rem' }}>Share this profile</div>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} style={{ background: '#fff', border: '1px solid #e4e5e7', color: '#404145', padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}>
                  🔗 Copy Profile Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}