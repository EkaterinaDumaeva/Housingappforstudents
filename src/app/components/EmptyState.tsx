import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 md:py-16 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary opacity-60" />
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Action button */}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Specialized empty state for cards/grids
export function EmptyStateCard({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
      <EmptyState
        icon={Icon}
        title={title}
        description={description}
        action={action}
      />
    </div>
  );
}
