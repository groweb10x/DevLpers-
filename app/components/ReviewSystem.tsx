'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Review = {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  reviewer_role: string;
  created_at: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
};

type ReviewSystemProps = {
  revieweeId: string;
  jobId?: string;
  proposalId?: string;
  canReview?: boolean;
  reviewerRole?: 'client' | 'developer';
};

export default function ReviewSystem({
  revieweeId,
  jobId,
  proposalId,
  canReview = false,
  reviewerRole = 'client',
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avgRating, setAvgRating] = useState(0);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    getCurrentUser();
  }, [revieweeId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReviews = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewee_id', revieweeId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      // Fetch reviewer profiles
      const reviewerIds = [...new Set(data.map(r => r.reviewer_id))];
      const { data: profiles } = await supabase
        .from('developer_profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', reviewerIds);

      const enriched = data.map(r => ({
        ...r,
        reviewer_name: profiles?.find(p => p.user_id === r.reviewer_id)?.full_name || 'Anonymous',
        reviewer_avatar: profiles?.find(p => p.user_id === r.reviewer_id)?.avatar_url || null,
      }));

      setReviews(enriched);
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAvgRating(Math.round(avg * 10) / 10);
    } else {
      setReviews([]);
      setAvgRating(0);
    }

    setLoading(false);
  };

  const checkAlreadyReviewed = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reviews')
      .select('id')
      .eq('reviewer_id', user.id)
      .eq('reviewee_id', revieweeId)
      .maybeSingle();
    setAlreadyReviewed(!!data);
  };

  useEffect(() => {
    if (user) checkAlreadyReviewed();
  }, [user, revieweeId]);

  const submitReview = async () => {
    if (!rating) { alert('Please select a rating!'); return; }
    if (!comment.trim()) { alert('Please write a comment!'); return; }
    if (!user) { window.location.href = '/login'; return; }
    setSubmitting(true);

    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      job_id: jobId || null,
      proposal_id: proposalId || null,
      rating,
      comment: comment.trim(),
      reviewer_role: reviewerRole,
    });

    if (!error) {
      // Notify reviewee
      await supabase.from('notifications').insert({
        user_id: revieweeId,
        title: '⭐ New Review!',
        message: `You received a ${rating}-star review!`,
        type: 'info',
        link: '/dashboard',
      });

      setSubmitted(true);
      setShowForm(false);
      await fetchReviews();
    } else {
      alert('Error: ' + error.message);
    }
    setSubmitting(false);
  };

  const StarDisplay = ({ rating, size = 16 }: { rating: number; size?: number }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= rating ? '#f59e0b' : '#e4e5e7' }}>★</span>
      ))}
    </div>
  );

  const getRatingLabel = (r: number) => {
    if (r === 5) return 'Excellent!';
    if (r === 4) return 'Very Good';
    if (r === 3) return 'Good';
    if (r === 2) return 'Fair';
    if (r === 1) return 'Poor';
    return '';
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0,
  }));

  return (
    <div style={{ background: '#fff', border: '1px solid #e4e5e7', borderRadius: '12px', overflow: 'hidden' }}>

      {/* HEADER */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e4e5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '0.25rem' }}>
            ⭐ Reviews & Ratings
          </h3>
          <p style={{ color: '#95979d', fontSize: '0.82rem' }}>
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        {canReview && !alreadyReviewed && !submitted && user && (
          <button onClick={() => setShowForm(!showForm)} style={{
            background: showForm ? '#fff' : '#1dbf73',
            border: `1px solid ${showForm ? '#e4e5e7' : '#1dbf73'}`,
            color: showForm ? '#62646a' : '#fff',
            padding: '8px 18px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}>
            {showForm ? 'Cancel' : '✍️ Write Review'}
          </button>
        )}
        {alreadyReviewed && (
          <span style={{ background: '#f0fdf4', color: '#1dbf73', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600 }}>
            ✓ Reviewed
          </span>
        )}
      </div>

      {/* RATING SUMMARY */}
      {reviews.length > 0 && (
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e4e5e7', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Average */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '3rem', color: '#1a1a2e', lineHeight: 1 }}>{avgRating}</div>
            <StarDisplay rating={Math.round(avgRating)} size={18} />
            <div style={{ color: '#95979d', fontSize: '0.75rem', marginTop: '0.25rem' }}>{reviews.length} reviews</div>
          </div>

          {/* Breakdown */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            {ratingCounts.map(r => (
              <div key={r.rating} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.8rem', minWidth: '16px' }}>{r.rating}★</span>
                <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: '#f59e0b', borderRadius: '100px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ color: '#95979d', fontSize: '0.75rem', minWidth: '20px' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEW FORM */}
      {showForm && (
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e4e5e7', background: '#f8fafc' }}>
          <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: '1.25rem' }}>
            Write Your Review
          </h4>

          {/* Star Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Rating *
            </label>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    fontSize: '2rem', cursor: 'pointer',
                    color: s <= (hoverRating || rating) ? '#f59e0b' : '#e4e5e7',
                    transition: 'color 0.1s, transform 0.1s',
                    transform: s <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)',
                  }}>★</span>
              ))}
              {(hoverRating || rating) > 0 && (
                <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                  {getRatingLabel(hoverRating || rating)}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#62646a', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.4rem' }}>
              Your Review * ({comment.length}/500)
            </label>
            <textarea
              value={comment}
              onChange={e => e.target.value.length <= 500 && setComment(e.target.value)}
              placeholder="Share your experience working with this developer/client..."
              rows={4}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #e4e5e7', borderRadius: '8px',
                fontSize: '0.88rem', outline: 'none', resize: 'vertical',
                fontFamily: 'Inter, sans-serif', color: '#404145',
                lineHeight: 1.6, boxSizing: 'border-box', background: '#fff',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#1dbf73'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = '#e4e5e7'}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={submitReview} disabled={submitting || !rating} style={{
              background: submitting || !rating ? '#a7f3d0' : '#1dbf73',
              border: 'none', color: '#fff', padding: '10px 24px',
              borderRadius: '6px', cursor: submitting || !rating ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: '0.88rem',
            }}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button onClick={() => setShowForm(false)} style={{
              background: '#fff', border: '1px solid #e4e5e7', color: '#62646a',
              padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem',
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <div style={{ padding: '1rem 1.5rem', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
          <div style={{ color: '#1dbf73', fontWeight: 600, fontSize: '0.88rem' }}>
            ✅ Review submitted successfully! Thank you for your feedback.
          </div>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            <p style={{ fontSize: '0.85rem' }}>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#95979d' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⭐</div>
            <p style={{ fontWeight: 500, color: '#62646a', marginBottom: '0.4rem' }}>No reviews yet</p>
            <p style={{ fontSize: '0.82rem' }}>Be the first to leave a review!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.map((review, i) => (
              <div key={i} style={{ paddingBottom: '1.25rem', borderBottom: i < reviews.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {review.reviewer_avatar ? (
                      <img src={review.reviewer_avatar} alt={review.reviewer_name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e4e5e7', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1dbf73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                        {review.reviewer_name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1a2e' }}>{review.reviewer_name}</div>
                      <div style={{ color: '#95979d', fontSize: '0.72rem', textTransform: 'capitalize' }}>
                        {review.reviewer_role}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StarDisplay rating={review.rating} size={14} />
                    <div style={{ color: '#95979d', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                      {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <p style={{ color: '#62646a', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
                  {review.comment}
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{
                    background: review.rating >= 4 ? '#f0fdf4' : review.rating >= 3 ? '#fffbeb' : '#fef2f2',
                    color: review.rating >= 4 ? '#1dbf73' : review.rating >= 3 ? '#f59e0b' : '#dc2626',
                    border: `1px solid ${review.rating >= 4 ? '#bbf7d0' : review.rating >= 3 ? '#fde68a' : '#fecaca'}`,
                    borderRadius: '100px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 600,
                  }}>
                    {getRatingLabel(review.rating)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}