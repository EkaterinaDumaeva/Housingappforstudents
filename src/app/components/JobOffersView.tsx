import { useState } from 'react';
import { Briefcase, Calendar, MapPin, DollarSign, FileText, Upload, CheckCircle, X, Clock, ShieldCheck } from 'lucide-react';

export interface JobOffer {
  id: string;
  employerName: string;
  employerPhoto?: string;
  employerVerified?: boolean;
  jobTitle: string;
  salary: string;
  startDate: string;
  endDate: string;
  location: string;
  additionalDetails: string;
  offerDocument?: string;
  sentDate: string;
  status: 'pending' | 'accepted' | 'declined';
  signedDocument?: string;
}

interface JobOffersViewProps {
  offers: JobOffer[];
  onUploadSignedOffer: (offerId: string, signedDocument: string) => void;
  onDeclineOffer: (offerId: string) => void;
}

export function JobOffersView({ offers, onUploadSignedOffer, onDeclineOffer }: JobOffersViewProps) {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingOfferId, setUploadingOfferId] = useState<string | null>(null);

  const handleUploadClick = (offer: JobOffer) => {
    setUploadingOfferId(offer.id);
    setShowUploadModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingOfferId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onUploadSignedOffer(uploadingOfferId, content);
        setShowUploadModal(false);
        setUploadingOfferId(null);
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const pendingOffers = offers.filter(o => o.status === 'pending');
  const acceptedOffers = offers.filter(o => o.status === 'accepted');
  const declinedOffers = offers.filter(o => o.status === 'declined');

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Job Offers</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review and respond to job offers from employers
          </p>
        </div>

        {/* Pending Offers */}
        {pendingOffers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Offers ({pendingOffers.length})
            </h3>
            <div className="space-y-4">
              {pendingOffers.map((offer) => (
                <div key={offer.id} className="bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      {offer.employerPhoto ? (
                        <img
                          src={offer.employerPhoto}
                          alt={offer.employerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{offer.jobTitle}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{offer.employerName}</p>
                          {offer.employerVerified && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold">
                      Pending Response
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white">{offer.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{offer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                        {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        Sent {formatDate(offer.sentDate)}
                      </span>
                    </div>
                  </div>

                  {offer.additionalDetails && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Additional Details:</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{offer.additionalDetails}</p>
                    </div>
                  )}

                  {offer.offerDocument && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                          Formal offer letter attached
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => handleUploadClick(offer)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Upload Signed Offer</span>
                      <span className="sm:hidden">Upload</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to decline this offer?')) {
                          onDeclineOffer(offer.id);
                        }
                      }}
                      className="px-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="px-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                    >
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Offers */}
        {acceptedOffers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Accepted Offers ({acceptedOffers.length})
            </h3>
            <div className="space-y-4">
              {acceptedOffers.map((offer) => (
                <div key={offer.id} className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {offer.employerPhoto ? (
                        <img
                          src={offer.employerPhoto}
                          alt={offer.employerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{offer.jobTitle}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{offer.employerName}</p>
                          {offer.employerVerified && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                              <ShieldCheck className="w-3 h-3" />
                              <span className="text-xs font-semibold">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Accepted
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Signed offer submitted successfully</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {offers.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Job Offers Yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Job offers from employers will appear here
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Upload className="w-6 h-6" />
                <h2 className="text-xl font-bold">Upload Signed Offer</h2>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Please upload the signed job offer document. Accepted formats: PDF, DOC, DOCX, or TXT.
              </p>

              <label className="block">
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    Click to upload signed document
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    PDF, DOC, DOCX, or TXT
                  </p>
                </div>
              </label>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadingOfferId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4 sm:p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedOffer.jobTitle}</h2>
                <p className="text-sm text-white/90">{selectedOffer.employerName}</p>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Salary</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedOffer.salary}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Location</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{selectedOffer.location}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Start Date</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedOffer.startDate)}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">End Date</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedOffer.endDate)}</div>
                </div>
              </div>

              {selectedOffer.additionalDetails && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Additional Details</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedOffer.additionalDetails}
                  </div>
                </div>
              )}

              {selectedOffer.offerDocument && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-300">Formal Offer Letter</span>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200 max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {selectedOffer.offerDocument}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedOffer(null)}
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
