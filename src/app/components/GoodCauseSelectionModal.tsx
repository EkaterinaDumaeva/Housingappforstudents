import { useState } from 'react';
import { X, Heart, DollarSign, ChevronRight, Sparkles, Trees, Waves, Dog, Users, UtensilsCrossed, Brain, AlertTriangle, Home } from 'lucide-react';

export interface GoodCause {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

interface GoodCauseSelectionModalProps {
  rewardAmount: number;
  onClose: () => void;
  onConfirm: (causeId: string) => void;
}

const goodCauses: GoodCause[] = [
  {
    id: 'animal-rescue',
    name: 'Animal Rescue & Homeless Dogs',
    description: 'Help rescue and care for abandoned animals finding them loving homes',
    icon: <Dog className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    category: 'Animals'
  },
  {
    id: 'ocean-cleanup',
    name: 'Ocean & Environment Cleanup',
    description: 'Support efforts to clean our oceans and protect marine life',
    icon: <Waves className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    category: 'Environment'
  },
  {
    id: 'tree-planting',
    name: 'Tree Planting & Reforestation',
    description: 'Plant trees and restore forests to combat climate change',
    icon: <Trees className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    category: 'Environment'
  },
  {
    id: 'student-support',
    name: 'Student Emergency Support Fund',
    description: 'Help students in need with emergency financial assistance',
    icon: <Users className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    category: 'Education'
  },
  {
    id: 'food-support',
    name: 'Food Support & Community Kitchens',
    description: 'Provide meals to those experiencing food insecurity',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    color: 'from-red-500 to-rose-500',
    category: 'Community'
  },
  {
    id: 'mental-health',
    name: 'Mental Health Support',
    description: 'Fund mental health resources and counseling services',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    category: 'Health'
  },
  {
    id: 'disaster-relief',
    name: 'Disaster Relief',
    description: 'Provide immediate aid to communities affected by disasters',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    category: 'Emergency'
  },
  {
    id: 'local-community',
    name: 'Local Community Support',
    description: 'Support local initiatives and community development projects',
    icon: <Home className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-500',
    category: 'Community'
  }
];

export function GoodCauseSelectionModal({
  rewardAmount,
  onClose,
  onConfirm
}: GoodCauseSelectionModalProps) {
  const [selectedCause, setSelectedCause] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedCause) {
      onConfirm(selectedCause);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-3 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Make an Impact</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Choose Where to Help</h2>
            <p className="text-pink-100">
              Your <span className="font-bold">${rewardAmount.toFixed(2)}</span> can make a real difference
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-start gap-3">
            <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-300 mb-1">100% goes to the cause</p>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Your full reward amount will be transferred to support the cause you select
              </p>
            </div>
          </div>

          {/* Causes Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {goodCauses.map((cause) => (
              <button
                key={cause.id}
                onClick={() => setSelectedCause(cause.id)}
                className={`p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                  selectedCause === cause.id
                    ? 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {selectedCause === cause.id && (
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 bg-gradient-to-br ${cause.color} rounded-full flex items-center justify-center`}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${cause.color} text-white`}>
                    {cause.icon}
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{cause.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{cause.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${cause.color} text-white font-medium`}>
                    {cause.category}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-4 pb-2 -mx-6 px-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleConfirm}
              disabled={!selectedCause}
              className={`w-full px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedCause
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-600/25'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>
                {selectedCause
                  ? `Support ${goodCauses.find(c => c.id === selectedCause)?.name}`
                  : 'Select a cause to continue'}
              </span>
              {selectedCause && <ChevronRight className="w-5 h-5" />}
            </button>

            {selectedCause && (
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-green-600 dark:text-green-400">${rewardAmount.toFixed(2)}</span> will be sent to this cause
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
