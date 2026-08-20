'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '../components/Navbar';

type Contract = {
  id: string;
  job_id: string;
  proposal_id: string;
  client_id: string;
  developer_id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: string;
  client_approved: boolean;
  developer_approved: boolean;
  created_at: string;
  completed_at: string | null;
  job?: any;
  client_profile?: any;
  developer_profile?: any;
};

export default function Contracts() {
  const [user, setUser] = useState<any>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [actionLoading, setActionLoading] = useState('');
  const [role, setRole] = useState<'developer' | 'client'>('developer');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUser(user);

      const userRole = user.user_metadata?.role || 'developer';
      setRole(userRole);

      await fetchContracts(user.id, userRole);
      setLoading(false);
    };
    init();
  }, []);

  const fetchContracts = async (userId: string, userRole: string) => {
    const query = supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (userRole === 'client') {
      query.eq('client_id', userId);
    } else {
      query.eq('developer_id', userId);
    }

    const { data: contractsData } = await query;
    if (!contractsData) return;

    // Fetch related data
    const enriched = await Promise.all(contractsData.map(async (contract) => {
      const { data: job } = await supabase
        .from('jobs').select('title, category').eq('id', contract.job_id).maybeSingle();

      const { data: clientProfile } = await supabase
        .from('developer_profiles').select('full_name, avatar_url').eq('user_id', contract.client_id).maybeSingle();

      const { data: devProfile } = await supabase
        .from('developer_profiles').select('full_name, avatar_url').eq('user_id', contract.developer_id).maybeSingle();

      return {
        ...contract,
        job,
        client_profile: clientProfile,
        developer_profile: devProfile,
      };
    }));

    setContracts(enriched);
  };

  const markComplete = async (contractId: string) => {
    setActionLoading(contractId + 'complete');
    await supabase.from('contracts')
      .update({ status: 'completed', developer_approved: true })
      .eq('id', contractId);

    await supabase.from('notifications').insert({
      user_id: contracts.find(c => c.id === contractId)?.client_id,
      title: '✅ Work Completed!',
      message: 'Developer has marked work as complete. Please review and approve payment release.',
      type: 'success',
      link: '/contracts',
    });

    await fetchContracts(user.id, role);
    setActionLoading('');
    alert('✅ Marked as complete! Client will review and release payment.');
  };

  const approveAndRelease = async (contract: Contract) => {
    setActionLoading(contract.id + 'approve');

    await supabase.from('contracts').update({
      status: 'approved',
      client_approved: true,
      completed_at: new Date().toISOString(),
    }).eq('id', contract.id);

    // Find escrow and release
    const { data: escrow } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('job_id', contract.job_id)
      .eq('status', 'in_escrow')
      .maybeSingle();

    if (escrow) {
      const platformFee = escrow.amount * 0.1;
      const devAmount = escrow.amount - platformFee;

      await supabase.from('escrow_payments').update({
        status: 'released',
        platform_fee: platformFee,
        developer_amount: devAmount,
        released_at: new Date().toISOString(),
      }).eq('id', escrow.id);

      // Notify developer
      await supabase.from('notifications').insert({
        user_id: contract.developer_id,
        title: '💰 Payment Released!',
        message: `$${devAmount} has been released to your account!`,
        type: 'payment',
        link: '/dashboard',
      });
    } else {
      // No escrow — notify admin
      await supabase.from('notifications').insert({
        user_id: contract.developer_id,
        title: '✅ Work Approved!',
        message: 'Client has approved your work. Admin will process payment shortly.',
        type: 'success',
        link: '/dashboard',
      });
    }

    await fetchContracts(user.id, role);
    setActionLoading('');
    alert('✅ Work approved! Payment released to developer.');
  };

  const raiseDispute = async (contractId: string, reason: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    await supabase.from('disputes').insert({
      job_id: contract.job_id,
      raised_by: user.id,
      against: role === 'client' ? contract.developer_id : contract.client_id,
      reason,
      status: 'open',
    });

    await supabase.from('contracts').update({ status: 'disputed' }).eq('id', contractId);

    // Notify admin
    const { data: admins } = await supabase.from('admin_users').select('user_id');
    if (admins) {
      for (const admin of admins) {
        await supabase.from('notifications').insert({
          user_id: admin.user_id,
          title: '⚠️ Dispute Raised!',
          message: `A dispute has been raised on contract: ${contract.title}`,
          type: 'warning',
          link: '/admin-panel',
        });
      }
    }

    await fetchContracts(user.id, role);
    alert('⚠️ Dispute raised! Admin will review within 24 hours.');
  };

  const filteredContracts = contracts.filter(c => {
    if (activeTab === 'active') return ['active', 'completed'].includes(c.status);
    if (activeTab === 'approved') return c.status === 'approved';
    if (activeTab === 'disputed') return c.status === 'disputed';
    if (activeTab === 'cancelled') return c.status === 'cancelled';
    return true;
  });

  const statusConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
    active: { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe', label: 'Active' },
    completed: { bg: '#fffbeb', color: '#f59e0b', border: '#fde68a', label: 'Pending Approval' },
    approved: { bg: '#f0fdf4', color: '#1dbf73', border: '#bbf7d0', label: 'Completed' },
    disputed: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Disputed' },
    cancelled: { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb', label: 'Cancelled' },
  };

  const getDaysLeft = (deadline: string) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#95979d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading contracts...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '2.5rem 5%' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: '#fff', marginBottom: '0.5rem' }}>
              📋 My Contracts
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              {contracts.length} total contracts · Manage your active projects
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 5%' }}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Active', value: contracts.filter(c => c.status === 'active').length, icon: '🔵', color: '#3b82f6' },
              { label: 'Pending Approval', value: contracts.filter(c => c.status === 'completed').length, icon: '⏳', color: '#f59e0b' },
              { label: 'Completed', value: contracts.filter(c => c.status === 'approved').length, icon: '✅', color: '#1dbf73' },
              { label: 'Disputed', value: contracts.filter(c => c.status === 'disputed').length, icon: '⚠️', color: '#dc2626' },
              { label: 'Total Value', value: '$' + contracts.reduce((s, c) => s + (c.amount || 0), 0).toLocaleString(), icon: '💰', color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: s.color }}>{s.value}</div>
                <div style={{ color: '#95979d', fontSize: '0.72rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '0', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {[
              { id: 'active', label: `🔵 Active (${contracts.filter(c => ['active', 'completed'].includes(c.status)).length})` },
              { id: 'approved', label: `✅ Done (${contracts.filter(c => c.status === 'approved').length})` },
              { id: 'disputed', label: `⚠️ Disputed (${contracts.filter(c => c.status === 'disputed').length})` },
              { id: 'all', label: `📋 All (${contracts.length})` },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 1, padding: '11px 8px',
                background: activeTab === tab.id ? '#1a1a2e' : '#fff',
                border: 'none', color: activeTab === tab.id ? '#fff' : '#62646a',
                fontWeight: activeTab === tab.id ? 700 : 400,
                fontSize: '0.8rem', cursor: 'pointer',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* CONTRACTS LIST */}
          {filteredContracts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', border: '1px solid #e4e5e7' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ fontWeight: 700, color: '#404145', marginBottom: '0.75rem' }}>No contracts yet</h3>
              <p style={{ color: '#62646a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {role === 'developer' ? 'Apply to jobs to get contracts!' : 'Post jobs and hire developers to create contracts!'}
              </p>
              <Link href={role === 'developer' ? '/jobs' : '/post-job'}>
                <button style={{ background: '#1dbf73', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  {role === 'developer' ? 'Browse Jobs →' : 'Post a Job →'}
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredContracts.map(contract => {
                const statusCfg = statusConfig[contract.status] || statusConfig.active;
                const daysLeft = contract.deadline ? getDaysLeft(contract.deadline) : null;
                const isClient = user?.id === contract.client_id;
                const isDeveloper = user?.id === contract.developer_id;
                const otherParty = isClient ? contract.developer_profile : contract.client_profile;

                return (
                  <div key={contract.id} style={{
                    background: '#fff', border: `1px solid ${contract.status === 'disputed' ? '#fecaca' : '#e4e5e7'}`,
                    borderRadius: '12px', padding: '1.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    {/* Contract Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', margin: 0 }}>
                            {contract.title || contract.job?.title || 'Contract'}
                          </h3>
                          <span style={{
                            background: statusCfg.bg, color: statusCfg.color,
                            border: `1px solid ${statusCfg.border}`,
                            borderRadius: '100px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600,
                          }}>{statusCfg.label}</span>
                        </div>
                        <div style={{ color: '#62646a', fontSize: '0.82rem' }}>
                          {contract.job?.category && `📁 ${contract.job.category} · `}
                          {isClient ? '👨‍💻 Developer: ' : '🏢 Client: '}
                          <strong>{otherParty?.full_name || 'Unknown'}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1dbf73' }}>${contract.amount?.toLocaleString()}</div>
                        {daysLeft !== null && contract.status === 'active' && (
                          <div style={{ fontSize: '0.75rem', color: daysLeft < 3 ? '#dc2626' : daysLeft < 7 ? '#f59e0b' : '#95979d' }}>
                            {daysLeft > 0 ? `⏰ ${daysLeft} days left` : '⚠️ Overdue!'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {contract.description && (
                      <p style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', padding: '0.75rem', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                        {contract.description}
                      </p>
                    )}

                    {/* Details Row */}
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#62646a' }}>
                      {contract.deadline && (
                        <span>📅 Deadline: <strong>{new Date(contract.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                      )}
                      <span>📅 Started: <strong>{new Date(contract.created_at).toLocaleDateString()}</strong></span>
                      {contract.completed_at && (
                        <span>✅ Completed: <strong>{new Date(contract.completed_at).toLocaleDateString()}</strong></span>
                      )}
                    </div>

                    {/* Progress Indicator */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#62646a', fontWeight: 500 }}>Contract Progress</span>
                        <span style={{ fontSize: '0.75rem', color: '#1dbf73', fontWeight: 600 }}>
                          {contract.status === 'approved' ? '100%' : contract.status === 'completed' ? '90%' : contract.status === 'active' ? '50%' : '0%'}
                        </span>
                      </div>
                      <div style={{ background: '#f0f0f0', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                        <div style={{
                          width: contract.status === 'approved' ? '100%' : contract.status === 'completed' ? '90%' : contract.status === 'active' ? '50%' : '0%',
                          height: '100%',
                          background: contract.status === 'disputed' ? '#dc2626' : '#1dbf73',
                          borderRadius: '100px', transition: 'width 0.3s',
                        }} />
                      </div>
                    </div>

                    {/* Approval Status */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: contract.developer_approved ? '#f0fdf4' : '#fafafa',
                        border: `1px solid ${contract.developer_approved ? '#bbf7d0' : '#e4e5e7'}`,
                        color: contract.developer_approved ? '#1dbf73' : '#95979d',
                        borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                      }}>
                        {contract.developer_approved ? '✓' : '○'} Developer Signed Off
                      </span>
                      <span style={{
                        background: contract.client_approved ? '#f0fdf4' : '#fafafa',
                        border: `1px solid ${contract.client_approved ? '#bbf7d0' : '#e4e5e7'}`,
                        color: contract.client_approved ? '#1dbf73' : '#95979d',
                        borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                      }}>
                        {contract.client_approved ? '✓' : '○'} Client Approved
                      </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>

                      {/* Developer Actions */}
                      {isDeveloper && contract.status === 'active' && (
                        <button onClick={() => markComplete(contract.id)} disabled={actionLoading === contract.id + 'complete'} style={{
                          background: '#1dbf73', border: 'none', color: '#fff',
                          padding: '9px 18px', borderRadius: '6px', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: 600,
                        }}>
                          {actionLoading === contract.id + 'complete' ? '⏳...' : '✅ Mark as Complete'}
                        </button>
                      )}

                      {/* Client Actions */}
                      {isClient && contract.status === 'completed' && (
                        <>
                          <button onClick={() => approveAndRelease(contract)} disabled={actionLoading === contract.id + 'approve'} style={{
                            background: '#1dbf73', border: 'none', color: '#fff',
                            padding: '9px 18px', borderRadius: '6px', cursor: 'pointer',
                            fontSize: '0.85rem', fontWeight: 700,
                          }}>
                            {actionLoading === contract.id + 'approve' ? '⏳...' : '💰 Approve & Release Payment'}
                          </button>
                          <button onClick={() => {
                            const reason = prompt('What is the issue with the delivered work?');
                            if (reason) raiseDispute(contract.id, reason);
                          }} style={{
                            background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                            padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                          }}>
                            ⚠️ Raise Dispute
                          </button>
                        </>
                      )}

                      {/* Message Button */}
                      {contract.status !== 'cancelled' && (
                        <Link href={`/messages?with=${isClient ? contract.developer_id : contract.client_id}`} style={{ textDecoration: 'none' }}>
                          <button style={{
                            background: '#eff6ff', border: '1px solid #bfdbfe', color: '#3b82f6',
                            padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                          }}>
                            💬 Message
                          </button>
                        </Link>
                      )}

                      {/* Dispute — for active contracts */}
                      {contract.status === 'active' && (
                        <button onClick={() => {
                          const reason = prompt('Describe the issue:');
                          if (reason) raiseDispute(contract.id, reason);
                        }} style={{
                          background: '#fff', border: '1px solid #e4e5e7', color: '#95979d',
                          padding: '9px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem',
                        }}>
                          ⚠️ Dispute
                        </button>
                      )}
                    </div>

                    {/* Dispute Notice */}
                    {contract.status === 'disputed' && (
                      <div style={{ marginTop: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem', color: '#dc2626', fontSize: '0.82rem', lineHeight: 1.6 }}>
                        ⚠️ <strong>Dispute in Progress</strong> — Admin is reviewing this contract. You will be notified of the decision within 24-48 hours. Contact us at <strong>support@develpers.com</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* How Contracts Work */}
          <div style={{ marginTop: '2rem', background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e', marginBottom: '1rem' }}>How Contracts Work</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {[
                { step: '1', icon: '✅', title: 'Proposal Accepted', desc: 'Client accepts your proposal' },
                { step: '2', icon: '💳', title: 'Payment in Escrow', desc: 'Client deposits payment safely' },
                { step: '3', icon: '💻', title: 'Work Begins', desc: 'Developer starts the project' },
                { step: '4', icon: '📤', title: 'Submit Work', desc: 'Developer marks as complete' },
                { step: '5', icon: '👀', title: 'Client Reviews', desc: 'Client reviews the work' },
                { step: '6', icon: '💰', title: 'Payment Released', desc: 'Payment sent to developer' },
              ].map(s => (
                <div key={s.step} style={{ textAlign: 'center', padding: '0.75rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #e4e5e7' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1dbf73', color: '#fff', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>{s.step}</div>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1a1a2e', marginBottom: '0.2rem' }}>{s.title}</div>
                  <div style={{ color: '#95979d', fontSize: '0.7rem' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}