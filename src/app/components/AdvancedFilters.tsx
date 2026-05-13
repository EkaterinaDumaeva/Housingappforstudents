import { X, SlidersHorizontal, Info } from 'lucide-react';

export interface AdvancedFilterOptions {
  priceRange: [number, number];
  genderPreference: string[];
  hostVerified: boolean | null;
  minRating: number;
  roomType: string[];
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
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions;
  onChange: (filters: AdvancedFilterOptions) => void;
  onClose: () => void;
}

export function AdvancedFilters({ filters, onChange, onClose }: AdvancedFiltersProps) {
  const updateFilter = (key: keyof AdvancedFilterOptions, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const updateAmenity = (amenity: keyof AdvancedFilterOptions['amenities'], value: boolean) => {
    onChange({
      ...filters,
      amenities: { ...filters.amenities, [amenity]: value }
    });
  };

  const toggleArrayValue = (key: 'genderPreference' | 'roomType', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2>Advanced Filters</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* J1 Student Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Note for J1 Students</h4>
              <p className="text-xs text-blue-700">
                J1 students are most likely to find shared bedroom options. These are typically more affordable and great for meeting other international students.
              </p>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block mb-3">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}/month
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block mb-3">Gender Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {['female-only', 'male-only', 'mixed'].map(option => (
                <button
                  key={option}
                  onClick={() => toggleArrayValue('genderPreference', option)}
                  className={`px-4 py-2.5 rounded-xl border transition-colors text-sm ${
                    filters.genderPreference.includes(option)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-accent'
                  }`}
                >
                  {option === 'female-only' ? 'Female Only' : option === 'male-only' ? 'Male Only' : 'Mixed'}
                </button>
              ))}
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block mb-3">Room Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'Private Room', label: 'Private Room' },
                { value: 'Shared Room', label: 'Shared Room' },
                { value: 'Whole Apartment', label: 'Whole Apartment' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleArrayValue('roomType', option.value)}
                  className={`px-4 py-2.5 rounded-xl border transition-colors text-sm ${
                    filters.roomType.includes(option.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Host Verified */}
          <div>
            <label className="block mb-3">Host Verification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateFilter('hostVerified', null)}
                className={`px-4 py-2.5 rounded-xl border transition-colors text-sm ${
                  filters.hostVerified === null
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                Any
              </button>
              <button
                onClick={() => updateFilter('hostVerified', true)}
                className={`px-4 py-2.5 rounded-xl border transition-colors text-sm ${
                  filters.hostVerified === true
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                Verified Only
              </button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block mb-3">
              Minimum Rating: {filters.minRating > 0 ? filters.minRating.toFixed(1) : 'Any'}
            </label>
            <div className="flex items-center gap-2">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFilter('minRating', rating)}
                  className={`flex-1 px-3 py-2 rounded-xl border transition-colors text-sm ${
                    filters.minRating === rating
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-accent'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block mb-3">Amenities</label>
            <div className="space-y-2">
              {[
                { key: 'wifi' as const, label: 'WiFi' },
                { key: 'furnished' as const, label: 'Furnished' },
                { key: 'ac' as const, label: 'Air Conditioning' },
                { key: 'tv' as const, label: 'TV' },
                { key: 'laundryInUnit' as const, label: 'Laundry in Unit' },
                { key: 'gatedCommunity' as const, label: 'Gated Community' },
                { key: 'swimmingPool' as const, label: 'Swimming Pool' },
                { key: 'grocery' as const, label: 'Grocery' },
                { key: 'bank' as const, label: 'Bank' },
                { key: 'mall' as const, label: 'Mall' }
              ].map(amenity => (
                <label key={amenity.key} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:bg-accent cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.amenities[amenity.key]}
                    onChange={(e) => updateAmenity(amenity.key, e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
