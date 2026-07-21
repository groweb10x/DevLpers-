'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

const plans = {
  weekly: { name: 'Weekly Pro', price: 9.99, bids: 999, duration: '7 days' },
  monthly: { name: 'Monthly Elite', price: 29.99, bids: 999, duration: '30 days' },
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const planId = (searchParams.get('plan') || 'weekly') as keyof typeof plans;
  const plan = plans[planId] || plans.weekly;

  const [method, setMethod] = useState<'stripe' | 'crypto' | 'payoneer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'pay' | 'success'>('select');

  const [cardDetails, setCardDetails] = useState({
    name: '', number: '', expiry: '', cvc: '',
  });

  const [cryptoAddress] = useState('TRX9xKqP8mNvLzWj3YcD5eAhBsRkFqM2p');
  const [cryptoCopied, setCryptoCopied] = useState(false);

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.price, plan: planId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Simulate payment success (real: use Stripe.js confirmPayment)
      await activateSubscription();
    } catch (error: any) {
      alert('Payment failed: ' + error.message);
    }
    setLoading(false);
  };

  const activateSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = '/login'; return; }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + (planId === 'weekly' ? 7 : 30));

    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: planId,
      bids_remaining: plan.bids,
      bids_total: plan.bids,
      expires_at: expiry.toISOString(),
    });

    setStep('success');
  };

  const copyCrypto = () => {
    navigator.clipboard.writeText(cryptoAddress);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 5%' }}>

          {/* SUCCESS */}
          {step === 'success' && (
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.75rem', color: '#1dbf73', marginBottom: '0.75rem' }}>
                Payment Successful!
              </h1>
              <p style={{ color: '#62646a', marginBottom: '2rem', lineHeight: 1.7 }}>
                Your <strong>{plan.name}</strong> plan is now active. Enjoy unlimited bids for {plan.duration}!
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/dashboard">
                  <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                    Go to Dashboard →
                  </button>
                </Link>
                <Link href="/jobs">
                  <button style={{ background: '#fff', color: '#62646a', border: '1px solid #e4e5e7', padding: '12px 28px', borderRadius: '6px', cursor: 'pointer' }}>
                    Browse Jobs
                  </button>
                </Link>
              </div>
            </div>
          )}

          {step !== 'success' && (
            <>
              {/* HEADER */}
              <div style={{ marginBottom: '2rem' }}>
                <Link href="/pricing" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Pricing</Link>
                <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.75rem', color: '#404145', margin: '1rem 0 0.5rem' }}>
                  Complete Your Purchase
                </h1>
                <p style={{ color: '#62646a', fontSize: '0.9rem' }}>You are upgrading to <strong>{plan.name}</strong></p>
              </div>

              {/* ORDER SUMMARY */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#404145' }}>{plan.name}</div>
                    <div style={{ color: '#62646a', fontSize: '0.85rem' }}>Unlimited bids · {plan.duration}</div>
                  </div>
                  <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.5rem', color: '#1dbf73' }}>
                    ${plan.price}
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.25rem' }}>
                  Select Payment Method
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

                  {/* Stripe */}
                  <div onClick={() => setMethod('stripe')} style={{
                    border: `2px solid ${method === 'stripe' ? '#1dbf73' : '#e4e5e7'}`,
                    borderRadius: '8px', padding: '1rem 1.25rem',
                    cursor: 'pointer', background: method === 'stripe' ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>💳</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#404145' }}>Credit / Debit Card</div>
                      <div style={{ color: '#95979d', fontSize: '0.78rem' }}>Visa, Mastercard, Amex — powered by Stripe</div>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${method === 'stripe' ? '#1dbf73' : '#e4e5e7'}`,
                      background: method === 'stripe' ? '#1dbf73' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: '#fff',
                    }}>{method === 'stripe' ? '✓' : ''}</div>
                  </div>

                  {/* Crypto */}
                  <div onClick={() => setMethod('crypto')} style={{
                    border: `2px solid ${method === 'crypto' ? '#1dbf73' : '#e4e5e7'}`,
                    borderRadius: '8px', padding: '1rem 1.25rem',
                    cursor: 'pointer', background: method === 'crypto' ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>🪙</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#404145' }}>Crypto (USDT / BTC / ETH)</div>
                      <div style={{ color: '#95979d', fontSize: '0.78rem' }}>Pay with cryptocurrency — manual confirmation</div>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${method === 'crypto' ? '#1dbf73' : '#e4e5e7'}`,
                      background: method === 'crypto' ? '#1dbf73' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: '#fff',
                    }}>{method === 'crypto' ? '✓' : ''}</div>
                  </div>

                  {/* Payoneer */}
                  <div onClick={() => setMethod('payoneer')} style={{
                    border: `2px solid ${method === 'payoneer' ? '#1dbf73' : '#e4e5e7'}`,
                    borderRadius: '8px', padding: '1rem 1.25rem',
                    cursor: 'pointer', background: method === 'payoneer' ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>💼</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#404145' }}>Payoneer</div>
                      <div style={{ color: '#95979d', fontSize: '0.78rem' }}>Pay via Payoneer — manual confirmation</div>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${method === 'payoneer' ? '#1dbf73' : '#e4e5e7'}`,
                      background: method === 'payoneer' ? '#1dbf73' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: '#fff',
                    }}>{method === 'payoneer' ? '✓' : ''}</div>
                  </div>
                </div>

                {/* STRIPE FORM */}
                {method === 'stripe' && (
                  <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145', marginBottom: '1rem' }}>Card Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>Cardholder Name</label>
                        <input value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="Ali Hassan"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>Card Number</label>
                        <input value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="1234 5678 9012 3456" maxLength={19}
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.1em' }}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>Expiry Date</label>
                          <input value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/YY" maxLength={5}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                            onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.3rem' }}>CVC</label>
                          <input value={cardDetails.cvc} onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                            placeholder="123" maxLength={4} type="password"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e5e7', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                            onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem', color: '#95979d', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      🔒 Secured by Stripe — your card details are never stored
                    </div>
                    <button onClick={handleStripePayment} disabled={loading} style={{
                      width: '100%', marginTop: '1.25rem', padding: '14px',
                      background: loading ? '#a7f3d0' : '#1dbf73',
                      border: 'none', borderRadius: '6px', color: '#fff',
                      fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                    }}>{loading ? 'Processing...' : `Pay $${plan.price}`}</button>
                  </div>
                )}

                {/* CRYPTO */}
                {method === 'crypto' && (
                  <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145', marginBottom: '1rem' }}>Crypto Payment Instructions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { coin: '₿ Bitcoin (BTC)', network: 'Bitcoin Network' },
                        { coin: '💲 USDT', network: 'TRC20 / ERC20' },
                        { coin: '◆ Ethereum (ETH)', network: 'Ethereum Network' },
                      ].map(c => (
                        <div key={c.coin} style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.85rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#404145', marginBottom: '0.3rem' }}>{c.coin}</div>
                          <div style={{ color: '#95979d', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{c.network}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <code style={{ fontSize: '0.75rem', color: '#62646a', flex: 1, wordBreak: 'break-all' }}>{cryptoAddress}</code>
                            <button onClick={copyCrypto} style={{ background: cryptoCopied ? '#1dbf73' : '#fff', border: '1px solid #e4e5e7', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', color: cryptoCopied ? '#fff' : '#62646a', whiteSpace: 'nowrap' }}>
                              {cryptoCopied ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.85rem', color: '#92400e', fontSize: '0.82rem', lineHeight: 1.6 }}>
                      ⚠️ After sending payment, email us at <strong>payments@develpers.com</strong> with your transaction ID and account email. We will activate your plan within 2 hours.
                    </div>
                    <button onClick={activateSubscription} disabled={loading} style={{
                      width: '100%', marginTop: '1.25rem', padding: '14px',
                      background: '#f59e0b', border: 'none', borderRadius: '6px',
                      color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    }}>I Have Sent the Payment →</button>
                  </div>
                )}

                {/* PAYONEER */}
                {method === 'payoneer' && (
                  <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#404145', marginBottom: '1rem' }}>Payoneer Payment Instructions</h3>
                    <div style={{ background: '#fafafa', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {[
                          { label: 'Send To Email', value: 'payments@develpers.com' },
                          { label: 'Amount', value: `$${plan.price} USD` },
                          { label: 'Reference', value: `DevLpers ${plan.name}` },
                        ].map(item => (
                          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#62646a', fontSize: '0.85rem' }}>{item.label}</span>
                            <strong style={{ color: '#404145', fontSize: '0.85rem' }}>{item.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.85rem', color: '#92400e', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      ⚠️ After sending payment via Payoneer, email us at <strong>payments@develpers.com</strong> with your Payoneer transaction ID. We will activate your plan within 2 hours.
                    </div>
                    <button onClick={activateSubscription} disabled={loading} style={{
                      width: '100%', padding: '14px',
                      background: '#e11d48', border: 'none', borderRadius: '6px',
                      color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    }}>I Have Sent the Payment →</button>
                  </div>
                )}
              </div>

              {/* SECURITY */}
              <div style={{ textAlign: 'center', color: '#95979d', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                🔒 Secure payment · SSL encrypted · Your data is safe
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fafafa' }} />}>
      <PaymentContent />
    </Suspense>
  );
}