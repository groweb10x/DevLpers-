'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all fields!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    if (selectedRoles.length === 0) {
      setError('Please select at least one role!');
      return;
    }
    setLoading(true);

    const primaryRole = selectedRoles.includes('developer') ? 'developer' : selectedRoles[0];

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          role: primaryRole,
          roles: selectedRoles,
        }
      }
    });

    if (error) { setError(error.message); setLoading(false); return; }

    // Profile banao
    if (data.user) {
      await supabase.from('developer_profiles').insert({
        user_id: data.user.id,
        full_name: form.name,
        is_developer: selectedRoles.includes('developer'),
        is_client: selectedRoles.includes('client'),
        is_tools_buyer: selectedRoles.includes('tools'),
        active_role: primaryRole,
      });

      // Welcome email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            to: form.email,
            name: form.name,
          }),
        });
      } catch (e) { console.log('Email error:', e); }
    }

    setLoading(false);
    window.location.href = primaryRole === 'developer' ? '/dashboard' : '/buyer-dashboard';
  };

  const roles = [
    {
      id: 'developer',
      icon: '💻',
      title: 'Developer',
      desc: 'Find jobs, submit proposals, earn money',
      color: '#1dbf73',
      bg: '#f0fdf4',
      border: '#bbf7d0',
    },
    {
      id: 'client',
      icon: '🏢',
      title: 'Client',
      desc: 'Post jobs, hire developers, manage projects',
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    {
      id: 'tools',
      icon: '🛠️',
      title: 'Tools Buyer',
      desc: 'Access premium dev tools and utilities',
      color: '#8b5cf6',
      bg: '#faf5ff',
      border: '#e9d5ff',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #e4e5e7',
        padding: '0 5%', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1dbf73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>D</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.3rem', color: '#404145' }}>
            Dev<span style={{ color: '#1dbf73' }}>Lpers</span>
          </span>
        </Link>
        <p style={{ color: '#62646a', fontSize: '0.9rem' }}>
          Already a member?{' '}
          <Link href="/login" style={{ color: '#1dbf73', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* Progress */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: '4px', borderRadius: '100px',
                background: step >= s ? '#1dbf73' : '#e4e5e7',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1a1a2e' }}>
              {step === 1 ? 'Choose Your Role(s)' : 'Create Your Account'}
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.9rem' }}>
              {step === 1
                ? 'Select one or more roles — you can switch anytime'
                : 'Fill in your details to get started'}
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

            {/* STEP 1 — Role Selection */}
            {step === 1 && (
              <>
                <p style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', lineHeight: 1.6 }}>
                  💡 <strong>One account, multiple roles!</strong> Select all roles you need — you can switch between them anytime from the navbar.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {roles.map(role => {
                    const isSelected = selectedRoles.includes(role.id);
                    return (
                      <div key={role.id} onClick={() => toggleRole(role.id)} style={{
                        border: `2px solid ${isSelected ? role.color : '#e4e5e7'}`,
                        borderRadius: '10px', padding: '1.25rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: isSelected ? role.bg : '#fff',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                      }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '10px',
                          background: isSelected ? role.border : '#f5f5f5',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem', flexShrink: 0,
                        }}>{role.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: '0.2rem', fontSize: '0.95rem' }}>
                            {role.title}
                          </div>
                          <div style={{ color: '#62646a', fontSize: '0.82rem' }}>{role.desc}</div>
                        </div>
                        {/* Checkbox */}
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '6px',
                          border: `2px solid ${isSelected ? role.color : '#e4e5e7'}`,
                          background: isSelected ? role.color : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.75rem', flexShrink: 0,
                          fontWeight: 700,
                        }}>{isSelected ? '✓' : ''}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected roles preview */}
                {selectedRoles.length > 0 && (
                  <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {selectedRoles.map(r => {
                      const role = roles.find(ro => ro.id === r);
                      return (
                        <span key={r} style={{
                          background: role?.bg, color: role?.color,
                          border: `1px solid ${role?.border}`,
                          borderRadius: '100px', padding: '3px 12px',
                          fontSize: '0.78rem', fontWeight: 600,
                        }}>{role?.icon} {role?.title}</span>
                      );
                    })}
                  </div>
                )}

                <button onClick={() => selectedRoles.length > 0 && setStep(2)} style={{
                  width: '100%', padding: '13px',
                  background: selectedRoles.length > 0 ? '#1dbf73' : '#e4e5e7',
                  border: 'none', borderRadius: '8px',
                  color: selectedRoles.length > 0 ? '#fff' : '#95979d',
                  fontWeight: 700, fontSize: '0.95rem',
                  cursor: selectedRoles.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}>
                  Continue → {selectedRoles.length > 0 && `(${selectedRoles.length} role${selectedRoles.length > 1 ? 's' : ''} selected)`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e4e5e7' }} />
                  <span style={{ color: '#95979d', fontSize: '0.8rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: '#e4e5e7' }} />
                </div>

                <button style={{
                  width: '100%', padding: '11px',
                  background: '#fff', border: '1px solid #e4e5e7',
                  borderRadius: '8px', color: '#404145',
                  fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}>
                  🌐 Continue with Google
                </button>
              </>
            )}

            {/* GitHub */}
<button onClick={async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
}} style={{
  width: '100%', padding: '11px',
  background: '#24292e', border: 'none',
  borderRadius: '8px', color: '#fff',
  fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
}}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
  Continue with GitHub
</button>

            {/* STEP 2 — Form */}
            {step === 2 && (
              <>
                <button onClick={() => setStep(1)} style={{
                  background: 'transparent', border: 'none',
                  color: '#62646a', cursor: 'pointer',
                  fontSize: '0.85rem', marginBottom: '1.25rem',
                  padding: 0, display: 'flex', alignItems: 'center', gap: '4px',
                }}>← Back</button>

                {/* Selected roles */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {selectedRoles.map(r => {
                    const role = roles.find(ro => ro.id === r);
                    return (
                      <span key={r} style={{
                        background: role?.bg, color: role?.color,
                        border: `1px solid ${role?.border}`,
                        borderRadius: '100px', padding: '3px 12px',
                        fontSize: '0.78rem', fontWeight: 600,
                      }}>{role?.icon} {role?.title}</span>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Ali Hassan' },
                    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'ali@example.com' },
                    { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
                  ].map(field => (
                    <div key={field.name}>
                      <label style={{ display: 'block', color: '#404145', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleInput}
                        style={{
                          width: '100%', padding: '10px 14px',
                          border: '1px solid #e4e5e7',
                          borderRadius: '8px', color: '#404145',
                          fontSize: '0.9rem', outline: 'none',
                          boxSizing: 'border-box', background: '#fff',
                        }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={handleSubmit} disabled={loading} style={{
                  width: '100%', padding: '13px',
                  background: loading ? '#a7f3d0' : '#1dbf73',
                  border: 'none', borderRadius: '8px',
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Creating Account...' : 'Create Account 🚀'}
                </button>

                <p style={{ textAlign: 'center', color: '#95979d', fontSize: '0.78rem', marginTop: '1rem', lineHeight: 1.6 }}>
                  By joining, you agree to our{' '}
                  <Link href="#" style={{ color: '#1dbf73', textDecoration: 'none' }}>Terms</Link>{' '}
                  and{' '}
                  <Link href="#" style={{ color: '#1dbf73', textDecoration: 'none' }}>Privacy Policy</Link>
                </p>
              </>
            )}
          </div>

          <p style={{ textAlign: 'center', color: '#62646a', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#1dbf73', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid #e4e5e7', color: '#95979d', fontSize: '0.8rem' }}>
        © 2026 DevLpers · <Link href="#" style={{ color: '#95979d', textDecoration: 'none' }}>Privacy</Link> · <Link href="#" style={{ color: '#95979d', textDecoration: 'none' }}>Terms</Link>
      </div>
    </div>
  );
}