import { useState } from 'react';
import { X, DollarSign, Clock, MapPin, User, Tag, CheckCircle, MessageCircle, AlertTriangle, Image as ImageIcon, Video } from 'lucide-react';
import { Task, TaskStatus } from './TaskCard';

interface TaskDetailModalProps {
  task: Task;
  viewMode: 'participant' | 'host';
  onClose: () => void;
  onAccept?: (taskId: string) => void;
  onDecline?: (taskId: string) => void;
  onSubmitCompletion?: (taskId: string) => void;
  onAskQuestion?: (taskId: string, question: string) => void;
}

export function TaskDetailModal({
  task,
  viewMode,
  onClose,
  onAccept,
  onDecline,
  onSubmitCompletion,
  onAskQuestion
}: TaskDetailModalProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [question, setQuestion] = useState('');

  const handleAskQuestion = () => {
    if (question.trim() && onAskQuestion) {
      onAskQuestion(task.id, question);
      setQuestion('');
      setShowQuestionForm(false);
    }
  };

  const isDeadlineSoon = new Date(task.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const canAccept = task.status === 'open' && viewMode === 'participant';
  const canSubmit = (task.status === 'accepted' || task.status === 'in_progress') && viewMode === 'participant';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{task.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{task.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Reward Amount - Highlighted */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">Reward</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {task.rewardAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">Deadline</p>
                <div className={`flex items-center gap-2 ${isDeadlineSoon ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">{new Date(task.deadline).toLocaleDateString()}</p>
                    <p className="text-xs">{new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deadline Warning */}
          {isDeadlineSoon && task.status === 'open' && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-300">Deadline approaching soon!</p>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                  This task needs to be completed within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Listing</span>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold">{task.listingName}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Host</span>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold">{task.hostName}</p>
            </div>
          </div>

          {/* Submitted Proof (if exists) */}
          {task.submittedProof && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Submitted Proof
              </h3>

              {task.submittedProof.note && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{task.submittedProof.note}</p>
                </div>
              )}

              {task.submittedProof.photos.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Photos ({task.submittedProof.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {task.submittedProof.photos.map((photo, idx) => (
                      <div key={idx} className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              )}

              {task.submittedProof.videos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Videos ({task.submittedProof.videos.length})
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                Submitted {new Date(task.submittedProof.submittedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Question Form */}
          {showQuestionForm && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Ask a Question</h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none mb-3"
                placeholder="Type your question here..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQuestionForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAskQuestion}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                >
                  Send Question
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {canAccept && (
              <>
                <button
                  onClick={() => onAccept?.(task.id)}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Task
                </button>
                <button
                  onClick={() => setShowQuestionForm(true)}
                  className="w-full px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Ask a Question
                </button>
                <button
                  onClick={() => onDecline?.(task.id)}
                  className="w-full px-6 py-2 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Decline
                </button>
              </>
            )}

            {canSubmit && (
              <button
                onClick={() => onSubmitCompletion?.(task.id)}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-600/25 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Completion
              </button>
            )}

            {!canAccept && !canSubmit && viewMode === 'participant' && (
              <button
                onClick={() => setShowQuestionForm(true)}
                className="w-full px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Ask a Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
