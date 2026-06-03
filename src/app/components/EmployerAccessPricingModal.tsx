import { X, DollarSign, Lock, CheckCircle, AlertCircle, Shield, MessageCircle, FileCheck, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface EmployerAccessPricingModalProps {
  onClose: () => void;
}

type Step = 'pricing' | 'whats-included' | 'one-offer-rule' | 'payment-locked';

export function EmployerAccessPricingModal({ onClose }: EmployerAccessPricingModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('pricing');

  const renderPricingStep = () => (
    <div className="space-y-6">
      {/* Locked Badge */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-amber-200">Future Feature</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            This feature is currently unavailable while we establish verified employer partnerships.
          </p>
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-center text-white">
        <div className="mb-4">
          <DollarSign className="w-16 h-16 mx-auto opacity-90" />
        </div>
        <div className="text-6xl font-bold mb-2">$300</div>
        <div className="text-xl font-medium opacity-90">One-Time Access Fee</div>
        <div className="text-sm opacity-75 mt-2">Employer Connection Process</div>
      </div>

      {/* What This Includes */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">What's Included</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">Access to employer connection process</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">Protected in-platform communication</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">One valid job offer</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">Job offer tracking and status updates</span>
          </li>
        </ul>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Important Information
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
          <li>• Employer contact information remains protected</li>
          <li>• All communication happens within the platform</li>
          <li>• You can only have one active job offer at a time</li>
          <li>• Email and phone numbers are not publicly displayed</li>
        </ul>
      </div>

      <button
        onClick={() => setCurrentStep('whats-included')}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Learn More
      </button>
    </div>
  );

  const renderWhatsIncludedStep = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep('pricing')}
        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
      >
        ← Back to Pricing
      </button>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        What's Included with Employer Access
      </h3>

      {/* Feature Cards */}
      <div className="space-y-4">
        {/* Protected Communication */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Protected Communication
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Message approved employers directly within the platform. Email and phone numbers remain private for your safety.
              </p>
            </div>
          </div>
        </div>

        {/* Job Offer */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                One Valid Job Offer
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive, review, and accept one formal job offer through the platform. You can decline and receive another offer if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Protection */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Safety & Privacy Protection
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your personal contact information stays private. Employers cannot access your email or phone directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('one-offer-rule')}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Understand the One Offer Rule
      </button>
    </div>
  );

  const renderOneOfferRuleStep = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep('whats-included')}
        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
      >
        ← Back
      </button>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              One Active Job Offer Rule
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              To ensure fairness and commitment, you can only have one active job offer at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            ✓ You Can:
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li>• Receive and review one job offer</li>
            <li>• Accept or decline the offer</li>
            <li>• Decline to receive another offer</li>
            <li>• Communicate with the employer before accepting</li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
            ✗ You Cannot:
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
            <li>• Hold multiple active job offers simultaneously</li>
            <li>• Receive new offers while one is already accepted</li>
            <li>• Share offers with others</li>
            <li>• Cancel after signing without valid reason</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Why This Rule Exists:
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            This protects both participants and employers from offer hoarding, last-minute cancellations, and unfair practices. It ensures serious commitments on both sides.
          </p>
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('payment-locked')}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderPaymentLockedStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
        <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Feature Currently Unavailable
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We are still establishing partnerships with verified employers. Employer access will be available once we have approved employer partners on the platform.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Want to be notified?
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
          Join the waitlist to receive an email when the employer marketplace launches.
        </p>
        <button
          onClick={() => {
            alert('You have been added to the employer access waitlist!');
            onClose();
          }}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Join Waitlist
        </button>
      </div>

      <button
        onClick={onClose}
        className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:underline"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {currentStep === 'pricing' && 'Employer Access Pricing'}
            {currentStep === 'whats-included' && "What's Included"}
            {currentStep === 'one-offer-rule' && 'One Active Offer Rule'}
            {currentStep === 'payment-locked' && 'Feature Locked'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {currentStep === 'pricing' && renderPricingStep()}
          {currentStep === 'whats-included' && renderWhatsIncludedStep()}
          {currentStep === 'one-offer-rule' && renderOneOfferRuleStep()}
          {currentStep === 'payment-locked' && renderPaymentLockedStep()}
        </div>
      </div>
    </div>
  );
}
