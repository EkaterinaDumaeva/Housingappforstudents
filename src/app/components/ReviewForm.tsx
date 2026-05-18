import { useState } from 'react';
import { X, Star, Upload, Image as ImageIcon, Video, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  onClose: () => void;
  onSubmit: (review: ReviewData) => void;
  revieweeType: 'host' | 'employer' | 'participant' | 'provider';
  revieweeName: string;
  relationshipId: string; // Booking ID, job ID, etc.
}

export interface ReviewData {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto?: string;
  revieweeId: string;
  revieweeName: string;
  revieweeType: 'host' | 'employer' | 'participant' | 'provider';
  relationshipId: string;
  overallRating: number;
  reviewText: string;
  categoryRatings?: {
    [key: string]: number;
  };
  photos: string[];
  videos: string[];
  createdAt: string;
  status: 'published' | 'reported' | 'under_review' | 'hidden' | 'removed' | 'verified';
  response?: {
    text: string;
    responderId: string;
    responderName: string;
    createdAt: string;
  };
}

export function ReviewForm({ onClose, onSubmit, revieweeType, revieweeName, relationshipId }: ReviewFormProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [categoryRatings, setCategoryRatings] = useState<{ [key: string]: number }>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ url: string; file?: File }>>([]);
  const [uploadedVideos, setUploadedVideos] = useState<Array<{ url: string; file?: File }>>([]);
  const [submitted, setSubmitted] = useState(false);

  const getCategoryLabels = () => {
    switch (revieweeType) {
      case 'host':
        return [
          { key: 'accuracy', label: 'Housing Accuracy' },
          { key: 'cleanliness', label: 'Cleanliness' },
          { key: 'safety', label: 'Safety' },
          { key: 'communication', label: 'Communication' },
          { key: 'value', label: 'Value' },
          { key: 'deposit_fairness', label: 'Deposit Fairness' }
        ];
      case 'employer':
        return [
          { key: 'job_accuracy', label: 'Job Accuracy' },
          { key: 'communication', label: 'Communication' },
          { key: 'work_environment', label: 'Work Environment' },
          { key: 'scheduling', label: 'Scheduling Fairness' },
          { key: 'pay_transparency', label: 'Pay Transparency' },
          { key: 'support', label: 'Support' }
        ];
      case 'participant':
        return [
          { key: 'communication', label: 'Communication' },
          { key: 'respectfulness', label: 'Respectfulness' },
          { key: 'payment_reliability', label: 'Payment Reliability' },
          { key: 'cleanliness', label: 'Cleanliness' },
          { key: 'rule_compliance', label: 'Rule Compliance' }
        ];
      case 'provider':
        return [
          { key: 'service_quality', label: 'Service Quality' },
          { key: 'communication', label: 'Communication' },
          { key: 'reliability', label: 'Reliability' },
          { key: 'professionalism', label: 'Professionalism' },
          { key: 'value', label: 'Value' }
        ];
      default:
        return [];
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).slice(0, 10 - uploadedPhotos.length).map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).slice(0, 5 - uploadedVideos.length).map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setUploadedVideos([...uploadedVideos, ...newVideos]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(uploadedVideos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (overallRating === 0) {
      alert('Please select a star rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      alert('Please write a review (at least 10 characters)');
      return;
    }

    const review: ReviewData = {
      id: `review-${Date.now()}`,
      reviewerId: 'current-user-id',
      reviewerName: 'Current User',
      revieweeId: 'reviewee-id',
      revieweeName,
      revieweeType,
      relationshipId,
      overallRating,
      reviewText: reviewText.trim(),
      categoryRatings: Object.keys(categoryRatings).length > 0 ? categoryRatings : undefined,
      photos: uploadedPhotos.map(p => p.url),
      videos: uploadedVideos.map(v => v.url),
      createdAt: new Date().toISOString(),
      status: 'published'
    };

    onSubmit(review);
    setSubmitted(true);

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review Submitted!</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Thank you for your feedback. Your review is now visible on {revieweeName}'s profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Leave a Review</h2>
            <p className="text-sm text-white/90 mt-1">Share your experience with {revieweeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Trust & Safety Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Review Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Be honest and based on your real experience</li>
                  <li>Do not share private personal information</li>
                  <li>Avoid abusive, discriminatory, or threatening language</li>
                  <li>Reviews may be moderated if reported</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setOverallRating(rating)}
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      rating <= (hoverRating || overallRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              {overallRating > 0 && (
                <span className="ml-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {overallRating} {overallRating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Category Ratings (Optional)
            </label>
            <div className="space-y-3">
              {getCategoryLabels().map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{category.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setCategoryRatings({ ...categoryRatings, [category.key]: rating })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            rating <= (categoryRatings[category.key] || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`Share details about your experience with ${revieweeName}...`}
              rows={6}
              minLength={10}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Minimum 10 characters • {reviewText.length} characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Add Photos (Optional)
            </label>
            <div className="space-y-3">
              {uploadedPhotos.length < 10 && (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click to upload photos (max 10)
                    </p>
                  </div>
                </label>
              )}

              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Add Videos (Optional)
            </label>
            <div className="space-y-3">
              {uploadedVideos.length < 5 && (
                <label className="block">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click to upload videos (max 5)
                    </p>
                  </div>
                </label>
              )}

              {uploadedVideos.length > 0 && (
                <div className="space-y-2">
                  {uploadedVideos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Video {index + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
