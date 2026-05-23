'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const skillOptions = ['React', 'Next.js', 'Node.js', 'Python', 'Flutter', 'Laravel', 'WordPress', 'Figma', 'React Native', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'UI/UX'];

export default function PostJob() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    desc: '',
    skills: [] as string[],
    budgetType: 'Fixed',
    budgetMin: '',
    budgetMax: '',
    hourlyRate: '',
    duration: '',
    level: '',
  });
  const handlePostJob = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    alert('Please login first!');
    window.location.href = '/login';
    return;
  }

  const { error } = await supabase.from('jobs').insert({
    buyer_id: user.id,
    title: form.title,
    description: form.desc,
    category: form.category,
    skills: form.skills,
    budget_type: form.budgetType,
    budget_min: form.budgetType === 'Fixed' ? Number(form.budgetMin) : Number(form.hourlyRate),
    budget_max: form.budgetType === 'Fixed' ? Number(form.budgetMax) : null,
    level: form.level,
    duration: form.duration,
    status: 'Open',
  });

  if (error) {
    alert('Error: ' + error.message);
  } else {
    setSubmitted(true);
  }
};

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalSteps = 3;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAVBAR */}
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
        <Link href="/buyer-dashboard">
          <button style={{
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text)', padding: '8px 18px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
          }}>← Dashboard</button>
        </Link>
      </nav>

      <div style={{ paddingTop: '80px', padding: '80px 5% 3rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>
              Post a Job 📋
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Tell us what you need — get proposals within hours
            </p>
          </div>

          {/* Progress Bar */}
          {!submitted && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                {['Job Details', 'Skills & Budget', 'Review'].map((label, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--accent)' : 'var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    }}>{step > i + 1 ? '✓' : i + 1}</div>
                    <span style={{
                      fontSize: '0.82rem',
                      color: step === i + 1 ? 'var(--text)' : 'var(--muted)',
                    }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '100px' }}>
                <div style={{
                  width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
                  height: '100%', background: 'var(--accent)',
                  borderRadius: '100px', transition: 'width 0.3s',
                }} />
              </div>
            </div>
          )}

          {/* Card */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '2rem',
          }}>

            {/* SUCCESS */}
            {submitted && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--green)' }}>
                  Job Posted Successfully!
                </h2>
                <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  Your job is now live. Developers will start sending proposals soon!
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/buyer-dashboard">
                    <button style={{
                      background: 'var(--accent)', color: '#fff',
                      border: 'none', padding: '12px 28px',
                      borderRadius: '10px', fontFamily: 'Syne',
                      fontWeight: 600, cursor: 'pointer',
                    }}>Go to Dashboard</button>
                  </Link>
                  <button onClick={() => { setSubmitted(false); setStep(1); setForm({ title: '', category: '', desc: '', skills: [], budgetType: 'Fixed', budgetMin: '', budgetMax: '', hourlyRate: '', duration: '', level: '' }); }} style={{
                    background: 'transparent', color: 'var(--text)',
                    border: '1px solid var(--border)', padding: '12px 28px',
                    borderRadius: '10px', cursor: 'pointer',
                  }}>Post Another Job</button>
                </div>
              </div>
            )}

            {/* STEP 1 - Job Details */}
            {!submitted && step === 1 && (
              <>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Job Details
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                      Job Title *
                    </label>
                    <input
                      name="title" value={form.title} onChange={handleInput}
                      placeholder="e.g. Full Stack Developer for E-commerce Website"
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: '8px', color: 'var(--text)',
                        fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                      onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                      Category *
                    </label>
                    <select
                      name="category" value={form.category} onChange={handleInput}
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: '8px', color: form.category ? 'var(--text)' : 'var(--muted)',
                        fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Select a category</option>
                      <option>Web Development</option>
                      <option>Mobile Apps</option>
                      <option>AI & ML</option>
                      <option>UI/UX Design</option>
                      <option>Cybersecurity</option>
                      <option>Cloud & DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                      Job Description *
                    </label>
                    <textarea
                      name="desc" value={form.desc} onChange={handleInput}
                      placeholder="Describe your project in detail. What do you need? What are the goals? Any specific requirements?"
                      rows={6}
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: '8px', color: 'var(--text)',
                        fontSize: '0.9rem', outline: 'none',
                        resize: 'vertical', fontFamily: 'DM Sans',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                      onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                      Experience Level *
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {['Entry', 'Intermediate', 'Expert'].map(l => (
                        <button key={l} onClick={() => setForm({ ...form, level: l })} style={{
                          padding: '8px 20px',
                          background: form.level === l ? 'rgba(108,99,255,0.15)' : 'transparent',
                          border: `1px solid ${form.level === l ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: '8px',
                          color: form.level === l ? 'var(--accent)' : 'var(--muted)',
                          cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                        }}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => form.title && form.category && form.desc && form.level && setStep(2)}
                  style={{
                    width: '100%', padding: '14px', marginTop: '2rem',
                    background: form.title && form.category && form.desc && form.level ? 'var(--accent)' : 'var(--border)',
                    border: 'none', borderRadius: '10px', color: '#fff',
                    fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
                    cursor: form.title && form.category && form.desc && form.level ? 'pointer' : 'not-allowed',
                  }}>
                  Next: Skills & Budget →
                </button>
              </>
            )}

            {/* STEP 2 - Skills & Budget */}
            {!submitted && step === 2 && (
              <>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Skills & Budget
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* Skills */}
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                      Required Skills * ({form.skills.length} selected)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {skillOptions.map(skill => (
                        <button key={skill} onClick={() => toggleSkill(skill)} style={{
                          padding: '6px 14px',
                          background: form.skills.includes(skill) ? 'rgba(108,99,255,0.15)' : 'transparent',
                          border: `1px solid ${form.skills.includes(skill) ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: '100px',
                          color: form.skills.includes(skill) ? 'var(--accent)' : 'var(--muted)',
                          cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                        }}>{skill}</button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Type */}
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                      Budget Type *
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {['Fixed', 'Hourly'].map(t => (
                        <button key={t} onClick={() => setForm({ ...form, budgetType: t })} style={{
                          flex: 1, padding: '10px',
                          background: form.budgetType === t ? 'rgba(108,99,255,0.15)' : 'transparent',
                          border: `1px solid ${form.budgetType === t ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: '8px',
                          color: form.budgetType === t ? 'var(--accent)' : 'var(--muted)',
                          cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600,
                          transition: 'all 0.2s',
                        }}>
                          {t === 'Fixed' ? '💰 Fixed Price' : '⏱️ Hourly Rate'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Amount */}
                  {form.budgetType === 'Fixed' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Min Budget ($)</label>
                        <input
                          name="budgetMin" value={form.budgetMin} onChange={handleInput}
                          type="number" placeholder="e.g. 500"
                          style={{
                            width: '100%', padding: '12px 14px',
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: '8px', color: 'var(--text)',
                            fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                          }}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Max Budget ($)</label>
                        <input
                          name="budgetMax" value={form.budgetMax} onChange={handleInput}
                          type="number" placeholder="e.g. 1000"
                          style={{
                            width: '100%', padding: '12px 14px',
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: '8px', color: 'var(--text)',
                            fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                          }}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Hourly Rate ($/hr)</label>
                      <input
                        name="hourlyRate" value={form.hourlyRate} onChange={handleInput}
                        type="number" placeholder="e.g. 35"
                        style={{
                          width: '100%', padding: '12px 14px',
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          borderRadius: '8px', color: 'var(--text)',
                          fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                      />
                    </div>
                  )}

                  {/* Duration */}
                  <div>
                    <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
                      Project Duration *
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {['< 1 week', '1-2 weeks', '1 month', '1-3 months', '3-6 months', 'Ongoing'].map(d => (
                        <button key={d} onClick={() => setForm({ ...form, duration: d })} style={{
                          padding: '7px 14px',
                          background: form.duration === d ? 'rgba(0,212,170,0.1)' : 'transparent',
                          border: `1px solid ${form.duration === d ? 'var(--green)' : 'var(--border)'}`,
                          borderRadius: '100px',
                          color: form.duration === d ? 'var(--green)' : 'var(--muted)',
                          cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                        }}>{d}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                  <button onClick={() => setStep(1)} style={{
                    padding: '14px 24px',
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '10px', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: '0.9rem',
                  }}>← Back</button>
                  <button
                    onClick={() => form.skills.length > 0 && form.duration && setStep(3)}
                    style={{
                      flex: 1, padding: '14px',
                      background: form.skills.length > 0 && form.duration ? 'var(--accent)' : 'var(--border)',
                      border: 'none', borderRadius: '10px', color: '#fff',
                      fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
                      cursor: form.skills.length > 0 && form.duration ? 'pointer' : 'not-allowed',
                    }}>
                    Next: Review →
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 - Review */}
            {!submitted && step === 3 && (
              <>
                <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Review Your Job Post
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Job Title', value: form.title },
                    { label: 'Category', value: form.category },
                    { label: 'Level', value: form.level },
                    { label: 'Budget Type', value: form.budgetType },
                    { label: 'Budget', value: form.budgetType === 'Fixed' ? `$${form.budgetMin} - $${form.budgetMax}` : `$${form.hourlyRate}/hr` },
                    { label: 'Duration', value: form.duration },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.75rem', background: 'var(--bg)',
                      borderRadius: '8px', border: '1px solid var(--border)',
                    }}>
                      <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.label}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</span>
                    </div>
                  ))}

                  <div style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Skills</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {form.skills.map(s => (
                        <span key={s} style={{
                          background: 'rgba(108,99,255,0.1)',
                          border: '1px solid rgba(108,99,255,0.2)',
                          borderRadius: '6px', padding: '3px 10px',
                          fontSize: '0.78rem', color: 'var(--accent)',
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Description</div>
                    <p style={{ color: 'var(--text)', fontSize: '0.85rem', lineHeight: 1.6 }}>{form.desc}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setStep(2)} style={{
                    padding: '14px 24px',
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '10px', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: '0.9rem',
                  }}>← Back</button>
                  <button onClick={handlePostJob} style={{
                    flex: 1, padding: '14px',
                    background: 'var(--accent2)', border: 'none',
                    borderRadius: '10px', color: '#fff',
                    fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
                    cursor: 'pointer',
                  }}>🚀 Post Job Now</button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}