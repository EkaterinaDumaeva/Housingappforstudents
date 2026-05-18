import { useState } from 'react';
import { Building2, MapPin, DollarSign, Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText, MessageCircle, MoreVertical } from 'lucide-react';

export type JobOfferStatus =
  | 'not_started'
  | 'employer_contacted'
  | 'interview_requested'
  | 'interview_scheduled'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_declined'
  | 'offer_cancelled'
  | 'offer_expired';

export interface JobOfferData {
  id: string;
  employerId: string;
  employerName: string;
  employerLogo?: string;
  participantId: string;
  participantName: string;
  jobTitle: string;
  jobLocation: string;
  salary: string;
  startDate: string;
  status: JobOfferStatus;
  sentDate: string;
  expiresDate?: string;
  interviewDate?: string;
  notes?: string;
}

interface JobOfferCardProps {
  offer: JobOfferData;
  viewMode: 'participant' | 'employer';
  onAccept?: (offerId: string) => void;
  onDecline?: (offerId: string) => void;
  onCancel?: (offerId: string) => void;
  onMessage?: (userId: string) => void;
  showActions?: boolean;
}

export function JobOfferCard({ offer, viewMode, onAccept, onDecline, onCancel, onMessage, showActions = true }: JobOfferCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusConfig = (status: JobOfferStatus) => {
    switch (status) {
      case 'not_started':
        return { color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300', icon: Clock, label: 'Not Started' };
      case 'employer_contacted':
        return { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', icon: MessageCircle, label: 'Contacted' };
      case 'interview_requested':
        return { color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', icon: Calendar, label: 'Interview Requested' };
      case 'interview_scheduled':
        return { color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400', icon: Calendar, label: 'Interview Scheduled' };
      case 'offer_sent':
        return { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: FileText, label: 'Offer Sent' };
      case 'offer_accepted':
        return { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', icon: CheckCircle, label: 'Offer Accepted' };
      case 'offer_declined':
        return { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: XCircle, label: 'Offer Declined' };
      case 'offer_cancelled':
        return { color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300', icon: XCircle, label: 'Offer Cancelled' };
      case 'offer_expired':
        return { color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', icon: AlertCircle, label: 'Offer Expired' };
      default:
        return { color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300', icon: Clock, label: status };
    }
  };

  const statusConfig = getStatusConfig(offer.status);
  const StatusIcon = statusConfig.icon;

  const canAccept = offer.status === 'offer_sent' && viewMode === 'participant';
  const canDecline = ['offer_sent', 'interview_scheduled'].includes(offer.status) && viewMode === 'participant';
  const canCancel = ['offer_sent', 'offer_accepted'].includes(offer.status) && viewMode === 'employer';

  const isExpired = offer.expiresDate && new Date(offer.expiresDate) < new Date();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {viewMode === 'participant' ? offer.employerName.charAt(0).toUpperCase() : offer.participantName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{offer.jobTitle}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {viewMode === 'participant' ? offer.employerName : `For: ${offer.participantName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </span>

          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-20 min-w-[180px]">
                    {onMessage && (
                      <button
                        onClick={() => {
                          onMessage(viewMode === 'participant' ? offer.employerId : offer.participantId);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send Message
                      </button>
                    )}
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300">{offer.jobLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300">{offer.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300">Start: {new Date(offer.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300">Sent: {new Date(offer.sentDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Expiration Warning */}
      {isExpired && offer.status === 'offer_sent' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>This offer has expired</span>
          </div>
        </div>
      )}

      {/* Interview Date */}
      {offer.interviewDate && offer.status === 'interview_scheduled' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
            <Calendar className="w-4 h-4" />
            <span>Interview scheduled for {new Date(offer.interviewDate).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      {offer.notes && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">{offer.notes}</p>
        </div>
      )}

      {/* Active Offer Limitation Warning (for participants) */}
      {viewMode === 'participant' && offer.status === 'offer_accepted' && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-1">Active Job Offer</p>
              <p>
                You have one active job offer. To receive another offer, you must first decline or cancel this offer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {canAccept && onAccept && (
            <button
              onClick={() => onAccept(offer.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Accept Offer
            </button>
          )}

          {canDecline && onDecline && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to decline this offer?')) {
                  onDecline(offer.id);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <XCircle className="w-4 h-4" />
              Decline Offer
            </button>
          )}

          {canCancel && onCancel && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel this offer?')) {
                  onCancel(offer.id);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              <XCircle className="w-4 h-4" />
              Cancel Offer
            </button>
          )}

          {onMessage && (
            <button
              onClick={() => onMessage(viewMode === 'participant' ? offer.employerId : offer.participantId)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Message {viewMode === 'participant' ? 'Employer' : 'Participant'}
            </button>
          )}
        </div>
      )}

      {/* Blocked Offer Message (for employers) */}
      {viewMode === 'employer' && offer.status === 'offer_accepted' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900 dark:text-red-100">
              <p className="font-semibold mb-1">Participant Has Active Offer</p>
              <p>
                This participant already has an active job offer with another employer. They must decline or cancel their current offer before receiving another one.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
