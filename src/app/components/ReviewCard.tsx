import { useState } from 'react';
import { Star, Flag, ThumbsUp, MessageCircle, Image as ImageIcon, Video, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { ReviewData } from './ReviewForm';

interface ReviewCardProps {
  review: ReviewData;
  onReport: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isOwnReview?: boolean;
  showResponse?: boolean;
}

export function ReviewCard({ review, onReport, onEdit, onDelete, isOwnReview = false, showResponse = true }: ReviewCardProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const shouldTruncate = review.reviewText.length > 300;
  const displayText = showFullText || !shouldTruncate
    ? review.reviewText
    : review.reviewText.substring(0, 300) + '...';

  const visiblePhotos = showAllPhotos ? review.photos : review.photos.slice(0, 4);
  const hasMorePhotos = review.photos.length > 4;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {review.reviewerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{review.reviewerName}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{getTimeAgo(review.createdAt)}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-20 min-w-[160px]">
                {isOwnReview ? (
                  <>
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(review.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Review
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this review? This cannot be undone.')) {
                            onDelete(review.id);
                          }
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Review
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onReport(review.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    Report Review
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        {renderStars(review.overallRating)}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {review.overallRating}.0
        </span>
        {review.status === 'verified' && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Category Ratings */}
      {review.categoryRatings && Object.keys(review.categoryRatings).length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(review.categoryRatings).slice(0, 4).map(([key, rating]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Text */}
      <div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {displayText}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-purple-600 dark:text-purple-400 text-sm font-medium mt-2 hover:underline"
          >
            {showFullText ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div>
          <div className="grid grid-cols-4 gap-2">
            {visiblePhotos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(photo, '_blank')}
              >
                <img
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 3 && hasMorePhotos && !showAllPhotos && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{review.photos.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {hasMorePhotos && !showAllPhotos && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="text-purple-600 dark:text-purple-400 text-sm font-medium mt-2 hover:underline"
            >
              Show all {review.photos.length} photos
            </button>
          )}
        </div>
      )}

      {/* Videos */}
      {review.videos.length > 0 && (
        <div className="space-y-2">
          {review.videos.map((video, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                Video {index + 1}
              </span>
              <button
                onClick={() => window.open(video, '_blank')}
                className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline"
              >
                Watch
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Response */}
      {showResponse && review.response && (
        <div className="ml-8 mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 border-l-4 border-purple-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Response from {review.response.responderName}
            </span>
            <span className="text-xs text-slate-500">
              {getTimeAgo(review.response.createdAt)}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {review.response.text}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          Helpful
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <MessageCircle className="w-4 h-4" />
          Reply
        </button>
      </div>
    </div>
  );
}
