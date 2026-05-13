import { useState } from 'react';
import { Calendar, MapPin, User, Mail, Phone, AlertCircle, CheckCircle, Clock, DollarSign, X } from 'lucide-react';
import { CancellationModal } from './CancellationModal';
import { EmergencySupport } from './EmergencySupport';

interface Reservation {
  id: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  listingTitle: string;
  checkIn: string;
  checkOut: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
}

interface HostReservationsProps {
  onOpenCase: (reservationId: string, participantName: string, participantEmail: string, listingTitle: string) => void;
}

// Mock reservations data
const mockReservations: Reservation[] = [];

export function HostReservations({ onOpenCase }: HostReservationsProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showEmergencySupport, setShowEmergencySupport] = useState(false);

  const filteredReservations = filter === 'all'
    ? mockReservations
    : mockReservations.filter(r => r.status === filter);

  const handleCancelClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancellationModal(true);
  };

  const handleCancelReservation = (reason: string, requestException: boolean) => {
    console.log(`Host cancelling reservation ${selectedReservation?.id} for reason: ${reason}`);
    alert(
      `⚠️ Reservation Cancellation Confirmed\n\n` +
      `This cancellation will impact your host reliability score.\n\n` +
      `Participant: ${selectedReservation?.participantName}\n` +
      `Listing: ${selectedReservation?.listingTitle}\n\n` +
      `The participant will:\n` +
      `• Receive a full refund\n` +
      `• Get priority rehouse assistance\n` +
      `• Be notified immediately\n\n` +
      `Your account will receive a strike and reduced visibility.`
    );
    setShowCancellationModal(false);
    setSelectedReservation(null);
    setShowEmergencySupport(true);
  };

  const handleRequestException = (reason: string, proofFiles: File[]) => {
    // This won't be called for hosts, but we need to provide it
    console.log('Exception not applicable for hosts');
  };

  const getStatusBadge = (status: Reservation['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      completed: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status: Reservation['paymentStatus']) => {
    const styles = {
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      partial: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${styles[status]}`}>
        {status === 'paid' && <CheckCircle className="w-3 h-3" />}
        {status === 'pending' && <Clock className="w-3 h-3" />}
        {status === 'partial' && <AlertCircle className="w-3 h-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">Participant Reservations</h2>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { value: 'all' as const, label: 'All Reservations' },
            { value: 'upcoming' as const, label: 'Upcoming' },
            { value: 'active' as const, label: 'Active' },
            { value: 'completed' as const, label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                filter === tab.value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No Reservations</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              No {filter !== 'all' && filter} reservations found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {reservation.listingTitle}
                      </h3>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Reservation ID: {reservation.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Participant Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Participant Information</h4>
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{reservation.participantName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${reservation.participantEmail}`} className="text-primary hover:underline">
                        {reservation.participantEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a href={`tel:${reservation.participantPhone}`} className="text-primary hover:underline">
                        {reservation.participantPhone}
                      </a>
                    </div>
                  </div>

                  {/* Reservation Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Reservation Details</h4>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-slate-700 dark:text-slate-300">
                          {new Date(reservation.checkIn).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          {' → '}
                          {new Date(reservation.checkOut).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">
                          ${reservation.totalPrice}
                        </span>
                        {getPaymentBadge(reservation.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {reservation.status === 'active' && 'Currently staying at your property'}
                    {reservation.status === 'upcoming' && 'Arriving soon'}
                    {reservation.status === 'completed' && 'Stay completed'}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => onOpenCase(
                        reservation.id,
                        reservation.participantName,
                        reservation.participantEmail,
                        reservation.listingTitle
                      )}
                      className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Open Case
                    </button>
                    {(reservation.status === 'upcoming' || reservation.status === 'active') && (
                      <button
                        onClick={() => handleCancelClick(reservation)}
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Cancel (Emergency Only)</span>
                        <span className="sm:hidden">Emergency Cancel</span>
                      </button>
                    )}
                  </div>
                  {(reservation.status === 'upcoming' || reservation.status === 'active') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
                      ⚠️ Host cancellations negatively impact your reliability score
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancellationModal && selectedReservation && (
        <CancellationModal
          onClose={() => {
            setShowCancellationModal(false);
            setSelectedReservation(null);
          }}
          onCancel={handleCancelReservation}
          onRequestException={handleRequestException}
          reservation={{
            id: selectedReservation.id,
            listingTitle: selectedReservation.listingTitle,
            startDate: selectedReservation.checkIn,
            endDate: selectedReservation.checkOut,
            price: selectedReservation.totalPrice,
            nights: Math.ceil((new Date(selectedReservation.checkOut).getTime() - new Date(selectedReservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
            participantName: selectedReservation.participantName
          }}
          userType="host"
        />
      )}

      {/* Emergency Support Modal */}
      {showEmergencySupport && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex items-start justify-between sticky top-0">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Emergency Support</h2>
                  <p className="text-sm text-white/90">Participant assistance activated</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEmergencySupport(false);
                  setSelectedReservation(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EmergencySupport
                reservation={{
                  id: selectedReservation.id,
                  listingTitle: selectedReservation.listingTitle,
                  startDate: selectedReservation.checkIn,
                  endDate: selectedReservation.checkOut,
                  participantName: selectedReservation.participantName
                }}
                userType="host"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
