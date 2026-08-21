'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const agents = [
  {
    id: 'email-writer',
    icon: '✉️',
    name: 'Email Writer Agent',
    desc: 'Writes professional emails, follow-ups and cold outreach instantly',
    category: 'Writing',
    price: 0,
    badge: 'Free',
    uses: '2.1k',
    rating: 4.8,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    features: ['Cold email writing', 'Follow-up sequences', 'Professional tone', 'Multi-language'],
  },
  {
    id: 'code-reviewer',
    icon: '🔍',
    name: 'Code Reviewer Agent',
    desc: 'Reviews your code for bugs, security issues and best practices',
    category: 'Developer',
    price: 0,
    badge: 'Free',
    uses: '3.4k',
    rating: 4.9,
    color: '#1dbf73',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    features: ['Bug detection', 'Security audit', 'Performance tips', 'Best practices'],
  },
  {
    id: 'seo-analyzer',
    icon: '📈',
    name: 'SEO Analyzer Agent',
    desc: 'Analyzes any webpage and gives actionable SEO improvement tips',
    category: 'SEO',
    price: 0,
    badge: 'Free',
    uses: '1.8k',
    rating: 4.7,
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    features: ['Meta tag analysis', 'Keyword suggestions', 'Content tips', 'Speed insights'],
  },
  {
    id: 'proposal-writer',
    icon: '📝',
    name: 'Proposal Writer Agent',
    desc: 'Writes winning freelance proposals based on job description',
    category: 'Freelance',
    price: 0,
    badge: 'Free',
    uses: '5.2k',
    rating: 4.9,
    color: '#8b5cf6',
    bg: '#faf5ff',
    border: '#e9d5ff',
    features: ['Job analysis', 'Custom proposals', 'Bid suggestions', 'Cover letters'],
  },
  {
    id: 'social-post',
    icon: '📱',
    name: 'Social Media Agent',
    desc: 'Creates engaging posts for LinkedIn, Twitter, Instagram and more',
    category: 'Marketing',
    price: 0,
    badge: 'Free',
    uses: '1.2k',
    rating: 4.6,
    color: '#ec4899',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    features: ['Platform-specific', 'Hashtag suggestions', 'Engagement hooks', 'Multiple formats'],
  },
  {
    id: 'bug-fixer',
    icon: '🐛',
    name: 'Bug Fixer Agent',
    desc: 'Paste your buggy code and get a fixed version with explanation',
    category: 'Developer',
    price: 0,
    badge: 'Free',
    uses: '4.1k',
    rating: 4.8,
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    features: ['Any language', 'Error explanation', 'Fixed code', 'Prevention tips'],
  },
  {
    id: 'readme-writer',
    icon: '📄',
    name: 'README Writer Agent',
    desc: 'Generates professional GitHub README files from project description',
    category: 'Developer',
    price: 0,
    badge: 'Free',
    uses: '2.7k',
    rating: 4.7,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    features: ['Badges support', 'Installation guide', 'API docs', 'Contributing guide'],
  },
  {
    id: 'price-negotiator',
    icon: '💰',
    name: 'Price Negotiator Agent',
    desc: 'Helps you negotiate better rates with clients professionally',
    category: 'Freelance',
    price: 0,
    badge: 'Free',
    uses: '987',
    rating: 4.5,
    color: '#1dbf73',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    features: ['Counter-offer scripts', 'Value justification', 'Psychology tips', 'Email templates'],
  },
  {
    id: 'cv-optimizer',
    icon: '📋',
    name: 'CV Optimizer Agent',
    desc: 'Optimizes your resume/CV for ATS systems and specific job roles',
    category: 'Career',
    price: 0,
    badge: 'Free',
    uses: '1.5k',
    rating: 4.8,
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    features: ['ATS optimization', 'Keyword matching', 'Format tips', 'Skills gap analysis'],
  },
  {
    id: 'api-doc-writer',
    icon: '📚',
    name: 'API Doc Writer Agent',
    desc: 'Generates complete API documentation from your code or endpoints',
    category: 'Developer',
    price: 0,
    badge: 'Free',
    uses: '1.1k',
    rating: 4.6,
    color: '#0284c7',
    bg: '#e0f2fe',
    border: '#bae6fd',
    features: ['Swagger format', 'Endpoint docs', 'Request/response', 'Error codes'],
  },
  {
    id: 'client-communicator',
    icon: '🤝',
    name: 'Client Communication Agent',
    desc: 'Handles tricky client situations with professional responses',
    category: 'Freelance',
    price: 0,
    badge: 'Free',
    uses: '876',
    rating: 4.7,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    features: ['Scope creep handling', 'Late payment', 'Revision requests', 'Conflict resolution'],
  },
  {
    id: 'sql-helper',
    icon: '🗄️',
    name: 'SQL Helper Agent',
    desc: 'Writes, optimizes and explains SQL queries for any database',
    category: 'Developer',
    price: 0,
    badge: 'Free',
    uses: '3.2k',
    rating: 4.9,
    color: '#b45309',
    bg: '#fef3c7',
    border: '#fde68a',
    features: ['Query writing', 'Optimization', 'Explain output', 'All databases'],
  },
];

const categories = ['All', 'Developer', 'Freelance', 'Writing', 'SEO', 'Marketing', 'Career'];

export default function AIAgents() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredAgents = agents.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const runAgent = async () => {
    if (!input.trim()) { alert('Please enter your input!'); return; }
    if (!selectedAgent) return;
    setLoading(true);
    setOutput('');

    const prompts: Record<string, string> = {
      'email-writer': `Write a professional email based on this request: ${input}. Make it concise, professional and effective.`,
      'code-reviewer': `Review this code and provide detailed feedback on bugs, security issues, performance and best practices:\n\n${input}`,
      'seo-analyzer': `Analyze this webpage/content for SEO and provide actionable improvement recommendations:\n\n${input}`,
      'proposal-writer': `Write a compelling freelance proposal for this job description. Make it personalized, professional and winning:\n\n${input}`,
      'social-post': `Create engaging social media posts for LinkedIn, Twitter and Instagram based on this topic/content:\n\n${input}`,
      'bug-fixer': `Fix the bugs in this code and explain what was wrong and how you fixed it:\n\n${input}`,
      'readme-writer': `Generate a professional GitHub README.md file for this project:\n\n${input}`,
      'price-negotiator': `Help me negotiate a better rate for this situation. Provide professional scripts and strategies:\n\n${input}`,
      'cv-optimizer': `Optimize this resume/CV for ATS and job applications. Provide specific improvements:\n\n${input}`,
      'api-doc-writer': `Generate complete API documentation for these endpoints or code:\n\n${input}`,
      'client-communicator': `Help me handle this difficult client situation professionally. Provide a response template:\n\n${input}`,
      'sql-helper': `Write, optimize or explain this SQL query request:\n\n${input}`,
    };

    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleArticle: prompts[selectedAgent.id] || `Help with: ${input}`,
          language: 'English',
          instructions: `You are a ${selectedAgent.name}. ${selectedAgent.desc}. Provide a detailed, professional and actionable response.`,
        }),
      });
      const data = await res.json();
      if (data.article) setOutput(data.article);
      else setOutput('Error generating response. Please try again.');
    } catch (e) {
      setOutput('Error connecting to AI. Please try again.');
    }
    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '4rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '100px', padding: '6px 18px', fontSize: '0.82rem', color: '#a78bfa', fontWeight: 700, marginBottom: '1.25rem' }}>
              🤖 AI Agents — Powered by Llama 3
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
              AI Agents for<br />
              <span style={{ color: '#a78bfa' }}>Developers & Freelancers</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {agents.length} specialized AI agents — write proposals, review code, fix bugs, optimize SEO and more. All free, powered by Llama 3 AI.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['🤖 12 AI Agents', '⚡ Instant', '🆓 100% Free', '💻 Developer Focused', '🔒 Private'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', padding: '5px 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AGENT MODAL */}
        {selectedAgent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

              {/* Modal Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: selectedAgent.bg, border: `1px solid ${selectedAgent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', margin: 0 }}>{selectedAgent.name}</h2>
                    <p style={{ color: '#62646a', fontSize: '0.78rem', margin: 0 }}>{selectedAgent.desc}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedAgent(null); setInput(''); setOutput(''); }} style={{ background: 'transparent', border: 'none', color: '#95979d', cursor: 'pointer', fontSize: '1.5rem', padding: '4px' }}>✕</button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Your Input *
                  </label>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={
                      selectedAgent.id === 'code-reviewer' ? 'Paste your code here...' :
                      selectedAgent.id === 'bug-fixer' ? 'Paste the buggy code here...' :
                      selectedAgent.id === 'proposal-writer' ? 'Paste the job description here...' :
                      selectedAgent.id === 'email-writer' ? 'Describe the email you need (e.g. follow-up email to client about delayed payment)...' :
                      selectedAgent.id === 'sql-helper' ? 'Describe your SQL query need or paste SQL to optimize...' :
                      `Describe what you need from ${selectedAgent.name}...`
                    }
                    rows={6}
                    style={{
                      width: '100%', padding: '1rem',
                      border: '2px solid #e4e5e7', borderRadius: '10px',
                      fontSize: '0.88rem', outline: 'none', resize: 'vertical',
                      fontFamily: ['code-reviewer', 'bug-fixer', 'sql-helper', 'api-doc-writer'].includes(selectedAgent.id) ? 'Courier New, monospace' : 'Inter, sans-serif',
                      background: ['code-reviewer', 'bug-fixer', 'sql-helper', 'api-doc-writer'].includes(selectedAgent.id) ? '#1e1e1e' : '#fff',
color: ['code-reviewer', 'bug-fixer', 'sql-helper', 'api-doc-writer'].includes(selectedAgent.id) ? '#d4d4d4' : '#404145',
lineHeight: 1.6, boxSizing: 'border-box',
                    } as any}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = selectedAgent.color}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                  />
                </div>

                <button onClick={runAgent} disabled={loading} style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#e4e5e7' : `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}cc)`,
                  border: 'none', borderRadius: '10px', color: '#fff',
                  fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}>
                  {loading ? (
                    <>⏳ AI is thinking... (10-20 seconds)</>
                  ) : (
                    <>{selectedAgent.icon} Run {selectedAgent.name}</>
                  )}
                </button>

                {output && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <label style={{ color: '#62646a', fontSize: '0.85rem', fontWeight: 600 }}>✅ AI Output</label>
                      <button onClick={copyOutput} style={{
                        background: copied ? '#1dbf73' : '#fff',
                        border: '1px solid #e4e5e7', color: copied ? '#fff' : '#62646a',
                        padding: '5px 14px', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600,
                      }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                    </div>
                    <div style={{
                      background: '#f8fafc', border: '1px solid #e4e5e7',
                      borderRadius: '10px', padding: '1.25rem',
                      fontSize: '0.88rem', color: '#404145', lineHeight: 1.8,
                      whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto',
                    }}>
                      {output}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 5%' }}>

          {/* Search + Filter */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search AI agents..."
              style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#404145' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#8b5cf6'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: '7px 16px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                  background: activeCategory === cat ? '#8b5cf6' : '#fff',
                  border: `1px solid ${activeCategory === cat ? '#8b5cf6' : '#e4e5e7'}`,
                  color: activeCategory === cat ? '#fff' : '#62646a',
                }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div style={{ color: '#62646a', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
            {search && ` for "${search}"`}
          </div>

          {/* AGENTS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {filteredAgents.map(agent => (
              <div key={agent.id} style={{
                background: '#fff', border: `1px solid ${agent.border}`,
                borderRadius: '14px', padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                position: 'relative', transition: 'all 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${agent.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
              >
                {/* Badge */}
                <span style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: agent.bg, color: agent.color,
                  border: `1px solid ${agent.border}`,
                  borderRadius: '100px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 700,
                }}>{agent.badge}</span>

                {/* Icon + Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: agent.bg, border: `1px solid ${agent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    {agent.icon}
                  </div>
                  <span style={{ background: agent.bg, color: agent.color, border: `1px solid ${agent.border}`, borderRadius: '4px', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>
                    {agent.category}
                  </span>
                </div>

                {/* Name + Desc */}
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', margin: 0 }}>{agent.name}</h3>
                <p style={{ color: '#62646a', fontSize: '0.82rem', lineHeight: 1.5, margin: 0, flex: 1 }}>{agent.desc}</p>

                {/* Features */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {agent.features.map(f => (
                    <span key={f} style={{ background: '#f8fafc', border: '1px solid #e4e5e7', borderRadius: '4px', padding: '2px 8px', fontSize: '0.68rem', color: '#62646a' }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', color: '#95979d', fontSize: '0.75rem' }}>
                    <span>⭐ {agent.rating}</span>
                    <span>👥 {agent.uses} uses</span>
                  </div>
                  <button onClick={() => { setSelectedAgent(agent); setInput(''); setOutput(''); }} style={{
                    background: agent.color, border: 'none', color: '#fff',
                    padding: '7px 18px', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: 700,
                  }}>
                    Use Agent →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1a1a2e', marginBottom: '1.5rem', textAlign: 'center' }}>How AI Agents Work</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '🤖', title: 'Choose Agent', desc: 'Pick the AI agent that fits your task' },
                { icon: '✍️', title: 'Enter Input', desc: 'Paste your code, text or describe your need' },
                { icon: '⚡', title: 'AI Processes', desc: 'Llama 3 AI analyzes and generates output' },
                { icon: '📋', title: 'Copy & Use', desc: 'Copy the output and use it directly' },
              ].map(s => (
                <div key={s.title} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '0.4rem' }}>{s.title}</div>
                  <div style={{ color: '#95979d', fontSize: '0.8rem' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              More AI Agents Coming Soon!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Contract drafting, invoice generation, project estimation and 20+ more agents in development.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/developers" style={{ textDecoration: 'none' }}>
                <button style={{ background: '#fff', color: '#8b5cf6', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
                  Hire an AI Developer →
                </button>
              </Link>
              <Link href="/tools" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer' }}>
                  Browse Tools
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}