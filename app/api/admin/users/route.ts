import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client — admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

export async function GET(req: NextRequest) {
  try {
    // Verify admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');

    // Verify user token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check admin
    const { data: adminCheck } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminCheck) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Fetch all users
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Fetch profiles
    const { data: profiles } = await supabaseAdmin
      .from('developer_profiles')
      .select('*');

    // Fetch subscriptions
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*');

    // Fetch user statuses
    const { data: statuses } = await supabaseAdmin
      .from('user_status')
      .select('*');

    // Merge data
    const mergedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      role: u.user_metadata?.role || 'developer',
      roles: u.user_metadata?.roles || [],
      full_name: u.user_metadata?.full_name || '',
      profile: profiles?.find(p => p.user_id === u.id) || null,
      subscription: subscriptions?.find(s => s.user_id === u.id) || null,
      status: statuses?.find(s => s.user_id === u.id) || null,
      is_banned: u.banned_until ? new Date(u.banned_until) > new Date() : false,
    }));

    return NextResponse.json({ users: mergedUsers, total: users.length });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: adminCheck } = await supabaseAdmin
      .from('admin_users').select('id')
      .eq('user_id', user.id).maybeSingle();
    if (!adminCheck) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { action, userId, reason, plan, amount } = await req.json();

    // SUSPEND USER
    if (action === 'suspend') {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: '876600h', // 100 years
      });
      await supabaseAdmin.from('user_status').upsert({
        user_id: userId,
        is_suspended: true,
        suspension_reason: reason || 'Suspended by admin',
      });
      // Notify user
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Account Suspended',
        message: `Your account has been suspended. Reason: ${reason || 'Violation of terms'}`,
        type: 'warning',
      });
      return NextResponse.json({ success: true, action: 'suspended' });
    }

    // ACTIVATE USER
    if (action === 'activate') {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: 'none',
      });
      await supabaseAdmin.from('user_status').upsert({
        user_id: userId,
        is_suspended: false,
        suspension_reason: null,
      });
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: 'Account Activated',
        message: 'Your account has been reactivated. Welcome back!',
        type: 'success',
      });
      return NextResponse.json({ success: true, action: 'activated' });
    }

    // DELETE USER
    if (action === 'delete') {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ success: true, action: 'deleted' });
    }

    // VERIFY USER
    if (action === 'verify') {
      await supabaseAdmin.from('user_status').upsert({
        user_id: userId,
        is_verified: true,
      });
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: '✅ Account Verified!',
        message: 'Your account has been verified by DevLpers admin.',
        type: 'success',
      });
      return NextResponse.json({ success: true, action: 'verified' });
    }

    // FEATURE USER
    if (action === 'feature') {
      await supabaseAdmin.from('seller_levels').upsert({
        user_id: userId,
        is_devmarket_choice: true,
      });
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: '⭐ DevLpers Choice!',
        message: 'You have been featured as a DevLpers Choice developer!',
        type: 'success',
      });
      return NextResponse.json({ success: true, action: 'featured' });
    }

    // UPDATE SUBSCRIPTION
    if (action === 'update_subscription') {
      const expiry = new Date();
      if (plan === 'weekly') expiry.setDate(expiry.getDate() + 7);
      else if (plan === 'monthly') expiry.setDate(expiry.getDate() + 30);
      else if (plan === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);

      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        plan,
        bids_remaining: plan === 'free' ? 5 : 999,
        bids_total: plan === 'free' ? 5 : 999,
        expires_at: plan === 'free' ? null : expiry.toISOString(),
      });
      await supabaseAdmin.from('notifications').insert({
        user_id: userId,
        title: '⚡ Subscription Updated!',
        message: `Your plan has been updated to ${plan.toUpperCase()} by admin.`,
        type: 'success',
        link: '/dashboard',
      });
      return NextResponse.json({ success: true, action: 'subscription_updated' });
    }

    // RELEASE ESCROW PAYMENT
    if (action === 'release_escrow') {
      const { escrowId } = await req.json().catch(() => ({}));
      const { data: escrow } = await supabaseAdmin
        .from('escrow_payments').select('*').eq('id', escrowId).maybeSingle();

      if (escrow) {
        const platformFee = escrow.amount * 0.1; // 10% fee
        const devAmount = escrow.amount - platformFee;

        await supabaseAdmin.from('escrow_payments').update({
          status: 'released',
          platform_fee: platformFee,
          developer_amount: devAmount,
          released_at: new Date().toISOString(),
        }).eq('id', escrowId);

        // Update developer earnings
        await supabaseAdmin.from('developer_profiles').update({
          total_earned: supabaseAdmin.rpc('increment_earned', { amount: devAmount }),
        }).eq('user_id', escrow.developer_id);

        await supabaseAdmin.from('notifications').insert({
          user_id: escrow.developer_id,
          title: '💰 Payment Released!',
          message: `$${devAmount} has been released to your account!`,
          type: 'payment',
          link: '/dashboard',
        });
      }
      return NextResponse.json({ success: true, action: 'escrow_released' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}