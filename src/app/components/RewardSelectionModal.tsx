import { useState } from 'react';
import { X, DollarSign, Heart, Sparkles, ChevronRight } from 'lucide-react';

interface RewardSelectionModalProps {
  taskTitle: string;
  rewardAmount: number;
  onClose: () => void;
  onCashOut: () => void;
  onSupportCause: () => void;
}

export function RewardSelectionModal({
  taskTitle,
  rewardAmount,
  onClose,
  onCashOut,
  onSupportCause
}: RewardSelectionModalProps) {
  const [selectedOption, setSelectedOption] = useState<'cashout' | 'cause' | null>(null);

  const handleConfirm = () => {
    if (selectedOption === 'cashout') {
      onCashOut();
    } else if (selectedOption === 'cause') {
      onSupportCause();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Task Approved!</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Your Reward is Ready</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{taskTitle}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Reward Amount Display */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-center border-2 border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">You earned</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-5xl font-bold text-green-600 dark:text-green-400">
                {rewardAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">
              Great work! Now choose what to do with it.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">What would you like to do?</p>

            {/* Cash Out Option */}
            <button
              onClick={() => setSelectedOption('cashout')}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                selectedOption === 'cashout'
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedOption === 'cashout'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Cash Out</h3>
                    {selectedOption === 'cashout' && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receive the money directly to your linked payment account
                  </p>
                </div>
              </div>
            </button>

            {/* Support a Cause Option */}
            <button
              onClick={() => setSelectedOption('cause')}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                selectedOption === 'cause'
                  ? 'border-pink-300 dark:border-pink-700 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {selectedOption === 'cause' && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedOption === 'cause'
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Give It Forward</h3>
                    {selectedOption === 'cause' && (
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Support a good cause and make a positive impact
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-pink-600 dark:text-pink-400">
                    <Heart className="w-3 h-3" />
                    <span>Help where it matters most</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Info Banner */}
          {selectedOption === 'cause' && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <p className="text-sm text-purple-900 dark:text-purple-300">
                <strong>You'll be able to choose:</strong> Animal rescue, ocean cleanup, tree planting, student support, and more meaningful causes.
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            disabled={!selectedOption}
            className={`w-full px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              selectedOption
                ? selectedOption === 'cause'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-600/25'
                  : 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/25'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <span>
              {selectedOption === 'cashout' && 'Continue to Cash Out'}
              {selectedOption === 'cause' && 'Choose a Cause'}
              {!selectedOption && 'Select an option to continue'}
            </span>
            {selectedOption && <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Note */}
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            You can always change your mind later in your reward settings
          </p>
        </div>
      </div>
    </div>
  );
}
