import { useState } from 'react';
import { Shield, FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye, Download } from 'lucide-react';

export interface ExceptionClaim {
  id: string;
  reservationId: string;
  listingTitle: string;
  submittedDate: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  reason: string;
  requestedAmount: number;
  approvedAmount?: number;
  documents: Array<{
    id: string;
    name: string;
    uploadedDate: string;
    type: string;
  }>;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

interface ExceptionClaimStatusProps {
  claims: ExceptionClaim[];
}

export function ExceptionClaimStatus({ claims }: ExceptionClaimStatusProps) {
  const [selectedClaim, setSelectedClaim] = useState<ExceptionClaim | null>(null);

  const getStatusColor = (status: ExceptionClaim['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400';
      case 'under-review':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: ExceptionClaim['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'under-review':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: ExceptionClaim['status']) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'under-review':
        return 'Under Review';
      default:
        return 'Pending Review';
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'visa-denied': 'Visa Denial',
      'medical-emergency': 'Medical Emergency',
      'serious-illness': 'Serious Illness',
      'family-death': 'Death in Family',
      'travel-restrictions': 'Travel Restrictions'
    };
    return labels[reason] || reason;
  };

  if (claims.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-semibold mb-1">No Exception Claims</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You haven't submitted any exception refund requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{claim.listingTitle}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Submitted: {new Date(claim.submittedDate).toLocaleDateString()}
              </p>
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(claim.status)}`}>
              {getStatusIcon(claim.status)}
              {getStatusLabel(claim.status)}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Reason:</span>
              <span className="font-medium text-slate-900 dark:text-white">{getReasonLabel(claim.reason)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Requested Refund:</span>
              <span className="font-medium text-slate-900 dark:text-white">${claim.requestedAmount.toFixed(2)}</span>
            </div>
            {claim.status === 'approved' && claim.approvedAmount !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Approved Amount:</span>
                <span className="font-bold text-green-600 dark:text-green-400">${claim.approvedAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {claim.status === 'approved' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ Your exception request has been approved! The refund will be processed within 5-7 business days.
              </p>
            </div>
          )}

          {claim.status === 'rejected' && claim.reviewNotes && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-1">✗ Request Rejected</p>
              <p className="text-sm text-red-600 dark:text-red-500">{claim.reviewNotes}</p>
            </div>
          )}

          {claim.status === 'under-review' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                ⏳ Your request is currently being reviewed by our support team. You will receive a response within 24-48 hours.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedClaim(claim)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details & Documents
            </button>
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4 sm:p-6 flex items-start justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Exception Claim Details</h2>
                  <p className="text-sm text-white/90">Claim ID: {selectedClaim.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Status */}
              <div className={`rounded-xl p-4 border ${getStatusColor(selectedClaim.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(selectedClaim.status)}
                  <span className="font-bold">Status: {getStatusLabel(selectedClaim.status)}</span>
                </div>
                {selectedClaim.reviewedDate && (
                  <p className="text-sm opacity-90">
                    Reviewed on {new Date(selectedClaim.reviewedDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Claim Information */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Claim Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Listing:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selectedClaim.listingTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Reason:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{getReasonLabel(selectedClaim.reason)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Submitted:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(selectedClaim.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Requested Amount:</span>
                    <span className="font-medium text-slate-900 dark:text-white">${selectedClaim.requestedAmount.toFixed(2)}</span>
                  </div>
                  {selectedClaim.approvedAmount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Approved Amount:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">${selectedClaim.approvedAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Uploaded Documents ({selectedClaim.documents.length})
                </h3>
                <div className="space-y-2">
                  {selectedClaim.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Downloading ${doc.name}...`)}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Notes */}
              {selectedClaim.reviewNotes && (
                <div className={`rounded-xl p-4 border ${
                  selectedClaim.status === 'approved'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    selectedClaim.status === 'approved'
                      ? 'text-green-900 dark:text-green-300'
                      : 'text-red-900 dark:text-red-300'
                  }`}>
                    Review Notes
                  </h3>
                  <p className={`text-sm ${
                    selectedClaim.status === 'approved'
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {selectedClaim.reviewNotes}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedClaim(null)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
