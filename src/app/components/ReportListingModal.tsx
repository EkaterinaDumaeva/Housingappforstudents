import { useState } from 'react';
import { Flag, X, Camera, MapPin, DollarSign, Home, Users, AlertTriangle, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface ReportListingModalProps {
  onClose: () => void;
  onSubmit: (reportData: ReportData) => void;
  listingData: {
    id: string;
    title: string;
    hostName: string;
    address?: string;
    photos?: string[];
  };
}

export interface ReportData {
  reason: string;
  description: string;
  photos: File[];
  additionalInfo?: string;
  timestamp: string;
}

const reportReasons = [
  {
    id: 'wrong_photos',
    icon: ImageIcon,
    title: 'Wrong or Misleading Photos',
    description: 'Photos don\'t match the actual property',
    examples: ['Different room', 'Old/outdated photos', 'Photoshopped images']
  },
  {
    id: 'wrong_address',
    icon: MapPin,
    title: 'Wrong Address or Location',
    description: 'Property is not where listing says it is',
    examples: ['Different neighborhood', 'Wrong city', 'Fake location']
  },
  {
    id: 'unsafe',
    icon: AlertTriangle,
    title: 'Unsafe Conditions',
    description: 'Safety hazards or dangerous environment',
    examples: ['Structural issues', 'No fire safety', 'Unsafe neighborhood']
  },
  {
    id: 'fewer_beds',
    icon: Home,
    title: 'Fewer Beds Than Promised',
    description: 'Not enough sleeping spaces',
    examples: ['Missing beds', 'Different room setup', 'Overcrowded']
  },
  {
    id: 'price_mismatch',
    icon: DollarSign,
    title: 'Different Price or Hidden Fees',
    description: 'Host charging more than listed',
    examples: ['Extra fees not mentioned', 'Higher weekly rate', 'Surprise charges']
  },
  {
    id: 'not_available',
    icon: X,
    title: 'Listing Not Available',
    description: 'Property doesn\'t exist or isn\'t available',
    examples: ['Never existed', 'Already rented', 'Host ghosting']
  },
  {
    id: 'misleading_description',
    icon: AlertTriangle,
    title: 'Misleading Description',
    description: 'Important details are false or missing',
    examples: ['No amenities listed', 'Wrong room type', 'Fake features']
  },
  {
    id: 'gender_policy',
    icon: Users,
    title: 'Gender Policy Mismatch',
    description: 'Different restrictions than advertised',
    examples: ['Listed as mixed but isn\'t', 'Undisclosed restrictions', 'Changed policy']
  }
];

export function ReportListingModal({ onClose, onSubmit, listingData }: ReportListingModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [step, setStep] = useState<'reason' | 'details' | 'confirm'>('reason');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedReason || !description) {
      alert('Please fill in all required fields');
      return;
    }

    const reportData: ReportData = {
      reason: selectedReason,
      description,
      photos,
      additionalInfo,
      timestamp: new Date().toISOString()
    };

    onSubmit(reportData);
  };

  const selectedReasonData = reportReasons.find(r => r.id === selectedReason);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-orange-600 text-white p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Flag className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Report Inaccurate Listing</h2>
              <p className="text-sm text-orange-100">Help keep the platform safe and accurate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Listing Info */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Reporting:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Listing:</span>
                <span className="font-medium text-slate-900 dark:text-white">{listingData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Host:</span>
                <span className="font-medium text-slate-900 dark:text-white">{listingData.hostName}</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select Reason */}
          {step === 'reason' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">What's inaccurate about this listing?</h3>

              <div className="space-y-3">
                {reportReasons.map((reason) => {
                  const Icon = reason.icon;
                  const isSelected = selectedReason === reason.id;

                  return (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-orange-600' : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                            {reason.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {reason.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {reason.examples.map((example, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep('details')}
                disabled={!selectedReason}
                className="w-full mt-6 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep('reason')}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Back
                </button>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {selectedReasonData && <selectedReasonData.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                    {selectedReasonData?.title}
                  </h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {selectedReasonData?.description}
                </p>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white">Provide details</h3>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  What exactly is wrong? *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Be as specific as possible. What did you expect vs. what did you find? Include dates if relevant."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                />
              </div>

              {/* Photo Evidence */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Photo Evidence (Recommended)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all">
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Photos showing the discrepancy help admins verify your report
                </p>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Additional Information
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                  placeholder="Any other relevant details, communication with host, etc."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* What Happens Next */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
                  What happens after you report:
                </h4>
                <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Admin reviews your report within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Host may be contacted for clarification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>If valid, listing may be removed or host warned</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>You'll be notified of the outcome</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!description}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Report
                </button>
                <button
                  onClick={() => setStep('reason')}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep('details')}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Back
                </button>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Flag className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-2">Ready to Submit Report</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Your report will be reviewed by our moderation team. False reports may result in account restrictions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Issue Type:</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedReasonData?.title}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Your Description:</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {description}
                  </div>
                </div>
                {photos.length > 0 && (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Evidence:</div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {photos.length} photo{photos.length !== 1 ? 's' : ''} attached
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setStep('details')}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Edit
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  By submitting, you confirm this report is accurate and made in good faith
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
