import { useState } from 'react';
import { X, Flag, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportReviewModalProps {
  onClose: () => void;
  onSubmit: (report: ReviewReport) => void;
  reviewId: string;
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  reporterId: string;
  reporterName: string;
  reason: 'fake' | 'harassment' | 'discrimination' | 'private_info' | 'irrelevant' | 'spam' | 'false_info' | 'threats' | 'inappropriate_media' | 'other';
  comment: string;
  createdAt: string;
  status: 'pending' | 'under_review' | 'dismissed' | 'action_taken';
}

export function ReportReviewModal({ onClose, onSubmit, reviewId }: ReportReviewModalProps) {
  const [reason, setReason] = useState<ReviewReport['reason']>('fake');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    { value: 'fake' as const, label: 'Fake Review', description: 'This review appears to be fabricated or fraudulent' },
    { value: 'harassment' as const, label: 'Harassment or Abusive Language', description: 'Contains harassing or abusive content' },
    { value: 'discrimination' as const, label: 'Discrimination', description: 'Contains discriminatory language or content' },
    { value: 'private_info' as const, label: 'Private Information Shared', description: 'Shares private or sensitive information' },
    { value: 'irrelevant' as const, label: 'Irrelevant Content', description: 'Content is not relevant to the experience' },
    { value: 'spam' as const, label: 'Spam', description: 'Spam or promotional content' },
    { value: 'false_info' as const, label: 'False Information', description: 'Contains deliberately false or misleading information' },
    { value: 'threats' as const, label: 'Threats or Safety Concern', description: 'Contains threats or raises safety concerns' },
    { value: 'inappropriate_media' as const, label: 'Inappropriate Photo/Video', description: 'Contains inappropriate images or videos' },
    { value: 'other' as const, label: 'Other', description: 'Another reason not listed above' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (reason === 'other' && comment.trim().length < 10) {
      alert('Please provide a detailed explanation for reporting this review');
      return;
    }

    const report: ReviewReport = {
      id: `report-${Date.now()}`,
      reviewId,
      reporterId: 'current-user-id',
      reporterName: 'Current User',
      reason,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    onSubmit(report);
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Submitted</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Thank you for reporting. Our moderation team will review this report and take appropriate action.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Report Review</h2>
            <p className="text-sm text-white/90 mt-1">Help us maintain a safe and trustworthy community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Warning Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <p className="font-semibold mb-1">False reports may result in action against your account</p>
                <p>
                  Please only report reviews that violate our community guidelines. Our team investigates all reports thoroughly.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Why are you reporting this review? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {reasons.map((reasonOption) => (
                <label
                  key={reasonOption.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    reason === reasonOption.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption.value}
                    checked={reason === reasonOption.value}
                    onChange={(e) => setReason(e.target.value as ReviewReport['reason'])}
                    className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {reasonOption.label}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      {reasonOption.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Comment */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Additional Details {reason === 'other' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                reason === 'other'
                  ? 'Please explain your reason for reporting this review...'
                  : 'Provide any additional context (optional)...'
              }
              rows={4}
              minLength={reason === 'other' ? 10 : 0}
              required={reason === 'other'}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            {reason === 'other' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Minimum 10 characters • {comment.length} characters
              </p>
            )}
          </div>

          {/* Confidentiality Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex gap-3">
              <Flag className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Your report is confidential</p>
                <p>
                  The person who wrote this review will not be notified that you reported it. Our moderation team will review your report privately.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Flag className="w-5 h-5" />
              Submit Report
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
