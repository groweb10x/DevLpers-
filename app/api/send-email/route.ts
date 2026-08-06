import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { type, to, name, jobTitle, amount } = await req.json();

    let subject = '';
    let html = '';

    if (type === 'welcome') {
      subject = 'Welcome to DevLpers! 🎉';
      html = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#fff;border-radius:12px;">
          <div style="text-align:center;margin-bottom:2rem;">
            <h1 style="color:#1dbf73;font-size:1.8rem;margin:0">Dev<span style="color:#404145">Lpers</span></h1>
          </div>
          <h2 style="color:#404145">Welcome, ${name}! 👋</h2>
          <p style="color:#62646a;line-height:1.7">
            Your account has been created successfully. You are now part of the DevLpers community!
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:1.5rem;margin:1.5rem 0;">
            <h3 style="color:#1dbf73;margin:0 0 0.75rem">Get Started:</h3>
            <ul style="color:#62646a;line-height:2;margin:0;padding-left:1.25rem;">
              <li>Complete your profile</li>
              <li>Browse available jobs</li>
              <li>Send your first proposal</li>
              <li>Start earning!</li>
            </ul>
          </div>
          <div style="text-align:center;margin-top:2rem;">
            <a href="https://www.develpers.com//dashboard" style="background:#1dbf73;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
              Go to Dashboard →
            </a>
          </div>
          <p style="color:#95979d;font-size:0.82rem;margin-top:2rem;text-align:center;">
            DevLpers — Global Developer Marketplace
          </p>
        </div>
      `;
    }

    if (type === 'proposal_sent') {
      subject = `Proposal Submitted — ${jobTitle}`;
      html = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#fff;border-radius:12px;">
          <div style="text-align:center;margin-bottom:2rem;">
            <h1 style="color:#1dbf73;font-size:1.8rem;margin:0">Dev<span style="color:#404145">Lpers</span></h1>
          </div>
          <h2 style="color:#404145">Proposal Submitted! 📨</h2>
          <p style="color:#62646a;line-height:1.7">Hi ${name}, your proposal has been submitted successfully.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:1.5rem;margin:1.5rem 0;">
            <p style="margin:0;color:#62646a"><strong>Job:</strong> ${jobTitle}</p>
            <p style="margin:0.5rem 0 0;color:#62646a"><strong>Bid Amount:</strong> $${amount}</p>
          </div>
          <p style="color:#62646a;line-height:1.7">
            The client will review your proposal and get back to you soon. You will receive an email when they respond.
          </p>
          <div style="text-align:center;margin-top:2rem;">
            <a href="https://www.develpers.com//dashboard" style="background:#1dbf73;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
              View Dashboard →
            </a>
          </div>
          <p style="color:#95979d;font-size:0.82rem;margin-top:2rem;text-align:center;">
            DevLpers — Global Developer Marketplace
          </p>
        </div>
      `;
    }

    if (type === 'proposal_accepted') {
      subject = `🎉 Your Proposal was Accepted — ${jobTitle}`;
      html = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#fff;border-radius:12px;">
          <div style="text-align:center;margin-bottom:2rem;">
            <h1 style="color:#1dbf73;font-size:1.8rem;margin:0">Dev<span style="color:#404145">Lpers</span></h1>
          </div>
          <h2 style="color:#1dbf73">Congratulations! Your proposal was accepted! 🎉</h2>
          <p style="color:#62646a;line-height:1.7">Hi ${name}, great news!</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:1.5rem;margin:1.5rem 0;">
            <p style="margin:0;color:#62646a"><strong>Job:</strong> ${jobTitle}</p>
            <p style="margin:0.5rem 0 0;color:#1dbf73;font-weight:700;font-size:1.1rem">Amount: $${amount}</p>
          </div>
          <p style="color:#62646a;line-height:1.7">
            The client has accepted your proposal. Login to your dashboard to start the project!
          </p>
          <div style="text-align:center;margin-top:2rem;">
            <a href="https://www.develpers.com//dashboard" style="background:#1dbf73;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
              Start Working →
            </a>
          </div>
          <p style="color:#95979d;font-size:0.82rem;margin-top:2rem;text-align:center;">
            DevLpers — Global Developer Marketplace
          </p>
        </div>
      `;
    }

    if (type === 'proposal_declined') {
      subject = `Proposal Update — ${jobTitle}`;
      html = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#fff;border-radius:12px;">
          <div style="text-align:center;margin-bottom:2rem;">
            <h1 style="color:#1dbf73;font-size:1.8rem;margin:0">Dev<span style="color:#404145">Lpers</span></h1>
          </div>
          <h2 style="color:#404145">Proposal Update 📋</h2>
          <p style="color:#62646a;line-height:1.7">Hi ${name},</p>
          <p style="color:#62646a;line-height:1.7">
            Unfortunately, the client has decided to go with another developer for <strong>${jobTitle}</strong>.
            Don't give up — there are many more opportunities waiting for you!
          </p>
          <div style="text-align:center;margin-top:2rem;">
            <a href="https://www.develpers.com//jobs" style="background:#1dbf73;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;">
              Browse More Jobs →
            </a>
          </div>
          <p style="color:#95979d;font-size:0.82rem;margin-top:2rem;text-align:center;">
            DevLpers — Global Developer Marketplace
          </p>
        </div>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: 'DevLpers <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}