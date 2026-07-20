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
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);
      setForm(prev => ({ ...prev, full_name: user.user_metadata?.full_name || '' }));

      const { data: profile } = await supabase
        .from('developer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setForm({
          full_name: profile.full_name || '',
          title: profile.title || '',
          bio: profile.bio || '',
          hourly_rate: profile.hourly_rate?.toString() || '',
          location: profile.location || '',
          availability: profile.availability || 'available',
          skills: profile.skills || [],
        });
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !user) return;
  setUploading(true);

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (!error) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    setAvatarUrl(data.publicUrl);

    // Save to profile immediately
    await supabase
      .from('developer_profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('user_id', user.id);
  }
  setUploading(false);
};

  const handleSave = async () => {

    console.log('Save clicked!');
    console.log('Form data:', form);
    console.log('User:', user?.id);
    if (!form.full_name || !form.title || !form.bio) {
      alert('Please fill name, title and bio!');
      return;
    }
    setSaving(true);

    // Check if profile exists
    const { data: existing } = await supabase
      .from('developer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    let error;

    if (existing) {
      // Update
      const { error: updateError } = await supabase
.from('developer_profiles')
  .update({
    full_name: form.full_name,
    title: form.title,
    bio: form.bio,
    hourly_rate: Number(form.hourly_rate),
    location: form.location,
    availability: form.availability,
    skills: form.skills,
    avatar_url: avatarUrl,
  })
  .eq('user_id', user.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('developer_profiles')
        .insert({
          user_id: user.id,
          full_name: form.full_name,
          title: form.title,
          bio: form.bio,
          hourly_rate: Number(form.hourly_rate),
          location: form.location,
          availability: form.availability,
          skills: form.skills,
        });
      error = insertError;
    }

    setSaving(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '80px', padding: '80px 5% 3rem', maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem', color: '#404145' }}>
            Setup Your Profile 👤
          </h1>
          <p style={{ color: '#95979d', fontSize: '0.9rem' }}>Complete your profile to get hired by top clients</p>
        </div>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#1dbf73', fontWeight: 600 }}>
            ✅ Profile saved successfully!
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Avatar */}
{/* Avatar */}
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <div style={{ position: 'relative', flexShrink: 0 }}>
    {avatarUrl ? (
      <img src={avatarUrl} alt="Avatar"
        style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1dbf73' }}
      />
    ) : (
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: '#1dbf73', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1.5rem',
      }}>{form.full_name?.[0]?.toUpperCase() || '?'}</div>
    )}
    <button onClick={() => fileRef.current?.click()} style={{
      position: 'absolute', bottom: 0, right: 0,
      width: '24px', height: '24px', borderRadius: '50%',
      background: '#1dbf73', border: '2px solid #fff',
      color: '#fff', fontSize: '0.7rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>📷</button>
  </div>
  <div>
    <div style={{ fontWeight: 700, color: '#404145' }}>{form.full_name || 'Your Name'}</div>
    <div style={{ color: '#95979d', fontSize: '0.85rem' }}>{user?.email}</div>
    <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
      marginTop: '0.4rem', background: '#fff', border: '1px solid #e4e5e7',
      borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
      fontSize: '0.78rem', color: '#62646a',
    }}>
      {uploading ? 'Uploading...' : '📷 Upload Photo'}
    </button>
    <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
  </div>
</div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Full Name *</label>
            <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ali Hassan"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Professional Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Full Stack Developer | React & Node.js Expert"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Bio / About Me *</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell clients about yourself..."
              rows={5}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'Inter', boxSizing: 'border-box' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />
          </div>

          {/* Skills */}
          <div>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.75rem' }}>
              Skills ({form.skills.length} selected)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {skillOptions.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)} style={{
                  padding: '5px 14px',
                  background: form.skills.includes(skill) ? '#f0fdf4' : '#fff',
                  border: `1px solid ${form.skills.includes(skill) ? '#1dbf73' : '#e4e5e7'}`,
                  borderRadius: '100px',
                  color: form.skills.includes(skill) ? '#1dbf73' : '#62646a',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                }}>{skill}</button>
              ))}
            </div>
          </div>

          {/* Rate & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Hourly Rate ($/hr)</label>
              <input type="number" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })}
                placeholder="e.g. 45"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Karachi, Pakistan"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#404145', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.75rem' }}>Availability</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { value: 'available', label: '✅ Available' },
                { value: 'busy', label: '🔴 Busy' },
                { value: 'part-time', label: '🟡 Part Time' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setForm({ ...form, availability: opt.value })} style={{
                  padding: '8px 18px',
                  background: form.availability === opt.value ? '#f0fdf4' : '#fff',
                  border: `1px solid ${form.availability === opt.value ? '#1dbf73' : '#e4e5e7'}`,
                  borderRadius: '6px',
                  color: form.availability === opt.value ? '#1dbf73' : '#62646a',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                }}>{opt.label}</button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 1, padding: '12px',
              background: saving ? '#a7f3d0' : '#1dbf73',
              border: 'none', borderRadius: '6px', color: '#fff',
              fontWeight: 700, fontSize: '1rem',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}>
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '6px', color: '#62646a', cursor: 'pointer' }}>
                Dashboard →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}