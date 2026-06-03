import { X, Star, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface LeaveReviewModalProps {
  onClose: () => void;
  participantName: string;
  onSubmit: (reviewData: ReviewData) => void;
}

export interface ReviewData {
  rating: number;
  relationship: string;
  reviewText: string;
  mediaFiles?: File[];
  date: string;
}

const relationshipCategories = [
  'Host',
  'Former Host',
  'Roommate',
  'Employer',
  'Coworker',
  'Provider',
  'Travel Companion',
  'Friend',
  'Other'
];

export function LeaveReviewModal({ onClose, participantName, onSubmit }: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [relationship, setRelationship] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isUnder10MB = file.size <= 10 * 1024 * 1024;
      return (isImage || isVideo) && isUnder10MB;
    });

    setMediaFiles([...mediaFiles, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !relationship || !reviewText.trim()) {
      alert('Please complete all required fields');
      return;
    }

    onSubmit({
      rating,
      relationship,
      reviewText,
      mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
      date: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Leave a Review</h2>
            <p className="text-sm text-white/90">For: {participantName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Your Relationship <span className="text-red-500">*</span>
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Select your relationship...</option>
              {relationshipCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={6}
              placeholder="Share your experience with this participant..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Minimum 50 characters
            </p>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Photos/Videos (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Upload photos or videos to support your review
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                  Max 10MB per file. Images and videos only.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm font-medium">Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Media Previews */}
              {mediaPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {mediaFiles[index].type.startsWith('image/') ? (
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Review Guidelines
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Be honest and respectful</li>
              <li>• Focus on your direct experience</li>
              <li>• Reviews are public and permanent</li>
              <li>• False or abusive reviews may be removed</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
