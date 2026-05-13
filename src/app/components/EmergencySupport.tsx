import { AlertTriangle, Phone, Mail, MessageCircle, MapPin, Calendar, Home, Shield } from 'lucide-react';

interface EmergencySupportProps {
  reservation: {
    id: string;
    listingTitle: string;
    startDate: string;
    endDate: string;
    hostName?: string;
    participantName?: string;
  };
  userType: 'participant' | 'host';
}

export function EmergencySupport({ reservation, userType }: EmergencySupportProps) {
  const handleContactSupport = (method: string) => {
    console.log(`Contacting support via ${method} for reservation ${reservation.id}`);
    alert(`Emergency support has been notified via ${method}.\n\nA support specialist will contact you within 30 minutes.\n\nFor immediate assistance, call: +1 (800) VOYA-911`);
  };

  const handleRequestRehouse = () => {
    console.log('Requesting priority rehouse assistance');
    alert(
      `Priority Rehouse Request Submitted!\n\n` +
      `Our team is now searching for alternative housing options for you.\n\n` +
      `Expected response time: Within 2 hours\n\n` +
      `You will receive:\n` +
      `• List of available alternatives in the same area\n` +
      `• Priority booking status\n` +
      `• Full refund for the cancelled reservation\n` +
      `• Additional support throughout the transition`
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 space-y-6">
      {/* Emergency Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 dark:text-red-300 mb-1">Emergency Support Activated</h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {userType === 'participant'
                ? 'Your host has cancelled your reservation. We are here to help you find alternative housing and provide full support.'
                : 'Host cancellation support is available for emergency situations only. Misuse may result in account penalties.'}
            </p>
          </div>
        </div>
      </div>

      {/* Reservation Details */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" />
          Affected Reservation
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Listing:</span>
            <span className="font-medium text-slate-900 dark:text-white">{reservation.listingTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Check-in Date:</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {new Date(reservation.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Check-out Date:</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {new Date(reservation.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Contact Options */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Emergency Contact Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <button
            onClick={() => handleContactSupport('phone')}
            className="flex items-center gap-3 p-3 sm:p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Phone className="w-5 h-5 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <div className="font-bold text-sm sm:text-base">Call Emergency Hotline</div>
              <div className="text-xs sm:text-sm text-white/90 truncate">+1 (800) VOYA-911 - 24/7 Support</div>
            </div>
          </button>

          <button
            onClick={() => handleContactSupport('email')}
            className="flex items-center gap-3 p-3 sm:p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-5 h-5 flex-shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <div className="font-bold text-sm sm:text-base">Email Support Team</div>
              <div className="text-xs sm:text-sm text-white/90 truncate">emergency@voyalink.com</div>
            </div>
          </button>

          <button
            onClick={() => handleContactSupport('chat')}
            className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1"
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-left flex-1">
              <div className="font-bold text-sm sm:text-base">Live Chat Support</div>
              <div className="text-xs sm:text-sm text-white/90">Connect with a specialist now</div>
            </div>
          </button>
        </div>
      </div>

      {/* Priority Rehouse Assistance (Participants Only) */}
      {userType === 'participant' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Priority Rehouse Assistance
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400 mb-4">
            We'll help you find alternative housing immediately. Our team will provide you with verified options in the same area with priority booking status.
          </p>
          <button
            onClick={handleRequestRehouse}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Request Priority Rehouse
          </button>
        </div>
      )}

      {/* Refund Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Full Refund Guarantee</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          {userType === 'participant'
            ? 'You will receive a full refund of all payments made for this reservation. Refunds are typically processed within 5-7 business days.'
            : 'The participant will receive a full refund for this cancellation. This is required for all host-initiated cancellations.'}
        </p>
      </div>

      {/* Additional Resources */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Additional Resources</h3>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Visit our Help Center for detailed cancellation policies and FAQs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Access your booking history and download receipts from your dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Report any issues or concerns to our Trust & Safety team</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
