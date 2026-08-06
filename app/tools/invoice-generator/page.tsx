'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

type LineItem = { description: string; quantity: number; rate: number };

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: '', email: '', address: '' });
  const [to, setTo] = useState({ name: '', email: '', address: '' });
  const [invoiceNo, setInvoiceNo] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('$');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { description: 'Web Development', quantity: 1, rate: 500 },
  ]);

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: field === 'description' ? value : parseFloat(value) || 0 } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * (parseFloat(taxRate) / 100);
  const total = subtotal + tax;
  const fmt = (n: number) => currency + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const printInvoice = () => {
    window.print();
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid #e4e5e7', borderRadius: '6px',
    fontSize: '0.88rem', outline: 'none', color: '#404145',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block', color: '#62646a', fontSize: '0.78rem',
    fontWeight: 500, marginBottom: '0.3rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-area { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <div className="no-print" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%)', borderBottom: '1px solid #e4e5e7', padding: '3rem 5%' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <nav style={{ marginBottom: '1rem' }}>
              <Link href="/tools" style={{ color: '#1dbf73', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Tools</Link>
            </nav>
            <div style={{ display: 'inline-block', background: '#e8fdf2', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '4px 16px', fontSize: '0.82rem', color: '#1dbf73', fontWeight: 600, marginBottom: '1rem' }}>
              🧾 Free Tool
            </div>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#404145', marginBottom: '0.5rem' }}>
              Free Invoice Generator for Freelancers
            </h1>
            <p style={{ color: '#62646a', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Create professional invoices instantly. Fill in your details, add line items, and print or save as PDF — completely free, no signup required.
            </p>
          </div>
        </div>

        <div style={{ padding: '2.5rem 5%', maxWidth: '900px', margin: '0 auto' }}>

          {/* CURRENCY + SETTINGS */}
          <div className="no-print" style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.25rem 1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Currency</label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['$', '£', '€', '₹', 'PKR'].map(c => (
                  <button key={c} onClick={() => setCurrency(c)} style={{
                    padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                    background: currency === c ? '#1dbf73' : '#fff',
                    border: `1px solid ${currency === c ? '#1dbf73' : '#e4e5e7'}`,
                    color: currency === c ? '#fff' : '#62646a',
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={labelStyle}>Tax Rate (%)</label>
              <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} style={{ ...inputStyle, width: '120px' }} />
            </div>
            <button onClick={printInvoice} style={{
              background: '#1dbf73', color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: '6px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            }}>🖨️ Print / Save PDF</button>
          </div>

          {/* INVOICE */}
          <div className="print-area" style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2.5rem', marginBottom: '2rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '1.5rem', color: '#1dbf73', marginBottom: '0.25rem' }}>INVOICE</h2>
                <div style={{ color: '#95979d', fontSize: '0.85rem' }}>DevLpers Platform</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ ...labelStyle, textAlign: 'right' }}>Invoice No.</label>
                  <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="no-print" style={{ ...inputStyle, width: '140px', textAlign: 'right' }} />
                  <span className="print-only" style={{ display: 'none', fontWeight: 600 }}>{invoiceNo}</span>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ ...labelStyle, textAlign: 'right' }}>Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="no-print" style={{ ...inputStyle, width: '140px' }} />
                </div>
                <div>
                  <label style={{ ...labelStyle, textAlign: 'right' }}>Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="no-print" style={{ ...inputStyle, width: '140px' }} />
                </div>
              </div>
            </div>

            {/* From / To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#95979d', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</div>
                <input value={from.name} onChange={e => setFrom({ ...from, name: e.target.value })} placeholder="Your Name / Company" style={{ ...inputStyle, marginBottom: '0.5rem', fontWeight: 600 }} />
                <input value={from.email} onChange={e => setFrom({ ...from, email: e.target.value })} placeholder="Email Address" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                <textarea value={from.address} onChange={e => setFrom({ ...from, address: e.target.value })} placeholder="Address" rows={2} style={{ ...inputStyle, resize: 'none', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#95979d', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bill To</div>
                <input value={to.name} onChange={e => setTo({ ...to, name: e.target.value })} placeholder="Client Name / Company" style={{ ...inputStyle, marginBottom: '0.5rem', fontWeight: 600 }} />
                <input value={to.email} onChange={e => setTo({ ...to, email: e.target.value })} placeholder="Client Email" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                <textarea value={to.address} onChange={e => setTo({ ...to, address: e.target.value })} placeholder="Client Address" rows={2} style={{ ...inputStyle, resize: 'none', fontFamily: 'Inter, sans-serif' }} />
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {['Description', 'Qty', 'Rate', 'Amount'].map(h => (
                  <div key={h} style={{ fontWeight: 700, fontSize: '0.78rem', color: '#95979d', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 4px' }}>{h}</div>
                ))}
              </div>

              {items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 100px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Service description" style={inputStyle} />
                  <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                  <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} style={{ ...inputStyle, textAlign: 'right' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: '#404145', fontSize: '0.9rem', flex: 1, textAlign: 'right' }}>{fmt(item.quantity * item.rate)}</span>
                    <button onClick={() => removeItem(i)} className="no-print" style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}>✕</button>
                  </div>
                </div>
              ))}

              <button onClick={addItem} className="no-print" style={{ marginTop: '0.5rem', background: '#f0fdf4', border: '1px dashed #bbf7d0', borderRadius: '6px', color: '#1dbf73', padding: '8px 20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                + Add Line Item
              </button>
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid #e4e5e7', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '280px', marginLeft: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#62646a', fontSize: '0.88rem' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{fmt(subtotal)}</span>
                </div>
                {parseFloat(taxRate) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#62646a', fontSize: '0.88rem' }}>Tax ({taxRate}%)</span>
                    <span style={{ fontWeight: 600 }}>{fmt(tax)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #404145', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1dbf73' }}>{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginTop: '2rem' }}>
              <label style={labelStyle}>Notes / Payment Terms</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Thank you for your business! Payment due within 30 days." rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#404145', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { q: 'How do I save my invoice as PDF?', a: 'Click "Print / Save PDF" and select "Save as PDF" in the print dialog. This works in all modern browsers on Windows, Mac and mobile.' },
                { q: 'Is this invoice generator free?', a: 'Yes, completely free. No signup, no watermarks, no limits on how many invoices you create.' },
                { q: 'Can I add my company logo?', a: 'Logo upload is coming soon. For now you can add your company name and full details in the "From" section.' },
                { q: 'Does this tool store my invoice data?', a: 'No. Everything runs in your browser. Your invoice data is never sent to or stored on any server.' },
              ].map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#404145', marginBottom: '0.5rem' }}>{faq.q}</div>
                  <div style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO CONTENT */}
          <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#404145', marginBottom: '1rem' }}>Free Invoice Generator for Freelancers and Developers</h2>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              Creating professional invoices should not require expensive software or a subscription. This free invoice generator lets freelancers,
              developers, designers and consultants create clean, professional invoices in seconds. Add your details, list your services, set your rates,
              and save as PDF — all without creating an account.
            </p>
            <p style={{ color: '#62646a', fontSize: '0.88rem', lineHeight: 1.8 }}>
              Looking for more freelance clients?{' '}
              <Link href="/signup" style={{ color: '#1dbf73', textDecoration: 'none', fontWeight: 600 }}>Join DevLpers free</Link>
              {' '}and connect with clients worldwide.
            </p>
          </div>

          {/* RELATED */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#404145', marginBottom: '1rem' }}>More Free Tools</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { name: 'Freelancer Rate Calculator', slug: 'freelancer-rate-calculator', icon: '💰' },
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