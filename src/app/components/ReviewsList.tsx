import { useState } from 'react';
import { Star, Filter, SortAsc, Plus } from 'lucide-react';
import { ReviewData, ReviewForm } from './ReviewForm';
import { ReviewCard } from './ReviewCard';
import { RatingBreakdown } from './RatingBreakdown';
import { ReportReviewModal, ReviewReport } from './ReportReviewModal';

interface ReviewsListProps {
  reviews: ReviewData[];
  revieweeType: 'host' | 'employer' | 'participant' | 'provider';
  revieweeName: string;
  relationshipId?: string; // If user has a relationship, show "Leave Review" button
  onSubmitReview?: (review: ReviewData) => void;
  onReportReview?: (report: ReviewReport) => void;
  onEditReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  currentUserId?: string;
}

export function ReviewsList({
  reviews,
  revieweeType,
  revieweeName,
  relationshipId,
  onSubmitReview,
  onReportReview,
  onEditReview,
  onDeleteReview,
  currentUserId
}: ReviewsListProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter reviews
  let filteredReviews = [...reviews];
  if (filterRating) {
    filteredReviews = filteredReviews.filter(r => r.overallRating === filterRating);
  }

  // Sort reviews
  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.overallRating - a.overallRating;
      case 'lowest':
        return a.overallRating - b.overallRating;
      default:
        return 0;
    }
  });

  const handleReport = (reviewId: string) => {
    setReportingReviewId(reviewId);
    setShowReportModal(true);
  };

  const handleSubmitReport = (report: ReviewReport) => {
    if (onReportReview) {
      onReportReview(report);
    }
    setShowReportModal(false);
  };

  const handleSubmitReview = (review: ReviewData) => {
    if (onSubmitReview) {
      onSubmitReview(review);
    }
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {relationshipId && onSubmitReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Leave a Review
          </button>
        )}
      </div>

      {reviews.length > 0 ? (
        <>
          {/* Rating Breakdown */}
          <RatingBreakdown reviews={reviews} />

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            {/* Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                filterRating
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                  : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">
                {filterRating ? `${filterRating} Stars` : 'Filter'}
              </span>
            </button>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Filter by Rating
                </span>
                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterRating === rating
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span>{rating}</span>
                    <Star className={`w-4 h-4 ${filterRating === rating ? 'fill-white' : 'fill-yellow-400 text-yellow-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReport={handleReport}
                  onEdit={onEditReview}
                  onDelete={onDeleteReview}
                  isOwnReview={currentUserId === review.reviewerId}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No reviews match your filters
                </p>
                <button
                  onClick={() => setFilterRating(null)}
                  className="mt-3 text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {relationshipId
              ? 'Be the first to share your experience!'
              : 'Reviews from previous clients will appear here.'}
          </p>
          {relationshipId && onSubmitReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Leave the First Review
            </button>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && relationshipId && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleSubmitReview}
          revieweeType={revieweeType}
          revieweeName={revieweeName}
          relationshipId={relationshipId}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportReviewModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitReport}
          reviewId={reportingReviewId}
        />
      )}
    </div>
  );
}
