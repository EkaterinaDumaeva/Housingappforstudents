import { MapPin } from 'lucide-react';
import { Housing } from './HousingCard';

interface HousingMapProps {
  housings: Housing[];
  selectedId?: string;
  onSelectHousing: (housing: Housing) => void;
}

export function HousingMap({ housings, selectedId, onSelectHousing }: HousingMapProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden border border-border">
      {/* Map Background Pattern */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Center map indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {housings.length} {housings.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>
      </div>

      {/* Housing pins - positioned around the map */}
      <div className="absolute inset-0">
        {housings.slice(0, 8).map((housing, index) => {
          // Calculate position for visual distribution
          const positions = [
            { top: '20%', left: '25%' },
            { top: '30%', left: '60%' },
            { top: '50%', left: '40%' },
            { top: '25%', left: '75%' },
            { top: '65%', left: '30%' },
            { top: '70%', left: '65%' },
            { top: '45%', left: '20%' },
            { top: '60%', left: '80%' },
          ];
          const position = positions[index % positions.length];

          return (
            <button
              key={housing.id}
              onClick={() => onSelectHousing(housing)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                selectedId === housing.id ? 'z-10 scale-110' : 'z-0'
              }`}
              style={{ top: position.top, left: position.left }}
            >
              <div
                className={`relative px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm transition-colors ${
                  selectedId === housing.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/90 hover:bg-white'
                }`}
              >
                <span className="text-sm font-medium">${housing.price}</span>
                <MapPin className="w-4 h-4 absolute -bottom-3 left-1/2 transform -translate-x-1/2"
                  fill="currentColor" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Map note */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow text-xs text-muted-foreground">
        Interactive map view
      </div>
    </div>
  );
}
