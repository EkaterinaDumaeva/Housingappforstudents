import { Check, Clock, CreditCard, XCircle, AlertTriangle, CheckCircle2, Home } from 'lucide-react';

export type BookingStatus =
  | 'request_sent'
  | 'host_accepted'
  | 'deposit_pending'
  | 'deposit_paid'
  | 'confirmed'
  | 'checked_in'
  | 'active'
  | 'checked_out'
  | 'completed'
  | 'cancelled_by_participant'
  | 'cancelled_by_host'
  | 'disputed';

interface BookingStatusFlowProps {
  currentStatus: BookingStatus;
  bookingData?: {
    requestDate?: string;
    acceptedDate?: string;
    depositPaidDate?: string;
    checkInDate?: string;
    checkOutDate?: string;
    completedDate?: string;
  };
}

export function BookingStatusFlow({ currentStatus, bookingData = {} }: BookingStatusFlowProps) {
  const statusSteps = [
    {
      id: 'request_sent',
      label: 'Request Sent',
      description: 'Waiting for host response',
      icon: Clock,
      color: 'blue'
    },
    {
      id: 'host_accepted',
      label: 'Host Accepted',
      description: 'Host approved your request',
      icon: CheckCircle2,
      color: 'green'
    },
    {
      id: 'deposit_pending',
      label: 'Deposit Pending',
      description: 'Pay deposit to confirm booking',
      icon: CreditCard,
      color: 'orange'
    },
    {
      id: 'deposit_paid',
      label: 'Deposit Paid',
      description: 'Processing payment',
      icon: Check,
      color: 'blue'
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      description: 'Booking is confirmed',
      icon: CheckCircle2,
      color: 'green'
    },
    {
      id: 'checked_in',
      label: 'Checked In',
      description: 'You have moved in',
      icon: Home,
      color: 'purple'
    },
    {
      id: 'completed',
      label: 'Completed',
      description: 'Booking completed successfully',
      icon: CheckCircle2,
      color: 'green'
    }
  ];

  const getStatusIndex = () => {
    if (currentStatus === 'cancelled_by_participant' || currentStatus === 'cancelled_by_host') {
      return -1;
    }
    if (currentStatus === 'disputed') {
      return -2;
    }
    return statusSteps.findIndex(step => step.id === currentStatus);
  };

  const currentIndex = getStatusIndex();

  const getStepColor = (stepIndex: number, stepColor: string) => {
    if (currentIndex === -1 || currentIndex === -2) {
      return 'slate';
    }
    if (stepIndex <= currentIndex) {
      return stepColor;
    }
    return 'slate';
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-600',
      lightBg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    green: {
      bg: 'bg-green-600',
      text: 'text-green-600',
      border: 'border-green-600',
      lightBg: 'bg-green-100 dark:bg-green-900/30'
    },
    orange: {
      bg: 'bg-orange-600',
      text: 'text-orange-600',
      border: 'border-orange-600',
      lightBg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    purple: {
      bg: 'bg-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-600',
      lightBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    slate: {
      bg: 'bg-slate-300 dark:bg-slate-700',
      text: 'text-slate-400 dark:text-slate-500',
      border: 'border-slate-300 dark:border-slate-700',
      lightBg: 'bg-slate-100 dark:bg-slate-800'
    },
    red: {
      bg: 'bg-red-600',
      text: 'text-red-600',
      border: 'border-red-600',
      lightBg: 'bg-red-100 dark:bg-red-900/30'
    }
  };

  // Handle cancelled or disputed status
  if (currentStatus === 'cancelled_by_participant') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-100">Booking Cancelled</h3>
            <p className="text-sm text-red-700 dark:text-red-300">You cancelled this booking</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStatus === 'cancelled_by_host') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-100">Booking Cancelled</h3>
            <p className="text-sm text-red-700 dark:text-red-300">Host cancelled this booking</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStatus === 'disputed') {
    return (
      <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-orange-900 dark:text-orange-100">Dispute in Progress</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">Admin is reviewing this case</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6">
      <h3 className="font-bold text-slate-900 dark:text-white mb-6">Booking Status</h3>

      {/* Desktop: Horizontal Flow */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-500"
              style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => {
              const stepColor = getStepColor(index, step.color);
              const colors = colorClasses[stepColor as keyof typeof colorClasses];
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div key={step.id} className="flex flex-col items-center" style={{ width: `${100 / statusSteps.length}%` }}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted || isActive ? colors.bg : colors.lightBg
                  } ${isActive ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-800' : ''} ${
                    isActive ? `ring-${stepColor}-200` : ''
                  } transition-all duration-300`}>
                    <step.icon className={`w-6 h-6 ${isCompleted || isActive ? 'text-white' : colors.text}`} />
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`text-sm font-semibold ${isActive ? colors.text : 'text-slate-600 dark:text-slate-400'}`}>
                      {step.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-[120px]">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Flow */}
      <div className="lg:hidden space-y-3">
        {statusSteps.map((step, index) => {
          const stepColor = getStepColor(index, step.color);
          const colors = colorClasses[stepColor as keyof typeof colorClasses];
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.id} className="relative flex items-start gap-3">
              {/* Vertical line */}
              {index < statusSteps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700">
                  {isCompleted && (
                    <div className="w-full bg-gradient-to-b from-blue-600 to-green-600 h-full" />
                  )}
                </div>
              )}

              {/* Icon */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                isCompleted || isActive ? colors.bg : colors.lightBg
              } ${isActive ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-800' : ''} transition-all duration-300`}>
                <step.icon className={`w-6 h-6 ${isCompleted || isActive ? 'text-white' : colors.text}`} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className={`font-semibold ${isActive ? colors.text : 'text-slate-600 dark:text-slate-400'}`}>
                  {step.label}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status Badge */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">Current Status:</span>
          <span className={`px-4 py-2 rounded-lg font-semibold ${
            colorClasses[statusSteps[currentIndex]?.color as keyof typeof colorClasses]?.lightBg
          } ${colorClasses[statusSteps[currentIndex]?.color as keyof typeof colorClasses]?.text}`}>
            {statusSteps[currentIndex]?.label}
          </span>
        </div>
      </div>
    </div>
  );
}
