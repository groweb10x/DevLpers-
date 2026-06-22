'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function FreelancerRateCalculator() {
  const [annualIncome, setAnnualIncome] = useState('50000');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [vacationWeeks, setVacationWeeks] = useState('4');
  const [taxRate, setTaxRate] = useState('25');
  const [profitMargin, setProfitMargin] = useState('20');
  const [currency, setCurrency] = useState('$');

  const calculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const hpd = parseFloat(hoursPerDay) || 8;
    const dpw = parseFloat(daysPerWeek) || 5;
    const vw = parseFloat(vacationWeeks) || 0;
    const tax = parseFloat(taxRate) || 0;
    const profit = parseFloat(profitMargin) || 0;

    const workingWeeks = 52 - vw;
    const totalHours = hpd * dpw * workingWeeks;
    const baseRate = totalHours > 0 ? income / totalHours : 0;
    const afterTax = baseRate * (1 + tax / 100);
    const afterProfit = afterTax * (1 + profit / 100);

    return {
      hourly: afterProfit,
      daily: afterProfit * hpd,
      weekly: afterProfit * hpd * dpw,
      monthly: (afterProfit * totalHours) / 12,
      totalHours,
    };
  };

  const result = calculate();

  const fmt = (n: number) => currency + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const faqs = [
    { q: 'How do I set my freelance rate as a beginner?', a: 'Start with your desired annual income, divide by billable hours, then add 25-30% for taxes and 15-20% profit margin. Our calculator does this automatically.' },
    { q: 'Should I charge hourly or per project?', a: 'Hourly is safer when scope is unclear. Per-project works better when you are experienced and can estimate time accurately.' },
    { q: 'How many billable hours should I count per year?', a: 'Realistically, only 60-70% of your working time is billable. The rest goes to admin, marketing and learning. Factor this into your rate.' },
    { q: 'Why add a profit margin?', a: 'The profit margin covers business expenses, equipment, software, insurance, slow periods, and business growth. Always include it.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)', borderBottom: '1px solid #e4e5e7', padding: '3rem 5%' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '1rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <div style={{ display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              💰 Free Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.5rem' }}>
              Freelancer Rate Calculator — Know Your Worth
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Calculate your ideal freelance hourly rate based on your income goals, working hours, taxes and profit margin. Built for developers, designers and freelancers.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '900px', margin: '0 auto' }}>

          {/* TOOL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* INPUTS */}
            <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1.5rem' }}>Your Details</h2>

              {/* Currency */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>Currency</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['$', '£', '€', '₹', 'PKR'].map(c => (
                    <button key={c} onClick={() => setCurrency(c)} style={{
                      padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                      background: currency === c ? '#1dbf73' : '#fff',
                      border: `1px solid ${currency === c ? '#1dbf73' : '#e4e5e7'}`,
                      color: currency === c ? '#fff' : '#62646a',
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Desired Annual Income', value: annualIncome, set: setAnnualIncome, prefix: currency },
                { label: 'Hours Per Day', value: hoursPerDay, set: setHoursPerDay },
                { label: 'Days Per Week', value: daysPerWeek, set: setDaysPerWeek },
                { label: 'Vacation Weeks Per Year', value: vacationWeeks, set: setVacationWeeks },
                { label: 'Tax Rate (%)', value: taxRate, set: setTaxRate, suffix: '%' },
                { label: 'Profit Margin (%)', value: profitMargin, set: setProfitMargin, suffix: '%' },
              ].map(field => (
                <div key={field.label} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>{field.label}</label>
                  <div style={{ position: 'relative' }}>
                    {field.prefix && <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#95979d' }}>{field.prefix}</span>}
                    <input
                      type="number"
                      value={field.value}
                      onChange={e => field.set(e.target.value)}
                      style={{
                        width: '100%', padding: `10px ${field.suffix ? '30px' : '14px'} 10px ${field.prefix ? '30px' : '14px'}`,
                        border: '1px solid #e4e5e7', borderRadius: '6px',
                        fontSize: '0.9rem', outline: 'none', color: '#404145',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
                      onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
                    />
                    {field.suffix && <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#95979d' }}>{field.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* RESULTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#1dbf73', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.85 }}>Your Ideal Hourly Rate</div>
                <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '3rem' }}>{fmt(result.hourly)}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>per hour</div>
              </div>

              {[
                { label: 'Daily Rate', value: fmt(result.daily), icon: '📅' },
                { label: 'Weekly Rate', value: fmt(result.weekly), icon: '📆' },
                { label: 'Monthly Income', value: fmt(result.monthly), icon: '💳' },
                { label: 'Billable Hours/Year', value: result.totalHours.toLocaleString(), icon: '⏱️' },
              ].map(item => (
                <div key={item.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span style={{ color: '#62646a', fontSize: '0.88rem' }}>{item.label}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#404145', fontSize: '1rem' }}>{item.value}</span>
                </div>
              ))}

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.25rem' }}>
                <p style={{ color: '#1dbf73', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
                  💡 Tip: Charge at least 20% more than this rate when starting with a new client to leave room for negotiation.
                </p>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>How to Set Your Freelance Rate</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '🎯', title: 'Set Income Goal', desc: 'Start with how much you want to earn per year' },
                { icon: '⏰', title: 'Count Hours', desc: 'Enter your working hours and vacation time' },
                { icon: '💸', title: 'Add Tax + Profit', desc: 'Include tax rate and business profit margin' },
                { icon: '💰', title: 'Get Your Rate', desc: 'See your ideal hourly, daily and monthly rate' },
              ].map(s => (
                <div key={s.title} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#404145', marginBottom: '0.3rem' }}>{s.title}</div>
                  <div style={{ color: '#95979d', fontSize: '0.78rem' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO CONTENT */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>Freelancer Rate Calculator for Developers</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              One of the hardest parts of freelancing is knowing what to charge. Charge too little and you burn out. Charge too much and you lose clients.
              This freelancer rate calculator helps you find the right number based on your actual income goals, not guesswork.
              It is built specifically for developers, designers, and digital freelancers on platforms like DevLpers.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Ready to start freelancing?{' '}
              <Link href="/signup" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Create a free developer profile on DevLpers</Link>
              {' '}and start getting hired by clients worldwide.
            </p>
          </div>

          {/* RELATED */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Invoice Generator', slug: 'invoice-generator', icon: '🧾' },
                { name: 'Urdu Word Counter', slug: 'urdu-word-counter', icon: '📝' },
                { name: 'Code Line Counter', slug: 'code-line-counter', icon: '💻' },
              ].map(t => (
                <a key={t.slug} href={`/${t.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#62646a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {t.icon} {t.name}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CREDIT */}
          <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px' }}>
            <p style={{ color: '#62646a', fontSize: '0.85rem' }}>
              Built by <strong style={{ color: '#404145' }}>Dev Zeeshan</strong> on{' '}
              <Link href="/" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>DevLpers</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}