import { Bell, Users, Shield, CheckCircle } from 'lucide-react';

interface EmployerMarketplaceLockedProps {
  onNotifyMe: () => void;
  onJoinWaitlist: () => void;
}

export function EmployerMarketplaceLocked({ onNotifyMe, onJoinWaitlist }: EmployerMarketplaceLockedProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px] p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 sm:p-12 shadow-xl">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Building a Trusted Employer Network
          </h2>

          {/* Message */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
              We are carefully building a trusted network of verified employers and sponsor-supported opportunities.
            </p>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
              To protect both students and employers, we are taking the time to establish the right partnerships before opening this section.
            </p>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              Employer opportunities will become available as approved partners are added to the platform.
            </p>
          </div>

          {/* Features List */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              What to Expect
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300">Verified employers with sponsor support</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300">Transparent job descriptions and expectations</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300">Protected communication within the platform</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300">Secure job offer tracking and management</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNotifyMe}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Notify Me When Available
            </button>
            <button
              onClick={onJoinWaitlist}
              className="flex-1 px-6 py-4 bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 font-semibold rounded-xl border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600 transition-all"
            >
              Join Waitlist
            </button>
          </div>

          {/* Subtle note */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            You can still use filters above to explore job categories and locations
          </p>
        </div>
      </div>
    </div>
  );
}
