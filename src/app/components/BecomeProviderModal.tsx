import { useState } from 'react';
import { X, Upload, CheckCircle, User, Building2, GraduationCap, Home, Briefcase, Store, ChevronRight, AlertCircle } from 'lucide-react';

interface BecomeProviderModalProps {
  onClose: () => void;
  onSubmit: (application: ProviderApplication) => void;
}

export type ProviderType = 'individual' | 'business' | 'student' | 'host_service' | 'employer_service' | 'local_provider';

export type ServiceCategory =
  | 'scholarships'
  | 'tax_help'
  | 'sim_cards'
  | 'bedding_kits'
  | 'airport_transfers'
  | 'local_transfers'
  | 'student_discounts'
  | 'travel_ideas'
  | 'group_trips'
  | 'events'
  | 'local_support'
  | 'cleaning'
  | 'handyman'
  | 'translation'
  | 'arrival_support'
  | 'housing_inspection'
  | 'other';

export interface ProviderApplication {
  providerType: ProviderType;
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  serviceCategory: ServiceCategory;
  serviceArea: string;
  description: string;
  pricing: string;
  availability: string;
  photos: File[];
  videos: File[];
  website?: string;
  socialMedia?: string;
  businessLicense?: File;
  idVerification?: File;
  agreeToTerms: boolean;

  // Dynamic fields based on service type
  transferPickupArea?: string;
  transferDropoffArea?: string;
  vehicleType?: string;
  seatsAvailable?: number;
  pricePerRide?: number;

  beddingItemsIncluded?: string;
  deliveryAvailable?: boolean;
  pickupLocation?: string;

  taxServiceType?: string;
  consultationFormat?: string;
  credentials?: string;

  eventDate?: string;
  eventLocation?: string;
  capacity?: number;
  ticketPrice?: string;

  tripDestination?: string;
  tripDate?: string;
  tripCost?: string;
  spotsAvailable?: number;
  transportationPlan?: string;
  meetingPoint?: string;

  discountDetails?: string;
  validDates?: string;
  redemptionInstructions?: string;
}

export function BecomeProviderModal({ onClose, onSubmit }: BecomeProviderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [providerType, setProviderType] = useState<ProviderType | null>(null);
  const [formData, setFormData] = useState<Partial<ProviderApplication>>({
    photos: [],
    videos: [],
    agreeToTerms: false,
  });
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const providerTypes = [
    { id: 'individual' as ProviderType, name: 'Individual Provider', icon: User, desc: 'Offer services as an individual' },
    { id: 'business' as ProviderType, name: 'Business Provider', icon: Building2, desc: 'Registered business offering services' },
    { id: 'student' as ProviderType, name: 'Student Provider', icon: GraduationCap, desc: 'Student offering peer support or services' },
    { id: 'host_service' as ProviderType, name: 'Host Offering Service', icon: Home, desc: 'Housing host offering additional services' },
    { id: 'employer_service' as ProviderType, name: 'Employer Offering Service', icon: Briefcase, desc: 'Employer providing extra support' },
    { id: 'local_provider' as ProviderType, name: 'Local Service Provider', icon: Store, desc: 'Local business or community service' },
  ];

  const serviceCategories = [
    { id: 'scholarships', name: 'Scholarships' },
    { id: 'tax_help', name: 'Tax Help' },
    { id: 'sim_cards', name: 'SIM Cards / Phone Plans' },
    { id: 'bedding_kits', name: 'Bedding / Starter Kits' },
    { id: 'airport_transfers', name: 'Airport Transfers' },
    { id: 'local_transfers', name: 'Local Transfers' },
    { id: 'student_discounts', name: 'Student Discounts' },
    { id: 'travel_ideas', name: 'Travel Ideas' },
    { id: 'group_trips', name: 'Group Trips' },
    { id: 'events', name: 'Events' },
    { id: 'local_support', name: 'Local Support' },
    { id: 'cleaning', name: 'Cleaning Services' },
    { id: 'handyman', name: 'Handyman / Repair Help' },
    { id: 'translation', name: 'Translation / Document Help' },
    { id: 'arrival_support', name: 'Arrival Support' },
    { id: 'housing_inspection', name: 'Housing Inspection Services' },
    { id: 'other', name: 'Other Services' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = formData.photos || [];

    if (currentPhotos.length + files.length > 10) {
      alert('Maximum 10 photos allowed');
      return;
    }

    setFormData({ ...formData, photos: [...currentPhotos, ...files] });

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...(formData.photos || [])];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });

    const newPreviews = [...photoPreview];
    newPreviews.splice(index, 1);
    setPhotoPreview(newPreviews);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentVideos = formData.videos || [];

    if (currentVideos.length + files.length > 5) {
      alert('Maximum 5 videos allowed');
      return;
    }

    setFormData({ ...formData, videos: [...currentVideos, ...files] });
  };

  const removeVideo = (index: number) => {
    const newVideos = [...(formData.videos || [])];
    newVideos.splice(index, 1);
    setFormData({ ...formData, videos: newVideos });
  };

  const canProceedStep2 = () => {
    if (!providerType) return false;
    if (!formData.fullName || !formData.email || !formData.phone) return false;
    if (providerType === 'business' && !formData.businessName) return false;
    if (!formData.serviceCategory) return false;
    return true;
  };

  const canSubmit = () => {
    if (!canProceedStep2()) return false;
    if (!formData.serviceArea || !formData.description || !formData.pricing) return false;
    if (!formData.agreeToTerms) return false;

    // Category-specific required fields
    const category = formData.serviceCategory;

    if ((category === 'airport_transfers' || category === 'local_transfers') &&
        (!formData.transferPickupArea || !formData.transferDropoffArea || !formData.vehicleType)) {
      return false;
    }

    if (category === 'bedding_kits' && !formData.beddingItemsIncluded) {
      return false;
    }

    if (category === 'tax_help' && !formData.credentials) {
      return false;
    }

    if (category === 'events' && (!formData.eventDate || !formData.eventLocation)) {
      return false;
    }

    if ((category === 'travel_ideas' || category === 'group_trips') &&
        (!formData.tripDestination || !formData.tripDate)) {
      return false;
    }

    if (category === 'student_discounts' && !formData.discountDetails) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit() || !providerType) return;

    onSubmit({
      ...formData,
      providerType,
    } as ProviderApplication);
  };

  const renderDynamicFields = () => {
    const category = formData.serviceCategory;

    if (!category) return null;

    // Transfers
    if (category === 'airport_transfers' || category === 'local_transfers') {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Transfer Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Area *</label>
            <input
              type="text"
              value={formData.transferPickupArea || ''}
              onChange={(e) => setFormData({ ...formData, transferPickupArea: e.target.value })}
              placeholder="e.g., Charleston Airport, Downtown"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Drop-off Area *</label>
            <input
              type="text"
              value={formData.transferDropoffArea || ''}
              onChange={(e) => setFormData({ ...formData, transferDropoffArea: e.target.value })}
              placeholder="e.g., Myrtle Beach, Specific address"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Type *</label>
            <select
              value={formData.vehicleType || ''}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select vehicle type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="minibus">Minibus</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Seats Available</label>
              <input
                type="number"
                min="1"
                value={formData.seatsAvailable || ''}
                onChange={(e) => setFormData({ ...formData, seatsAvailable: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price per Ride/Person</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerRide || ''}
                onChange={(e) => setFormData({ ...formData, pricePerRide: parseFloat(e.target.value) })}
                placeholder="e.g., 25.00"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      );
    }

    // Bedding / Starter Kits
    if (category === 'bedding_kits') {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Bedding Kit Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Items Included *</label>
            <textarea
              value={formData.beddingItemsIncluded || ''}
              onChange={(e) => setFormData({ ...formData, beddingItemsIncluded: e.target.value })}
              placeholder="e.g., Sheets, pillows, blanket, towels..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="delivery"
              checked={formData.deliveryAvailable || false}
              onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="delivery" className="text-sm text-gray-300">Delivery available</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Location</label>
            <input
              type="text"
              value={formData.pickupLocation || ''}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              placeholder="e.g., 123 Main St, Charleston"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    // Tax Help
    if (category === 'tax_help') {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Tax Service Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Service Type</label>
            <select
              value={formData.taxServiceType || ''}
              onChange={(e) => setFormData({ ...formData, taxServiceType: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select service type</option>
              <option value="filing">Tax Filing</option>
              <option value="consultation">Tax Consultation</option>
              <option value="itin">ITIN Application</option>
              <option value="amendment">Tax Amendment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Consultation Format</label>
            <select
              value={formData.consultationFormat || ''}
              onChange={(e) => setFormData({ ...formData, consultationFormat: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select format</option>
              <option value="in_person">In Person</option>
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="email">Email Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Credentials / Experience *</label>
            <textarea
              value={formData.credentials || ''}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              placeholder="e.g., CPA, 5 years experience, etc."
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      );
    }

    // Events
    if (category === 'events') {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Event Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Event Date *</label>
            <input
              type="date"
              value={formData.eventDate || ''}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Event Location *</label>
            <input
              type="text"
              value={formData.eventLocation || ''}
              onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
              placeholder="e.g., Downtown Park, 123 Main St"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                placeholder="e.g., 50"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Ticket Price</label>
              <input
                type="text"
                value={formData.ticketPrice || ''}
                onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                placeholder="Free or $10"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      );
    }

    // Travel Ideas / Group Trips
    if (category === 'travel_ideas' || category === 'group_trips') {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Trip Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Destination *</label>
            <input
              type="text"
              value={formData.tripDestination || ''}
              onChange={(e) => setFormData({ ...formData, tripDestination: e.target.value })}
              placeholder="e.g., New York City, Miami Beach"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Trip Date *</label>
            <input
              type="date"
              value={formData.tripDate || ''}
              onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Cost</label>
              <input
                type="text"
                value={formData.tripCost || ''}
                onChange={(e) => setFormData({ ...formData, tripCost: e.target.value })}
                placeholder="e.g., $200-300"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Spots Available</label>
              <input
                type="number"
                min="1"
                value={formData.spotsAvailable || ''}
                onChange={(e) => setFormData({ ...formData, spotsAvailable: parseInt(e.target.value) })}
                placeholder="e.g., 10"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Transportation Plan</label>
            <input
              type="text"
              value={formData.transportationPlan || ''}
              onChange={(e) => setFormData({ ...formData, transportationPlan: e.target.value })}
              placeholder="e.g., Rental van, bus, car pool"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Meeting Point</label>
            <input
              type="text"
              value={formData.meetingPoint || ''}
              onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
              placeholder="e.g., Downtown parking lot"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    // Student Discounts
    if (category === 'student_discounts') {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Discount Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Discount Details *</label>
            <textarea
              value={formData.discountDetails || ''}
              onChange={(e) => setFormData({ ...formData, discountDetails: e.target.value })}
              placeholder="e.g., 20% off all purchases, Buy one get one free"
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Valid Dates</label>
            <input
              type="text"
              value={formData.validDates || ''}
              onChange={(e) => setFormData({ ...formData, validDates: e.target.value })}
              placeholder="e.g., June 1 - August 31, 2026"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Redemption Instructions</label>
            <textarea
              value={formData.redemptionInstructions || ''}
              onChange={(e) => setFormData({ ...formData, redemptionInstructions: e.target.value })}
              placeholder="e.g., Show student ID at checkout, Use code SUMMER2026 online"
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Become a Provider</h2>
            <p className="text-sm text-gray-400 mt-1">Start offering services to the community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= s
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    step > s ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Provider Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Select Provider Type</h3>
                <p className="text-sm text-gray-400">Choose the type that best describes you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {providerTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProviderType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      providerType === type.id
                        ? 'border-purple-600 bg-purple-600/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mb-2 ${
                      providerType === type.id ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <div className="font-semibold text-white text-sm mb-1">{type.name}</div>
                    <div className="text-xs text-gray-400">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Basic Information</h3>
                <p className="text-sm text-gray-400">Tell us about yourself and your service</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {providerType === 'business' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName || ''}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Your business name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 555-5555"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service Category *</label>
                <select
                  value={formData.serviceCategory || ''}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value as ServiceCategory })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Service Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Service Details</h3>
                <p className="text-sm text-gray-400">Provide details about your service offering</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service Area *</label>
                <input
                  type="text"
                  value={formData.serviceArea || ''}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                  placeholder="e.g., Charleston, Myrtle Beach, All of South Carolina"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your service in detail..."
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Pricing *</label>
                  <input
                    type="text"
                    value={formData.pricing || ''}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    placeholder="e.g., $50/hour, $100 flat rate"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Availability</label>
                  <input
                    type="text"
                    value={formData.availability || ''}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g., Weekdays 9am-5pm"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Dynamic fields based on service category */}
              {renderDynamicFields()}

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Photos (up to 10)</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-600 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-400">Upload photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {photoPreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photoPreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Videos */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Videos (up to 5)</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-600 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-400">Upload videos</span>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>

                  {formData.videos && formData.videos.length > 0 && (
                    <div className="space-y-2">
                      {formData.videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-300 truncate flex-1">{video.name}</span>
                          <button
                            onClick={() => removeVideo(index)}
                            className="ml-2 p-1 hover:bg-gray-700 rounded"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Website (optional)</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Social Media (optional)</label>
                  <input
                    type="text"
                    value={formData.socialMedia || ''}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    placeholder="@yourusername"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Verification Documents */}
              {(providerType === 'business' || providerType === 'local_provider') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business License (optional)</label>
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-600 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-400">
                      {formData.businessLicense ? formData.businessLicense.name : 'Upload business license'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({ ...formData, businessLicense: e.target.files?.[0] })}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Verification (optional)</label>
                <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-600 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">
                    {formData.idVerification ? formData.idVerification.name : 'Upload ID'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, idVerification: e.target.files?.[0] })}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Terms */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300 flex-1">
                    I agree to the Terms of Service and Provider Agreement. I understand that my application will be reviewed and that providing false information may result in account suspension.
                  </label>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Your application will be reviewed within 2-3 business days. You'll receive an email notification once approved.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800">
          <button
            onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : onClose()}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as 1 | 2 | 3)}
              disabled={step === 1 ? !providerType : !canProceedStep2()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
