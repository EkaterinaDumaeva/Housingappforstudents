import { ArrowLeft, Star, MapPin, Users, Calendar, Wifi, Car, Utensils, Bed, CheckCircle, XCircle, Heart, Shield, Lock } from 'lucide-react';
import { Housing } from './HousingCard';
import { ReliabilityProfile, ReliabilityData } from './ReliabilityProfile';

interface HousingDetailsProps {
  housing: Housing & {
    description: string;
    amenities: string[];
    images: string[];
    reviews: Array<{
      id: string;
      author: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  onBack: () => void;
  onBook: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  availableSpaces?: number;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': Utensils,
  'Furnished': Bed,
};

export function HousingDetails({ housing, onBack, onBook, isSaved = false, onToggleSave, availableSpaces }: HousingDetailsProps) {
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
    badges: ['Superhost', 'Quick Responder']
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="relative">
        <img
          src={housing.images[0]}
          alt={housing.title}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-background/90 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {onToggleSave && (
          <button
            onClick={onToggleSave}
            className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform active:scale-95"
          >
            <Heart
              className={`w-5 h-5 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
            />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
          <div className="flex-1">
            <h2 className="mb-1">{housing.title}</h2>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{housing.location}</span>
            </div>
            {housing.hostName && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hosted by {housing.hostName}</span>
                {housing.hostVerified !== undefined && (
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                    housing.hostVerified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {housing.hostVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Not Verified
                      </>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-primary">${housing.price}</div>
            <div className="text-xs text-muted-foreground">per month</div>
            {availableSpaces !== undefined && housing.maxCapacity && (
              <div className={`mt-2 text-xs font-semibold px-2 py-1 rounded-md inline-block ${
                availableSpaces === 0
                  ? 'bg-red-100 text-red-700'
                  : availableSpaces <= 2
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
              }`}>
                {availableSpaces === 0 ? 'Fully Booked' : `${availableSpaces}/${housing.maxCapacity} spaces`}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>{housing.rating}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{housing.reviews.length} reviews</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
            {housing.type}
          </span>
        </div>

        {/* Host Reliability Profile */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Host Reliability
          </h3>
          <ReliabilityProfile userType="host" data={hostReliability} />
        </div>

        <div className="mb-4">
          <h3 className="mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{housing.description}</p>
        </div>

        <div className="mb-4">
          <h3 className="mb-3">Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {housing.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Users;
              return (
                <div key={amenity} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deposit Protection */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Secure Deposit Protection
          </h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Your Deposit is Protected</h4>
                <p className="text-xs text-blue-700 leading-relaxed mb-3">
                  When you pay a deposit, 80% is held securely in escrow on Voya Link's platform until the end of your lease.
                  This protects both you and the host.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-900">Non-refundable</span>
                </div>
                <p className="text-xs text-gray-600">20% goes to host immediately as booking fee</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-900">In Escrow</span>
                </div>
                <p className="text-xs text-gray-600">80% held securely until move-out</p>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-3">
              <ul className="text-xs text-blue-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>If you follow lease terms, you get your deposit back</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>If host violates terms, you get an immediate refund</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span>If you violate terms, host receives the deposit</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3">Reviews</h3>
          <div className="space-y-3">
            {housing.reviews.map((review) => (
              <div key={review.id} className="p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span>{review.author}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-background border-t border-border">
        <button
          onClick={onBook}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
