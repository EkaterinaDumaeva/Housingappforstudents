import { Star, MapPin, CheckCircle, XCircle, Heart } from 'lucide-react';
import { ReliabilityProfile, ReliabilityData } from './ReliabilityProfile';

export interface Housing {
  id: string;
  title: string;
  location: string;
  city: string;
  state: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  type: string;
  availability: string;
  hostVerified?: boolean;
  hostName?: string;
  genderPreference?: 'female-only' | 'male-only' | 'mixed';
  maxCapacity?: number;
  amenities: {
    wifi: boolean;
    furnished: boolean;
    ac: boolean;
    tv: boolean;
    laundryInUnit: boolean;
    gatedCommunity: boolean;
    swimmingPool: boolean;
    grocery: boolean;
    bank: boolean;
    mall: boolean;
  };
  transport?: {
    subway: boolean;
    bus: boolean;
    train: boolean;
    airport: boolean;
    bikeShare: boolean;
  };
}

interface HousingCardProps {
  housing: Housing;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  showSaveButton?: boolean;
  mismatches?: string[];
  availableSpaces?: number;
}

export function HousingCard({ housing, onClick, isSaved = false, onToggleSave, showSaveButton = true, mismatches, availableSpaces }: HousingCardProps) {
  // Mock host reliability data - in production this would come from the backend
  const hostReliability: ReliabilityData = {
    reliabilityScore: 94,
    cancellationRate: 2,
    totalCancellations: 1,
    responseRate: 98,
    averageResponseTime: '2 hours',
    casesOpened: 0,
    casesResolved: 0,
    totalReservations: 47,
    verifications: {
      email: true,
      phone: true,
      identity: true,
      government: housing.hostVerified || false
    },
    strikes: 0,
    warnings: 0,
    badges: []
  };

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden border border-border active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={housing.image}
          alt={housing.title}
          className="w-full h-full object-cover"
        />
        {showSaveButton && onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="absolute top-3 left-3 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform active:scale-95"
          >
            <Heart
              className={`w-5 h-5 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
            />
          </button>
        )}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-sm">${housing.price}/month</span>
        </div>
        {availableSpaces !== undefined && housing.maxCapacity && (
          <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold ${
            availableSpaces === 0
              ? 'bg-red-500/90 text-white backdrop-blur-sm'
              : availableSpaces <= 2
                ? 'bg-orange-500/90 text-white backdrop-blur-sm'
                : 'bg-green-500/90 text-white backdrop-blur-sm'
          }`}>
            {availableSpaces === 0 ? 'Fully Booked' : `${availableSpaces} space${availableSpaces !== 1 ? 's' : ''} left`}
          </div>
        )}
      </div>

      {mismatches && mismatches.length > 0 && (
        <div className="px-4 pt-3 pb-2">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
            <p className="text-xs text-orange-800 font-medium mb-1">Close Match</p>
            <p className="text-xs text-orange-700">
              Missing: {mismatches.slice(0, 2).join(', ')}
              {mismatches.length > 2 && ` +${mismatches.length - 2} more`}
            </p>
          </div>
        </div>
      )}

      <div className={mismatches && mismatches.length > 0 ? "p-4 pt-2" : "p-4"}>
        <div className="flex items-start justify-between mb-1">
          <h3>{housing.title}</h3>
          {housing.hostVerified !== undefined && (
            <div className="flex items-center gap-1">
              {housing.hostVerified ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-orange-500" />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{housing.location}</span>
        </div>
        {housing.hostVerified !== undefined && (
          <div className="mb-2">
            <ReliabilityProfile userType="host" data={hostReliability} compact />
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{housing.rating}</span>
            <span className="text-sm text-muted-foreground">({housing.reviewCount})</span>
          </div>
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
            {housing.type}
          </span>
        </div>
      </div>
    </div>
  );
}
