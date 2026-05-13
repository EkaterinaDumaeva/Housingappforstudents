import { useState, useEffect } from 'react';
import { X, FileText, CheckCircle, AlertTriangle, ScrollText } from 'lucide-react';

interface AgreementModalProps {
  rentalAgreement?: string;
  houseRules?: string;
  listingTitle: string;
  hostName: string;
  onAgree: () => void;
  onDecline: () => void;
}

export function AgreementModal({
  rentalAgreement,
  houseRules,
  listingTitle,
  hostName,
  onAgree,
  onDecline
}: AgreementModalProps) {
  const [currentStep, setCurrentStep] = useState<'agreement' | 'rules' | 'confirm'>(
    rentalAgreement ? 'agreement' : houseRules ? 'rules' : 'confirm'
  );
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [hasReadRules, setHasReadRules] = useState(false);
  const [agreedToAgreement, setAgreedToAgreement] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'agreement' | 'rules') => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (isAtBottom) {
      if (type === 'agreement') {
        setHasReadAgreement(true);
      } else {
        setHasReadRules(true);
      }
    }
  };

  const handleNext = () => {
    if (currentStep === 'agreement' && houseRules) {
      setCurrentStep('rules');
    } else {
      setCurrentStep('confirm');
    }
  };

  const canProceed = () => {
    if (currentStep === 'agreement') {
      return hasReadAgreement && agreedToAgreement;
    } else if (currentStep === 'rules') {
      return hasReadRules && agreedToRules;
    } else if (currentStep === 'confirm') {
      const agreementOk = !rentalAgreement || (hasReadAgreement && agreedToAgreement);
      const rulesOk = !houseRules || (hasReadRules && agreedToRules);
      return agreementOk && rulesOk;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Review & Accept Terms</h2>
              </div>
              <p className="text-sm text-white/90">
                <strong>Property:</strong> {listingTitle}
              </p>
              <p className="text-sm text-white/90">
                <strong>Host:</strong> {hostName}
              </p>
            </div>
            <button
              onClick={onDecline}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Decline and cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex-1 h-1 rounded-full transition-all ${
              currentStep === 'agreement' || currentStep === 'rules' || currentStep === 'confirm'
                ? 'bg-white'
                : 'bg-white/30'
            }`} />
            {houseRules && (
              <div className={`flex-1 h-1 rounded-full transition-all ${
                currentStep === 'rules' || currentStep === 'confirm'
                  ? 'bg-white'
                  : 'bg-white/30'
              }`} />
            )}
            <div className={`flex-1 h-1 rounded-full transition-all ${
              currentStep === 'confirm'
                ? 'bg-white'
                : 'bg-white/30'
            }`} />
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold mb-1">Important - Please Read Carefully</p>
              <p>
                You must read and agree to all terms before proceeding with your reservation.
                By agreeing, you are entering into a legally binding contract.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Rental Agreement Step */}
          {currentStep === 'agreement' && rentalAgreement && (
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rental Agreement</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {hasReadAgreement ? 'Review complete' : 'Scroll to the bottom to continue'}
                  </p>
                </div>
              </div>

              <div
                onScroll={(e) => handleScroll(e, 'agreement')}
                className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4"
              >
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300">
                    {rentalAgreement}
                  </pre>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <input
                  type="checkbox"
                  id="agree-agreement"
                  checked={agreedToAgreement}
                  onChange={(e) => setAgreedToAgreement(e.target.checked)}
                  disabled={!hasReadAgreement}
                  className="mt-1 w-5 h-5 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label
                  htmlFor="agree-agreement"
                  className={`text-sm font-semibold cursor-pointer ${
                    hasReadAgreement
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  I have read and agree to the terms and conditions of this Rental Agreement
                  {!hasReadAgreement && (
                    <span className="block text-xs font-normal text-orange-600 dark:text-orange-400 mt-1">
                      Please scroll to the bottom to enable this checkbox
                    </span>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* House Rules Step */}
          {currentStep === 'rules' && houseRules && (
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">House Rules</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {hasReadRules ? 'Review complete' : 'Scroll to the bottom to continue'}
                  </p>
                </div>
              </div>

              <div
                onScroll={(e) => handleScroll(e, 'rules')}
                className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4"
              >
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300">
                    {houseRules}
                  </pre>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <input
                  type="checkbox"
                  id="agree-rules"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  disabled={!hasReadRules}
                  className="mt-1 w-5 h-5 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label
                  htmlFor="agree-rules"
                  className={`text-sm font-semibold cursor-pointer ${
                    hasReadRules
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  I have read and agree to follow all House Rules during my stay
                  {!hasReadRules && (
                    <span className="block text-xs font-normal text-orange-600 dark:text-orange-400 mt-1">
                      Please scroll to the bottom to enable this checkbox
                    </span>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirm' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Review Complete
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  You have reviewed and agreed to all the required documents.
                  Click "I Agree & Continue" below to proceed with your reservation.
                </p>

                <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Summary of Agreements:</h4>

                  {rentalAgreement && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Rental Agreement</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          You have read and agreed to the rental agreement terms
                        </p>
                      </div>
                    </div>
                  )}

                  {houseRules && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">House Rules</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          You have read and agreed to follow all house rules
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      By proceeding, you acknowledge that you have read, understood, and agree to be bound by these terms.
                      This creates a legally binding contract between you and the host.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={onDecline}
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Decline & Cancel
          </button>

          <div className="flex gap-3">
            {currentStep !== 'confirm' ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={onAgree}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                I Agree & Continue to Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
