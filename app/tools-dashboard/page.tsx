'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const allTools = [
  // Image Tools
  { slug: 'image-format-converter', name: 'Image Format Converter', icon: '🖼️', category: 'Image', desc: 'Convert PNG, JPG, WebP, BMP, GIF, AVIF', price: 0, badge: 'Free' },
  { slug: 'image-compressor', name: 'Image Compressor', icon: '🗜️', category: 'Image', desc: 'Reduce image file size without losing quality', price: 0, badge: 'Free' },
  { slug: 'image-resizer', name: 'Image Resizer', icon: '📐', category: 'Image', desc: 'Resize photos to any dimension or preset', price: 0, badge: 'Free' },
  { slug: 'favicon-generator', name: 'Favicon Generator', icon: '🔖', category: 'Image', desc: 'Create all favicon sizes from one image', price: 0, badge: 'Free' },
  // Calculator Tools
  { slug: 'unit-converter', name: 'Unit Converter', icon: '📏', category: 'Calculator', desc: 'Convert length, weight, temperature', price: 0, badge: 'Free' },
  { slug: 'bmi-calculator', name: 'BMI Calculator', icon: '⚖️', category: 'Calculator', desc: 'Calculate Body Mass Index', price: 0, badge: 'Free' },
  { slug: 'loan-emi-calculator', name: 'Loan EMI Calculator', icon: '🏦', category: 'Calculator', desc: 'Calculate monthly EMI for loans', price: 0, badge: 'Free' },
  { slug: 'percentage-calculator', name: 'Percentage Calculator', icon: '🔢', category: 'Calculator', desc: 'Quick percentage calculations', price: 0, badge: 'Free' },
  // Freelance Tools
  { slug: 'urdu-word-counter', name: 'Urdu Word Counter', icon: '📝', category: 'Freelance', desc: 'Count words in Urdu text instantly', price: 0, badge: 'Free' },
  { slug: 'freelancer-rate-calculator', name: 'Rate Calculator', icon: '💰', category: 'Freelance', desc: 'Calculate ideal hourly rate', price: 0, badge: 'Free' },
  { slug: 'code-line-counter', name: 'Code Line Counter', icon: '💻', category: 'Freelance', desc: 'Count lines of code online', price: 0, badge: 'Free' },
  { slug: 'invoice-generator', name: 'Invoice Generator', icon: '🧾', category: 'Freelance', desc: 'Create professional PDF invoices', price: 0, badge: 'Free' },
  // SEO Tools
  { slug: 'da-pa-checker', name: 'DA PA Checker', icon: '📊', category: 'SEO', desc: 'Check Domain & Page Authority', price: 0, badge: 'Free' },
  { slug: 'spam-score-checker', name: 'Spam Score Checker', icon: '🛡️', category: 'SEO', desc: 'Check domain spam score', price: 0, badge: 'Free' },
  { slug: 'backlink-checker', name: 'Backlink Checker', icon: '🔗', category: 'SEO', desc: 'Find real backlinks for any domain', price: 0, badge: 'Free' },
  { slug: 'devlpers-backlink-indexer', name: 'Backlink Indexer', icon: '📈', category: 'SEO', desc: 'Index your backlinks fast', price: 0, badge: 'Free' },
  // Developer Tools
  { slug: 'youtube-thumbnail-downloader', name: 'YouTube Thumbnail', icon: '🎬', category: 'Developer', desc: 'Download YouTube thumbnails HD', price: 0, badge: 'Free' },
  { slug: 'meta-tag-generator', name: 'Meta Tag Generator', icon: '🏷️', category: 'Developer', desc: 'Generate SEO meta tags', price: 0, badge: 'Free' },
  { slug: 'robots-txt-generator', name: 'Robots.txt Generator', icon: '🤖', category: 'Developer', desc: 'Generate robots.txt file', price: 0, badge: 'Free' },
  { slug: 'htaccess-generator', name: '.htaccess Generator', icon: '⚙️', category: 'Developer', desc: 'Apache configuration generator', price: 0, badge: 'Free' },
  // AI Tools
  { slug: 'article-generator', name: 'AI Article Generator', icon: '✍️', category: 'AI', desc: 'Generate articles with Llama 3 AI', price: 4.99, badge: 'Pro' },
];

const categories = ['All', 'Image', 'Calculator', 'Freelance', 'SEO', 'Developer', 'AI'];

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  Image: { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd' },
  Calculator: { bg: '#faf5ff', color: '#8b5cf6', border: '#e9d5ff' },
  Freelance: { bg: '#fffbeb', color: '#f59e0b', border: '#fde68a' },
  SEO: { bg: '#f0fdf4', color: '#1dbf73', border: '#bbf7d0' },
  Developer: { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  AI: { bg: '#fdf4ff', color: '#a855f7', border: '#e9d5ff' },
};

export default function ToolsDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const { data: prof } = await supabase
        .from('developer_profiles').select('*')
        .eq('user_id', user.id).maybeSingle();
      if (prof) setProfile(prof);

      const { data: purch } = await supabase
        .from('tool_purchases').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (purch) setPurchases(purch);

      setLoading(false);
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const filteredTools = allTools.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const myTools = allTools.filter(t =>
    t.price === 0 || purchases.some(p => p.tool_slug === t.slug && p.status === 'active')
  );

  const isPurchased = (slug: string) => {
    const tool = allTools.find(t => t.slug === slug);
    if (tool?.price === 0) return true;
    return purchases.some(p => p.tool_slug === slug && p.status === 'active');
  };

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName[0]?.toUpperCase();

  const navItems = [
    { id: 'browse', icon: '🛠️', label: 'Browse Tools' },
    { id: 'my-tools', icon: '⭐', label: 'My Tools' },
    { id: 'purchases', icon: '💳', label: 'Purchases' },
    { id: 'stats', icon: '📊', label: 'Usage Stats' },
  ];

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e4e5e7' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.2rem', color: '#404145' }}>
            Dev<span style={{ color: '#8b5cf6' }}>Lpers</span>
          </span>
        </Link>
      </div>

      {/* Profile */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e4e5e7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8b5cf6', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{userInitial}</div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <span style={{ background: '#faf5ff', color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', border: '1px solid #e9d5ff' }}>
              🛠️ Tools Access
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#8b5cf6', fontSize: '1rem' }}>{myTools.length}</div>
            <div style={{ color: '#95979d', fontSize: '0.65rem' }}>Tools Access</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#1dbf73', fontSize: '1rem' }}>{purchases.length}</div>
            <div style={{ color: '#95979d', fontSize: '0.65rem' }}>Purchases</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} style={{
            width: '100%', padding: '0.7rem 1.5rem',
            background: activeTab === item.id ? '#faf5ff' : 'transparent',
            border: 'none',
            borderLeft: activeTab === item.id ? '3px solid #8b5cf6' : '3px solid transparent',
            color: activeTab === item.id ? '#8b5cf6' : '#62646a',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', fontSize: '0.88rem',
            fontWeight: activeTab === item.id ? 600 : 400,
            textAlign: 'left', transition: 'all 0.15s',
          }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e4e5e7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/tools" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', padding: '8px', background: '#8b5cf6', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            🛠️ Open Tools Hub
          </button>
        </Link>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '4px', color: '#62646a', cursor: 'pointer', fontSize: '0.82rem' }}>
          🚪 Log Out
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛠️</div>
        <p>Loading Tools Dashboard...</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media (min-width: 769px) {
          .dash-sidebar { display: flex !important; }
          .dash-mobile-header { display: none !important; }
          .dash-main { margin-left: 260px !important; }
        }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-mobile-header { display: flex !important; }
          .dash-main { margin-left: 0 !important; padding-top: 60px !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>

        {/* DESKTOP SIDEBAR */}
        <aside className="dash-sidebar" style={{ width: '260px', minHeight: '100vh', background: '#fff', borderRight: '1px solid #e4e5e7', position: 'fixed', top: 0, left: 0, zIndex: 50, flexDirection: 'column', display: 'flex' }}>
          <SidebarContent />
        </aside>

        {/* MOBILE HEADER */}
        <div className="dash-mobile-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e4e5e7', padding: '0 1rem', height: '60px', alignItems: 'center', justifyContent: 'space-between', display: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>D</div>
            <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.1rem', color: '#404145' }}>Dev<span style={{ color: '#8b5cf6' }}>Lpers</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: '1px solid #e4e5e7', color: '#404145', cursor: 'pointer', fontSize: '1.2rem', padding: '6px 10px', borderRadius: '4px' }}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.4)' }} />
            <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 99, width: '280px', background: '#fff', borderRight: '1px solid #e4e5e7', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <SidebarContent />
            </aside>
          </>
        )}

        {/* MAIN */}
        <main className="dash-main" style={{ flex: 1, padding: '2rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '0.25rem', color: '#1a1a2e' }}>
                Tools Dashboard 🛠️
              </h1>
              <p style={{ color: '#95979d', fontSize: '0.85rem' }}>{allTools.length} tools available · {myTools.length} accessible</p>
            </div>
            <Link href="/tools">
              <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Open Tools Hub →
              </button>
            </Link>
          </div>

          {/* BROWSE TOOLS TAB */}
          {activeTab === 'browse' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Search + Filter */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="🔍 Search tools..."
                  style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#404145' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#8b5cf6'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                />
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                      padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                      background: activeCategory === cat ? '#8b5cf6' : '#fff',
                      border: `1px solid ${activeCategory === cat ? '#8b5cf6' : '#e4e5e7'}`,
                      color: activeCategory === cat ? '#fff' : '#62646a',
                    }}>{cat}</button>
                  ))}
                </div>
              </div>

              {/* Tools Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {filteredTools.map(tool => {
                  const catStyle = categoryColors[tool.category] || categoryColors.Developer;
                  const purchased = isPurchased(tool.slug);
                  return (
                    <div key={tool.slug} style={{
                      background: '#fff', border: '1px solid #e4e5e7',
                      borderRadius: '12px', padding: '1.5rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      display: 'flex', flexDirection: 'column', gap: '0.6rem',
                      position: 'relative', transition: 'all 0.2s',
                    }}>
                      {/* Badge */}
                      <span style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: tool.price === 0 ? '#f0fdf4' : '#faf5ff',
                        color: tool.price === 0 ? '#1dbf73' : '#8b5cf6',
                        border: `1px solid ${tool.price === 0 ? '#bbf7d0' : '#e9d5ff'}`,
                        borderRadius: '100px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 700,
                      }}>{tool.badge}</span>

                      {/* Icon + Category */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: catStyle.bg, border: `1px solid ${catStyle.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                          {tool.icon}
                        </div>
                        <span style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}`, borderRadius: '4px', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600 }}>
                          {tool.category}
                        </span>
                      </div>

                      <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', margin: 0 }}>{tool.name}</h3>
                      <p style={{ color: '#62646a', fontSize: '0.8rem', lineHeight: 1.5, margin: 0, flex: 1 }}>{tool.desc}</p>

                      {/* Price + Action */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                        <span style={{ fontWeight: 800, color: tool.price === 0 ? '#1dbf73' : '#8b5cf6', fontSize: '0.95rem' }}>
                          {tool.price === 0 ? 'Free' : `$${tool.price}/mo`}
                        </span>
                        {purchased ? (
                          <a href={`/${tool.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                              Open →
                            </button>
                          </a>
                        ) : (
                          <Link href={`/payment?plan=tool&tool=${tool.slug}&amount=${tool.price}`} style={{ textDecoration: 'none' }}>
                            <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                              Buy →
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTools.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#95979d' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
                  <p>No tools found for "{search}"</p>
                </div>
              )}
            </div>
          )}

          {/* MY TOOLS TAB */}
          {activeTab === 'my-tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {categories.filter(c => c !== 'All').map(cat => {
                  const count = myTools.filter(t => t.category === cat).length;
                  const catStyle = categoryColors[cat];
                  return (
                    <div key={cat} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => { setActiveCategory(cat); setActiveTab('browse'); }}>
                      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: catStyle.color }}>{count}</div>
                      <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{cat} Tools</div>
                    </div>
                  );
                })}
              </div>

              {/* Tools Grid */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '1.25rem' }}>
                  ⭐ My Tools ({myTools.length})
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {myTools.map(tool => {
                    const catStyle = categoryColors[tool.category] || categoryColors.Developer;
                    return (
                      <a key={tool.slug} href={`/${tool.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{
                          background: '#fafafa', border: '1px solid #e4e5e7',
                          borderRadius: '8px', padding: '1rem',
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          transition: 'all 0.15s', cursor: 'pointer',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = '#faf5ff'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e4e5e7'; e.currentTarget.style.background = '#fafafa'; }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: catStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                            {tool.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.name}</div>
                            <div style={{ color: catStyle.color, fontSize: '0.7rem', fontWeight: 600 }}>{tool.category}</div>
                          </div>
                          <span style={{ color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>Open →</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PURCHASES TAB */}
          {activeTab === 'purchases' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '1.25rem' }}>
                💳 Purchase History
              </h2>
              {purchases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#95979d' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                  <h3 style={{ fontWeight: 600, color: '#62646a', marginBottom: '0.5rem' }}>No purchases yet</h3>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>All tools are currently free! Premium AI tools coming soon.</p>
                  <button onClick={() => setActiveTab('browse')} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                    Browse Tools →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {purchases.map((p, i) => (
                    <div key={i} style={{ padding: '1.25rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e' }}>{p.tool_name}</div>
                        <div style={{ color: '#95979d', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                          Plan: {p.plan} · Paid: ${p.amount_paid} · {new Date(p.created_at).toLocaleDateString()}
                        </div>
                        {p.expires_at && (
                          <div style={{ color: '#f59e0b', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                            Expires: {new Date(p.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{
                          background: p.status === 'active' ? '#f0fdf4' : '#fef2f2',
                          color: p.status === 'active' ? '#1dbf73' : '#dc2626',
                          border: `1px solid ${p.status === 'active' ? '#bbf7d0' : '#fecaca'}`,
                          borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600,
                        }}>{p.status}</span>
                        <a href={`/${p.tool_slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                            Open →
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Tools Available', value: allTools.length, icon: '🛠️', color: '#8b5cf6' },
                  { label: 'Free Tools', value: allTools.filter(t => t.price === 0).length, icon: '🆓', color: '#1dbf73' },
                  { label: 'Pro Tools', value: allTools.filter(t => t.price > 0).length, icon: '⭐', color: '#f59e0b' },
                  { label: 'My Purchases', value: purchases.length, icon: '💳', color: '#3b82f6' },
                  { label: 'Categories', value: categories.length - 1, icon: '📁', color: '#ec4899' },
                  { label: 'Active Access', value: myTools.length, icon: '✅', color: '#1dbf73' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', color: s.color }}>{s.value}</div>
                    <div style={{ color: '#95979d', fontSize: '0.75rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Category Breakdown */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1.25rem' }}>Tools by Category</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {categories.filter(c => c !== 'All').map(cat => {
                    const total = allTools.filter(t => t.category === cat).length;
                    const free = allTools.filter(t => t.category === cat && t.price === 0).length;
                    const catStyle = categoryColors[cat];
                    const pct = Math.round((free / total) * 100);
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#404145' }}>{cat} Tools</span>
                          <span style={{ fontSize: '0.78rem', color: '#95979d' }}>{free}/{total} free</span>
                        </div>
                        <div style={{ background: '#f0f0f0', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: catStyle.color, borderRadius: '100px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coming Soon */}
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚀</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>More Premium Tools Coming!</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  AI Code Generator, Logo Maker, Video Compressor and more coming soon!
                </p>
                <button onClick={() => setActiveTab('browse')} style={{ background: '#fff', color: '#8b5cf6', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                  Browse Current Tools →
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}