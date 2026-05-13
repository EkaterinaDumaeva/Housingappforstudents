import { useState } from 'react';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, Shield, Lock, AlertCircle } from 'lucide-react';
import { Housing } from './HousingCard';

interface BookingFlowProps {
  housing: Housing;
  onBack: () => void;
  onComplete: (bookingData: {
    moveInDate: string;
    duration: number;
    paymentOption: 'with-deposit' | 'without-deposit';
  }) => void;
  availableSpaces?: number;
  onCheckAvailability?: (startDate: string, endDate: string) => number;
}

export function BookingFlow({ housing, onBack, onComplete, availableSpaces, onCheckAvailability }: BookingFlowProps) {
  const [step, setStep] = useState<'dates' | 'payment' | 'confirmation'>('dates');
  const [moveInDate, setMoveInDate] = useState('');
  const [duration, setDuration] = useState('3');
  const [paymentOption, setPaymentOption] = useState<'with-deposit' | 'without-deposit'>('with-deposit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [availabilityWarning, setAvailabilityWarning] = useState('');

  const deposit = housing.price * 0.5;
  const nonRefundableDeposit = deposit * 0.2; // 20% non-refundable (goes to host immediately)
  const refundableDeposit = deposit * 0.8; // 80% refundable (held in escrow)
  const totalAmount = housing.price * parseInt(duration);

  const calculateMoveOutDate = (moveIn: string, months: number) => {
    const date = new Date(moveIn);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const handleContinue = () => {
    if (step === 'dates') {
      // Check availability for selected dates
      if (onCheckAvailability && moveInDate) {
        const moveOutDate = calculateMoveOutDate(moveInDate, parseInt(duration));
        const available = onCheckAvailability(moveInDate, moveOutDate);

        if (available === 0) {
          setAvailabilityWarning('Sorry, this property is fully booked for your selected dates. Please choose different dates.');
          return;
        } else if (available < (housing.maxCapacity || 1)) {
          setAvailabilityWarning(`Note: Only ${available} space${available !== 1 ? 's' : ''} available for your selected dates.`);
        } else {
          setAvailabilityWarning('');
        }
      }
      setStep('payment');
    } else if (step === 'payment') {
      onComplete({
        moveInDate,
        duration: parseInt(duration),
        paymentOption
      });
      setStep('confirmation');
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your housing reservation has been confirmed. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-card border border-border rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Property</span>
              <span>{housing.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Move-in Date</span>
              <span>{moveInDate}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Duration</span>
              <span>{duration} months</span>
            </div>
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              {paymentOption === 'with-deposit' ? (
                <>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-blue-600" />
                      Deposit Paid
                    </span>
                    <span className="text-primary font-bold">${deposit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    ${nonRefundableDeposit.toFixed(0)} to host, ${refundableDeposit.toFixed(0)} in escrow
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Booking Type</span>
                    <span className="text-blue-600 font-medium">No Deposit Required</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {paymentOption === 'with-deposit' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-blue-900 mb-1">Protected by Escrow</div>
                  <div className="text-xs text-blue-700">
                    ${refundableDeposit.toFixed(0)} is held securely until move-out. Refunded if you follow lease terms.
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={onComplete}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-accent rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2>Book Housing</h2>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step === 'dates' || step === 'payment' ? 'bg-primary' : 'bg-border'}`} />
          <div className={`flex-1 h-1 rounded-full ${step === 'payment' ? 'bg-primary' : 'bg-border'}`} />
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="mb-2">{housing.title}</h3>
          <p className="text-sm text-muted-foreground">{housing.location}</p>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-primary">${housing.price}/month</span>
            {availableSpaces !== undefined && housing.maxCapacity && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                availableSpaces === 0
                  ? 'bg-red-100 text-red-700'
                  : availableSpaces <= 2
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
              }`}>
                {availableSpaces}/{housing.maxCapacity} available
              </span>
            )}
          </div>
        </div>

        {step === 'dates' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Move-in Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-11 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Duration (months)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="1">1 month</option>
                <option value="2">2 months</option>
                <option value="3">3 months</option>
                <option value="4">4 months</option>
                <option value="5">5 months</option>
                <option value="6">6 months</option>
              </select>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Monthly rent</span>
                <span>${housing.price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Duration</span>
                <span>{duration} months</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span>Total Rent</span>
                <span className="text-primary">${totalAmount}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-border space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Security Deposit (50%)</span>
                  <span className="text-primary">${deposit}</span>
                </div>
                <div className="ml-4 space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      Non-refundable (to host)
                    </span>
                    <span>${nonRefundableDeposit.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-blue-600" />
                      Held in escrow
                    </span>
                    <span>${refundableDeposit.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Secure Deposit Protection</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    ${refundableDeposit.toFixed(0)} is held securely on Voya Link's platform until the end of your tenancy.
                    If terms are breached, it goes to the host. If the host acts inappropriately, you get a full refund.
                    ${nonRefundableDeposit.toFixed(0)} is non-refundable and released to the host immediately.
                  </p>
                </div>
              </div>
            </div>

            {availabilityWarning && (
              <div className={`rounded-xl p-4 border ${
                availabilityWarning.includes('fully booked')
                  ? 'bg-red-50 border-red-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <p className={`text-sm ${
                  availabilityWarning.includes('fully booked')
                    ? 'text-red-700'
                    : 'text-orange-700'
                }`}>
                  {availabilityWarning}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            {/* Payment Option Selection */}
            <div className="space-y-3">
              <label className="block mb-2 font-medium">Choose Payment Option</label>

              <label
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentOption === 'with-deposit'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  value="with-deposit"
                  checked={paymentOption === 'with-deposit'}
                  onChange={(e) => setPaymentOption(e.target.value as 'with-deposit' | 'without-deposit')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium mb-1 flex items-center gap-2">
                    Pay Deposit (Recommended)
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Pay ${deposit} deposit now. ${refundableDeposit.toFixed(0)} held in escrow for your protection. Remaining ${totalAmount - deposit} due on move-in.
                  </div>
                  <div className="text-primary font-semibold">${deposit} today</div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentOption === 'without-deposit'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  value="without-deposit"
                  checked={paymentOption === 'without-deposit'}
                  onChange={(e) => setPaymentOption(e.target.value as 'with-deposit' | 'without-deposit')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium mb-1">Book Without Deposit</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Reserve now without payment. Full amount (${totalAmount}) due on move-in.
                  </div>
                  <div className="text-blue-600 font-semibold">$0 today</div>
                </div>
              </label>
            </div>

            {paymentOption === 'with-deposit' && (
              <>
                {/* Deposit Breakdown */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-900">Your Deposit Breakdown</div>
                      <div className="text-xs text-blue-700">Protected by Voya Link Escrow</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Non-refundable (to host now)
                      </span>
                      <span className="font-bold text-gray-900">${nonRefundableDeposit.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Held in escrow (refundable)
                      </span>
                      <span className="font-bold text-gray-900">${refundableDeposit.toFixed(0)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                      <span className="font-bold text-gray-900">Total Deposit</span>
                      <span className="font-bold text-blue-600 text-lg">${deposit}</span>
                    </div>
                  </div>

                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800 leading-relaxed">
                        <strong>Your protection:</strong> The ${refundableDeposit.toFixed(0)} escrow deposit is held securely on our platform.
                        If you follow all lease terms, you'll get it back at move-out. If the host violates your rights, you get an immediate refund.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium">Payment Details</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your card information to pay the deposit
                  </p>
                </div>

                <div>
                  <label className="block mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-secondary/30 rounded-xl p-3 text-xs text-muted-foreground">
                    Your payment information is secure and encrypted. We do not store your card details.
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-700">
                      <strong>Stripe Secure Processing:</strong> Your deposit is processed through Stripe and held in a secure escrow account until your lease ends.
                    </p>
                  </div>
                </div>
              </>
            )}

            {paymentOption === 'without-deposit' && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>Note:</strong> By booking without a deposit, you agree to pay the full amount of ${totalAmount} upon move-in.
                  </p>
                  <p className="text-xs text-blue-600">
                    The host may require verification before confirming your booking.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-orange-700">
                      <strong>Recommendation:</strong> Paying a deposit shows commitment and gives you the protection of our escrow service.
                      Without a deposit, you won't have the security of funds held on the platform for dispute resolution.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 p-4 bg-background border-t border-border">
        <button
          onClick={handleContinue}
          disabled={
            (step === 'dates' && (!moveInDate || (availabilityWarning.includes('fully booked')))) ||
            (step === 'payment' && paymentOption === 'with-deposit' && (!cardNumber || !cardName || !expiry || !cvv))
          }
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
        >
          {step === 'dates'
            ? 'Continue to Payment'
            : paymentOption === 'with-deposit'
              ? `Pay $${deposit}`
              : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
