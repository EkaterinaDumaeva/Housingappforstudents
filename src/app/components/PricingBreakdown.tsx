import { DollarSign, AlertTriangle, Shield, Info, CheckCircle } from 'lucide-react';

interface Fee {
  name: string;
  amount: number;
  description: string;
  required: boolean;
}

interface PricingBreakdownProps {
  weeklyRent: number;
  deposit: number;
  fees: Fee[];
  durationWeeks: number;
  showWarnings?: boolean;
}

export function PricingBreakdown({
  weeklyRent,
  deposit,
  fees,
  durationWeeks,
  showWarnings = true
}: PricingBreakdownProps) {
  const totalRequiredFees = fees
    .filter(f => f.required)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalOptionalFees = fees
    .filter(f => !f.required)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalUpfront = deposit + totalRequiredFees;
  const totalWeeklyRent = weeklyRent * durationWeeks;
  const grandTotal = totalUpfront + totalWeeklyRent + totalOptionalFees;

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      {showWarnings && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-900 dark:text-red-100 mb-2">
                ⚠️ Never Pay Outside the Platform
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• All payments must go through the platform for your protection</li>
                <li>• Do NOT send money via Zelle, Venmo, Cash App, or wire transfer</li>
                <li>• Do NOT pay cash or use payment apps directly to the host</li>
                <li>• Report any host requesting off-platform payment immediately</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Pricing Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-bold text-lg">Complete Price Breakdown</h3>
          </div>
          <p className="text-sm text-white/80">All fees disclosed upfront - no surprises</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Upfront Costs */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Due Before Move-In
            </h4>

            <div className="space-y-2">
              {/* Deposit */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">Security Deposit</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Protected by platform • 80% refundable
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">${deposit.toFixed(2)}</div>
              </div>

              {/* Required Fees */}
              {fees.filter(f => f.required).map((fee, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">{fee.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{fee.description}</div>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">${fee.amount.toFixed(2)}</div>
                </div>
              ))}

              {/* Upfront Total */}
              <div className="flex items-center justify-between py-3 bg-primary/5 dark:bg-primary/10 rounded-lg px-3 mt-2">
                <div className="font-bold text-slate-900 dark:text-white">Total Due Before Move-In</div>
                <div className="text-xl font-bold text-primary">${totalUpfront.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Weekly Rent */}
          <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              Weekly Rent
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">
                    ${weeklyRent.toFixed(2)} per week × {durationWeeks} weeks
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Paid weekly after you move in
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">${totalWeeklyRent.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Optional Fees */}
          {fees.filter(f => !f.required).length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Optional Fees
              </h4>

              <div className="space-y-2">
                {fees.filter(f => !f.required).map((fee, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        {fee.name}
                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                          Optional
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{fee.description}</div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">${fee.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total for {durationWeeks}-week stay</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    Including {totalOptionalFees > 0 ? 'optional fees' : 'all required fees'}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">${grandTotal.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protection Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-2">
              Your Payment is Protected
            </h5>
            <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
              <li>✓ All fees disclosed before booking - no hidden charges</li>
              <li>✓ Deposit held securely by platform, not by host</li>
              <li>✓ Automatic refund if host cancels or fails to provide housing</li>
              <li>✓ Dispute resolution and admin support included</li>
              <li>✓ Payment protection against fraud and scams</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Host Communication Warning */}
      {showWarnings && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-2">
                If Host Asks for Additional Payments
              </h5>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                If the host contacts you asking for money outside the platform or demands fees not listed here,
                this is against platform rules and may be a scam.
              </p>
              <button className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 hover:underline">
                Report this immediately →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
