import { Shield, CheckCircle, XCircle, AlertTriangle, Star, MessageCircle, Calendar, Award, Mail, Phone, FileCheck } from 'lucide-react';

export interface ReliabilityData {
  reliabilityScore: number; // 0-100
  cancellationRate: number; // percentage
  totalCancellations: number;
  responseRate: number; // percentage
  averageResponseTime: string; // e.g., "2 hours"
  casesOpened: number;
  casesResolved: number;
  totalReservations: number;
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    government: boolean;
  };
  strikes: number;
  warnings: number;
  badges: string[];
}

interface ReliabilityProfileProps {
  userType: 'host' | 'participant';
  data: ReliabilityData;
  compact?: boolean;
  customLabel?: string; // Custom label to override default "Reliability Score"
  isOwnProfile?: boolean; // Hide performance metrics when viewing own profile
}

export function ReliabilityProfile({ userType, data, compact = false, customLabel, isOwnProfile = false }: ReliabilityProfileProps) {
  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getReliabilityBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 75) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (score >= 60) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getReliabilityLabel = (score: number) => {
    if (score >= 95) return 'Exceptional';
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const isFullyVerified = data.verifications.email && data.verifications.phone &&
                          data.verifications.identity && data.verifications.government;

  if (compact) {
    const compactLabel = customLabel
      ? `${data.reliabilityScore}% Rating`
      : `${data.reliabilityScore}% Reliable`;

    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getReliabilityBgColor(data.reliabilityScore)}`}>
          <Shield className={`w-4 h-4 ${getReliabilityColor(data.reliabilityScore)}`} />
          <span className={`text-sm font-bold ${getReliabilityColor(data.reliabilityScore)}`}>
            {compactLabel}
          </span>
        </div>
        {isFullyVerified && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Account Verified</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
      {/* Reliability Score Header */}
      <div className={`rounded-xl p-6 border ${getReliabilityBgColor(data.reliabilityScore)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
              <Shield className={`w-6 h-6 ${getReliabilityColor(data.reliabilityScore)}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {customLabel || `${userType === 'host' ? 'Host' : 'Participant'} Reliability Score`}
              </h3>
              <p className={`text-3xl font-bold ${getReliabilityColor(data.reliabilityScore)}`}>
                {data.reliabilityScore}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${getReliabilityColor(data.reliabilityScore)} ${getReliabilityBgColor(data.reliabilityScore)}`}>
              {getReliabilityLabel(data.reliabilityScore)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              data.reliabilityScore >= 90
                ? 'bg-green-500'
                : data.reliabilityScore >= 75
                ? 'bg-yellow-500'
                : data.reliabilityScore >= 60
                ? 'bg-orange-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${data.reliabilityScore}%` }}
          />
        </div>
      </div>

      {/* Account Verification Status */}
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Account Status
        </h4>
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          isFullyVerified
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isFullyVerified
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : 'bg-yellow-100 dark:bg-yellow-900/30'
          }`}>
            {isFullyVerified ? (
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            )}
          </div>
          <div className="flex-1">
            <h5 className={`font-semibold mb-1 ${
              isFullyVerified
                ? 'text-blue-900 dark:text-blue-300'
                : 'text-yellow-900 dark:text-yellow-300'
            }`}>
              {isFullyVerified ? 'Account Verified' : 'Verification Incomplete'}
            </h5>
            <p className={`text-sm ${
              isFullyVerified
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-yellow-700 dark:text-yellow-400'
            }`}>
              {isFullyVerified
                ? 'All identity checks completed'
                : 'Complete verification to increase trust'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics - Only visible to other users */}
      {!isOwnProfile && userType === 'host' && (
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Response Rate</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{data.responseRate}%</span>
            </div>

            {/* Only show Cancellation Rate for actual hosts, not employers */}
            {!customLabel?.includes('Rating') && !customLabel?.includes('Employer') && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Cancellation Rate</span>
                </div>
                <span className={`font-bold ${
                  data.cancellationRate <= 5
                    ? 'text-green-600 dark:text-green-400'
                    : data.cancellationRate <= 10
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {data.cancellationRate}%
                </span>
              </div>
            )}

            {/* Only show Cases Opened for actual hosts, not employers */}
            {!customLabel?.includes('Rating') && !customLabel?.includes('Employer') && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Cases Opened</span>
                </div>
                <span className={`font-bold ${
                  data.casesOpened === 0
                    ? 'text-green-600 dark:text-green-400'
                    : data.casesOpened <= 2
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {data.casesOpened}
                </span>
              </div>
            )}

            {/* Only show Total Reservations for actual hosts, not employers */}
            {!customLabel?.includes('Rating') && !customLabel?.includes('Employer') && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Total Reservations</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{data.totalReservations}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Status Warnings */}
      {(data.strikes > 0 || data.warnings > 0) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">Account Warnings</h4>
              {data.strikes > 0 && (
                <p className="text-sm text-red-700 dark:text-red-400 mb-1">
                  ⚠️ Account Strikes: {data.strikes}/3 (Account may be suspended if strikes reach 3)
                </p>
              )}
              {data.warnings > 0 && (
                <p className="text-sm text-red-700 dark:text-red-400">
                  ⚠️ Active Warnings: {data.warnings}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation History - Only visible to other users */}
      {!isOwnProfile && data.totalCancellations > 0 && (
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Cancellation History</h4>
          <div className={`p-4 rounded-lg border ${
            data.totalCancellations <= 1
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : data.totalCancellations <= 3
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
              Total Cancellations: <span className="font-bold">{data.totalCancellations}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Out of {data.totalReservations} total reservations
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
