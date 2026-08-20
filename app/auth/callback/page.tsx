'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        window.location.href = '/login';
        return;
      }

      // Check if profile exists
      const { data: profile } = await supabase
        .from('developer_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Create profile if not exists
      if (!profile) {
        const name = user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.user_name ||
          user.email?.split('@')[0] || 'Developer';

        const avatar = user.user_metadata?.avatar_url ||
          user.user_metadata?.picture || null;

        await supabase.from('developer_profiles').insert({
          user_id: user.id,
          full_name: name,
          avatar_url: avatar,
          is_developer: true,
          is_client: false,
          active_role: 'developer',
        });

        // Create subscription
        await supabase.from('subscriptions').insert({
          user_id: user.id,
          plan: 'free',
          bids_remaining: 5,
          bids_total: 5,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });

        // Create seller level
        await supabase.from('seller_levels').insert({
          user_id: user.id,
          level: 1,
          total_jobs: 0,
          total_earnings: 0,
          rating: 0,
          is_devmarket_choice: false,
        });

        // Welcome notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: '🎉 Welcome to DevLpers!',
          message: `Welcome ${name}! Complete your profile to start getting hired.`,
          type: 'success',
          link: '/profile-setup',
        });

        // Redirect to profile setup
        window.location.href = '/profile-setup';
        return;
      }

      // Existing user — redirect based on role
      // Nai line
const role = user.user_metadata?.role || 'developer';
window.location.href = role === 'client' ? '/buyer-dashboard' : '/dashboard';
    };

    handleCallback();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' }}>
          Signing you in...
        </h2>
        <p style={{ fontSize: '0.9rem' }}>Please wait while we set up your account</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#1dbf73', opacity: 0.3,
              animation: `bounce 1s ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}