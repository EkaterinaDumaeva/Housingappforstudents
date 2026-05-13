import { ShieldCheck, Shield } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  type: 'host' | 'employer' | 'participant';
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function VerificationBadge({
  isVerified,
  type,
  variant = 'default',
  className = ''
}: VerificationBadgeProps) {
  if (!isVerified) {
    if (variant === 'inline') {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-md text-xs font-medium ${className}`}>
          <Shield className="w-3 h-3" />
          Not Verified
        </span>
      );
    }
    return null;
  }

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-semibold ${className}`}>
        <ShieldCheck className="w-3 h-3" />
        Verified
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800 ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5" />
      Verified {typeLabel}
    </div>
  );
}

// Trust badge for escrow protection
export function EscrowBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold border border-green-200 dark:border-green-800 ${className}`}>
      <Shield className="w-3.5 h-3.5" />
      Protected Payment
    </div>
  );
}
