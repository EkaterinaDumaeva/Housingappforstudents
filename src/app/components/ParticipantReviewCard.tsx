import { Star, Flag, CheckCircle, AlertTriangle, EyeOff } from 'lucide-react';
import { useState } from 'react';

export type ReviewStatus = 'published' | 'reported' | 'under-review' | 'hidden' | 'removed' | 'verified';

export interface ParticipantReview {
  id: string;
  reviewerName: string;
  reviewerPhoto?: string;
  rating: number;
  relationship: string;
  reviewText: string;
  date: string;
  mediaUrls?: string[];
  status: ReviewStatus;
  isVerified?: boolean;
}

interface ParticipantReviewCardProps {
  review: ParticipantReview;
  onReport?: (reviewId: string) => void;
  showAdminControls?: boolean;
  onAdminAction?: (reviewId: string, action: 'keep' | 'hide' | 'remove' | 'verify') => void;
}

export function ParticipantReviewCard({ review, onReport, showAdminControls = false, onAdminAction }: ParticipantReviewCardProps) {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = () => {
    switch (review.status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        );
      case 'reported':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
            <Flag className="w-3 h-3" />
            Reported
          </div>
        );
      case 'under-review':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3 h-3" />
            Under Review
          </div>
        );
      case 'hidden':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400 rounded-full text-xs font-semibold">
            <EyeOff className="w-3 h-3" />
            Hidden
          </div>
        );
      default:
        return null;
    }
  };

  if (review.status === 'removed' && !showAdminControls) {
    return null;
  }

  if (review.status === 'hidden' && !showAdminControls) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* Reviewer Photo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0">
            {review.reviewerPhoto ? (
              <img
                src={review.reviewerPhoto}
                alt={review.reviewerName}
                className="w-full h-full object-cover"
              />
            ) : (
              review.reviewerName.charAt(0).toUpperCase()
            )}
          </div>

          {/* Reviewer Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {review.reviewerName}
              </h4>
              {review.isVerified && (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                {review.relationship}
              </span>
              <span>•</span>
              <span>{formatDate(review.date)}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= review.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-900 dark:text-white">
          {review.rating} / 5
        </span>
      </div>

      {/* Review Text */}
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {review.reviewText}
      </p>

      {/* Media */}
      {review.mediaUrls && review.mediaUrls.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {review.mediaUrls.slice(0, 3).map((url, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedMediaIndex(index);
                  setShowMediaModal(true);
                }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={url}
                  alt={`Review media ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                {index === 2 && review.mediaUrls!.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      +{review.mediaUrls!.length - 3}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        {!showAdminControls && review.status === 'published' && (
          <button
            onClick={() => onReport?.(review.id)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Flag className="w-4 h-4" />
            Report Review
          </button>
        )}

        {showAdminControls && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdminAction?.(review.id, 'keep')}
              className="px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              Keep
            </button>
            <button
              onClick={() => onAdminAction?.(review.id, 'hide')}
              className="px-3 py-2 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            >
              Hide
            </button>
            <button
              onClick={() => onAdminAction?.(review.id, 'remove')}
              className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Remove
            </button>
            <button
              onClick={() => onAdminAction?.(review.id, 'verify')}
              className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Verify
            </button>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {showMediaModal && review.mediaUrls && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowMediaModal(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
          <div className="max-w-4xl w-full">
            <img
              src={review.mediaUrls[selectedMediaIndex]}
              alt={`Review media ${selectedMediaIndex + 1}`}
              className="w-full h-auto rounded-lg"
            />
            {review.mediaUrls.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {review.mediaUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedMediaIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
