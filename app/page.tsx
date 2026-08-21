'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from './components/Navbar';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ developers: 0, jobs: 0, tools: 21, agents: 12 });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const [{ count: devCount }, { count: jobCount }] = await Promise.all([
        supabase.from('developer_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
      ]);

      setStats(prev => ({
        ...prev,
        developers: devCount || 0,
        jobs: jobCount || 0,
      }));
    };
    init();
  }, []);

  const tools = [
    { icon: '🖼️', name: 'Image Converter', slug: '/image-format-converter' },
    { icon: '🗜️', name: 'Image Compressor', slug: '/image-compressor' },
    { icon: '✍️', name: 'Article Generator', slug: '/article-generator' },
    { icon: '📊', name: 'DA PA Checker', slug: '/da-pa-checker' },
    { icon: '🔖', name: 'Favicon Generator', slug: '/favicon-generator' },
    { icon: '🧾', name: 'Invoice Generator', slug: '/invoice-generator' },
  ];

  const agents = [
    { icon: '🔍', name: 'Code Reviewer', color: '#1dbf73' },
    { icon: '🐛', name: 'Bug Fixer', color: '#dc2626' },
    { icon: '📝', name: 'Proposal Writer', color: '#8b5cf6' },
    { icon: '✉️', name: 'Email Writer', color: '#3b82f6' },
    { icon: '📈', name: 'SEO Analyzer', color: '#f59e0b' },
    { icon: '🗄️', name: 'SQL Helper', color: '#b45309' },
  ];

  const features = [
    { icon: '🔒', title: 'Secure Escrow', desc: 'Payment held safely until work is approved by client' },
    { icon: '⭐', title: 'Verified Developers', desc: 'All developers verified with skill tests and reviews' },
    { icon: '🤖', title: 'AI-Powered Tools', desc: '21+ free tools and 12 AI agents built for developers' },
    { icon: '💬', title: 'Real-time Chat', desc: 'Direct messaging between clients and developers' },
    { icon: '📋', title: 'Contract System', desc: 'Full contract management with milestones and approvals' },
    { icon: '🌍', title: 'Global Marketplace', desc: 'Connect with developers and clients from 150+ countries' },
  ];

  const topSkills = ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'Flutter', 'WordPress', 'Laravel', 'AWS', 'MongoDB', 'Vue.js', 'GraphQL'];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: 'clamp(3rem,8vw,6rem) 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(29,191,115,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(139,92,246,0.05)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', background: 'rgba(29,191,115,0.15)', border: '1px solid rgba(29,191,115,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 700, marginBottom: '1.5rem' }}>
              🌍 Global Developer Marketplace
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Hire Top Developers<br />
              <span style={{ color: '#1dbf73' }}>or Get Hired</span> Worldwide
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              DevLpers connects businesses with verified developers. Post jobs, hire talent, use AI tools and manage projects — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(29,191,115,0.4)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#19a463'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1dbf73'}
                >
                  Get Started Free →
                </button>
              </Link>
              <Link href="/developers" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
                >
                  Browse Developers
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1.5rem, 4vw, 3rem)', flexWrap: 'wrap' }}>
              {[
                { label: 'Developers', value: stats.developers > 0 ? stats.developers + '+' : '500+' },
                { label: 'Open Jobs', value: stats.jobs > 0 ? stats.jobs + '+' : '100+' },
                { label: 'Free Tools', value: stats.tools + '+' },
                { label: 'AI Agents', value: stats.agents + '+' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1dbf73' }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRUSTED BY */}
        <div style={{ background: '#fafafa', borderBottom: '1px solid #e4e5e7', padding: '1.25rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ color: '#95979d', fontSize: '0.82rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Trusted by developers from</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {['🇵🇰 Pakistan', '🇺🇸 USA', '🇮🇳 India', '🇧🇩 Bangladesh', '🇬🇧 UK', '🇦🇪 UAE'].map(c => (
                <span key={c} style={{ color: '#62646a', fontSize: '0.88rem', fontWeight: 500 }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ padding: '5rem 5%', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a2e', marginBottom: '0.75rem' }}>
              How DevLpers Works
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.95rem' }}>Get started in minutes — no experience required</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', icon: '📝', title: 'Create Account', desc: 'Sign up free as a developer or client in under 2 minutes', color: '#1dbf73' },
              { step: '02', icon: '🔍', title: 'Find or Post', desc: 'Browse jobs or post your project with detailed requirements', color: '#3b82f6' },
              { step: '03', icon: '💬', title: 'Connect & Discuss', desc: 'Chat directly, share files and agree on terms', color: '#8b5cf6' },
              { step: '04', icon: '💰', title: 'Pay Securely', desc: 'Funds held in escrow until work is completed and approved', color: '#f59e0b' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: `${s.color}15`, border: `2px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto' }}>
                    {s.icon}
                  </div>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', background: s.color, color: '#fff', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.step}
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TOP SKILLS */}
        <div style={{ background: '#fafafa', padding: '3rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', color: '#1a1a2e', marginBottom: '0.5rem', textAlign: 'center' }}>
              Browse by Skills
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.75rem' }}>Find developers with exactly the skills you need</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {topSkills.map(skill => (
                <Link key={skill} href={`/developers?skill=${skill}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #e4e5e7',
                    borderRadius: '8px', padding: '10px 20px',
                    fontSize: '0.88rem', color: '#404145', fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1dbf73'; e.currentTarget.style.color = '#1dbf73'; e.currentTarget.style.background = '#f0fdf4'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e5e7'; e.currentTarget.style.color = '#404145'; e.currentTarget.style.background = '#fff'; }}
                  >{skill}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ padding: '5rem 5%', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a2e', marginBottom: '0.75rem' }}>
              Everything You Need
            </h2>
            <p style={{ color: '#62646a', fontSize: '0.95rem' }}>Built specifically for developers and tech projects</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '0.4rem' }}>{f.title}</h3>
                  <p style={{ color: '#62646a', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FREE TOOLS SECTION */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', padding: '5rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 14px', fontSize: '0.78rem', color: '#1dbf73', fontWeight: 700, marginBottom: '0.75rem' }}>
                  🛠️ Free Tools
                </div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                  21+ Free Developer Tools
                </h2>
                <p style={{ color: '#62646a', fontSize: '0.9rem' }}>No signup required · Works in browser · No limits</p>
              </div>
              <Link href="/tools" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                  View All Tools →
                </button>
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {tools.map(tool => (
                <a key={tool.slug} href={tool.slug} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #e4e5e7',
                    borderRadius: '10px', padding: '1.25rem',
                    textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1dbf73'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,191,115,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e5e7'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{tool.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#404145' }}>{tool.name}</div>
                    <div style={{ color: '#1dbf73', fontSize: '0.72rem', marginTop: '0.25rem', fontWeight: 600 }}>Free →</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* AI AGENTS SECTION */}
        <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #fff 100%)', padding: '5rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '100px', padding: '4px 14px', fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 700, marginBottom: '0.75rem' }}>
                  🤖 AI Agents
                </div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                  12 Free AI Agents
                </h2>
                <p style={{ color: '#62646a', fontSize: '0.9rem' }}>Powered by Llama 3 · No signup · Instant results</p>
              </div>
              <Link href="/ai-agents" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                  Try AI Agents →
                </button>
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {agents.map(agent => (
                <Link key={agent.name} href="/ai-agents" style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', border: '1px solid #e9d5ff',
                    borderRadius: '10px', padding: '1.25rem',
                    textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{agent.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#404145' }}>{agent.name}</div>
                    <div style={{ color: '#8b5cf6', fontSize: '0.72rem', marginTop: '0.25rem', fontWeight: 600 }}>Use Free →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* FOR DEVELOPERS / CLIENTS */}
        <div style={{ padding: '5rem 5%', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

            {/* For Developers */}
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '16px', padding: '2.5rem', color: '#fff' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💻</div>
              <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.75rem' }}>For Developers</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Find remote jobs, showcase your skills and earn money from clients worldwide.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {['✓ Browse 100+ open jobs', '✓ Submit proposals for free', '✓ Get paid via Stripe, Crypto, Payoneer', '✓ Build your rating & level up'].map(item => (
                  <div key={item} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{item}</div>
                ))}
              </div>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}>
                  Start as Developer →
                </button>
              </Link>
            </div>

            {/* For Clients */}
            <div style={{ background: 'linear-gradient(135deg, #1dbf73 0%, #19a463 100%)', borderRadius: '16px', padding: '2.5rem', color: '#fff' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
              <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.75rem' }}>For Clients</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Post your project and get proposals from verified developers within hours.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {['✓ Post jobs for free', '✓ Get proposals within hours', '✓ Pay only when satisfied', '✓ Secure escrow payment'].map(item => (
                  <div key={item} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>{item}</div>
                ))}
              </div>
              <Link href="/post-job" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#fff', color: '#1dbf73', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}>
                  Post a Job Free →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '5rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '1rem' }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Join thousands of developers and clients building great things together on DevLpers. It's free to start.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(29,191,115,0.4)' }}>
                  Join Free Today →
                </button>
              </Link>
              <Link href="/ai-agents" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 36px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
                  Try AI Agents Free
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ background: '#1a1a2e', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 5%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

              {/* Brand */}
              <div>
                <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '0.75rem' }}>
                  Dev<span style={{ color: '#1dbf73' }}>Lpers</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.7 }}>
                  Global developer marketplace for freelancers and businesses.
                </p>
              </div>

              {/* For Developers */}
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1rem' }}>For Developers</h4>
                {[
                  { label: 'Browse Jobs', href: '/jobs' },
                  { label: 'Create Profile', href: '/profile-setup' },
                  { label: 'Pricing Plans', href: '/pricing' },
                  { label: 'Dashboard', href: '/dashboard' },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ textDecoration: 'none', display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '0.5rem' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#1dbf73'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                  >{l.label}</Link>
                ))}
              </div>

              {/* For Clients */}
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1rem' }}>For Clients</h4>
                {[
                  { label: 'Post a Job', href: '/post-job' },
                  { label: 'Browse Developers', href: '/developers' },
                  { label: 'How it Works', href: '/#how-it-works' },
                  { label: 'Client Dashboard', href: '/buyer-dashboard' },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ textDecoration: 'none', display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '0.5rem' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#1dbf73'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                  >{l.label}</Link>
                ))}
              </div>

              {/* Tools & AI */}
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1rem' }}>Free Tools & AI</h4>
                {[
                  { label: 'All Tools', href: '/tools' },
                  { label: 'AI Agents', href: '/ai-agents' },
                  { label: 'Image Converter', href: '/image-format-converter' },
                  { label: 'Article Generator', href: '/article-generator' },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ textDecoration: 'none', display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '0.5rem' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#8b5cf6'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                  >{l.label}</Link>
                ))}
              </div>

              {/* Support */}
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', marginBottom: '1rem' }}>Support</h4>
                {[
                  { label: 'Help Center', href: '/support' },
                  { label: 'Report Issue', href: '/report' },
                  { label: 'Contact Us', href: '/support' },
                  { label: 'Admin Panel', href: '/admin-panel' },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ textDecoration: 'none', display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '0.5rem' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#1dbf73'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                © 2026 DevLpers. All rights reserved. Built by Dev Zeeshan.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {[
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms', href: '#' },
                  { label: 'Sitemap', href: '/tools' },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textDecoration: 'none' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#1dbf73'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}