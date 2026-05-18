import { TrendingUp } from 'lucide-react';

interface SponsoredBadgeProps {
  variant?: 'small' | 'medium' | 'large';
  className?: string;
}

export function SponsoredBadge({ variant = 'medium', className = '' }: SponsoredBadgeProps) {
  const sizes = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-semibold rounded-full ${sizes[variant]} ${className}`}>
      <TrendingUp className={iconSizes[variant]} />
      <span>Sponsored</span>
    </div>
  );
}
