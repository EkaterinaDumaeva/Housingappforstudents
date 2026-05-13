import { useState } from 'react';
import { X, AlertTriangle, Calendar, DollarSign, Shield, Info, FileText } from 'lucide-react';

interface CancellationModalProps {
  onClose: () => void;
  onCancel: (reason: string, requestException: boolean) => void;
  onRequestException: (reason: string, proofFiles: File[]) => void;
  reservation: {
    id: string;
    listingTitle: string;
    startDate: string;
    endDate: string;
    price: number;
    nights: number;
    hostName?: string;
    participantName?: string;
  };
  userType: 'participant' | 'host';
}

export function CancellationModal({ onClose, onCancel, onRequestException, reservation, userType }: CancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showExceptionFlow, setShowExceptionFlow] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  const daysUntilMoveIn = Math.ceil(
    (new Date(reservation.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const participantReasons = [
    { value: 'change-of-plans', label: 'Change of Plans' },
    { value: 'found-alternative', label: 'Found Alternative Housing' },
    { value: 'visa-denied', label: 'Visa Denied (Exception Eligible)' },
    { value: 'medical-emergency', label: 'Medical Emergency (Exception Eligible)' },
    { value: 'family-emergency', label: 'Family Emergency (Exception Eligible)' },
    { value: 'travel-restrictions', label: 'Emergency Travel Restrictions (Exception Eligible)' },
    { value: 'other', label: 'Other Reason' }
  ];

  const hostReasons = [
    { value: 'property-damage', label: 'Property Damage or Emergency Repair' },
    { value: 'safety-concern', label: 'Safety or Security Concern' },
    { value: 'legal-issue', label: 'Legal or Compliance Issue' },
    { value: 'force-majeure', label: 'Force Majeure Event' },
    { value: 'other-emergency', label: 'Other Emergency Situation' }
  ];

  const reasons = userType === 'participant' ? participantReasons : hostReasons;

  const getRefundInfo = () => {
    if (userType === 'host') {
      return {
        amount: reservation.price * reservation.nights,
        percentage: 100,
        message: 'Participant will receive a full refund',
        warning: 'This cancellation will negatively impact your host reliability score'
      };
    }

    if (daysUntilMoveIn > 30) {
      return {
        amount: reservation.price * reservation.nights,
        percentage: 100,
        message: 'You will receive a full refund'
      };
    } else if (daysUntilMoveIn >= 14) {
      const refundAmount = (reservation.price * reservation.nights) * 0.5;
      return {
        amount: refundAmount,
        percentage: 50,
        message: 'You will receive a 50% partial refund'
      };
    } else {
      return {
        amount: 0,
        percentage: 0,
        message: 'Your deposit is non-refundable',
        canRequestException: true
      };
    }
  };

  const refundInfo = getRefundInfo();
  const isExceptionEligible = selectedReason && ['visa-denied', 'medical-emergency', 'family-emergency', 'travel-restrictions'].includes(selectedReason);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofFiles(Array.from(e.target.files));
    }
  };

  const handleSubmitException = () => {
    if (exceptionReason && proofFiles.length > 0) {
      onRequestException(exceptionReason, proofFiles);
    }
  };

  const handleConfirmCancellation = () => {
    const reason = selectedReason === 'other' ? customReason : selectedReason;
    onCancel(reason, false);
  };

  if (showExceptionFlow) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 flex items-start justify-between sticky top-0">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Request Exception Refund</h2>
                <p className="text-sm text-white/90">Upload supporting documents for review</p>
              </div>
            </div>
            <button
              onClick={() => setShowExceptionFlow(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Exception Review Process</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Your request will be reviewed by our support team within 24-48 hours. You may receive a full refund if your documentation is approved.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Exception Reason
              </label>
              <select
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a reason...</option>
                <option value="visa-denied">Visa Denial</option>
                <option value="medical-emergency">Medical Emergency</option>
                <option value="serious-illness">Serious Illness</option>
                <option value="family-death">Death in Immediate Family</option>
                <option value="travel-restrictions">Emergency Travel Restrictions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Upload Supporting Documents
              </label>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                Required: Official documents such as visa denial letter, medical certificate, death certificate, government travel advisory, etc.
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {proofFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {proofFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1">{file.name}</span>
                      <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmitException}
                disabled={!exceptionReason || proofFiles.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Submit Exception Request
              </button>
              <button
                onClick={() => setShowExceptionFlow(false)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm sm:text-base"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 flex items-start justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Cancel Reservation</h2>
              <p className="text-sm text-white/90">{reservation.listingTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Reservation Details */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Reservation Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Check-in Date:</span>
                <span className="font-medium text-slate-900 dark:text-white">{new Date(reservation.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Check-out Date:</span>
                <span className="font-medium text-slate-900 dark:text-white">{new Date(reservation.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Days until move-in:</span>
                <span className="font-medium text-slate-900 dark:text-white">{daysUntilMoveIn} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Paid:</span>
                <span className="font-medium text-slate-900 dark:text-white">${reservation.price * reservation.nights}</span>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className={`rounded-xl p-4 border ${
            refundInfo.percentage === 100
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : refundInfo.percentage > 0
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              <DollarSign className={`w-5 h-5 mt-0.5 ${
                refundInfo.percentage === 100
                  ? 'text-green-600 dark:text-green-400'
                  : refundInfo.percentage > 0
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`} />
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  refundInfo.percentage === 100
                    ? 'text-green-900 dark:text-green-300'
                    : refundInfo.percentage > 0
                    ? 'text-yellow-900 dark:text-yellow-300'
                    : 'text-red-900 dark:text-red-300'
                }`}>
                  Refund: ${refundInfo.amount.toFixed(2)} ({refundInfo.percentage}%)
                </h3>
                <p className={`text-sm ${
                  refundInfo.percentage === 100
                    ? 'text-green-700 dark:text-green-400'
                    : refundInfo.percentage > 0
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {refundInfo.message}
                </p>
                {refundInfo.warning && (
                  <p className="text-sm text-red-700 dark:text-red-400 mt-2 font-medium">
                    ⚠️ {refundInfo.warning}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Reason for Cancellation {userType === 'host' && <span className="text-red-500">*Required</span>}
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              required
            >
              <option value="">Select a reason...</option>
              {reasons.map((reason) => (
                <option key={reason.value} value={reason.value}>{reason.label}</option>
              ))}
            </select>

            {selectedReason === 'other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please explain your reason..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            )}

            {isExceptionEligible && (
              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                  ✓ This reason may qualify for a full refund exception. You can upload supporting documents to request a review.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {(refundInfo.canRequestException || isExceptionEligible) && userType === 'participant' && (
              <button
                onClick={() => setShowExceptionFlow(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Request Exception Refund
              </button>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirmCancellation}
                disabled={!selectedReason || (selectedReason === 'other' && !customReason)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm sm:text-base"
              >
                Keep Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
