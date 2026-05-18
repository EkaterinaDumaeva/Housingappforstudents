import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Video, CheckCircle, Camera } from 'lucide-react';

interface UploadProofModalProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
  onSubmit: (proof: { photos: File[]; videos: File[]; note: string }) => void;
}

export function UploadProofModal({ taskId, taskTitle, onClose, onSubmit }: UploadProofModalProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [note, setNote] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);

      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos([...videos, ...Array.from(e.target.files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ photos, videos, note });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Submit Task Completion</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{taskTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Upload proof of completion</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Take photos or videos showing the completed task. Before and after shots are helpful!
                </p>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photos
            </label>

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {photos.length > 0 ? 'Add More Photos' : 'Upload Photos'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {photos.length > 0 ? `${photos.length} photo(s) selected` : 'Tap to select photos from your device'}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos (optional)
            </label>

            {videos.length > 0 && (
              <div className="mb-4 space-y-2">
                {videos.map((video, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-900 dark:text-white">{video.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {videos.length > 0 ? `${videos.length} video(s) selected` : 'Upload videos'}
              </span>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Add a Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
              placeholder="Any additional information about the completed task..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={photos.length === 0 && videos.length === 0}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Submit for Review
            </button>
          </div>

          {photos.length === 0 && videos.length === 0 && (
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">
              At least one photo or video is required
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
