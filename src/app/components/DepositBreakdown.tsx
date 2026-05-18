import { DollarSign, Shield, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';

interface DepositBreakdownProps {
  totalDeposit: number;
  reservationFeePercentage?: number; // Default 20%
  refundablePercentage?: number; // Default 80%
  status: 'pending' | 'paid' | 'held' | 'released' | 'partially_refunded' | 'disputed';
  bookingData?: {
    checkInDate?: string;
    checkOutDate?: string;
    participantName?: string;
    hostName?: string;
    listingTitle?: string;
  };
}

export function DepositBreakdown({
  totalDeposit,
  reservationFeePercentage = 20,
  refundablePercentage = 80,
  status,
  bookingData = {}
}: DepositBreakdownProps) {
  const reservationFee = totalDeposit * (reservationFeePercentage / 100);
  const refundableDeposit = totalDeposit * (refundablePercentage / 100);

  const statusConfig = {
    pending: {
      color: 'orange',
      icon: Clock,
      title: 'Deposit Payment Pending',
      description: 'Complete payment to confirm your booking',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-900 dark:text-orange-100'
    },
    paid: {
      color: 'blue',
      icon: CheckCircle,
      title: 'Deposit Paid',
      description: 'Processing your payment',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-900 dark:text-blue-100'
    },
    held: {
      color: 'purple',
      icon: Shield,
      title: 'Deposit Held Securely',
      description: 'Your deposit is protected by the platform',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-900 dark:text-purple-100'
    },
    released: {
      color: 'green',
      icon: CheckCircle,
      title: 'Deposit Released',
      description: 'Your refundable deposit has been returned',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-900 dark:text-green-100'
    },
    partially_refunded: {
      color: 'yellow',
      icon: AlertCircle,
      title: 'Partial Refund Issued',
      description: 'A portion was deducted for approved claims',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-900 dark:text-yellow-100'
    },
    disputed: {
      color: 'red',
      icon: AlertCircle,
      title: 'Deposit Under Review',
      description: 'Admin is reviewing a claim on this deposit',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-100'
    }
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Status Header */}
      <div className={`${currentStatus.bgColor} border-b ${currentStatus.borderColor} p-4 sm:p-6`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-${currentStatus.color}-600 rounded-full flex items-center justify-center text-white`}>
            <StatusIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold ${currentStatus.textColor}`}>
              {currentStatus.title}
            </h3>
            <p className={`text-sm ${currentStatus.textColor} opacity-80`}>
              {currentStatus.description}
            </p>
          </div>
        </div>
      </div>

      {/* Deposit Breakdown */}
      <div className="p-4 sm:p-6">
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Deposit Breakdown
        </h4>

        <div className="space-y-4">
          {/* Total Deposit */}
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border border-primary/20 dark:border-primary/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Deposit</span>
              <span className="text-2xl font-bold text-primary">${totalDeposit.toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              One-time payment required to confirm booking
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3">
            {/* Reservation Fee */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Reservation Fee ({reservationFeePercentage}%)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${reservationFee.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Non-refundable. Released to host only after successful check-in.
                </p>
              </div>
            </div>

            {/* Refundable Security Deposit */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Refundable Security Deposit ({refundablePercentage}%)
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${refundableDeposit.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Held securely. Automatically released 3 days after check-out unless host opens a case.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Notice */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                Platform Protection
              </h5>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Your deposit is held securely by the platform</li>
                <li>• Automatic refund if host cancels or fails to provide housing</li>
                <li>• Admin reviews all disputes fairly</li>
                <li>• 3-day automatic release after check-out</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline Info */}
        {status === 'held' && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h5 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Deposit Timeline</h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">
                  <strong>Now:</strong> Deposit held securely
                </span>
              </div>
              {bookingData.checkInDate && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong>{new Date(bookingData.checkInDate).toLocaleDateString()}:</strong> Check-in (reservation fee released to host)
                  </span>
                </div>
              )}
              {bookingData.checkOutDate && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    <strong>{new Date(bookingData.checkOutDate).toLocaleDateString()}:</strong> Check-out
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">
                  <strong>3 days after check-out:</strong> Automatic refund (if no case opened)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
