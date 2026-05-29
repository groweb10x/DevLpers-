'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

export default function Pricing() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: sub } = await supabase
          .from('subscriptions').select('*')
          .eq('user_id', user.id).single();
        if (sub) setSubscription(sub);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (plan: string) => {
    if (!user) { window.location.href = '/signup'; return; }
    setLoading(true);
    setSelectedPlan(plan);
    const bidsMap: Record<string, number> = { free: 5, weekly: 999, monthly: 999 };
    const expiryMap: Record<string, Date> = {
      free: new Date(Date.now() + 24 * 60 * 60 * 1000),
      weekly: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      monthly: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    const { error } = await supabase.from('subscriptions').upsert({
      user_id: user.id, plan,
      bids_remaining: bidsMap[plan], bids_total: bidsMap[plan],
      expires_at: expiryMap[plan].toISOString(),
    });
    setLoading(false);
    if (!error) { alert(`${plan} plan activated!`); window.location.reload(); }
  };

  const plans = [
    {
      id: 'free', name: 'Free', price: '$0', period: 'forever',
      bids: '5 bids/day', popular: false,
      features: [
        { text: '5 daily bids', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Browse all jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Standard support', included: true },
        { text: 'Featured listing', included: false },
        { text: 'Priority ranking', included: false },
        { text: 'DevLpers Choice badge', included: false },
        { text: 'Unlimited bids', included: false },
      ],
    },
    {
      id: 'weekly', name: 'Weekly Pro', price: '$9.99', period: 'per week',
      bids: 'Unlimited bids', popular: true,
      features: [
        { text: 'Unlimited bids', included: true },
        { text: 'Featured profile', included: true },
        { text: 'Browse all jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Priority support', included: true },
        { text: 'Featured listing', included: true },
        { text: 'Priority ranking', included: true },
        { text: 'DevLpers Choice badge', included: false },
        { text: 'Dedicated manager', included: false },
      ],
    },
    {
      id: 'monthly', name: 'Monthly Elite', price: '$29.99', period: 'per month',
      bids: 'Unlimited bids', popular: false,
      features: [
        { text: 'Unlimited bids', included: true },
        { text: 'Featured profile', included: true },
        { text: 'Browse all jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Featured listing', included: true },
        { text: 'Priority ranking', included: true },
        { text: 'DevLpers Choice badge', included: true },
        { text: 'Dedicated manager', included: true },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '3rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0',
              borderRadius: '100px', padding: '4px 16px',
              fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '1rem',
            }}>💳 Simple Pricing</div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '0.75rem', color: 'var(--text)' }}>
              Choose Your Plan
            </h1>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Start free and upgrade when you need more. No hidden fees, cancel anytime.
            </p>
            {subscription && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '100px', padding: '6px 16px',
                fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600,
              }}>
                ✅ Current Plan: {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                {subscription.plan === 'free' && ` · ${subscription.bids_remaining} bids left`}
              </div>
            )}
          </div>
        </div>

        {/* PLANS */}
        <div style={{ padding: '3rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem', marginBottom: '4rem',
          }}>
            {plans.map(plan => (
              <div key={plan.id} style={{
                background: '#fff',
                border: plan.popular ? '2px solid var(--accent)' : subscription?.plan === plan.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: '8px', padding: '2rem',
                position: 'relative',
                boxShadow: plan.popular ? '0 4px 20px rgba(29,191,115,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--accent)', color: '#fff',
                    borderRadius: '100px', padding: '4px 16px',
                    fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
                  }}>🔥 Most Popular</div>
                )}

                {/* Current Badge */}
                {subscription?.plan === plan.id && (
                  <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: '#f0fdf4', color: 'var(--accent)',
                    border: '1px solid #bbf7d0',
                    borderRadius: '4px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600,
                  }}>✓ Active</div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>{plan.name}</div>
                  <div style={{ fontWeight: 800, fontSize: '2.25rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{plan.price}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{plan.period}</div>
                  <div style={{
                    display: 'inline-block',
                    background: '#f0fdf4', color: 'var(--accent)',
                    border: '1px solid #bbf7d0',
                    borderRadius: '4px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600,
                  }}>🎯 {plan.bids}</div>
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      fontSize: '0.85rem',
                      color: f.included ? 'var(--text)' : 'var(--muted)',
                      opacity: f.included ? 1 : 0.6,
                    }}>
                      <span style={{ color: f.included ? 'var(--accent)' : 'var(--muted)', flexShrink: 0, fontWeight: 700 }}>
                        {f.included ? '✓' : '✗'}
                      </span>
                      {f.text}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading && selectedPlan === plan.id || subscription?.plan === plan.id}
                  style={{
                    width: '100%', padding: '12px',
                    background: subscription?.plan === plan.id ? '#f5f5f5' : plan.popular ? 'var(--accent)' : '#fff',
                    border: plan.popular ? 'none' : `1px solid ${subscription?.plan === plan.id ? 'var(--border)' : 'var(--accent)'}`,
                    borderRadius: '4px',
                    color: subscription?.plan === plan.id ? 'var(--muted)' : plan.popular ? '#fff' : 'var(--accent)',
                    fontWeight: 700, fontSize: '0.95rem',
                    cursor: subscription?.plan === plan.id ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (subscription?.plan !== plan.id) { if (plan.popular) (e.currentTarget as HTMLElement).style.background = 'var(--accent-dark)'; else { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#fff'; } } }}
                  onMouseLeave={e => { if (subscription?.plan !== plan.id) { if (plan.popular) (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; else { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; } } }}
                >
                  {subscription?.plan === plan.id ? '✓ Current Plan' :
                    loading && selectedPlan === plan.id ? 'Processing...' :
                      plan.id === 'free' ? 'Get Started Free' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* How Bids Work */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
              How Bids Work 🎯
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: '🎫', title: 'What are Bids?', desc: 'Bids are credits used to apply for jobs. Each proposal costs 1 bid.' },
                { icon: '🆓', title: 'Free Plan', desc: 'Get 5 free bids daily. Bids reset every 24 hours at midnight.' },
                { icon: '♾️', title: 'Pro Plans', desc: 'Weekly and Monthly plans include unlimited bids — apply to as many jobs as you want!' },
                { icon: '📈', title: 'Level Up', desc: 'Complete more jobs to unlock higher seller levels and better visibility.' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text)' }}>{item.title}</div>
                  <p style={{ color: 'var(--text2)', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Levels */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
              Seller Levels 🏆
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { level: 'Level 1', icon: '🥉', bg: '#fef3c7', color: '#92400e', border: '#fde68a', req: '0 jobs', perks: 'Basic listing, 5 bids/day' },
                { level: 'Level 2', icon: '🥈', bg: '#f3f4f6', color: '#374151', border: '#d1d5db', req: '10 jobs', perks: 'Featured listing, priority search' },
                { level: 'Level 3', icon: '🥇', bg: '#fef9c3', color: '#78350f', border: '#fde68a', req: '50 jobs', perks: 'Top ranking, verified badge' },
                { level: 'DevLpers Choice', icon: '⭐', bg: '#f0fdf4', color: '#14532d', border: '#bbf7d0', req: 'Selected by team', perks: 'Elite badge, homepage feature' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: item.bg, border: `1px solid ${item.border}`,
                  borderRadius: '8px', padding: '1.25rem',
                }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, color: item.color, marginBottom: '0.25rem', fontSize: '0.9rem' }}>{item.level}</div>
                  <div style={{ color: item.color, fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.8 }}>Requires: {item.req}</div>
                  <div style={{ color: item.color, fontSize: '0.8rem', opacity: 0.9 }}>{item.perks}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}