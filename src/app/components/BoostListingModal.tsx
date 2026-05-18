import { useState } from 'react';
import { X, TrendingUp, Calendar, DollarSign, CheckCircle, Star, AlertCircle, BarChart3 } from 'lucide-react';

interface BoostListingModalProps {
  onClose: () => void;
  listings: { id: string; title: string; rating: number; isActive: boolean }[];
  onBoost: (boost: BoostData) => void;
}

export interface BoostData {
  id: string;
  listingId: string;
  duration: '1day' | '1week' | '1month';
  price: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'expired';
  impressions?: number;
  clicks?: number;
}

export function BoostListingModal({ onClose, listings, onBoost }: BoostListingModalProps) {
  const [step, setStep] = useState<'select' | 'plan' | 'payment' | 'success'>('select');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<'1day' | '1week' | '1month'>('1week');
  const [submitted, setSubmitted] = useState(false);

  const plans = [
    {
      duration: '1day' as const,
      label: '1 Day Boost',
      price: 4.99,
      description: 'Perfect for quick visibility',
      features: ['24 hours of top placement', 'Sponsored badge', 'Priority in search results']
    },
    {
      duration: '1week' as const,
      label: '1 Week Boost',
      price: 19.99,
      description: 'Most popular option',
      popular: true,
      features: ['7 days of top placement', 'Sponsored badge', 'Priority in search results', 'Weekly performance report']
    },
    {
      duration: '1month' as const,
      label: '1 Month Boost',
      price: 59.99,
      description: 'Best value for serious hosts',
      features: ['30 days of top placement', 'Sponsored badge', 'Priority in search results', 'Weekly performance reports', 'Extended analytics']
    }
  ];

  const selectedListing = listings.find(l => l.id === selectedListingId);
  const selectedPlan = plans.find(p => p.duration === selectedDuration);

  const handleBoost = () => {
    if (!selectedListingId || !selectedDuration) return;

    const startDate = new Date();
    const endDate = new Date();

    switch (selectedDuration) {
      case '1day':
        endDate.setDate(endDate.getDate() + 1);
        break;
      case '1week':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case '1month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
    }

    const boost: BoostData = {
      id: `boost-${Date.now()}`,
      listingId: selectedListingId,
      duration: selectedDuration,
      price: selectedPlan?.price || 0,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      impressions: 0,
      clicks: 0
    };

    onBoost(boost);
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
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Boost Activated!</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Your listing is now boosted and will appear at the top of search results.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Track your boost performance in the Analytics tab
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-7 h-7" />
              Boost Your Listing
            </h2>
            <p className="text-sm text-white/90 mt-1">
              {step === 'select' && 'Select a listing to boost'}
              {step === 'plan' && 'Choose your boost plan'}
              {step === 'payment' && 'Complete your purchase'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-2">
            {['select', 'plan', 'payment'].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === s ? 'bg-purple-600 text-white' :
                  ['select', 'plan', 'payment'].indexOf(step) > idx ? 'bg-green-500 text-white' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {['select', 'plan', 'payment'].indexOf(step) > idx ? '✓' : idx + 1}
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    ['select', 'plan', 'payment'].indexOf(step) > idx ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Select Listing */}
          {step === 'select' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">How Sponsored Listings Work</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Boosted listings appear at the top of search results</li>
                      <li>All boosted listings rotate fairly among active boosts</li>
                      <li>Higher-rated and more reliable hosts receive stronger placement</li>
                      <li>All sponsored listings are clearly labeled as "Sponsored"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Listing to Boost</h3>

              {listings.length > 0 ? (
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <button
                      key={listing.id}
                      onClick={() => setSelectedListingId(listing.id)}
                      className={`w-full text-left p-4 border-2 rounded-xl transition-all ${
                        selectedListingId === listing.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{listing.title}</h4>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-slate-600 dark:text-slate-400">{listing.rating.toFixed(1)}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              listing.isActive
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}>
                              {listing.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        {selectedListingId === listing.id && (
                          <CheckCircle className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-400">No active listings available to boost</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Plan */}
          {step === 'plan' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Boosting: {selectedListing?.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Choose your boost duration</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <button
                    key={plan.duration}
                    onClick={() => setSelectedDuration(plan.duration)}
                    className={`relative p-6 border-2 rounded-xl text-left transition-all ${
                      selectedDuration === plan.duration
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        ${plan.price}
                      </div>
                      <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {plan.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {plan.description}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {selectedDuration === plan.duration && (
                      <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          Selected
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Ranking Factors Info */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Your Sponsored Placement Score
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                  Your placement in sponsored results is affected by:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Host Rating: {selectedListing?.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Response Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Reliability Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Active Boost</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && selectedPlan && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Listing:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedListing?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Boost Plan:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedPlan.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Duration:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedPlan.duration === '1day' ? '1 Day' : selectedPlan.duration === '1week' ? '7 Days' : '30 Days'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-purple-200 dark:border-purple-800 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">${selectedPlan.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Placeholder */}
              <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center">
                <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">Payment integration placeholder</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  In production, payment gateway (Stripe, etc.) would be integrated here
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Your boost will activate immediately after payment
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'select') {
                onClose();
              } else if (step === 'plan') {
                setStep('select');
              } else if (step === 'payment') {
                setStep('plan');
              }
            }}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            {step === 'select' ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => {
              if (step === 'select' && selectedListingId) {
                setStep('plan');
              } else if (step === 'plan') {
                setStep('payment');
              } else if (step === 'payment') {
                handleBoost();
              }
            }}
            disabled={step === 'select' && !selectedListingId}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              (step === 'select' && !selectedListingId)
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg'
            }`}
          >
            {step === 'payment' ? 'Complete Purchase' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
