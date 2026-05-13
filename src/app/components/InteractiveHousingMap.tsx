import { Housing } from './HousingCard';
import { MapPin } from 'lucide-react';

interface InteractiveHousingMapProps {
  housings: Housing[];
  selectedId?: string;
  onSelectHousing: (housing: Housing) => void;
}

export function InteractiveHousingMap({ housings, selectedId, onSelectHousing }: InteractiveHousingMapProps) {
  const validHousings = housings.filter(h => h.coordinates);

  // Calculate bounds for the map
  const bounds = validHousings.reduce(
    (acc, h) => ({
      minLat: Math.min(acc.minLat, h.coordinates!.lat),
      maxLat: Math.max(acc.maxLat, h.coordinates!.lat),
      minLng: Math.min(acc.minLng, h.coordinates!.lng),
      maxLng: Math.max(acc.maxLng, h.coordinates!.lng),
    }),
    { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 }
  );

  // Add padding to bounds
  const latPadding = (bounds.maxLat - bounds.minLat) * 0.2 || 10;
  const lngPadding = (bounds.maxLng - bounds.minLng) * 0.2 || 10;

  const viewBox = {
    minLng: bounds.minLng - lngPadding,
    maxLng: bounds.maxLng + lngPadding,
    minLat: bounds.minLat - latPadding,
    maxLat: bounds.maxLat + latPadding,
  };

  const width = viewBox.maxLng - viewBox.minLng;
  const height = viewBox.maxLat - viewBox.minLat;

  // Convert lat/lng to SVG coordinates
  const coordsToSVG = (lat: number, lng: number) => {
    const x = ((lng - viewBox.minLng) / width) * 100;
    const y = ((viewBox.maxLat - lat) / height) * 100;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Decorative background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7C6FDC" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Interactive map with markers */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {validHousings.map((housing) => {
          const { x, y } = coordsToSVG(housing.coordinates!.lat, housing.coordinates!.lng);
          const isSelected = selectedId === housing.id;

          return (
            <g
              key={housing.id}
              onClick={() => onSelectHousing(housing)}
              className="cursor-pointer transition-transform hover:scale-110"
              style={{ transformOrigin: `${x}% ${y}%` }}
            >
              {/* Marker pin */}
              <circle
                cx={x}
                cy={y}
                r="2"
                fill={isSelected ? '#7C6FDC' : '#FFFFFF'}
                stroke={isSelected ? '#7C6FDC' : '#E5E7EB'}
                strokeWidth="0.3"
              />

              {/* Price label */}
              <g>
                <rect
                  x={x - 4}
                  y={y - 6}
                  width="8"
                  height="3"
                  rx="1.5"
                  fill={isSelected ? '#7C6FDC' : '#FFFFFF'}
                  stroke={isSelected ? '#7C6FDC' : '#E5E7EB'}
                  strokeWidth="0.15"
                  filter="drop-shadow(0 0.2px 0.5px rgba(0,0,0,0.2))"
                />
                <text
                  x={x}
                  y={y - 3.5}
                  textAnchor="middle"
                  fontSize="1.5"
                  fontWeight="600"
                  fill={isSelected ? '#FFFFFF' : '#7C6FDC'}
                  style={{ pointerEvents: 'none' }}
                >
                  ${housing.price}
                </text>
              </g>

              {/* City label */}
              {isSelected && (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="1.2"
                  fontWeight="500"
                  fill="#7C6FDC"
                  style={{ pointerEvents: 'none' }}
                >
                  {housing.city}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs text-gray-600 z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-primary" />
          <span>{validHousings.length} {validHousings.length === 1 ? 'property' : 'properties'}</span>
        </div>
      </div>

      {validHousings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No properties with locations</p>
          </div>
        </div>
      )}
    </div>
  );
}
