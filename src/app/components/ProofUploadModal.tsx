import { useState } from 'react';
import { Upload, X, Camera, Image as ImageIcon, FileText, Check, AlertTriangle, Clock, Lock } from 'lucide-react';

interface ProofUploadModalProps {
  type: 'checkin' | 'checkout';
  onClose: () => void;
  onSubmit: (data: ProofSubmissionData) => void;
  deadline?: string;
  existingProof?: ProofSubmissionData;
  isLocked?: boolean;
}

export interface ProofSubmissionData {
  photos: File[];
  videos: File[];
  notes: string;
  timestamp: string;
  submittedBy: 'participant' | 'host';
}

export function ProofUploadModal({
  type,
  onClose,
  onSubmit,
  deadline,
  existingProof,
  isLocked = false
}: ProofUploadModalProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const isCheckIn = type === 'checkin';
  const title = isCheckIn ? 'Check-In Proof' : 'Check-Out Proof';
  const description = isCheckIn
    ? 'Upload photos and videos showing your arrival and the property condition'
    : 'Upload photos and videos showing the property condition as you leave';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos([...photos, ...files]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos([...videos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (photos.length === 0 && videos.length === 0) {
      alert('Please upload at least one photo or video');
      return;
    }

    const proofData: ProofSubmissionData = {
      photos,
      videos,
      notes,
      timestamp: new Date().toISOString(),
      submittedBy: 'participant' // This would be dynamic based on user type
    };

    onSubmit(proofData);
  };

  // If proof is locked (already submitted)
  if (isLocked && existingProof) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-green-600 text-white p-6 flex items-start justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{title} Submitted</h2>
                <p className="text-sm text-green-100">
                  Submitted on {new Date(existingProof.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Proof Locked and Secured
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    This proof cannot be edited or deleted. It's permanently stored for dispute protection.
                  </p>
                </div>
              </div>
            </div>

            {/* View Submitted Content */}
            {existingProof.photos.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Photos ({existingProof.photos.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {existingProof.photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Proof ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingProof.videos.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Videos ({existingProof.videos.length})
                </h4>
                <div className="space-y-2">
                  {existingProof.videos.map((video, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm text-slate-900 dark:text-white">{video.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingProof.notes && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Notes</h4>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {existingProof.notes}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-6 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className={`sticky top-0 ${isCheckIn ? 'bg-blue-600' : 'bg-purple-600'} text-white p-6 flex items-start justify-between z-10`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Camera className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-sm text-white/90">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deadline Warning */}
        {deadline && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm">
                  Submit by {new Date(deadline).toLocaleString()}
                </h4>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Missing the deadline may weaken your position if a dispute arises
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Important: Proof Cannot Be Changed
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Once submitted, this proof is permanently locked and timestamped. It cannot be edited or deleted.
                  This protects both parties in case of disputes.
                </p>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Photos {isCheckIn ? '(Property Condition)' : '(As You Leave)'}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-500">
              Upload clear photos of the property condition. Multiple angles recommended.
            </p>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Videos (Optional)
            </label>

            <div className="space-y-2 mb-3">
              {videos.map((video, index) => (
                <div key={index} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-white">{video.name}</span>
                  </div>
                  <button
                    onClick={() => removeVideo(index)}
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <label className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Click to upload video</span>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>

            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Video walkthroughs provide additional evidence of property condition.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={isCheckIn
                ? "Describe any pre-existing damage, issues, or notable conditions you observed..."
                : "Note any changes, damages, or the final condition of the property..."}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Document any important details that photos may not capture.
            </p>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">What to Include:</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Overall room condition</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Walls, floors, and ceiling</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Furniture and appliances</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Bathroom and kitchen areas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Any existing damage or issues</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                if (photos.length === 0 && videos.length === 0) {
                  alert('Please upload at least one photo or video');
                  return;
                }
                setShowConfirm(true);
              }}
              className={`flex-1 px-4 py-3 ${isCheckIn ? 'bg-blue-600' : 'bg-purple-600'} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}
            >
              Submit Proof
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Submit Proof?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Once submitted, this proof cannot be changed or deleted. It will be permanently timestamped and secured.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleSubmit();
                    setShowConfirm(false);
                  }}
                  className={`flex-1 px-4 py-3 ${isCheckIn ? 'bg-blue-600' : 'bg-purple-600'} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}
                >
                  Confirm & Submit
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
