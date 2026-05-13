import { useState } from 'react';
import { Calendar, DollarSign, Home, AlertCircle, MessageSquare, MapPin, CheckCircle, X } from 'lucide-react';
import { CancellationModal } from './CancellationModal';
import { ExceptionClaimStatus, ExceptionClaim } from './ExceptionClaimStatus';

interface Reservation {
  id: string;
  listingTitle: string;
  listingLocation: string;
  listingImage: string;
  hostName: string;
  hostEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  bookedWithoutDeposit: boolean;
  status: 'upcoming' | 'current' | 'past';
  bookingDate: string;
}

interface ReservationsProps {
  userName: string;
  onOpenCase: (reservationId: string, listingTitle: string, hostName: string, hostEmail: string) => void;
}

export function Reservations({ userName, onOpenCase }: ReservationsProps) {
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Mock exception claims data
  const [exceptionClaims] = useState<ExceptionClaim[]>([]);

  // Mock reservations data
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const currentReservation = reservations.find(r => r.status === 'current');
  const upcomingReservations = reservations.filter(r => r.status === 'upcoming');
  const pastReservations = reservations.filter(r => r.status === 'past');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancellationModal(true);
  };

  const handleCancelReservation = (reason: string, requestException: boolean) => {
    console.log(`Cancelling reservation ${selectedReservation?.id} for reason: ${reason}`);
    alert(
      `Reservation Cancelled\n\n` +
      `Your reservation for "${selectedReservation?.listingTitle}" has been cancelled.\n\n` +
      `Refund details have been sent to your email.\n\n` +
      `Cancellation reason: ${reason}`
    );
    setShowCancellationModal(false);
    setSelectedReservation(null);
  };

  const handleRequestException = (reason: string, proofFiles: File[]) => {
    console.log(`Exception request submitted for ${selectedReservation?.id}`, { reason, files: proofFiles.length });
    alert(
      `Exception Request Submitted Successfully!\n\n` +
      `Your request has been submitted for review.\n\n` +
      `Reason: ${reason}\n` +
      `Documents uploaded: ${proofFiles.length}\n\n` +
      `Our support team will review your case within 24-48 hours.\n` +
      `You can track the status in the "Exception Claims" section below.`
    );
    setShowCancellationModal(false);
    setSelectedReservation(null);
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const daysUntilCheckIn = calculateDaysUntil(reservation.checkInDate);

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Image */}
        <div className="relative h-48 sm:h-56">
          <img
            src={reservation.listingImage}
            alt={reservation.listingTitle}
            className="w-full h-full object-cover"
          />
          {reservation.status === 'current' && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Home className="w-3 h-3" />
              Current Housing
            </div>
          )}
          {reservation.status === 'upcoming' && daysUntilCheckIn <= 30 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              {daysUntilCheckIn} days until check-in
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-1">{reservation.listingTitle}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{reservation.listingLocation}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Host: {reservation.hostName}
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
            </span>
          </div>

          {/* Payment Info */}
          <div className="bg-accent/30 border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-semibold">${reservation.totalPrice}/month</span>
            </div>

            {reservation.bookedWithoutDeposit ? (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Booked without deposit</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deposit:</span>
                  <span className="font-semibold">${reservation.depositAmount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {reservation.depositPaid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">Deposit paid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Deposit pending</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {reservation.status === 'current' && (
              <button
                onClick={() => onOpenCase(reservation.id, reservation.listingTitle, reservation.hostName, reservation.hostEmail)}
                className="w-full py-2.5 sm:py-3 border border-border hover:bg-accent rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Open Case with Host</span>
              </button>
            )}

            {(reservation.status === 'upcoming' || reservation.status === 'current') && (
              <button
                onClick={() => handleCancelClick(reservation)}
                className="w-full py-2.5 sm:py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Cancel Reservation</span>
              </button>
            )}

            {reservation.status === 'upcoming' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  {daysUntilCheckIn > 0
                    ? `Your housing will be ready in ${daysUntilCheckIn} days. Contact your host for move-in details.`
                    : 'Your check-in date is today! Contact your host for instructions.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="mb-1">My Reservations</h2>
        <p className="text-sm text-muted-foreground">
          Manage your housing bookings and arrangements
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Housing */}
        {currentReservation && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-600">Current Housing Arrangement</h3>
            </div>
            <ReservationCard reservation={currentReservation} />
          </div>
        )}

        {/* Upcoming Reservations */}
        {upcomingReservations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Upcoming Reservations</h3>
            </div>
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </div>
        )}

        {/* Past Reservations */}
        {pastReservations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-muted-foreground">Past Reservations</h3>
            </div>
            <div className="space-y-4">
              {pastReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </div>
        )}

        {/* Exception Claims */}
        {exceptionClaims.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">Exception Refund Claims</h3>
            </div>
            <ExceptionClaimStatus claims={exceptionClaims} />
          </div>
        )}

        {/* Empty State */}
        {reservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="mb-2 text-muted-foreground">No reservations yet</h3>
            <p className="text-sm text-muted-foreground">
              Start browsing to find your perfect housing
            </p>
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
            startDate: selectedReservation.checkInDate,
            endDate: selectedReservation.checkOutDate,
            price: selectedReservation.totalPrice,
            nights: Math.ceil((new Date(selectedReservation.checkOutDate).getTime() - new Date(selectedReservation.checkInDate).getTime()) / (1000 * 60 * 60 * 24)),
            hostName: selectedReservation.hostName
          }}
          userType="participant"
        />
      )}
    </div>
  );
}
