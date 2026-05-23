'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (sub) setSubscription(sub);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    setLoading(true);
    setSelectedPlan(plan);

    const bidsMap: Record<string, number> = {
      free: 5,
      weekly: 999,
      monthly: 999,
    };

    const expiryMap: Record<string, Date> = {
      free: new Date(Date.now() + 24 * 60 * 60 * 1000),
      weekly: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      monthly: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    const { error } = await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: plan,
      bids_remaining: bidsMap[plan],
      bids_total: bidsMap[plan],
      expires_at: expiryMap[plan].toISOString(),
    });

    setLoading(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert(`${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated!`);
      window.location.reload();
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      color: 'var(--muted)',
      borderColor: 'var(--border)',
      bids: '5 bids per day',
      badge: '',
      features: [
        { text: '5 daily bids', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Browse all jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Standard support', included: true },
        { text: 'Featured listing', included: false },
        { text: 'Priority ranking', included: false },
        { text: 'DevMarket Choice badge', included: false },
        { text: 'Unlimited bids', included: false },
      ],
    },
    {
      id: 'weekly',
      name: 'Weekly Pro',
      price: '$9.99',
      period: 'per week',
      color: 'var(--accent)',
      borderColor: 'var(--accent)',
      bids: 'Unlimited bids',
      badge: '🔥 Popular',
      features: [
        { text: 'Unlimited bids', included: true },
        { text: 'Featured profile', included: true },
        { text: 'Browse all jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Priority support', included: true },
        { text: 'Featured listing', included: true },
        { text: 'Priority ranking', included: true },
        { text: 'DevMarket Choice badge', included: false },
        { text: 'Dedicated account manager', included: false },
      ],
    },
    {
      id: 'monthly',
      name: 'Monthly Elite',
      price: '$29.99',
      period: 'per month',
      color: 'var(--green)',
      borderColor: 'var(--green)',
      bids: 'Unlimited bids',
      badge: '⭐ Best Value',
      features: [
        { text: 'Unlimited bids', included: true },
        { text: 'Featured profile', included: true },
        { text: 'Browse all jobs', included: true },
        { text: 'Apply to jobs', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Featured listing', included: true },
        { text: 'Priority ranking', included: true },
        { text: 'DevMarket Choice badge', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
    },
  ];

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
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user ? (
            <Link href="/dashboard">
              <button style={{
                background: 'var(--accent)', border: 'none',
                color: '#fff', padding: '8px 18px',
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
              }}>Dashboard</button>
            </Link>
          ) : (
            <Link href="/signup">
              <button style={{
                background: 'var(--accent)', border: 'none',
                color: '#fff', padding: '8px 18px',
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
              }}>Sign Up Free</button>
            </Link>
          )}
        </div>
      </nav>

      <div style={{ paddingTop: '80px', padding: '80px 5% 4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: '100px', padding: '6px 16px',
            fontSize: '0.8rem', color: 'var(--accent)',
            marginBottom: '1.5rem',
          }}>
            💳 Simple Pricing
          </div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
            Choose Your Plan
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Start free and upgrade when you need more bids and features. No hidden fees.
          </p>

          {/* Current Plan */}
          {subscription && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(0,212,170,0.1)',
              border: '1px solid rgba(0,212,170,0.3)',
              borderRadius: '100px', padding: '8px 20px',
              fontSize: '0.85rem', color: 'var(--green)',
              marginTop: '1.5rem',
            }}>
              ✅ Current Plan: <strong>{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</strong>
              · {subscription.bids_remaining} bids remaining
            </div>
          )}
        </div>

        {/* Plans */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem', maxWidth: '1000px', margin: '0 auto 4rem',
        }}>
          {plans.map(plan => (
            <div key={plan.id} style={{
              background: 'var(--card)',
              border: `2px solid ${subscription?.plan === plan.id ? plan.borderColor : 'var(--border)'}`,
              borderRadius: '20px', padding: '2rem',
              position: 'relative',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = plan.borderColor; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = subscription?.plan === plan.id ? plan.borderColor : 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.id === 'weekly' ? 'var(--accent)' : 'var(--green)',
                  color: '#fff', borderRadius: '100px',
                  padding: '4px 16px', fontSize: '0.78rem', fontWeight: 600,
                  fontFamily: 'Syne', whiteSpace: 'nowrap',
                }}>{plan.badge}</div>
              )}

              {/* Current badge */}
              {subscription?.plan === plan.id && (
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(0,212,170,0.15)',
                  color: 'var(--green)',
                  border: '1px solid rgba(0,212,170,0.3)',
                  borderRadius: '6px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600,
                }}>✓ Active</div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: plan.color, marginBottom: '0.5rem' }}>
                  {plan.name}
                </div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                  {plan.price}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{plan.period}</div>
                <div style={{
                  background: `rgba(${plan.id === 'free' ? '136,136,170' : plan.id === 'weekly' ? '108,99,255' : '0,212,170'},0.1)`,
                  border: `1px solid rgba(${plan.id === 'free' ? '136,136,170' : plan.id === 'weekly' ? '108,99,255' : '0,212,170'},0.3)`,
                  borderRadius: '8px', padding: '6px 12px',
                  fontSize: '0.82rem', color: plan.color, display: 'inline-block',
                }}>🎯 {plan.bids}</div>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontSize: '0.85rem',
                    color: feature.included ? 'var(--text)' : 'var(--muted)',
                    opacity: feature.included ? 1 : 0.5,
                  }}>
                    <span style={{ color: feature.included ? plan.color : 'var(--muted)', flexShrink: 0 }}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    {feature.text}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading && selectedPlan === plan.id || subscription?.plan === plan.id}
                style={{
                  width: '100%', padding: '13px',
                  background: subscription?.plan === plan.id ? 'var(--border)' : plan.id === 'free' ? 'transparent' : plan.id === 'weekly' ? 'var(--accent)' : 'var(--green)',
                  border: plan.id === 'free' ? `1px solid ${plan.borderColor}` : 'none',
                  borderRadius: '10px',
                  color: subscription?.plan === plan.id ? 'var(--muted)' : plan.id === 'free' ? 'var(--text)' : '#fff',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem',
                  cursor: subscription?.plan === plan.id ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}>
                {subscription?.plan === plan.id ? '✓ Current Plan' :
                  loading && selectedPlan === plan.id ? 'Processing...' :
                    plan.id === 'free' ? 'Get Started Free' :
                      `Subscribe ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Bid System Explanation */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            How Bids Work 🎯
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem', marginBottom: '3rem',
          }}>
            {[
              { icon: '🎫', title: 'What are Bids?', desc: 'Bids are credits you use to apply for jobs. Each proposal costs 1 bid.' },
              { icon: '🆓', title: 'Free Plan', desc: 'Free users get 5 bids per day. Bids reset every 24 hours at midnight.' },
              { icon: '♾️', title: 'Pro Plans', desc: 'Weekly and Monthly plans get unlimited bids — apply to as many jobs as you want!' },
              { icon: '📈', title: 'Level Up', desc: 'Higher seller levels unlock more features and better job visibility.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1.5rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Seller Levels */}
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            Seller Levels 🏆
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { level: 'Level 1', icon: '🥉', color: '#cd7f32', req: '0 jobs completed', perks: 'Basic listing, 5 bids/day' },
              { level: 'Level 2', icon: '🥈', color: '#c0c0c0', req: '10 jobs completed', perks: 'Featured listing, priority search' },
              { level: 'Level 3', icon: '🥇', color: '#ffd700', req: '50 jobs completed', perks: 'Top search ranking, verified badge' },
              { level: 'DevMarket Choice', icon: '⭐', color: 'var(--accent)', req: 'Selected by DevMarket', perks: 'Elite badge, dedicated support, homepage feature' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: `1px solid ${item.color}`,
                borderRadius: '14px', padding: '1.5rem',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, color: item.color, marginBottom: '0.4rem' }}>{item.level}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>Requires: {item.req}</div>
                <div style={{ color: 'var(--text)', fontSize: '0.82rem' }}>{item.perks}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}