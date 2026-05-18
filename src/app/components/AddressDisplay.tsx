import { MapPin, Lock, CheckCircle, Info, Navigation } from 'lucide-react';

interface AddressDisplayProps {
  isConfirmed: boolean;
  fullAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    apartmentUnit?: string;
  };
  approximateLocation?: {
    neighborhood: string;
    city: string;
    state: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
    radius?: number; // in meters, for approximate circle
  };
  checkInInstructions?: string;
  parkingInfo?: string;
  accessCode?: string;
}

export function AddressDisplay({
  isConfirmed,
  fullAddress,
  approximateLocation,
  coordinates,
  checkInInstructions,
  parkingInfo,
  accessCode
}: AddressDisplayProps) {

  // Before confirmation: Show approximate location only
  if (!isConfirmed) {
    return (
      <div className="space-y-4">
        {/* Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                Exact Address Protected
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                The full street address will be revealed after your booking is confirmed and deposit is paid.
                This protects the host's privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Approximate Location */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-slate-900 dark:text-white">Approximate Location</h3>
          </div>

          {approximateLocation && (
            <div className="mb-4">
              <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {approximateLocation.neighborhood}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {approximateLocation.city}, {approximateLocation.state}
              </div>
            </div>
          )}

          {/* Map Placeholder with Circle */}
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden mb-4 relative" style={{ height: '250px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full border-4 border-primary/30 bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Property is within this general area
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The exact location is shown as a circle radius for privacy. You'll get the full address after
                booking confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After confirmation: Show full address and details
  return (
    <div className="space-y-4">
      {/* Confirmation Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">
              Booking Confirmed - Full Address Revealed
            </h4>
            <p className="text-xs text-green-700 dark:text-green-300">
              Your booking is confirmed and deposit is secured. Here's the complete address and access information.
            </p>
          </div>
        </div>
      </div>

      {/* Full Address Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-slate-900 dark:text-white">Property Address</h3>
        </div>

        {fullAddress && (
          <div className="mb-4">
            <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {fullAddress.street}
              {fullAddress.apartmentUnit && (
                <span className="text-primary ml-2">#{fullAddress.apartmentUnit}</span>
              )}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {fullAddress.city}, {fullAddress.state} {fullAddress.zip}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden mb-4" style={{ height: '300px' }}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Interactive map would load here</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {coordinates && `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Open in Maps
          </button>
          <button className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
            Get Directions
          </button>
          <button className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
            Copy Address
          </button>
        </div>
      </div>

      {/* Check-In Instructions */}
      {checkInInstructions && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Check-In Instructions</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {checkInInstructions}
            </p>
          </div>
        </div>
      )}

      {/* Access Information */}
      {(accessCode || parkingInfo) && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Access Information</h3>

          <div className="space-y-3">
            {accessCode && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                    Building/Door Code
                  </span>
                  <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="font-mono text-2xl font-bold text-purple-900 dark:text-purple-100 tracking-wider">
                  {accessCode}
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                  Use this code to access the building or unit
                </p>
              </div>
            )}

            {parkingInfo && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Parking Information
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {parkingInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Important Note */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-orange-900 dark:text-orange-100 text-sm mb-1">
              Keep This Information Private
            </h5>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              Do not share the address, access codes, or any sensitive information with anyone outside your booking group.
              If you have issues accessing the property, contact the host or emergency support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
