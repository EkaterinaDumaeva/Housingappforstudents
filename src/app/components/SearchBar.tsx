import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onLocationClick: () => void;
}

export function SearchBar({ value, onChange, onLocationClick }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by city or location..."
        className="w-full pl-12 pr-12 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={onLocationClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
}
