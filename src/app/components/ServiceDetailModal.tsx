import { useState } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Star, Verified, Share2, Flag, MessageCircle, Phone, Mail, Globe, Clock, Car, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ServiceListing } from './ServiceListingCard';
import { ReviewsList } from './ReviewsList';
import { ReviewData } from './ReviewCard';

interface ServiceDetailModalProps {
  listing: ServiceListing;
  onClose: () => void;
  onBook?: (listingId: string, details: BookingDetails) => void;
  onJoin?: (listingId: string) => void;
  onContact?: (providerId: string) => void;
  onReport?: (listingId: string) => void;
  onShare?: (listingId: string) => void;
  onSaveOffer?: (listingId: string) => void;
  reviews?: ReviewData[];
}

export interface BookingDetails {
  date?: string;
  numberOfSeats?: number;
  message?: string;
}

export function ServiceDetailModal({ listing, onClose, onBook, onJoin, onContact, onReport, onShare, onSaveOffer, reviews = [] }: ServiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});
  const [showContactInfo, setShowContactInfo] = useState(false);

  const canBook = () => {
    const bookingCategories = ['airport_transfers', 'local_transfers', 'cleaning', 'handyman', 'translation', 'arrival_support', 'housing_inspection', 'bedding_kits', 'sim_cards', 'tax_help'];
    return bookingCategories.includes(listing.category);
  };

  const canJoin = () => {
    const joinCategories = ['events', 'group_trips', 'travel_ideas'];
    return joinCategories.includes(listing.category) && listing.status === 'active';
  };

  const canSaveOffer = () => {
    return listing.category === 'student_discounts';
  };

  const handleBooking = () => {
    if (onBook) {
      onBook(listing.id, bookingDetails);
      setShowBookingForm(false);
      setBookingDetails({});
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % listing.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
  };

  const renderActionButtons = () => {
    if (listing.status !== 'active') {
      return (
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <AlertCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            {listing.status === 'full' && 'This service is currently full'}
            {listing.status === 'cancelled' && 'This service has been cancelled'}
            {listing.status === 'expired' && 'This service has expired'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {canBook() && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Request Booking
          </button>
        )}

        {canJoin() && (
          <button
            onClick={() => onJoin?.(listing.id)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {listing.category === 'events' ? "I'm Joining" : 'Join Trip'}
          </button>
        )}

        {canSaveOffer() && (
          <button
            onClick={() => onSaveOffer?.(listing.id)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Save Offer
          </button>
        )}

        <button
          onClick={() => onContact?.(listing.provider.id)}
          className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Ask a Question
        </button>

        {!showContactInfo && (
          <button
            onClick={() => setShowContactInfo(true)}
            className="w-full px-4 py-2 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
          >
            View Contact Information
          </button>
        )}
      </div>
    );
  };

  const renderBookingForm = () => {
    if (!showBookingForm) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
        <div className="bg-gray-900 rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">Request Booking</h3>
            <button
              onClick={() => setShowBookingForm(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Service</label>
              <div className="px-4 py-3 bg-gray-800 rounded-lg text-gray-300">{listing.title}</div>
            </div>

            {(listing.category === 'airport_transfers' || listing.category === 'local_transfers') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingDetails.date || ''}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Seats</label>
                  <input
                    type="number"
                    min="1"
                    max={listing.seatsAvailable || 1}
                    value={bookingDetails.numberOfSeats || 1}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, numberOfSeats: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {listing.seatsAvailable && (
                    <p className="text-xs text-gray-500 mt-1">{listing.seatsAvailable} seats available</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message (optional)</label>
              <textarea
                value={bookingDetails.message || ''}
                onChange={(e) => setBookingDetails({ ...bookingDetails, message: e.target.value })}
                placeholder="Any special requests or questions..."
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Service Fee</span>
                <span className="text-white font-semibold">{listing.price}</span>
              </div>
              <div className="text-xs text-gray-500">
                You'll be contacted by the provider to confirm details and payment.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-6 border-t border-gray-800">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex-1 px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSpecificDetails = () => {
    // Transfer details
    if (listing.category === 'airport_transfers' || listing.category === 'local_transfers') {
      return (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-white">Transfer Details</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-400">Pickup</div>
                <div className="text-white">{listing.pickupLocation}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pink-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-400">Drop-off</div>
                <div className="text-white">{listing.dropoffLocation}</div>
              </div>
            </div>
            {listing.vehicleType && (
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-gray-400 text-sm">Vehicle: </span>
                  <span className="text-white capitalize">{listing.vehicleType}</span>
                </div>
              </div>
            )}
            {listing.seatsAvailable && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-gray-400 text-sm">Available seats: </span>
                  <span className="text-white">{listing.seatsAvailable}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Event details
    if (listing.category === 'events') {
      return (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-white">Event Details</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <span className="text-white">{listing.eventDate ? new Date(listing.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}</span>
                {listing.eventTime && <span className="text-gray-400 ml-2">at {listing.eventTime}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-pink-400" />
              <div className="flex-1 text-white">{listing.location}</div>
            </div>
            {listing.capacity && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-white">{listing.spotsLeft || 0} spots left</span>
                  <span className="text-gray-400 text-sm ml-2">of {listing.capacity}</span>
                </div>
              </div>
            )}
            {listing.isFree ? (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div className="text-green-400 font-medium">Free Event</div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div className="text-white">{listing.price}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Trip details
    if (listing.category === 'travel_ideas' || listing.category === 'group_trips') {
      return (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-white">Trip Details</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="text-sm text-gray-400">Destination</div>
                <div className="text-white">{listing.destination}</div>
              </div>
            </div>
            {listing.tripDate && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-pink-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-white">{new Date(listing.tripDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
            )}
            {listing.maxParticipants && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <span className="text-white">{listing.participantsCount || 0} / {listing.maxParticipants} joined</span>
                </div>
              </div>
            )}
            {listing.estimatedCost && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-400">Estimated Cost</div>
                  <div className="text-white">{listing.estimatedCost}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Discount/Offer details
    if (listing.category === 'student_discounts') {
      return (
        <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-white">Discount Details</h3>
          {listing.discountAmount && (
            <div className="text-2xl font-bold text-white">{listing.discountAmount}</div>
          )}
          {listing.businessName && (
            <div className="text-sm text-gray-300">at {listing.businessName}</div>
          )}
          <div className="space-y-2 pt-2 border-t border-amber-600/30">
            {listing.validUntil && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Valid until {new Date(listing.validUntil).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{listing.location}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-gray-900 rounded-2xl w-full max-w-4xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">{listing.title}</h2>
            <div className="flex items-center gap-2">
              {onShare && (
                <button
                  onClick={() => onShare(listing.id)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              )}
              {onReport && (
                <button
                  onClick={() => onReport(listing.id)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Flag className="w-5 h-5 text-gray-400" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column - main content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Photo gallery */}
                    {listing.photos.length > 0 && (
                      <div className="relative">
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={listing.photos[currentPhotoIndex]}
                            alt={`${listing.title} - ${currentPhotoIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {listing.photos.length > 1 && (
                          <>
                            <button
                              onClick={prevPhoto}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={nextPhoto}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                              {currentPhotoIndex + 1} / {listing.photos.length}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-300 whitespace-pre-line">{listing.description}</p>
                    </div>

                    {/* Specific details */}
                    {renderSpecificDetails()}

                    {/* Provider info */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-3">Provider</h3>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {listing.provider.avatar ? (
                            <img src={listing.provider.avatar} alt={listing.provider.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            listing.provider.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{listing.provider.name}</span>
                            {listing.provider.verified && (
                              <Verified className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{listing.provider.rating.toFixed(1)}</span>
                            </div>
                            <span>•</span>
                            <span>{listing.provider.reviewCount} reviews</span>
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {listing.provider.type.replace('_', ' ')} provider
                          </div>
                        </div>
                      </div>

                      {showContactInfo && (
                        <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>provider@example.com</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>(555) 555-5555</span>
                          </div>
                          <div className="bg-gray-900 rounded p-3 mt-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-400">
                                Payments and communication outside the platform may not be protected.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column - booking/actions */}
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
                      <div className="text-3xl font-bold text-white mb-4">{listing.price}</div>
                      {renderActionButtons()}
                    </div>

                    {/* Safety notice */}
                    <div className="bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-amber-400 text-sm mb-1">Safety Notice</div>
                          <p className="text-xs text-gray-300">
                            Payments and communication outside the platform may not be protected. Always use in-platform messaging when possible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="p-6">
                <ReviewsList
                  reviews={reviews}
                  revieweeType="provider"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {renderBookingForm()}
    </>
  );
}
