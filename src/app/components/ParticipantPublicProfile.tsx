import { Star, TrendingUp, Users, Award, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ParticipantReviewCard, ParticipantReview } from './ParticipantReviewCard';
import { LeaveReviewModal, ReviewData } from './LeaveReviewModal';

interface ParticipantPublicProfileProps {
  participantName: string;
  participantPhoto?: string;
  onClose?: () => void;
}

// Mock reviews data - in production this would come from backend
const mockReviews: ParticipantReview[] = [
  {
    id: '1',
    reviewerName: 'Sarah Johnson',
    reviewerPhoto: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    relationship: 'Host',
    reviewText: 'Excellent tenant! Very respectful of the property, always paid rent on time, and communicated well. Would definitely host again.',
    date: '2026-05-15T00:00:00.000Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400'
    ],
    status: 'published',
    isVerified: true
  },
  {
    id: '2',
    reviewerName: 'Michael Chen',
    reviewerPhoto: 'https://i.pravatar.cc/150?img=12',
    rating: 4,
    relationship: 'Employer',
    reviewText: 'Great employee during the summer season. Reliable, punctual, and had a positive attitude. Minor communication issues but overall a good experience.',
    date: '2026-04-20T00:00:00.000Z',
    status: 'published'
  },
  {
    id: '3',
    reviewerName: 'Emma Davis',
    reviewerPhoto: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    relationship: 'Roommate',
    reviewText: 'Amazing roommate! Always clean, respectful of shared spaces, and friendly. Made the summer work experience so much better.',
    date: '2026-03-10T00:00:00.000Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    ],
    status: 'verified',
    isVerified: true
  },
  {
    id: '4',
    reviewerName: 'David Martinez',
    reviewerPhoto: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    relationship: 'Former Host',
    reviewText: 'One of the best tenants I\'ve had. Left the place in perfect condition, never any issues, and very considerate. Highly recommend!',
    date: '2026-02-05T00:00:00.000Z',
    status: 'published'
  }
];

export function ParticipantPublicProfile({ participantName, participantPhoto, onClose }: ParticipantPublicProfileProps) {
  const [reviews, setReviews] = useState<ParticipantReview[]>(mockReviews);
  const [showLeaveReview, setShowLeaveReview] = useState(false);
  const [filterRelationship, setFilterRelationship] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate statistics
  const totalReviews = reviews.filter(r => r.status === 'published' || r.status === 'verified').length;
  const averageRating = totalReviews > 0
    ? reviews.filter(r => r.status === 'published' || r.status === 'verified')
        .reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r =>
      (r.status === 'published' || r.status === 'verified') && r.rating === star
    ).length;
    return {
      star,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
    };
  });

  // Relationship breakdown
  const relationshipCounts: Record<string, number> = {};
  reviews.forEach(review => {
    if (review.status === 'published' || review.status === 'verified') {
      relationshipCounts[review.relationship] = (relationshipCounts[review.relationship] || 0) + 1;
    }
  });

  // Filter reviews
  const filteredReviews = filterRelationship === 'all'
    ? reviews.filter(r => r.status === 'published' || r.status === 'verified')
    : reviews.filter(r =>
        (r.status === 'published' || r.status === 'verified') &&
        r.relationship === filterRelationship
      );

  const handleSubmitReview = (reviewData: ReviewData) => {
    const newReview: ParticipantReview = {
      id: `r${Date.now()}`,
      reviewerName: 'You',
      rating: reviewData.rating,
      relationship: reviewData.relationship,
      reviewText: reviewData.reviewText,
      date: reviewData.date,
      mediaUrls: reviewData.mediaFiles?.map(file => URL.createObjectURL(file)),
      status: 'published'
    };

    setReviews([newReview, ...reviews]);
    setShowLeaveReview(false);
    alert('Review submitted successfully!');
  };

  const handleReportReview = (reviewId: string) => {
    const updatedReviews = reviews.map(r =>
      r.id === reviewId ? { ...r, status: 'reported' as const } : r
    );
    setReviews(updatedReviews);
    alert('Review reported. Our team will investigate this review.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold overflow-hidden flex-shrink-0">
              {participantPhoto ? (
                <img
                  src={participantPhoto}
                  alt={participantName}
                  className="w-full h-full object-cover"
                />
              ) : (
                participantName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{participantName}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-white/80">({totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Award className="w-4 h-4" />
                  <span>Participant Profile</span>
                </div>
              </div>

              {/* Relationship Tags */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(relationshipCounts).map(([relationship, count]) => (
                  <span
                    key={relationship}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm"
                  >
                    {relationship}: {count}
                  </span>
                ))}
              </div>
            </div>

            {/* Leave Review Button */}
            <button
              onClick={() => setShowLeaveReview(true)}
              className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Leave a Review
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rating Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Rating */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {ratingBreakdown.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{star}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">Filter by Relationship</h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="space-y-2">
                  <button
                    onClick={() => setFilterRelationship('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterRelationship === 'all'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Reviews ({totalReviews})
                  </button>
                  {Object.entries(relationshipCounts).map(([relationship, count]) => (
                    <button
                      key={relationship}
                      onClick={() => setFilterRelationship(relationship)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filterRelationship === relationship
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {relationship} ({count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {filterRelationship === 'all' ? 'All Reviews' : `${filterRelationship} Reviews`}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {filteredReviews.length} of {totalReviews} reviews
              </p>
            </div>

            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">No Reviews Yet</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {filterRelationship === 'all'
                      ? 'Be the first to leave a review!'
                      : `No ${filterRelationship} reviews yet.`}
                  </p>
                </div>
              ) : (
                filteredReviews.map(review => (
                  <ParticipantReviewCard
                    key={review.id}
                    review={review}
                    onReport={handleReportReview}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Review Modal */}
      {showLeaveReview && (
        <LeaveReviewModal
          onClose={() => setShowLeaveReview(false)}
          participantName={participantName}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
