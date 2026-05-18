import { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';
import { Task } from './TaskCard';

interface HostReviewTaskModalProps {
  task: Task;
  onClose: () => void;
  onApprove: (taskId: string) => void;
  onReject: (taskId: string, reason: string) => void;
  onRequestRevision: (taskId: string, feedback: string) => void;
}

export function HostReviewTaskModal({
  task,
  onClose,
  onApprove,
  onReject,
  onRequestRevision
}: HostReviewTaskModalProps) {
  const [action, setAction] = useState<'approve' | 'revision' | 'reject' | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(task.id);
    } else if (action === 'revision' && feedback.trim()) {
      onRequestRevision(task.id, feedback);
    } else if (action === 'reject' && feedback.trim()) {
      onReject(task.id, feedback);
    }
    onClose();
  };

  if (!task.submittedProof) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Task Completion</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submitted Proof */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Submitted Proof</h3>

            {/* Note */}
            {task.submittedProof.note && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Participant's Note:</p>
                <p className="text-slate-600 dark:text-slate-400">{task.submittedProof.note}</p>
              </div>
            )}

            {/* Photos */}
            {task.submittedProof.photos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Photos ({task.submittedProof.photos.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {task.submittedProof.photos.map((photo, idx) => (
                    <div key={idx} className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                      {/* Photo placeholder */}
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {task.submittedProof.videos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Videos ({task.submittedProof.videos.length})
                </p>
                <div className="space-y-2">
                  {task.submittedProof.videos.map((video, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-900 dark:text-white">Video {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submitted {new Date(task.submittedProof.submittedAt).toLocaleString()}
            </p>
          </div>

          {/* Action Selection */}
          {!action && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Choose an action:</p>

              <button
                onClick={() => setAction('approve')}
                className="w-full p-4 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-300">Approve & Release Reward</p>
                  <p className="text-sm text-green-700 dark:text-green-400">Task completed successfully</p>
                </div>
              </button>

              <button
                onClick={() => setAction('revision')}
                className="w-full p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-300">Request Revision</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">Ask for improvements or corrections</p>
                </div>
              </button>

              <button
                onClick={() => setAction('reject')}
                className="w-full p-4 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-red-900 dark:text-red-300">Reject Task</p>
                  <p className="text-sm text-red-700 dark:text-red-400">Task not completed as requested</p>
                </div>
              </button>
            </div>
          )}

          {/* Feedback Form */}
          {(action === 'revision' || action === 'reject') && (
            <div className="space-y-4">
              <button
                onClick={() => setAction(null)}
                className="text-sm text-primary hover:underline"
              >
                ← Back to options
              </button>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {action === 'revision' ? 'Revision Feedback' : 'Rejection Reason'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
                  placeholder={action === 'revision' ? 'Explain what needs to be improved...' : 'Explain why the task is being rejected...'}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setAction(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!feedback.trim()}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    action === 'revision'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {action === 'revision' ? 'Request Revision' : 'Reject Task'}
                </button>
              </div>
            </div>
          )}

          {/* Approve Confirmation */}
          {action === 'approve' && (
            <div className="space-y-4">
              <button
                onClick={() => setAction(null)}
                className="text-sm text-primary hover:underline"
              >
                ← Back to options
              </button>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="font-semibold text-green-900 dark:text-green-300 mb-2">Ready to approve?</p>
                <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                  The participant will receive ${task.rewardAmount.toFixed(2)} and can choose to cash out or support a good cause.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setAction(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Release Reward
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
