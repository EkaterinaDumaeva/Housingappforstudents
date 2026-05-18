import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Pause, Play, MessageCircle, Calendar, DollarSign, Star, AlertCircle, CheckCircle, Clock, Users, X, FileText } from 'lucide-react';
import { ServiceListing } from './ServiceListingCard';
import { ServiceCategory } from './BecomeProviderModal';

interface ProviderDashboardProps {
  providerId: string;
  onCreateService: () => void;
  onEditService: (serviceId: string) => void;
}

type DashboardView = 'overview' | 'services' | 'requests' | 'bookings' | 'messages' | 'reviews';

export type ServiceStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'rejected' | 'suspended';

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  type: 'booking' | 'join' | 'inquiry';
  message?: string;
  date?: string;
  numberOfSeats?: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  date: string;
  numberOfSeats?: number;
  totalAmount: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  createdAt: string;
}

export function ProviderDashboard({ providerId, onCreateService, onEditService }: ProviderDashboardProps) {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Mock data
  const mockServices: (ServiceListing & { status: ServiceStatus })[] = [
    {
      id: '1',
      category: 'airport_transfers',
      title: 'Charleston Airport to Myrtle Beach Transfer',
      description: 'Comfortable SUV transfer service',
      price: '$45',
      location: 'Charleston, SC',
      provider: {
        id: providerId,
        name: 'John Driver',
        type: 'individual',
        rating: 4.8,
        reviewCount: 24,
        verified: true,
      },
      photos: [],
      status: 'active',
      createdAt: '2026-05-01',
      pickupLocation: 'Charleston Airport',
      dropoffLocation: 'Myrtle Beach',
      vehicleType: 'SUV',
      seatsAvailable: 4,
    },
    {
      id: '2',
      category: 'events',
      title: 'Beach Volleyball Tournament',
      description: 'Join us for a fun beach volleyball event!',
      price: 'Free',
      location: 'Myrtle Beach',
      provider: {
        id: providerId,
        name: 'John Driver',
        type: 'individual',
        rating: 4.8,
        reviewCount: 24,
        verified: true,
      },
      photos: [],
      status: 'pending_review',
      createdAt: '2026-05-15',
      eventDate: '2026-06-20',
      eventTime: '2:00 PM',
      capacity: 20,
      spotsLeft: 12,
      isFree: true,
    },
  ];

  const mockRequests: ServiceRequest[] = [
    {
      id: '1',
      serviceId: '1',
      serviceName: 'Charleston Airport to Myrtle Beach Transfer',
      participantId: 'p1',
      participantName: 'Sarah Johnson',
      type: 'booking',
      date: '2026-06-15',
      numberOfSeats: 2,
      message: 'Arriving at 3 PM, can you pick us up?',
      status: 'pending',
      createdAt: '2026-05-18T10:30:00Z',
    },
    {
      id: '2',
      serviceId: '2',
      serviceName: 'Beach Volleyball Tournament',
      participantId: 'p2',
      participantName: 'Mike Chen',
      type: 'join',
      status: 'accepted',
      createdAt: '2026-05-17T14:20:00Z',
    },
  ];

  const mockBookings: Booking[] = [
    {
      id: '1',
      serviceId: '1',
      serviceName: 'Charleston Airport to Myrtle Beach Transfer',
      participantId: 'p3',
      participantName: 'Emily Davis',
      date: '2026-06-10',
      numberOfSeats: 1,
      totalAmount: '$45',
      status: 'confirmed',
      createdAt: '2026-05-10T09:15:00Z',
    },
  ];

  const stats = {
    activeServices: mockServices.filter(s => s.status === 'active').length,
    pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
    upcomingBookings: mockBookings.filter(b => b.status === 'confirmed').length,
    totalEarnings: '$450',
  };

  const getStatusBadge = (status: ServiceStatus) => {
    const styles: Record<ServiceStatus, string> = {
      draft: 'bg-gray-600/20 text-gray-400',
      pending_review: 'bg-yellow-600/20 text-yellow-400',
      active: 'bg-green-600/20 text-green-400',
      paused: 'bg-orange-600/20 text-orange-400',
      rejected: 'bg-red-600/20 text-red-400',
      suspended: 'bg-red-600/20 text-red-400',
    };

    const labels: Record<ServiceStatus, string> = {
      draft: 'Draft',
      pending_review: 'Pending Review',
      active: 'Active',
      paused: 'Paused',
      rejected: 'Rejected',
      suspended: 'Suspended',
    };

    return (
      <span className={`px-2 py-1 ${styles[status]} text-xs rounded-full font-medium`}>
        {labels[status]}
      </span>
    );
  };

  const getRequestStatusBadge = (status: ServiceRequest['status']) => {
    const styles = {
      pending: 'bg-yellow-600/20 text-yellow-400',
      accepted: 'bg-green-600/20 text-green-400',
      declined: 'bg-red-600/20 text-red-400',
      cancelled: 'bg-gray-600/20 text-gray-400',
    };

    return (
      <span className={`px-2 py-1 ${styles[status]} text-xs rounded-full font-medium capitalize`}>
        {status}
      </span>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-600/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Active Services</div>
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.activeServices}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Pending Requests</div>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.pendingRequests}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-600/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Upcoming Bookings</div>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.upcomingBookings}</div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-600/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Total Earnings</div>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalEarnings}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={onCreateService}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Service
          </button>
          <button
            onClick={() => setActiveView('requests')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            View Requests
          </button>
          <button
            onClick={() => setActiveView('bookings')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            View Bookings
          </button>
        </div>
      </div>

      {/* Recent Requests */}
      {mockRequests.filter(r => r.status === 'pending').length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Requests</h3>
          <div className="space-y-3">
            {mockRequests.filter(r => r.status === 'pending').slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {request.participantName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{request.participantName}</div>
                    <div className="text-sm text-gray-400 truncate">{request.serviceName}</div>
                    {request.message && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">{request.message}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderServices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">My Services</h3>
        <button
          onClick={onCreateService}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Service
        </button>
      </div>

      <div className="space-y-3">
        {mockServices.map((service) => (
          <div key={service.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{service.title}</h4>
                  {getStatusBadge(service.status)}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{service.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="font-semibold text-white">{service.price}</span>
                <span>•</span>
                <span>{service.location}</span>
              </div>

              <div className="flex items-center gap-2">
                {service.status === 'active' && (
                  <>
                    <button
                      onClick={() => {}}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Pause service"
                    >
                      <Pause className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                )}
                {service.status === 'paused' && (
                  <button
                    onClick={() => {}}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Activate service"
                  >
                    <Play className="w-4 h-4 text-green-400" />
                  </button>
                )}
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="View service"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => onEditService(service.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit service"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {service.status === 'pending_review' && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-300">
                  Your service is under review. You'll receive a notification once it's approved.
                </p>
              </div>
            )}

            {service.status === 'rejected' && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-300 mb-1">
                    Your service was rejected. Please review the feedback and resubmit.
                  </p>
                  <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                    View Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Service Requests</h3>

      <div className="space-y-3">
        {mockRequests.map((request) => (
          <div key={request.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {request.participantAvatar ? (
                    <img src={request.participantAvatar} alt={request.participantName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    request.participantName.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-white">{request.participantName}</div>
                    {getRequestStatusBadge(request.status)}
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{request.serviceName}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {request.type === 'booking' && (
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                {request.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(request.date).toLocaleDateString()}</span>
                  </div>
                )}
                {request.numberOfSeats && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{request.numberOfSeats} seats</span>
                  </div>
                )}
              </div>
            )}

            {request.message && (
              <div className="p-3 bg-gray-700/50 rounded-lg mb-3">
                <p className="text-sm text-gray-300">{request.message}</p>
              </div>
            )}

            {request.status === 'pending' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {}}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => {}}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => {}}
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Message
                </button>
              </div>
            )}
          </div>
        ))}

        {mockRequests.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No requests yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Bookings</h3>

      <div className="space-y-3">
        {mockBookings.map((booking) => (
          <div key={booking.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {booking.participantAvatar ? (
                    <img src={booking.participantAvatar} alt={booking.participantName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    booking.participantName.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white mb-1">{booking.participantName}</div>
                  <div className="text-sm text-gray-400 mb-1">{booking.serviceName}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    {booking.numberOfSeats && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{booking.numberOfSeats} seats</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white mb-1">{booking.totalAmount}</div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  booking.status === 'confirmed' ? 'bg-blue-600/20 text-blue-400' :
                  booking.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {booking.status === 'confirmed' && (
              <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                <button
                  onClick={() => {}}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => {}}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}

        {mockBookings.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Provider Dashboard</h1>
          <p className="text-purple-100">Manage your services and bookings</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'services', label: 'Services', icon: FileText },
              { id: 'requests', label: 'Requests', icon: MessageCircle, badge: stats.pendingRequests },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'reviews', label: 'Reviews', icon: Star },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as DashboardView)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeView === item.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'services' && renderServices()}
        {activeView === 'requests' && renderRequests()}
        {activeView === 'bookings' && renderBookings()}
        {activeView === 'messages' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Messages feature coming soon</p>
          </div>
        )}
        {activeView === 'reviews' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Reviews feature coming soon</p>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {selectedRequest.participantName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{selectedRequest.participantName}</div>
                  <div className="text-sm text-gray-400">{selectedRequest.serviceName}</div>
                </div>
              </div>

              {selectedRequest.message && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-400 mb-2">Message</div>
                  <p className="text-gray-300">{selectedRequest.message}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
