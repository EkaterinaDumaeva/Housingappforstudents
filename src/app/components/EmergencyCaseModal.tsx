import { useState } from 'react';
import { AlertTriangle, X, DoorClosed, Home, DollarSign, Shield, Camera, Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyCaseModalProps {
  onClose: () => void;
  onSubmit: (caseData: EmergencyCaseData) => void;
  bookingData?: {
    listingTitle: string;
    hostName: string;
    address: string;
    checkInDate: string;
  };
}

export interface EmergencyCaseData {
  reason: string;
  description: string;
  photos: File[];
  videos: File[];
  contactNumber: string;
  currentLocation?: string;
  needsImmediateRehousing: boolean;
  timestamp: string;
}

const emergencyReasons = [
  {
    id: 'cannot_access',
    icon: DoorClosed,
    title: 'Cannot Access Housing',
    description: 'Host not responding, door locked, or unable to enter',
    severity: 'critical'
  },
  {
    id: 'not_match',
    icon: Home,
    title: 'Housing Does Not Match Listing',
    description: 'Different property, fewer beds, or major discrepancies',
    severity: 'high'
  },
  {
    id: 'unsafe',
    icon: Shield,
    title: 'Unsafe Conditions',
    description: 'Safety hazards, dangerous environment, or health risks',
    severity: 'critical'
  },
  {
    id: 'hidden_fees',
    icon: DollarSign,
    title: 'Different Price or Hidden Fees',
    description: 'Host demanding additional money not in listing',
    severity: 'high'
  },
  {
    id: 'host_unresponsive',
    icon: Phone,
    title: 'Host Not Responding',
    description: 'Cannot reach host and need urgent assistance',
    severity: 'high'
  }
];

export function EmergencyCaseModal({ onClose, onSubmit, bookingData }: EmergencyCaseModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [contactNumber, setContactNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [needsRehousing, setNeedsRehousing] = useState(false);
  const [step, setStep] = useState<'reason' | 'details' | 'confirm'>('reason');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos([...photos, ...files]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos([...videos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedReason || !description || !contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const caseData: EmergencyCaseData = {
      reason: selectedReason,
      description,
      photos,
      videos,
      contactNumber,
      currentLocation,
      needsImmediateRehousing: needsRehousing,
      timestamp: new Date().toISOString()
    };

    onSubmit(caseData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-red-600 text-white p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Emergency Housing Case</h2>
              <p className="text-sm text-red-100">We'll respond immediately to help you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Notice */}
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">
                Priority Support - Response within 30 minutes
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300">
                Our emergency team is standing by. If you need immediate assistance, call support at +1-XXX-XXX-XXXX
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Booking Info */}
          {bookingData && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Booking Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Listing:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{bookingData.listingTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Host:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{bookingData.hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Check-in Date:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {new Date(bookingData.checkInDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Select Reason */}
          {step === 'reason' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">What's the emergency?</h3>

              <div className="space-y-3">
                {emergencyReasons.map((reason) => {
                  const Icon = reason.icon;
                  const isSelected = selectedReason === reason.id;
                  const isCritical = reason.severity === 'critical';

                  return (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? isCritical
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? isCritical
                              ? 'bg-red-600'
                              : 'bg-orange-600'
                            : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                              {reason.title}
                            </h4>
                            {isCritical && isSelected && (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-bold">
                                CRITICAL
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep('details')}
                disabled={!selectedReason}
                className="w-full mt-6 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

              <h3 className="font-bold text-slate-900 dark:text-white">Tell us what happened</h3>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Please provide as many details as possible: what happened, when, what you've tried, etc."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  required
                />
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Photos (Strongly Recommended)
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
                  <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
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
                  Photos help us verify and resolve your case faster
                </p>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Emergency team will call this number
                </p>
              </div>

              {/* Current Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Where are you right now?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="Current location or nearby landmark"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Needs Rehousing */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsRehousing}
                    onChange={(e) => setNeedsRehousing(e.target.checked)}
                    className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                      I need emergency re-housing assistance
                    </div>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Check this if you have nowhere to stay tonight and need immediate help finding alternative housing
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!description || !contactNumber}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Submit
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

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">Ready to Submit Emergency Case</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Our emergency team will review this immediately and contact you within 30 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Issue Type:</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {emergencyReasons.find(r => r.id === selectedReason)?.title}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Evidence:</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {photos.length} photo{photos.length !== 1 ? 's' : ''}, {videos.length} video{videos.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">Contact Number:</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{contactNumber}</div>
                </div>
                {needsRehousing && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                      <Home className="w-4 h-4" />
                      <span>Emergency re-housing requested</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Submit Emergency Case
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
                  Urgent? Call emergency support: <a href="tel:+1-XXX-XXX-XXXX" className="font-semibold text-red-600 dark:text-red-400">+1-XXX-XXX-XXXX</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
