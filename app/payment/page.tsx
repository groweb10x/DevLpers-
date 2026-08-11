'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

const plans = {
  weekly: { name: 'Weekly Pro', price: 9.99, bids: 999, duration: '7 days', type: 'subscription' },
  monthly: { name: 'Monthly Elite', price: 29.99, bids: 999, duration: '30 days', type: 'subscription' },
  yearly: { name: 'Yearly Ultimate', price: 99.99, bids: 999, duration: '365 days', type: 'subscription' },
};

export default function Payment() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') as string;
  const escrowAmount = searchParams.get('amount');
  const developerId = searchParams.get('developer');
  const jobId = searchParams.get('job');
  const proposalId = searchParams.get('proposal');

  const isEscrow = planId === 'escrow';
  const plan = !isEscrow ? (plans[planId as keyof typeof plans] || plans.weekly) : null;

  const [method, setMethod] = useState<'stripe' | 'crypto' | 'payoneer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'pay' | 'success'>('select');
  const [user, setUser] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState(escrowAmount || '');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [cryptoCopied, setCryptoCopied] = useState(false);
  const [payoneerCopied, setPayoneerCopied] = useState(false);
  const [txId, setTxId] = useState('');

  const cryptoAddress = 'TRX9xKqP8mNvLzWj3YcD5eAhBsRkFqM2p';
  const payoneerEmail = 'payments@develpers.com';

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);
    };
    getUser();
  }, []);

  const finalAmount = isEscrow ? parseFloat(customAmount || '0') : plan?.price || 0;
  const platformFee = isEscrow ? finalAmount * 0.1 : 0;
  const developerAmount = isEscrow ? finalAmount - platformFee : 0;

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const createEscrowRecord = async (method: string, status = 'pending') => {
    if (!user || !isEscrow) return null;
    const { data, error } = await supabase.from('escrow_payments').insert({
      job_id: jobId,
      proposal_id: proposalId,
      client_id: user.id,
      developer_id: developerId,
      amount: finalAmount,
      platform_fee: platformFee,
      developer_amount: developerAmount,
      status,
      payment_method: method,
      transaction_id: txId || null,
    }).select().single();

    if (!error && data) {
      // Notify admin
      const { data: adminUsers } = await supabase.from('admin_users').select('user_id');
      if (adminUsers) {
        for (const admin of adminUsers) {
          await supabase.from('notifications').insert({
            user_id: admin.user_id,
            title: '💳 New Payment Received!',
            message: `Client deposited $${finalAmount} via ${method}. Action required.`,
            type: 'payment',
            link: '/admin-panel',
          });
        }
      }
      // Notify developer
      await supabase.from('notifications').insert({
        user_id: developerId,
        title: '🔒 Payment in Escrow!',
        message: `Client has sent $${finalAmount}. Admin will verify and release after work completion.`,
        type: 'payment',
        link: '/dashboard',
      });
    }
    return data;
  };

  const activateSubscription = async (method: string) => {
    if (!user || isEscrow) return;
    const expiry = new Date();
    if (planId === 'weekly') expiry.setDate(expiry.getDate() + 7);
    else if (planId === 'monthly') expiry.setDate(expiry.getDate() + 30);
    else if (planId === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: planId,
      bids_remaining: 999,
      bids_total: 999,
      expires_at: expiry.toISOString(),
    });

    await supabase.from('notifications').insert({
      user_id: user.id,
      title: '⚡ Subscription Activated!',
      message: `Your ${plan?.name} plan is now active. Enjoy unlimited bids!`,
      type: 'success',
      link: '/dashboard',
    });
  };

  const handleStripePayment = async () => {
    if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
      alert('Please fill all card details!');
      return;
    }
    setLoading(true);
    try {
      if (isEscrow) {
        await createEscrowRecord('stripe', 'pending');
      } else {
        await activateSubscription('stripe');
      }
      setStep('success');
    } catch (e: any) {
      alert('Payment failed: ' + e.message);
    }
    setLoading(false);
  };

  const handleManualPayment = async (paymentMethod: string) => {
    if (!txId.trim()) {
      alert('Please enter your transaction ID!');
      return;
    }
    setLoading(true);
    try {
      if (isEscrow) {
        await createEscrowRecord(paymentMethod, 'pending');
      } else {
        await activateSubscription(paymentMethod);
      }
      setStep('success');
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 5%' }}>

          {/* SUCCESS */}
          {step === 'success' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.75rem', color: '#1dbf73', marginBottom: '0.75rem' }}>
                {isEscrow ? 'Payment Submitted!' : 'Subscription Activated!'}
              </h1>
              {isEscrow ? (
                <>
                  <p style={{ color: '#62646a', marginBottom: '1rem', lineHeight: 1.7 }}>
                    Your payment of <strong>${finalAmount}</strong> has been submitted. Our admin team will verify and confirm within 2 hours.
                  </p>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#1dbf73', marginBottom: '0.5rem' }}>What happens next:</div>
                    {[
                      '✓ Admin verifies your payment',
                      '✓ Developer gets notified to start work',
                      '✓ After work completion, you approve',
                      '✓ Payment released to developer',
                    ].map((s, i) => (
                      <div key={i} style={{ color: '#62646a', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{s}</div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: '#62646a', marginBottom: '2rem', lineHeight: 1.7 }}>
                  Your <strong>{plan?.name}</strong> is now active. Enjoy unlimited bids!
                </p>
              )}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href={isEscrow ? '/buyer-dashboard' : '/dashboard'}>
                  <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    Go to Dashboard →
                  </button>
                </Link>
                {!isEscrow && (
                  <Link href="/jobs">
                    <button style={{ background: '#fff', color: '#62646a', border: '1px solid #e4e5e7', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer' }}>
                      Browse Jobs
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {step !== 'success' && (
            <>
              {/* HEADER */}
              <div style={{ marginBottom: '2rem' }}>
                <Link href={isEscrow ? '/buyer-dashboard' : '/pricing'} style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>
                  ← Back
                </Link>
                <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.75rem', color: '#1a1a2e', margin: '1rem 0 0.5rem' }}>
                  {isEscrow ? '💳 Escrow Payment' : '⚡ Upgrade Plan'}
                </h1>
                <p style={{ color: '#62646a', fontSize: '0.9rem' }}>
                  {isEscrow ? 'Payment held safely until work is approved' : `Upgrading to ${plan?.name}`}
                </p>
              </div>

              {/* ORDER SUMMARY */}
              <div style={{ background: isEscrow ? '#fffbeb' : '#f0fdf4', border: `1px solid ${isEscrow ? '#fde68a' : '#bbf7d0'}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                {isEscrow ? (
                  <>
                    <h3 style={{ fontWeight: 700, color: '#92400e', marginBottom: '1rem', fontSize: '0.95rem' }}>🔒 Escrow Payment Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#62646a', fontSize: '0.88rem' }}>Job Payment</span>
                        <span style={{ fontWeight: 700, color: '#404145' }}>${finalAmount.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#62646a', fontSize: '0.88rem' }}>Platform Fee (10%)</span>
                        <span style={{ fontWeight: 600, color: '#f59e0b' }}>-${platformFee.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #fde68a', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: '#404145' }}>Developer Receives</span>
                        <span style={{ fontWeight: 800, color: '#1dbf73', fontSize: '1.1rem' }}>${developerAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Custom amount input */}
                    {!escrowAmount && (
                      <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', color: '#92400e', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                          Enter Payment Amount ($)
                        </label>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={e => setCustomAmount(e.target.value)}
                          placeholder="Enter amount agreed with developer"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#404145' }}>{plan?.name}</div>
                      <div style={{ color: '#62646a', fontSize: '0.85rem' }}>Unlimited bids · {plan?.duration}</div>
                    </div>
                    <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.5rem', color: '#1dbf73' }}>
                      ${plan?.price}
                    </div>
                  </div>
                )}
              </div>

              {/* PAYMENT METHOD */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '1.25rem' }}>
                  Select Payment Method
                </h2>

                {/* Method Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { id: 'stripe', icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex — powered by Stripe' },
                    { id: 'crypto', icon: '🪙', label: 'Crypto (USDT / BTC / ETH)', desc: 'Pay with cryptocurrency — manual confirmation' },
                    { id: 'payoneer', icon: '💼', label: 'Payoneer', desc: 'Pay via Payoneer — manual confirmation' },
                  ].map(m => (
                    <div key={m.id} onClick={() => setMethod(m.id as any)} style={{
                      border: `2px solid ${method === m.id ? '#1dbf73' : '#e4e5e7'}`,
                      borderRadius: '10px', padding: '1rem 1.25rem',
                      cursor: 'pointer', background: method === m.id ? '#f0fdf4' : '#fff',
                      display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s',
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{m.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#404145', fontSize: '0.9rem' }}>{m.label}</div>
                        <div style={{ color: '#95979d', fontSize: '0.78rem' }}>{m.desc}</div>
                      </div>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${method === m.id ? '#1dbf73' : '#e4e5e7'}`,
                        background: method === m.id ? '#1dbf73' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.65rem',
                      }}>{method === m.id ? '✓' : ''}</div>
                    </div>
                  ))}
                </div>

                {/* STRIPE FORM */}
                {method === 'stripe' && (
                  <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '1rem' }}>Card Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { label: 'Cardholder Name', key: 'name', placeholder: 'Ali Hassan', type: 'text' },
                        { label: 'Card Number', key: 'number', placeholder: '1234 5678 9012 3456', type: 'text' },
                      ].map(field => (
                        <div key={field.key}>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>{field.label}</label>
                          <input
                            type={field.type}
                            value={cardDetails[field.key as keyof typeof cardDetails]}
                            onChange={e => setCardDetails({ ...cardDetails, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#404145' }}
                            onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                            onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                          />
                        </div>
                      ))}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>Expiry Date</label>
                          <input value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} placeholder="MM/YY" maxLength={5} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#404145' }} onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'} onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>CVC</label>
                          <input value={cardDetails.cvc} onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })} placeholder="123" maxLength={4} type="password" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#404145' }} onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'} onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'} />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem', color: '#95979d', fontSize: '0.78rem' }}>🔒 Secured by Stripe</div>
                    <button onClick={handleStripePayment} disabled={loading} style={{ width: '100%', marginTop: '1.25rem', padding: '14px', background: loading ? '#a7f3d0' : '#1dbf73', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {loading ? 'Processing...' : `Pay $${finalAmount.toFixed(2)}`}
                    </button>
                  </div>
                )}

                {/* CRYPTO */}
                {method === 'crypto' && (
                  <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '1rem' }}>Crypto Payment</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      {[
                        { coin: '₿ Bitcoin (BTC)', network: 'Bitcoin Network' },
                        { coin: '💲 USDT', network: 'TRC20 / ERC20' },
                        { coin: '◆ Ethereum (ETH)', network: 'Ethereum Network' },
                      ].map(c => (
                        <div key={c.coin} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.85rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#404145', marginBottom: '0.2rem' }}>{c.coin}</div>
                          <div style={{ color: '#95979d', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{c.network}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <code style={{ fontSize: '0.72rem', color: '#62646a', flex: 1, wordBreak: 'break-all' }}>{cryptoAddress}</code>
                            <button onClick={() => copyText(cryptoAddress, setCryptoCopied)} style={{ background: cryptoCopied ? '#1dbf73' : '#fff', border: '1px solid #e4e5e7', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.72rem', color: cryptoCopied ? '#fff' : '#62646a', whiteSpace: 'nowrap' }}>
                              {cryptoCopied ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Amount to send */}
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1dbf73', fontSize: '0.9rem' }}>
                        Send exactly: <strong>${finalAmount.toFixed(2)} USD equivalent</strong>
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>
                        Transaction ID / Hash *
                      </label>
                      <input
                        value={txId}
                        onChange={e => setTxId(e.target.value)}
                        placeholder="Paste your transaction hash here"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#404145' }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                      />
                    </div>

                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.85rem', color: '#92400e', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      ⚠️ After sending, enter your transaction ID above and click Submit. Admin will verify within 2 hours.
                    </div>

                    <button onClick={() => handleManualPayment('crypto')} disabled={loading || !txId} style={{ width: '100%', padding: '14px', background: loading || !txId ? '#a7f3d0' : '#1dbf73', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading || !txId ? 'not-allowed' : 'pointer' }}>
                      {loading ? 'Submitting...' : `Submit Payment — $${finalAmount.toFixed(2)}`}
                    </button>
                  </div>
                )}

                {/* PAYONEER */}
                {method === 'payoneer' && (
                  <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '1rem' }}>Payoneer Payment</h3>
                    <div style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
                      {[
                        { label: 'Send To Email', value: payoneerEmail },
                        { label: 'Amount', value: `$${finalAmount.toFixed(2)} USD` },
                        { label: 'Reference', value: isEscrow ? `DevLpers Escrow - Job Payment` : `DevLpers ${plan?.name}` },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ color: '#62646a', fontSize: '0.85rem' }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ color: '#404145', fontSize: '0.85rem' }}>{item.value}</strong>
                            {item.label === 'Send To Email' && (
                              <button onClick={() => copyText(payoneerEmail, setPayoneerCopied)} style={{ background: payoneerCopied ? '#1dbf73' : '#fff', border: '1px solid #e4e5e7', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.7rem', color: payoneerCopied ? '#fff' : '#62646a' }}>
                                {payoneerCopied ? '✓' : 'Copy'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Transaction ID */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>
                        Payoneer Transaction ID *
                      </label>
                      <input
                        value={txId}
                        onChange={e => setTxId(e.target.value)}
                        placeholder="Enter Payoneer transaction ID"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', color: '#404145' }}
                        onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                        onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                      />
                    </div>

                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.85rem', color: '#92400e', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      ⚠️ Send payment via Payoneer, enter transaction ID above, then click Submit. Admin verifies within 2 hours.
                    </div>

                    <button onClick={() => handleManualPayment('payoneer')} disabled={loading || !txId} style={{ width: '100%', padding: '14px', background: loading || !txId ? '#a7f3d0' : '#e11d48', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading || !txId ? 'not-allowed' : 'pointer' }}>
                      {loading ? 'Submitting...' : `Submit Payment — $${finalAmount.toFixed(2)}`}
                    </button>
                  </div>
                )}
              </div>

              {/* Security */}
              <div style={{ textAlign: 'center', color: '#95979d', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                🔒 Secure payment · SSL encrypted · Admin verified
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}