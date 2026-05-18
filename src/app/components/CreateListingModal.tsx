import { useState } from 'react';
import { X, Upload, MapPin, Home, Users, DollarSign, Image as ImageIcon, Trash2, CheckCircle, Calendar } from 'lucide-react';
import { RoomManagement, Room, Bathroom } from './RoomManagement';

interface CreateListingModalProps {
  onClose: () => void;
  onSubmit: (listing: NewListing) => void;
}

export interface NewListing {
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'entire_house' | 'apartment' | 'private_room' | 'shared_room' | 'bed_in_shared' | 'multiple_rooms';
  genderPreference: 'female-only' | 'male-only' | 'mixed';
  roomType: 'Whole Apartment' | 'Private Room' | 'Shared Room';
  peopleInRoom: number;
  peopleInHouse: number;
  rooms: Room[];
  bathrooms: Bathroom[];
  price: number;
  pricePer: 'week' | 'month' | 'biweekly';
  deposit: {
    amount: number;
    type: 'refundable' | 'non-refundable' | 'partially-refundable';
    partiallyRefundableAmount?: number;
    partiallyRefundableReason?: string;
  };
  amenities: {
    wifi: boolean;
    furnished: boolean;
    ac: boolean;
    heating: boolean;
    tv: boolean;
    laundryInUnit: boolean;
    laundryInBuilding: boolean;
    dishwasher: boolean;
    parking: boolean;
    kitchen: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    gatedCommunity: boolean;
    swimmingPool: boolean;
    gym: boolean;
    elevator: boolean;
    balcony: boolean;
    backyard: boolean;
  };
  transport: {
    subway: boolean;
    bus: boolean;
    train: boolean;
    airport: boolean;
    bikeShare: boolean;
  };
  nearbyPlaces: {
    grocery: boolean;
    bank: boolean;
    mall: boolean;
    hospital: boolean;
    university: boolean;
    restaurant: boolean;
  };
  description: string;
  houseRules: string;
  availability: string;
  minStay: string;
  maxStay: string;
  photos: string[];
}

export function CreateListingModal({ onClose, onSubmit }: CreateListingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NewListing>({
    title: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    propertyType: 'apartment',
    genderPreference: 'mixed',
    roomType: 'Private Room',
    peopleInRoom: 1,
    peopleInHouse: 1,
    rooms: [],
    bathrooms: [],
    price: 0,
    pricePer: 'month',
    deposit: {
      amount: 0,
      type: 'refundable'
    },
    amenities: {
      wifi: false,
      furnished: false,
      ac: false,
      heating: false,
      tv: false,
      laundryInUnit: false,
      laundryInBuilding: false,
      dishwasher: false,
      parking: false,
      kitchen: false,
      petsAllowed: false,
      smokingAllowed: false,
      gatedCommunity: false,
      swimmingPool: false,
      gym: false,
      elevator: false,
      balcony: false,
      backyard: false
    },
    transport: {
      subway: false,
      bus: false,
      train: false,
      airport: false,
      bikeShare: false
    },
    nearbyPlaces: {
      grocery: false,
      bank: false,
      mall: false,
      hospital: false,
      university: false,
      restaurant: false
    },
    description: '',
    houseRules: '',
    availability: 'Available Now',
    minStay: '1 week',
    maxStay: '6 months',
    photos: []
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ url: string; file?: File }>>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      photos: uploadedPhotos.map(p => p.url)
    };
    onSubmit(finalData);
    onClose();
  };

  const nextStep = () => {
    // Validate step 2: require at least one room
    if (step === 2 && formData.rooms.length === 0) {
      alert('Please add at least one room before continuing');
      return;
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-purple-600 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Create New Listing</h2>
            <p className="text-sm text-white/90 mt-1">Step {step} of 5 - {
              step === 1 ? 'Basic Information' :
              step === 2 ? 'Rooms & Bathrooms' :
              step === 3 ? 'Pricing & Deposit' :
              step === 4 ? 'Amenities & Features' :
              'Photos & Final Details'
            }</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 pb-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`h-2 rounded-full flex-1 transition-all ${
                  s <= step ? 'bg-gradient-to-r from-primary to-purple-600' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Cozy Apartment Near Downtown"
                    required
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                        placeholder="123 Main Street, Apt 4B"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        placeholder="New York"
                        required
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                        placeholder="NY"
                        required
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: e.target.value }
                        })}
                        placeholder="10001"
                        required
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, country: e.target.value }
                        })}
                        placeholder="USA"
                        required
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Rooms & Bathrooms */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'entire_house' as const, label: 'Entire House', icon: '🏠' },
                      { value: 'apartment' as const, label: 'Apartment', icon: '🏢' },
                      { value: 'private_room' as const, label: 'Private Room', icon: '🚪' },
                      { value: 'shared_room' as const, label: 'Shared Room', icon: '🛏️' },
                      { value: 'bed_in_shared' as const, label: 'Bed in Shared', icon: '🛌' },
                      { value: 'multiple_rooms' as const, label: 'Multiple Rooms', icon: '🏘️' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, propertyType: option.value })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.propertyType === option.value
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Select the property type that best describes your listing
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Room Details & Bathroom Information
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Add detailed information about each room and bathroom. This helps participants understand capacity, gender policies, and bathroom sharing arrangements.
                  </p>

                  <RoomManagement
                    rooms={formData.rooms}
                    bathrooms={formData.bathrooms}
                    onUpdateRooms={(rooms) => setFormData({ ...formData, rooms })}
                    onUpdateBathrooms={(bathrooms) => setFormData({ ...formData, bathrooms })}
                  />

                  {formData.rooms.length === 0 && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        ⚠️ Please add at least one room to continue
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Deposit */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Price Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        placeholder="850"
                        min="0"
                        step="0.01"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Price Per <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.pricePer}
                      onChange={(e) => setFormData({ ...formData, pricePer: e.target.value as 'week' | 'month' | 'biweekly' })}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="week">Week</option>
                      <option value="biweekly">Bi-weekly (2 weeks)</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Price Preview</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ${formData.price} per {formData.pricePer}
                    {formData.pricePer === 'week' && formData.price > 0 && (
                      <span> (≈ ${(formData.price * 4.33).toFixed(2)}/month)</span>
                    )}
                    {formData.pricePer === 'biweekly' && formData.price > 0 && (
                      <span> (≈ ${(formData.price * 2.17).toFixed(2)}/month)</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Deposit Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={formData.deposit.amount || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        deposit: { ...formData.deposit, amount: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="500"
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Deposit Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'refundable' as const, label: 'Fully Refundable', desc: 'Full deposit returned at end of stay' },
                      { value: 'non-refundable' as const, label: 'Non-Refundable', desc: 'Deposit will not be returned' },
                      { value: 'partially-refundable' as const, label: 'Partially Refundable', desc: 'Part of deposit will be refunded' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          deposit: { ...formData.deposit, type: option.value }
                        })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.deposit.type === option.value
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 dark:text-white mb-1">{option.label}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.deposit.type === 'partially-refundable' && (
                  <div className="space-y-4 pl-4 border-l-4 border-primary">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Refundable Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          value={formData.deposit.partiallyRefundableAmount || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            deposit: { ...formData.deposit, partiallyRefundableAmount: parseFloat(e.target.value) || 0 }
                          })}
                          placeholder="250"
                          min="0"
                          max={formData.deposit.amount}
                          step="0.01"
                          required
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Non-refundable: ${(formData.deposit.amount - (formData.deposit.partiallyRefundableAmount || 0)).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Reason for Non-Refundable Portion
                      </label>
                      <textarea
                        value={formData.deposit.partiallyRefundableReason || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          deposit: { ...formData.deposit, partiallyRefundableReason: e.target.value }
                        })}
                        placeholder="e.g., Cleaning fee, processing fee, etc."
                        rows={2}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Amenities & Features */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Property Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries({
                      wifi: 'WiFi',
                      furnished: 'Furnished',
                      ac: 'Air Conditioning',
                      heating: 'Heating',
                      tv: 'TV',
                      laundryInUnit: 'Laundry in Unit',
                      laundryInBuilding: 'Laundry in Building',
                      dishwasher: 'Dishwasher',
                      parking: 'Parking',
                      kitchen: 'Kitchen',
                      petsAllowed: 'Pets Allowed',
                      smokingAllowed: 'Smoking Allowed',
                      gatedCommunity: 'Gated Community',
                      swimmingPool: 'Swimming Pool',
                      gym: 'Gym',
                      elevator: 'Elevator',
                      balcony: 'Balcony',
                      backyard: 'Backyard'
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          amenities: {
                            ...formData.amenities,
                            [key]: !formData.amenities[key as keyof typeof formData.amenities]
                          }
                        })}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          formData.amenities[key as keyof typeof formData.amenities]
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Transportation Nearby</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries({
                      subway: 'Subway',
                      bus: 'Bus',
                      train: 'Train',
                      airport: 'Airport',
                      bikeShare: 'Bike Share'
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          transport: {
                            ...formData.transport,
                            [key]: !formData.transport[key as keyof typeof formData.transport]
                          }
                        })}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          formData.transport[key as keyof typeof formData.transport]
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Nearby Places</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries({
                      grocery: 'Grocery Store',
                      bank: 'Bank',
                      mall: 'Shopping Mall',
                      hospital: 'Hospital',
                      university: 'University',
                      restaurant: 'Restaurants'
                    }).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          nearbyPlaces: {
                            ...formData.nearbyPlaces,
                            [key]: !formData.nearbyPlaces[key as keyof typeof formData.nearbyPlaces]
                          }
                        })}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          formData.nearbyPlaces[key as keyof typeof formData.nearbyPlaces]
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Photos & Final Details */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Property Photos <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-4">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">Click to upload photos</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Upload multiple photos of your property</p>
                      </div>
                    </label>

                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo.url}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your property, what makes it special, nearby attractions, etc."
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    House Rules
                  </label>
                  <textarea
                    value={formData.houseRules}
                    onChange={(e) => setFormData({ ...formData, houseRules: e.target.value })}
                    placeholder="e.g., No parties, quiet hours 10PM-8AM, shoes off inside, etc."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              step === 1
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            Previous
          </button>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            Step {step} of 5
          </div>

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Create Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
