import { useState } from 'react';
import { X, Lock, Unlock, MessageCircle, FileText, Shield, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface EmployerPaywallModalProps {
  onClose: () => void;
  onPurchase: () => void;
  employerName?: string;
}

export function EmployerPaywallModal({ onClose, onPurchase, employerName }: EmployerPaywallModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handlePurchase = () => {
    onPurchase();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Unlock className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Unlocked!</h3>
          <p className="text-slate-600 dark:text-slate-400">
            You can now message employers and receive job offers through the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="w-7 h-7" />
              Unlock Employer Access
            </h2>
            <p className="text-sm text-white/90 mt-1">One-time payment for full employer features</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Price Card */}
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl">
            <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">$14.99</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">One-Time Payment</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Lifetime access to employer features</div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">What You Get:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">In-Platform Messaging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Message employers directly through our secure platform
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Receive Job Offers</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get one active job offer, review, and accept or decline
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Protected Contact Information</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    All communication stays secure within the platform. Employer emails and phone numbers remain private.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Job Offer Limitation</p>
                <p>
                  You can have one active job offer at a time. To receive another offer, you must first decline or cancel your current active offer.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Safety */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <p className="font-semibold mb-1">Privacy & Safety Rules</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Do NOT share contact information outside the platform</li>
                  <li>Do NOT request or send payment outside the platform</li>
                  <li>Messages attempting to share external contact info will be blocked</li>
                  <li>Violations may result in account suspension without refund</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What You're Browsing */}
          {employerName && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">You're viewing:</p>
              <p className="font-semibold text-slate-900 dark:text-white">{employerName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Unlock access to message this employer and receive their job offers
              </p>
            </div>
          )}

          {/* Payment Placeholder */}
          <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center">
            <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">Payment integration placeholder</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              In production, payment gateway (Stripe, etc.) would be integrated here
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            Maybe Later
          </button>

          <button
            onClick={handlePurchase}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Unlock className="w-5 h-5" />
            Unlock Access for $14.99
          </button>
        </div>
      </div>
    </div>
  );
}
