'use client';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const stats = [
  { value: '12K+', label: 'Developers' },
  { value: '8K+', label: 'Buyers' },
  { value: '95%', label: 'Success Rate' },
  { value: '$2M+', label: 'Paid Out' },
];

const categories = [
  { icon: '⚡', name: 'Web Development', count: '2.4k devs' },
  { icon: '📱', name: 'Mobile Apps', count: '1.8k devs' },
  { icon: '🤖', name: 'AI & ML', count: '900 devs' },
  { icon: '🎨', name: 'UI/UX Design', count: '1.2k devs' },
  { icon: '🔒', name: 'Cybersecurity', count: '600 devs' },
  { icon: '☁️', name: 'Cloud & DevOps', count: '800 devs' },
];

const developers = [
  { name: 'Ali Hassan', skill: 'Full Stack Dev', rate: '$45/hr', rating: '4.9', jobs: 87, tag: 'React · Node · PostgreSQL' },
  { name: 'Sara Khan', skill: 'Mobile Developer', rate: '$38/hr', rating: '5.0', jobs: 64, tag: 'Flutter · Firebase · iOS' },
  { name: 'Usman Malik', skill: 'AI Engineer', rate: '$65/hr', rating: '4.8', jobs: 42, tag: 'Python · TensorFlow · LLMs' },
];

const aiTools = [
  { icon: '🎙️', name: 'Voice Cloner', category: 'Audio AI', desc: 'Clone any voice with just 10 seconds of sample audio', tag: 'Popular' },
  { icon: '🗣️', name: 'Speech to Text', category: 'Audio AI', desc: 'Convert spoken words to accurate text in real-time', tag: 'Hot' },
  { icon: '🌐', name: 'Text Translator', category: 'Language AI', desc: 'Translate between Urdu, English and 50+ languages instantly', tag: '' },
  { icon: '🔇', name: 'Noise Remover', category: 'Audio AI', desc: 'Remove background noise and enhance audio quality', tag: '' },
  { icon: '💬', name: 'Sentiment Checker', category: 'Text AI', desc: 'Analyze reviews as positive, negative or neutral', tag: 'New' },
  { icon: '🖼️', name: 'Image Analyzer', category: 'Vision AI', desc: 'Detect objects, faces and text inside any photo', tag: '' },
  { icon: '🤖', name: 'AI Chatbot', category: 'Text AI', desc: 'Deploy a smart customer support bot in minutes', tag: 'Hot' },
  { icon: '👤', name: 'Face Detector', category: 'Vision AI', desc: 'Real-time face detection for security systems', tag: '' },
  { icon: '📄', name: 'Document Scanner', category: 'Business AI', desc: 'Extract text and data from any document or invoice', tag: 'New' },
  { icon: '🎵', name: 'Music Generation', category: 'Audio AI', desc: 'Generate original music tracks using AI prompts', tag: 'New' },
  { icon: '🎨', name: 'Image Generation', category: 'Vision AI', desc: 'Create stunning images from text descriptions', tag: 'Hot' },
  { icon: '📊', name: 'Review Analyzer', category: 'Business AI', desc: 'Turn customer feedback into actionable insights', tag: '' },
];

const jobs = [
  { title: 'Full Stack Developer Needed', budget: '$500-1000', skills: 'React · Node.js', time: '2 hrs ago', proposals: 12, type: 'Fixed' },
  { title: 'Mobile App for Food Delivery', budget: '$800-1500', skills: 'Flutter · Firebase', time: '5 hrs ago', proposals: 8, type: 'Fixed' },
  { title: 'AI Chatbot Integration', budget: '$40/hr', skills: 'Python · OpenAI API', time: '1 day ago', proposals: 5, type: 'Hourly' },
  { title: 'E-commerce Website Redesign', budget: '$300-600', skills: 'Next.js · Tailwind', time: '3 hrs ago', proposals: 19, type: 'Fixed' },
  { title: 'WordPress Speed Optimization', budget: '$100-200', skills: 'WordPress · PHP', time: '6 hrs ago', proposals: 7, type: 'Fixed' },
  { title: 'React Native Developer', budget: '$35/hr', skills: 'React Native · Redux', time: '2 days ago', proposals: 3, type: 'Hourly' },
];

const faqs = [
  { q: 'How do I hire a developer?', a: 'Simply browse developer profiles or post a job. Developers will send proposals and you can chat, review portfolios, and hire directly.' },
  { q: 'Is DevMarket free to join?', a: 'Yes! Creating an account is 100% free for both developers and buyers. We only charge a small commission on successful projects.' },
  { q: 'How does payment work?', a: 'We use an escrow system. You deposit funds which are held safely and released to the developer only when you approve the work.' },
  { q: 'Can I hire Pakistani developers only?', a: 'DevMarket is focused on Pakistani talent but developers from all over can join. Our goal is to showcase top local developers globally.' },
  { q: 'What if I am not satisfied with the work?', a: 'We have a dispute resolution system. If issues arise, our team steps in to mediate and ensure a fair outcome for both parties.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main style={{ minHeight: '100vh' }}>
<Navbar />
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
       <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
  <div style={{
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: '#fff',
  }}>D</div>
  <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
    Dev<span style={{ color: 'var(--text)' }}>Lpers</span>
  </span>
</Link>

<div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
  {[
    { label: 'Browse Devs', href: '/developers' },
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ].map(item => (
    <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
      <span style={{
        color: 'var(--muted)', fontSize: '0.9rem',
        transition: 'color 0.2s', cursor: 'pointer',
      }}
        onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--text)'}
        onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--muted)'}
      >{item.label}</span>
    </Link>
  ))}
</div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {user ? (
            <>
              <Link href={user.user_metadata?.role === 'developer' ? '/dashboard' : '/buyer-dashboard'}>
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '8px 20px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem'
                }}>Dashboard</button>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'var(--accent2)', border: 'none',
                color: '#fff', padding: '8px 20px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
              }}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '8px 20px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem'
                }}>Log In</button>
              </Link>
              <Link href="/signup">
                <button style={{
                  background: 'var(--accent)', border: 'none',
                  color: '#fff', padding: '8px 20px', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
                }}>Sign Up Free</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 5% 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: '100px', padding: '6px 16px',
          fontSize: '0.8rem', color: 'var(--accent)',
          marginBottom: '2rem',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          The Global Developer Marketplace
        </div>

        <h1 style={{
          fontFamily: 'Syne', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px',
        }}>
          Hire Top Developers.<br />
          <span style={{ color: 'var(--accent)' }}>Build Faster.</span>{' '}
          <span style={{ color: 'var(--accent2)' }}>Ship Better.</span>
        </h1>

        <p style={{
          color: 'var(--muted)', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          maxWidth: '560px', lineHeight: 1.7, marginBottom: '2.5rem',
        }}>
          Connect with verified Pakistani developers or post your project and get proposals within hours.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/jobs">
            <button style={{
              background: 'var(--accent)', color: '#fff',
              border: 'none', padding: '14px 32px',
              borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            }}>Find a Developer →</button>
          </Link>
          <Link href="/post-job">
            <button style={{
              background: 'transparent', color: 'var(--text)',
              border: '1px solid var(--border)', padding: '14px 32px',
              borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
            }}>Post a Job</button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--accent)' }}>{s.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>Browse by Category</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>Find the exact skill you need</p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', maxWidth: '1100px', margin: '0 auto',
        }}>
          {categories.map(cat => (
            <div key={cat.name} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.5rem', cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 600, marginBottom: '0.25rem' }}>{cat.name}</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP DEVELOPERS */}
      <section style={{ padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>Top Developers</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>Verified, reviewed, and ready to work</p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem', maxWidth: '1100px', margin: '0 auto',
        }}>
          {developers.map(dev => (
            <div key={dev.name} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.75rem',
              transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem',
                }}>{dev.name[0]}</div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700 }}>{dev.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{dev.skill}</div>
                </div>
              </div>
              <div style={{
                background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: '6px', padding: '6px 12px',
                fontSize: '0.78rem', color: 'var(--accent)',
                marginBottom: '1rem', display: 'inline-block',
              }}>{dev.tag}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--green)', fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>{dev.rate}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>⭐ {dev.rating} · {dev.jobs} jobs</span>
              </div>
              <button style={{
                marginTop: '1.25rem', width: '100%',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text)', padding: '10px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >View Profile</button>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '4rem' }}>Get started in 3 simple steps</p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem', maxWidth: '1000px', margin: '0 auto',
        }}>
          {[
            { step: '01', icon: '👤', title: 'Create Your Account', desc: 'Sign up as a Developer or Buyer in under 2 minutes. Set up your profile with skills, portfolio, or project needs.' },
            { step: '02', icon: '🔍', title: 'Browse or Post', desc: 'Buyers post jobs or browse developer profiles. Developers apply to jobs or get contacted directly by buyers.' },
            { step: '03', icon: '🚀', title: 'Work & Get Paid', desc: 'Chat, agree on terms, work together. Payment is held in escrow and released when you approve the delivery.' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '1rem', right: '1.25rem',
                fontFamily: 'Syne', fontWeight: 800, fontSize: '3.5rem',
                color: 'rgba(108,99,255,0.08)', lineHeight: 1,
              }}>{item.step}</div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR JOBS */}
      <section style={{ padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto 2.5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.4rem' }}>Popular Jobs</h2>
            <p style={{ color: 'var(--muted)' }}>Latest projects posted by buyers</p>
          </div>
          <Link href="/jobs">
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--accent)', padding: '10px 22px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            }}>View All Jobs →</button>
          </Link>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem', maxWidth: '1100px', margin: '0 auto',
        }}>
          {jobs.map((job, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.5rem', cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', maxWidth: '75%' }}>{job.title}</h3>
                <span style={{
                  background: job.type === 'Hourly' ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)',
                  color: job.type === 'Hourly' ? 'var(--green)' : 'var(--accent)',
                  border: `1px solid ${job.type === 'Hourly' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}`,
                  borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem',
                }}>{job.type}</span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>🏷️ {job.skills}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--green)', fontSize: '1rem' }}>{job.budget}</span>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', display: 'flex', gap: '1rem' }}>
                  <span>🕐 {job.time}</span>
                  <span>📨 {job.proposals}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI TOOLS */}
      <section style={{ padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
            borderRadius: '100px', padding: '6px 16px',
            fontSize: '0.8rem', color: 'var(--green)', marginBottom: '1rem',
          }}>⚡ AI-Powered Tools</div>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>
          Popular AI Tools on DevMarket
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem', maxWidth: '560px', margin: '0 auto 3rem' }}>
          Developers build and sell these AI-powered tools.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem', maxWidth: '1200px', margin: '0 auto',
        }}>
          {aiTools.map((tool, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.5rem', cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s', position: 'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {tool.tag && (
                <span style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: tool.tag === 'Hot' ? 'rgba(255,101,132,0.15)' : tool.tag === 'New' ? 'rgba(0,212,170,0.15)' : 'rgba(108,99,255,0.15)',
                  color: tool.tag === 'Hot' ? 'var(--accent2)' : tool.tag === 'New' ? 'var(--green)' : 'var(--accent)',
                  border: `1px solid ${tool.tag === 'Hot' ? 'rgba(255,101,132,0.3)' : tool.tag === 'New' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}`,
                  borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600,
                }}>{tool.tag}</span>
              )}
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{tool.icon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--green)', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase' }}>{tool.category}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{tool.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.83rem', lineHeight: 1.6 }}>{tool.desc}</p>
              <button style={{
                marginTop: '1rem', width: '100%',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text)', padding: '8px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,170,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--green)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
              >Explore Tool →</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button style={{
            background: 'linear-gradient(135deg, var(--accent), var(--green))',
            color: '#fff', border: 'none', padding: '14px 36px',
            borderRadius: '10px', fontSize: '1rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Syne',
          }}>Browse All AI Tools →</button>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem' }}>Everything you need to know</p>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: 'var(--card)',
              border: `1px solid ${openFaq === i ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', background: 'transparent', border: 'none',
                padding: '1.25rem 1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', color: 'var(--text)',
                fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem', textAlign: 'left',
              }}>
                {faq.q}
                <span style={{
                  color: 'var(--accent)', fontSize: '1.2rem',
                  transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.2s', display: 'inline-block',
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
        padding: '100px 5%', borderTop: '1px solid var(--border)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '500px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(255,101,132,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>Ready to Get Started?</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Join thousands of developers and buyers already using DevMarket.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup">
            <button style={{
              background: 'var(--accent)', color: '#fff', border: 'none',
              padding: '14px 36px', borderRadius: '10px',
              fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne',
            }}>Join as Developer</button>
          </Link>
          <Link href="/signup">
            <button style={{
              background: 'var(--accent2)', color: '#fff', border: 'none',
              padding: '14px 36px', borderRadius: '10px',
              fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne',
            }}>Hire a Developer</button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
        color: 'var(--muted)', fontSize: '0.85rem',
      }}>
        <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--accent)' }}>
          Dev<span style={{ color: 'var(--text)' }}>Market</span>
        </div>
        <div>© 2026 DevMarket. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>



    </main>
  );
}