import { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface CityOption {
  city: string;
  state: string;
  country: string;
  displayName: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string, cityData?: CityOption) => void;
}

// Mock city database for autocomplete
const mockCities: CityOption[] = [
  { city: 'New York', state: 'NY', country: 'USA', displayName: 'New York, NY, USA' },
  { city: 'Los Angeles', state: 'CA', country: 'USA', displayName: 'Los Angeles, CA, USA' },
  { city: 'Miami', state: 'FL', country: 'USA', displayName: 'Miami, FL, USA' },
  { city: 'Chicago', state: 'IL', country: 'USA', displayName: 'Chicago, IL, USA' },
  { city: 'San Diego', state: 'CA', country: 'USA', displayName: 'San Diego, CA, USA' },
  { city: 'Orlando', state: 'FL', country: 'USA', displayName: 'Orlando, FL, USA' },
  { city: 'San Francisco', state: 'CA', country: 'USA', displayName: 'San Francisco, CA, USA' },
  { city: 'Las Vegas', state: 'NV', country: 'USA', displayName: 'Las Vegas, NV, USA' },
  { city: 'Boston', state: 'MA', country: 'USA', displayName: 'Boston, MA, USA' },
  { city: 'Seattle', state: 'WA', country: 'USA', displayName: 'Seattle, WA, USA' },
  { city: 'Austin', state: 'TX', country: 'USA', displayName: 'Austin, TX, USA' },
  { city: 'Denver', state: 'CO', country: 'USA', displayName: 'Denver, CO, USA' },
];

export function LocationSearch({ value, onChange }: LocationSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filteredCities = inputValue.length > 0
    ? mockCities.filter(city =>
        city.displayName.toLowerCase().includes(inputValue.toLowerCase()) ||
        city.city.toLowerCase().includes(inputValue.toLowerCase()) ||
        city.state.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const handleSelectCity = (city: CityOption) => {
    setInputValue(city.displayName);
    onChange(city.displayName, city);
    setIsFocused(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search by city..."
          className="w-full pl-11 pr-10 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {isFocused && filteredCities.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20 max-h-64 overflow-y-auto">
          {filteredCities.map((city, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectCity(city);
              }}
              className="w-full px-4 py-3 hover:bg-accent transition-colors text-left flex items-center gap-3"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm">{city.city}</div>
                <div className="text-xs text-muted-foreground">{city.state}, {city.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
