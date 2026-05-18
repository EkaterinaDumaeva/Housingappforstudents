import { useState } from 'react';
import { X, Upload, DollarSign, Calendar, Users, Tag, Image as ImageIcon, Video } from 'lucide-react';

export type TaskCategory =
  | 'kitchen_cleaning'
  | 'bathroom_cleaning'
  | 'trash_recycling'
  | 'laundry_room'
  | 'yard_outdoor'
  | 'grocery_errand'
  | 'move_in_prep'
  | 'move_out_prep'
  | 'deep_cleaning'
  | 'organizing_common'
  | 'pet_care'
  | 'delivery_help'
  | 'maintenance_help'
  | 'general_house_help'
  | 'other';

export type TaskAssignmentScope = 'anyone' | 'specific_room' | 'specific_participant';

export interface TaskData {
  title: string;
  category: TaskCategory;
  customCategory?: string;
  description: string;
  rewardAmount: number;
  deadline: string;
  assignmentScope: TaskAssignmentScope;
  specificRoom?: string;
  specificParticipantId?: string;
  photos: File[];
  videos: File[];
  maxAcceptances?: number;
}

interface CreateTaskModalProps {
  listingId: string;
  listingName: string;
  onClose: () => void;
  onSubmit: (taskData: TaskData) => void;
}

const taskCategoryLabels: Record<TaskCategory, string> = {
  kitchen_cleaning: 'Kitchen cleaning',
  bathroom_cleaning: 'Bathroom cleaning',
  trash_recycling: 'Trash/recycling',
  laundry_room: 'Laundry room',
  yard_outdoor: 'Yard/outdoor',
  grocery_errand: 'Grocery/help errand',
  move_in_prep: 'Move-in preparation',
  move_out_prep: 'Move-out preparation',
  deep_cleaning: 'Deep cleaning',
  organizing_common: 'Organizing common area',
  pet_care: 'Pet care',
  delivery_help: 'Delivery/help request',
  maintenance_help: 'Maintenance help',
  general_house_help: 'General house help',
  other: 'Other/custom'
};

export function CreateTaskModal({ listingId, listingName, onClose, onSubmit }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    category: 'kitchen_cleaning',
    description: '',
    rewardAmount: 0,
    deadline: '',
    assignmentScope: 'anyone',
    photos: [],
    videos: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photos: [...formData.photos, ...Array.from(e.target.files)] });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, videos: [...formData.videos, ...Array.from(e.target.files)] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Task</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{listingName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Clean kitchen after weekend"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.entries(taskCategoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Custom Category (if Other is selected) */}
          {formData.category === 'other' && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Custom Category Name
              </label>
              <input
                type="text"
                value={formData.customCategory || ''}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Garden maintenance"
                required
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
              placeholder="Describe what needs to be done..."
              required
            />
          </div>

          {/* Reward Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Reward Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rewardAmount || ''}
                onChange={(e) => setFormData({ ...formData, rewardAmount: parseFloat(e.target.value) })}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Assignment Scope */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assign To
            </label>
            <select
              value={formData.assignmentScope}
              onChange={(e) => setFormData({ ...formData, assignmentScope: e.target.value as TaskAssignmentScope })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="anyone">Anyone in listing (first come, first served)</option>
              <option value="specific_room">Specific room</option>
              <option value="specific_participant">Specific participant</option>
            </select>
          </div>

          {/* Multiple Acceptances Option */}
          {formData.assignmentScope === 'anyone' && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Max Acceptances (optional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxAcceptances || ''}
                onChange={(e) => setFormData({ ...formData, maxAcceptances: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Leave empty for single acceptance"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Allow multiple participants to accept this task
              </p>
            </div>
          )}

          {/* Photos Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photos (optional)
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {formData.photos.length > 0 ? `${formData.photos.length} photo(s) selected` : 'Upload photos'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Videos Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos (optional)
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {formData.videos.length > 0 ? `${formData.videos.length} video(s) selected` : 'Upload videos'}
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

          {/* Submit Button */}
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
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
