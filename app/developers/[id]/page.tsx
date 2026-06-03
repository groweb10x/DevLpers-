'use client';
import { useState } from 'react';
import Link from 'next/link';


const responsiveStyles = `
@media (max-width: 768px){
  .dev-container{padding:80px 16px 24px !important;}
  .dev-grid{grid-template-columns:1fr !important;}
  .dev-nav{padding:0 16px !important;}
  .dev-stats{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}
}
`;

const developer = {
  id: 1,
  name: 'Ali Hassan',
  title: 'Full Stack Developer',
  location: 'Lahore, Pakistan',
  rate: '$45/hr',
  rating: 4.9,
  reviews: 34,
  jobs: 87,
  earned: '$12,400',
  availability: 'Available',
  level: 'Expert',
  bio: `I am a passionate Full Stack Developer with 5+ years of experience building modern web applications. I specialize in React, Node.js and PostgreSQL and have worked with clients from Pakistan, UAE and USA.

I take pride in writing clean, maintainable code and always deliver projects on time. I believe in clear communication and regular updates throughout the project.

Let us build something amazing together!`,
  skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST API', 'Docker', 'AWS', 'MongoDB', 'Tailwind CSS'],
  portfolio: [
    { title: 'E-commerce Platform', desc: 'Full stack store with payment integration', tech: 'React · Node.js · PostgreSQL', emoji: '🛒' },
    { title: 'Food Delivery App', desc: 'Real-time tracking mobile app', tech: 'React Native · Firebase', emoji: '🍕' },
    { title: 'SaaS Dashboard', desc: 'Analytics dashboard for marketing teams', tech: 'Next.js · Chart.js · Tailwind', emoji: '📊' },
    { title: 'AI Chatbot', desc: 'GPT-4 powered customer support bot', tech: 'Python · OpenAI · FastAPI', emoji: '🤖' },
  ],
  reviewsList: [
    { client: 'Ahmed Store', rating: 5, comment: 'Excellent work! Delivered on time and communicated very well throughout the project.', date: 'Apr 2025' },
    { client: 'TechPak Ltd', rating: 5, comment: 'Ali is a true professional. The app works perfectly and the code is very clean.', date: 'Mar 2025' },
    { client: 'StartupX', rating: 4, comment: 'Good developer, knows his stuff. Would hire again for future projects.', date: 'Feb 2025' },
  ],
};

export default function DeveloperProfile() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews'>('portfolio');
  const [contacted, setContacted] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
      <nav className='dev-nav' style={{
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
          <Link href="/developers">
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 18px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            }}>← Browse Devs</button>
          </Link>
        </div>
      </nav>

      <><style>{responsiveStyles}</style><div className='dev-container' style={{ paddingTop: '80px', padding: '80px 5% 3rem' }}>
        <div className='dev-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>

          {/* LEFT */}
          <div>

            {/* Profile Header */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem',
                }}>{developer.name[0]}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem' }}>{developer.name}</h1>
                    <span style={{
                      background: 'rgba(0,212,170,0.1)', color: 'var(--green)',
                      border: '1px solid rgba(0,212,170,0.3)',
                      borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600,
                    }}>● {developer.availability}</span>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{developer.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>📍 {developer.location}</div>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{
                display: 'flex', gap: '2rem', flexWrap: 'wrap',
                marginTop: '1.5rem', paddingTop: '1.5rem',
                borderTop: '1px solid var(--border)',
              }}>
                {[
                  { label: 'Rating', value: `⭐ ${developer.rating}` },
                  { label: 'Reviews', value: developer.reviews },
                  { label: 'Jobs Done', value: developer.jobs },
                  { label: 'Total Earned', value: developer.earned },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>{s.value}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>About Me</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.92rem', whiteSpace: 'pre-line' }}>
                {developer.bio}
              </p>
            </div>

            {/* Skills */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>Skills</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {developer.skills.map(skill => (
                  <span key={skill} style={{
                    background: 'rgba(108,99,255,0.08)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    borderRadius: '6px', padding: '6px 14px',
                    fontSize: '0.85rem', color: 'var(--accent)',
                  }}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Portfolio & Reviews Tabs */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                {(['portfolio', 'reviews'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '1rem',
                    background: activeTab === tab ? 'rgba(108,99,255,0.08)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                    color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
                    fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer', transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}>{tab === 'portfolio' ? '🎨 Portfolio' : '⭐ Reviews'}</button>
                ))}
              </div>

              <div style={{ padding: '1.5rem' }}>
                {/* Portfolio */}
                {activeTab === 'portfolio' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {developer.portfolio.map((item, i) => (
                      <div key={i} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: '12px', padding: '1.25rem',
                        transition: 'border-color 0.2s', cursor: 'pointer',
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.emoji}</div>
                        <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.4rem' }}>{item.title}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{item.desc}</div>
                        <div style={{
                          background: 'rgba(108,99,255,0.08)',
                          border: '1px solid rgba(108,99,255,0.15)',
                          borderRadius: '6px', padding: '4px 10px',
                          fontSize: '0.75rem', color: 'var(--accent)', display: 'inline-block',
                        }}>{item.tech}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews */}
                {activeTab === 'reviews' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {developer.reviewsList.map((review, i) => (
                      <div key={i} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: '12px', padding: '1.25rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>{review.client}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#fbbf24' }}>{'⭐'.repeat(review.rating)}</span>
                            <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{review.date}</span>
                          </div>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.6 }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Hire Card */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.5rem',
              position: 'sticky', top: '80px',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--green)', marginBottom: '0.25rem' }}>
                  {developer.rate}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Hourly Rate</div>
              </div>

              {contacted ? (
                <div style={{
                  textAlign: 'center', padding: '1rem',
                  background: 'rgba(0,212,170,0.08)',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '10px',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
                  <div style={{ color: 'var(--green)', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>
                    Message Sent!
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Ali will respond soon
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => setContacted(true)} style={{
                    width: '100%', padding: '13px',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: '10px', color: '#fff',
                    fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem',
                    cursor: 'pointer', marginBottom: '0.75rem',
                  }}>
                    💬 Contact Ali
                  </button>
                  <button style={{
                    width: '100%', padding: '13px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '10px', color: 'var(--text)',
                    fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}>
                    📋 Invite to Job
                  </button>
                </>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { label: 'Response Time', value: '< 1 hour' },
                  { label: 'Level', value: developer.level },
                  { label: 'Languages', value: 'Urdu, English' },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div></>
    </div>
  );
}