'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

const skillOptions = ['React', 'Next.js', 'Node.js', 'Python', 'Flutter', 'Laravel', 'WordPress', 'Figma', 'React Native', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'UI/UX', 'Vue.js', 'Angular', 'Swift', 'Kotlin', 'PHP'];

export default function ProfileSetup() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    full_name: '',
    title: '',
    bio: '',
    hourly_rate: '',
    location: '',
    availability: 'available',
    skills: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      setForm(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
      }));

      const { data: profile } = await supabase
        .from('developer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setForm({
          full_name: profile.full_name || user.user_metadata?.full_name || '',
          title: profile.title || '',
          bio: profile.bio || '',
          hourly_rate: profile.hourly_rate?.toString() || '',
          location: profile.location || '',
          availability: profile.availability || 'available',
          skills: profile.skills || [],
        });
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSave = async () => {
    if (!form.full_name || !form.title || !form.bio) {
      alert('Please fill name, title and bio!');
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from('developer_profiles')
      .upsert({
        user_id: user.id,
        full_name: form.full_name,
        title: form.title,
        bio: form.bio,
        hourly_rate: Number(form.hourly_rate),
        location: form.location,
        availability: form.availability,
        skills: form.skills,
        avatar_url: avatarUrl,
      });

    setSaving(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ paddingTop: '80px', padding: '80px 5% 3rem', maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>
            Setup Your Profile 👤
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Complete your profile to get hired by top clients
          </p>
        </div>

        {saved && (
          <div style={{
            background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)',
            borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem',
            color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>✅ Profile saved successfully!</div>
        )}

        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}>

          {/* Profile Picture */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }}
                />
              ) : (
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#fff',
                }}>
                  {form.full_name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontSize: '0.7rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>📷</button>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>
                {form.full_name || 'Your Name'}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{user?.email}</div>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '6px 14px',
                borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
              }}>
                {uploading ? 'Uploading...' : '📷 Upload Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Full Name *</label>
            <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ali Hassan"
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Professional Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Full Stack Developer | React & Node.js Expert"
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Bio / About Me *</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell clients about yourself, your experience, and what makes you the best choice..."
              rows={5}
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'DM Sans', boxSizing: 'border-box' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Skills */}
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>
              Skills ({form.skills.length} selected)
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

          {/* Hourly Rate & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Hourly Rate ($/hr)</label>
              <input type="number" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })}
                placeholder="e.g. 45"
                style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.4rem' }}>Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Karachi, Pakistan"
                style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.75rem' }}>Availability</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { value: 'available', label: '✅ Available', color: 'var(--green)' },
                { value: 'busy', label: '🔴 Busy', color: 'var(--accent2)' },
                { value: 'part-time', label: '🟡 Part Time', color: '#fbbf24' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm({ ...form, availability: opt.value })} style={{
                  padding: '8px 16px',
                  background: form.availability === opt.value ? 'rgba(108,99,255,0.1)' : 'transparent',
                  border: `1px solid ${form.availability === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  color: form.availability === opt.value ? opt.color : 'var(--muted)',
                  cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                }}>{opt.label}</button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 1, padding: '14px',
              background: saving ? 'var(--border)' : 'var(--accent)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontFamily: 'Syne', fontWeight: 600, fontSize: '1rem',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}>
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 24px',
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: '10px', color: 'var(--muted)',
                cursor: 'pointer', fontSize: '0.9rem',
              }}>Dashboard →</button>
            </Link>
          </div>

        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href={`/developers/${user?.id}`} style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--muted)', padding: '10px 20px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
            }}>👁️ View Public Profile</button>
          </Link>
          <Link href="/jobs" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--muted)', padding: '10px 20px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
            }}>🔍 Browse Jobs</button>
          </Link>
        </div>

      </div>
    </div>
  );
}