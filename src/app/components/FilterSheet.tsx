import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface FilterSheetProps {
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: [number, number];
  type: string[];
  rating: number;
}

export function FilterSheet({ onClose, onApply }: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const types = ['Apartment', 'Shared Room', 'Private Room', 'Studio'];

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleApply = () => {
    onApply({
      priceRange,
      type: selectedTypes,
      rating: minRating
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
        <h2>Filters</h2>
        <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="block mb-3">Price Range (per month)</label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">$0</span>
              <span className="text-primary">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-3">Housing Type</label>
          <div className="grid grid-cols-2 gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`py-2.5 px-4 rounded-xl border transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3">Minimum Rating</label>
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`flex-1 py-2.5 rounded-xl border transition-colors ${
                  minRating === rating
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                {rating === 0 ? 'Any' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-background border-t border-border flex gap-3">
        <button
          onClick={() => {
            setPriceRange([0, 2000]);
            setSelectedTypes([]);
            setMinRating(0);
          }}
          className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl active:scale-[0.98] transition-transform"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
