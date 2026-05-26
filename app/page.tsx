'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from './components/Navbar';

const categories = [
  { icon: '💻', name: 'Web Development', count: '2.4k devs' },
  { icon: '📱', name: 'Mobile Apps', count: '1.8k devs' },
  { icon: '🤖', name: 'AI & ML', count: '900 devs' },
  { icon: '🎨', name: 'UI/UX Design', count: '1.2k devs' },
  { icon: '🔒', name: 'Cybersecurity', count: '600 devs' },
  { icon: '☁️', name: 'Cloud & DevOps', count: '800 devs' },
];

const developers = [
  { name: 'Ali Hassan', skill: 'Full Stack Dev', rate: '$45/hr', rating: '4.9', jobs: 87, tag: 'React · Node · PostgreSQL', level: '🥇' },
  { name: 'Sara Khan', skill: 'Mobile Developer', rate: '$38/hr', rating: '5.0', jobs: 64, tag: 'Flutter · Firebase · iOS', level: '🥈' },
  { name: 'Usman Malik', skill: 'AI Engineer', rate: '$65/hr', rating: '4.8', jobs: 42, tag: 'Python · TensorFlow · LLMs', level: '🥇' },
];

const faqs = [
  { q: 'How do I hire a developer?', a: 'Browse developer profiles or post a job. Developers will send proposals and you can chat, review portfolios, and hire directly.' },
  { q: 'Is DevLpers free to join?', a: 'Yes! Creating an account is 100% free for both developers and buyers. We only charge a small commission on successful projects.' },
  { q: 'How does payment work?', a: 'We use an escrow system. You deposit funds which are held safely and released to the developer only when you approve the work.' },
  { q: 'Can I hire developers globally?', a: 'DevLpers is a global marketplace. Developers and buyers from all over the world can join and collaborate.' },
  { q: 'What if I am not satisfied with the work?', a: 'We have a dispute resolution system. If issues arise, our team steps in to mediate and ensure a fair outcome for both parties.' },
];

const howItWorks = [
  { step: '01', icon: '👤', title: 'Create Your Account', desc: 'Sign up as a Developer or Buyer in under 2 minutes.' },
  { step: '02', icon: '🔍', title: 'Browse or Post', desc: 'Buyers post jobs or browse developer profiles. Developers apply to jobs.' },
  { step: '03', icon: '🚀', title: 'Work & Get Paid', desc: 'Payment is held in escrow and released when you approve the delivery.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        paddingTop: '120px', paddingBottom: '80px',
        padding: '120px 5% 80px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(29,191,115,0.1)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(29,191,115,0.08)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(29,191,115,0.15)',
          border: '1px solid rgba(29,191,115,0.3)',
          borderRadius: '100px', padding: '6px 16px',
          fontSize: '0.8rem', color: '#1dbf73',
          marginBottom: '1.5rem',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1dbf73', display: 'inline-block' }} />
          The Global Developer Marketplace
        </div>

        <h1 style={{
          fontFamily: 'Inter', fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          lineHeight: 1.15, marginBottom: '1.25rem',
          color: '#ffffff', maxWidth: '800px', margin: '0 auto 1.25rem',
        }}>
          Find the Perfect Developer
          <span style={{ color: '#1dbf73', display: 'block' }}>for Any Project</span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          maxWidth: '560px', lineHeight: 1.7, margin: '0 auto 2.5rem',
        }}>
          Connect with verified developers worldwide. Post jobs, submit proposals, and build amazing products together.
        </p>

        {/* Search Bar */}
        <div style={{
          maxWidth: '600px', margin: '0 auto 3rem',
          display: 'flex', gap: '0', borderRadius: '6px',
          overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <input
            type="text"
            placeholder='Try "React Developer" or "Mobile App"'
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, padding: '16px 20px',
              border: 'none', outline: 'none',
              fontSize: '1rem', background: '#fff',
              color: '#404145',
            }}
          />
          <Link href={`/jobs?search=${search}`}>
            <button style={{
              padding: '16px 28px',
              background: '#1dbf73', border: 'none',
              color: '#fff', fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>Search</button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '3rem', flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { value: '12K+', label: 'Developers' },
            { value: '8K+', label: 'Clients' },
            { value: '95%', label: 'Success Rate' },
            { value: '$2M+', label: 'Paid Out' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.8rem', color: '#1dbf73' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '60px 5%', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: 700 }}>
          Browse by Category
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2.5rem' }}>
          Find the exact skill you need
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem', maxWidth: '1100px', margin: '0 auto',
        }}>
          {categories.map(cat => (
            <Link key={cat.name} href={`/developers?skill=${cat.name}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1.5rem',
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{cat.name}</div>
                <div style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 500 }}>{cat.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '60px 5%', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem', fontWeight: 700 }}>
          How It Works
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>
          Get started in 3 simple steps
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem', maxWidth: '900px', margin: '0 auto',
        }}>
          {howItWorks.map((item, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '2rem',
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: '8px', position: 'relative',
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(29,191,115,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', margin: '0 auto 1rem',
              }}>{item.icon}</div>
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontWeight: 800, fontSize: '2.5rem',
                color: 'rgba(29,191,115,0.08)',
              }}>{item.step}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOP DEVELOPERS */}
      <section style={{ padding: '60px 5%', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto 2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.25rem' }}>Top Developers</h2>
            <p style={{ color: 'var(--muted)' }}>Verified, reviewed, and ready to work</p>
          </div>
          <Link href="/developers">
            <button style={{
              background: 'transparent', border: '1px solid var(--accent)',
              color: 'var(--accent)', padding: '10px 22px',
              borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
            }}>View All →</button>
          </Link>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem', maxWidth: '1100px', margin: '0 auto',
        }}>
          {developers.map(dev => (
            <div key={dev.name} style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '1.5rem',
              transition: 'all 0.2s', cursor: 'pointer',
              boxShadow: 'var(--shadow)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1dbf73, #0d6efd)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Inter', fontWeight: 700, fontSize: '1.2rem', color: '#fff',
                }}>{dev.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>{dev.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{dev.skill}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>{dev.level}</div>
              </div>

              <div style={{
                background: '#f5f5f5', borderRadius: '4px',
                padding: '6px 12px', fontSize: '0.78rem',
                color: 'var(--text2)', marginBottom: '1rem', display: 'inline-block',
              }}>{dev.tag}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: '#1dbf73', fontWeight: 700, fontSize: '1rem' }}>{dev.rate}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>⭐ {dev.rating} · {dev.jobs} jobs</span>
              </div>

              <Link href="/developers">
                <button style={{
                  width: '100%', padding: '10px',
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', borderRadius: '4px',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1dbf73'; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#1dbf73'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                >View Profile</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 5%', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem', fontWeight: 700 }}>
          Frequently Asked Questions
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>Everything you need to know</p>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)', borderRadius: '8px',
              overflow: 'hidden', transition: 'border-color 0.2s',
              background: '#fff',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', background: 'transparent', border: 'none',
                padding: '1.25rem 1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', color: 'var(--text)',
                fontFamily: 'Inter', fontWeight: 600, fontSize: '0.95rem', textAlign: 'left',
              }}>
                {faq.q}
                <span style={{
                  color: 'var(--accent)', fontSize: '1.2rem',
                  transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.2s', display: 'inline-block', flexShrink: 0,
                }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 5%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem', color: '#fff', fontWeight: 800 }}>
          Ready to Get Started?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Join thousands of developers and clients already using DevLpers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup">
            <button style={{
              background: '#1dbf73', color: '#fff', border: 'none',
              padding: '14px 36px', borderRadius: '4px',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#19a463'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1dbf73'}
            >Join as Developer</button>
          </Link>
          <Link href="/post-job">
            <button style={{
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.5)', padding: '14px 36px',
              borderRadius: '4px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; }}
            >Hire a Developer</button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#1a1a2e',
        padding: '2rem 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 800, color: '#1dbf73', fontSize: '1.2rem' }}>
          Dev<span style={{ color: '#fff' }}>Lpers</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
          © 2026 DevLpers. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <Link key={l} href={l === 'Support' ? '/support' : '#'} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.85rem' }}>{l}</Link>
          ))}
        </div>
      </footer>

    </main>
  );
}