import { MapPin, Calendar, Users, DollarSign, Star, Verified, Bookmark, Flag, MessageCircle, TrendingUp, Clock, Car, Plane, Gift, PartyPopper } from 'lucide-react';
import { ServiceCategory } from './BecomeProviderModal';

interface ServiceListingCardProps {
  listing: ServiceListing;
  onViewDetails: (id: string) => void;
  onSave?: (id: string) => void;
  onReport?: (id: string) => void;
  isSaved?: boolean;
}

export interface ServiceListing {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  price: string;
  location: string;
  provider: {
    id: string;
    name: string;
    type: 'individual' | 'business' | 'student' | 'host_service' | 'employer_service' | 'local_provider';
    rating: number;
    reviewCount: number;
    verified: boolean;
    avatar?: string;
  };
  photos: string[];
  status: 'active' | 'full' | 'cancelled' | 'expired';
  createdAt: string;

  // Transfer specific
  pickupLocation?: string;
  dropoffLocation?: string;
  vehicleType?: string;
  seatsAvailable?: number;
  transferDate?: string;

  // Event specific
  eventDate?: string;
  eventTime?: string;
  capacity?: number;
  spotsLeft?: number;
  isFree?: boolean;

  // Trip specific
  destination?: string;
  tripDate?: string;
  estimatedCost?: string;
  participantsCount?: number;
  maxParticipants?: number;

  // Offer specific
  discountAmount?: string;
  validUntil?: string;
  businessName?: string;
}

export function ServiceListingCard({ listing, onViewDetails, onSave, onReport, isSaved }: ServiceListingCardProps) {
  const getCategoryIcon = () => {
    switch (listing.category) {
      case 'airport_transfers':
      case 'local_transfers':
        return <Car className="w-4 h-4" />;
      case 'group_trips':
      case 'travel_ideas':
        return <Plane className="w-4 h-4" />;
      case 'events':
        return <PartyPopper className="w-4 h-4" />;
      case 'student_discounts':
        return <Gift className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = () => {
    const labels: Record<ServiceCategory, string> = {
      scholarships: 'Scholarship',
      tax_help: 'Tax Help',
      sim_cards: 'SIM Card',
      bedding_kits: 'Bedding Kit',
      airport_transfers: 'Airport Transfer',
      local_transfers: 'Local Transfer',
      student_discounts: 'Student Discount',
      travel_ideas: 'Travel Idea',
      group_trips: 'Group Trip',
      events: 'Event',
      local_support: 'Local Support',
      cleaning: 'Cleaning',
      handyman: 'Handyman',
      translation: 'Translation',
      arrival_support: 'Arrival Support',
      housing_inspection: 'Housing Inspection',
      other: 'Other Service',
    };
    return labels[listing.category];
  };

  const getStatusBadge = () => {
    switch (listing.status) {
      case 'full':
        return <span className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs rounded-full font-medium">Full</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full font-medium">Cancelled</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full font-medium">Expired</span>;
      default:
        return null;
    }
  };

  const renderSpecificDetails = () => {
    // Transfer details
    if (listing.category === 'airport_transfers' || listing.category === 'local_transfers') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="flex-1 truncate">{listing.pickupLocation} → {listing.dropoffLocation}</span>
          </div>
          {listing.transferDate && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(listing.transferDate).toLocaleDateString()}</span>
            </div>
          )}
          {listing.seatsAvailable && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{listing.seatsAvailable} seats available</span>
            </div>
          )}
          {listing.vehicleType && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Car className="w-4 h-4" />
              <span className="capitalize">{listing.vehicleType}</span>
            </div>
          )}
        </div>
      );
    }

    // Event details
    if (listing.category === 'events') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{listing.eventDate ? new Date(listing.eventDate).toLocaleDateString() : 'TBA'}</span>
            {listing.eventTime && <span className="text-gray-500">• {listing.eventTime}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{listing.location}</span>
          </div>
          {listing.capacity && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{listing.spotsLeft || 0} / {listing.capacity} spots left</span>
            </div>
          )}
          {listing.isFree && (
            <div className="inline-block px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full font-medium">
              Free Event
            </div>
          )}
        </div>
      );
    }

    // Trip details
    if (listing.category === 'travel_ideas' || listing.category === 'group_trips') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="truncate">{listing.destination}</span>
          </div>
          {listing.tripDate && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(listing.tripDate).toLocaleDateString()}</span>
            </div>
          )}
          {listing.maxParticipants && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{listing.participantsCount || 0} / {listing.maxParticipants} joined</span>
            </div>
          )}
          {listing.estimatedCost && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>{listing.estimatedCost}</span>
            </div>
          )}
        </div>
      );
    }

    // Discount/Offer details
    if (listing.category === 'student_discounts') {
      return (
        <div className="space-y-2">
          {listing.businessName && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="truncate">{listing.businessName}</span>
            </div>
          )}
          {listing.discountAmount && (
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-full font-semibold">
              {listing.discountAmount}
            </div>
          )}
          {listing.validUntil && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Valid until {new Date(listing.validUntil).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{listing.location}</span>
          </div>
        </div>
      );
    }

    // Default generic details
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{listing.location}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group">
      {/* Image */}
      <div className="relative aspect-video bg-gray-700 overflow-hidden">
        {listing.photos.length > 0 ? (
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getCategoryIcon() ? (
              <div className="text-gray-600">
                {getCategoryIcon()}
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full" />
            )}
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-medium flex items-center gap-1">
          {getCategoryIcon()}
          <span>{getCategoryLabel()}</span>
        </div>

        {/* Save button */}
        {onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(listing.id);
            }}
            className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400 text-purple-400' : 'text-white'}`} />
          </button>
        )}

        {/* Status badge */}
        {listing.status !== 'active' && (
          <div className="absolute bottom-2 right-2">
            {getStatusBadge()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">{listing.description}</p>

        {/* Specific details based on category */}
        {renderSpecificDetails()}

        {/* Provider info */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
            {listing.provider.avatar ? (
              <img src={listing.provider.avatar} alt={listing.provider.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              listing.provider.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-300 truncate">{listing.provider.name}</span>
              {listing.provider.verified && (
                <Verified className="w-3 h-3 text-blue-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{listing.provider.rating.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{listing.provider.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{listing.price}</span>
            {(listing.category === 'airport_transfers' || listing.category === 'local_transfers') && (
              <span className="text-sm text-gray-400">/ride</span>
            )}
            {listing.category === 'events' && listing.isFree && (
              <span className="text-sm text-green-400 font-medium">Free</span>
            )}
          </div>

          <button
            onClick={() => onViewDetails(listing.id)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
