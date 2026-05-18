import { useState } from 'react';
import { Calendar, CreditCard, CheckCircle, AlertCircle, Clock, Zap, Shield, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

interface PaymentRecord {
  id: string;
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  amount: number;
  status: 'paid' | 'due' | 'overdue' | 'upcoming';
  paidDate?: string;
  dueDate: string;
  paymentMethod?: string;
}

interface WeeklyRentPaymentProps {
  weeklyRentAmount: number;
  totalWeeks: number;
  currentWeek: number;
  autopayEnabled: boolean;
  onToggleAutopay: (enabled: boolean) => void;
  onPayNow: (weekId: string) => void;
  paymentHistory: PaymentRecord[];
}

export function WeeklyRentPayment({
  weeklyRentAmount,
  totalWeeks,
  currentWeek,
  autopayEnabled,
  onToggleAutopay,
  onPayNow,
  paymentHistory
}: WeeklyRentPaymentProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showAutopayModal, setShowAutopayModal] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-400',
          badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
          icon: CheckCircle
        };
      case 'due':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          text: 'text-orange-700 dark:text-orange-400',
          badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
          icon: AlertCircle
        };
      case 'overdue':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-400',
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
          icon: AlertCircle
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800',
          border: 'border-slate-200 dark:border-slate-700',
          text: 'text-slate-600 dark:text-slate-400',
          badge: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
          icon: Clock
        };
    }
  };

  const paidWeeks = paymentHistory.filter(p => p.status === 'paid').length;
  const overduePayments = paymentHistory.filter(p => p.status === 'overdue');
  const duePayments = paymentHistory.filter(p => p.status === 'due');

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">${weeklyRentAmount.toFixed(2)}</h3>
            <p className="text-sm text-white/80">Weekly Rent</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold">{paidWeeks}</div>
            <div className="text-xs text-white/80">Paid</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold">{currentWeek}</div>
            <div className="text-xs text-white/80">Current Week</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold">{totalWeeks}</div>
            <div className="text-xs text-white/80">Total Weeks</div>
          </div>
        </div>
      </div>

      {/* Autopay Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              autopayEnabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'
            }`}>
              <Zap className={`w-6 h-6 ${
                autopayEnabled ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                Automatic Weekly Payments
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {autopayEnabled
                  ? 'Rent is automatically charged every week. Never miss a payment!'
                  : 'Enable autopay to automatically pay rent each week.'}
              </p>
              {autopayEnabled && (
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Autopay Active
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAutopayModal(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              autopayEnabled
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {autopayEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {!autopayEnabled && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Benefits of Autopay
                </h5>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>✓ Never miss a payment</li>
                  <li>✓ Avoid late fees</li>
                  <li>✓ One less thing to worry about</li>
                  <li>✓ Can be disabled anytime</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overdue Alerts */}
      {overduePayments.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">
                {overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Please pay immediately to avoid penalties
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {overduePayments.map((payment) => (
              <div key={payment.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Week {payment.weekNumber}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => onPayNow(payment.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Pay ${payment.amount.toFixed(2)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Due This Week */}
      {duePayments.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-1">
                Payment Due This Week
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Pay by {new Date(duePayments[0].dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          {duePayments.map((payment) => (
            <button
              key={payment.id}
              onClick={() => onPayNow(payment.id)}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg p-4 hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="text-left">
                <div className="font-bold text-lg">Week {payment.weekNumber}</div>
                <div className="text-sm text-white/80">
                  {new Date(payment.weekStart).toLocaleDateString()} - {new Date(payment.weekEnd).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold">${payment.amount.toFixed(2)}</div>
                  <div className="text-xs text-white/80">Pay Now</div>
                </div>
                <CreditCard className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <h4 className="font-bold text-slate-900 dark:text-white">Payment History</h4>
          {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showHistory && (
          <div className="border-t border-slate-200 dark:border-slate-700">
            {paymentHistory.length === 0 ? (
              <div className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No payment history yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {paymentHistory.map((payment) => {
                  const config = getStatusConfig(payment.status);
                  const StatusIcon = config.icon;

                  return (
                    <div key={payment.id} className={`p-4 ${config.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.badge}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              Week {payment.weekNumber}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {new Date(payment.weekStart).toLocaleDateString()} - {new Date(payment.weekEnd).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">
                            ${payment.amount.toFixed(2)}
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${config.badge}`}>
                            {payment.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      {payment.status === 'paid' && payment.paidDate && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 ml-13">
                          Paid on {new Date(payment.paidDate).toLocaleDateString()}
                          {payment.paymentMethod && ` • ${payment.paymentMethod}`}
                        </div>
                      )}
                      {(payment.status === 'due' || payment.status === 'overdue') && (
                        <div className="mt-2">
                          <button
                            onClick={() => onPayNow(payment.id)}
                            className={`text-xs font-medium ${config.text} hover:underline`}
                          >
                            Pay Now →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Autopay Modal */}
      {showAutopayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {autopayEnabled ? 'Disable Autopay?' : 'Enable Autopay?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {autopayEnabled
                  ? 'You will need to manually pay rent each week. Make sure to pay on time to avoid late fees.'
                  : 'Rent will be automatically charged to your saved payment method every week. You can disable this anytime.'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onToggleAutopay(!autopayEnabled);
                    setShowAutopayModal(false);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    autopayEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {autopayEnabled ? 'Disable Autopay' : 'Enable Autopay'}
                </button>
                <button
                  onClick={() => setShowAutopayModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
