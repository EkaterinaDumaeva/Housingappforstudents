import { useState } from 'react';
import { Plus, DollarSign, MessageCircle, Eye, Edit2, Trash2, TrendingUp, Users, Package, Calendar, ChevronRight, Search, Filter, Star, MapPin, Clock } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  serviceArea: string;
  status: 'active' | 'inactive' | 'pending';
  views: number;
  bookings: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  photos: string[];
  createdAt: string;
}

interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  amount: number;
}

interface ServiceProviderDashboardProps {
  providerId: string;
  providerName: string;
  onCreateService: () => void;
  onEditService: (serviceId: string) => void;
}

export function ServiceProviderDashboard({
  providerId,
  providerName,
  onCreateService,
  onEditService
}: ServiceProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'requests' | 'messages' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data - in production, this would come from the backend
  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Airport Transfer Service',
      category: 'airport_transfers',
      description: 'Professional airport pickup and drop-off service',
      price: '$45 per ride',
      serviceArea: 'Charleston, SC',
      status: 'active',
      views: 234,
      bookings: 18,
      revenue: 810,
      rating: 4.8,
      reviewCount: 15,
      photos: [],
      createdAt: '2026-04-15'
    },
    {
      id: '2',
      title: 'Tax Help for J1 Students',
      category: 'tax_help',
      description: 'Expert tax filing assistance for international students',
      price: '$75 per session',
      serviceArea: 'Online (All US)',
      status: 'active',
      views: 567,
      bookings: 42,
      revenue: 3150,
      rating: 5.0,
      reviewCount: 38,
      photos: [],
      createdAt: '2026-03-20'
    },
    {
      id: '3',
      title: 'Bedding Starter Kit',
      category: 'bedding_kits',
      description: 'Complete bedding set with delivery',
      price: '$50',
      serviceArea: 'Myrtle Beach, SC',
      status: 'inactive',
      views: 145,
      bookings: 8,
      revenue: 400,
      rating: 4.5,
      reviewCount: 7,
      photos: [],
      createdAt: '2026-05-01'
    }
  ];

  const mockRequests: ServiceRequest[] = [
    {
      id: 'r1',
      serviceId: '1',
      serviceName: 'Airport Transfer Service',
      customerName: 'Maria Garcia',
      customerEmail: 'maria@email.com',
      customerPhone: '(555) 123-4567',
      message: 'Hi! I need a ride from Charleston Airport to Myrtle Beach on June 15th at 3 PM. Can you confirm availability?',
      requestDate: '2026-05-18T14:30:00',
      status: 'pending',
      amount: 45
    },
    {
      id: 'r2',
      serviceId: '2',
      serviceName: 'Tax Help for J1 Students',
      customerName: 'Alex Chen',
      customerEmail: 'alex@email.com',
      customerPhone: '(555) 987-6543',
      message: 'I need help filing my tax return for my J1 visa. When are you available for a consultation?',
      requestDate: '2026-05-19T10:15:00',
      status: 'pending',
      amount: 75
    },
    {
      id: 'r3',
      serviceId: '1',
      serviceName: 'Airport Transfer Service',
      customerName: 'Sophie Martin',
      customerEmail: 'sophie@email.com',
      customerPhone: '(555) 456-7890',
      message: 'Airport pickup confirmed for tomorrow 2 PM. Thank you!',
      requestDate: '2026-05-17T09:00:00',
      status: 'accepted',
      amount: 45
    }
  ];

  const totalRevenue = mockServices.reduce((sum, service) => sum + service.revenue, 0);
  const totalBookings = mockServices.reduce((sum, service) => sum + service.bookings, 0);
  const totalViews = mockServices.reduce((sum, service) => sum + service.views, 0);
  const activeServices = mockServices.filter(s => s.status === 'active').length;
  const pendingRequests = mockRequests.filter(r => r.status === 'pending').length;

  const handleAcceptRequest = (requestId: string) => {
    alert(`Request ${requestId} accepted! In production, this would update the backend and notify the customer.`);
  };

  const handleDeclineRequest = (requestId: string) => {
    alert(`Request ${requestId} declined. Customer will be notified.`);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      alert(`Service ${serviceId} deleted.`);
    }
  };

  const handleToggleServiceStatus = (serviceId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    alert(`Service ${serviceId} status changed to ${newStatus}`);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Service Provider Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back, {providerName}!</p>
          </div>
          <button
            onClick={onCreateService}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create New Service
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-2 border-primary/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-2 border-primary/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            My Services ({mockServices.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all relative ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-2 border-primary/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Service Requests
            {pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-2 border-primary/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-2 border-primary/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    +12% this month
                  </span>
                </div>
                <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Revenue</h3>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    {activeServices} active
                  </span>
                </div>
                <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Services</h3>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{mockServices.length}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                    +8 today
                  </span>
                </div>
                <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Bookings</h3>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalBookings}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                    +23% this week
                  </span>
                </div>
                <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Views</h3>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalViews}</p>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Service Requests</h2>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-primary hover:text-purple-600 font-semibold text-sm flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {mockRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{request.customerName}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{request.serviceName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : request.status === 'accepted'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{request.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-primary">${request.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Services */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Performing Services</h2>
              <div className="space-y-3">
                {mockServices
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 3)
                  .map((service, index) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                          : index === 1
                          ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                          : 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {service.bookings} bookings • {service.views} views
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 dark:text-green-400">${service.revenue}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {service.rating}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 bg-white dark:bg-slate-900 border-2 ${
                    showFilters ? 'border-primary' : 'border-slate-200 dark:border-slate-800'
                  } rounded-xl hover:border-primary transition-colors`}
                >
                  <Filter className={`w-5 h-5 ${showFilters ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`} />
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'active', 'inactive', 'pending'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status as typeof statusFilter)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                          statusFilter === status
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-primary focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="airport_transfers">Airport Transfers</option>
                    <option value="local_transfers">Local Transfers</option>
                    <option value="tax_help">Tax Help</option>
                    <option value="bedding_kits">Bedding Kits</option>
                    <option value="cleaning">Cleaning Services</option>
                    <option value="handyman">Handyman Services</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{service.title}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            service.status === 'active'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : service.status === 'inactive'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {service.serviceArea}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(service.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Views</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{service.views}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Bookings</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{service.bookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Revenue</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">${service.revenue}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-slate-900 dark:text-white">{service.rating}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">({service.reviewCount} reviews)</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{service.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditService(service.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleServiceStatus(service.id, service.status)}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                          service.status === 'active'
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        }`}
                      >
                        {service.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="px-4 py-2.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Service Requests</h2>

              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{request.customerName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : request.status === 'accepted'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : request.status === 'declined'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-primary mb-1">{request.serviceName}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <span>{request.customerEmail}</span>
                          <span>•</span>
                          <span>{request.customerPhone}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(request.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg mb-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{request.message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">${request.amount}</p>
                      {request.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Messages</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Chat with customers about their service requests. Messages will appear here once you start receiving inquiries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Performance Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Conversion Rate</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">18.5%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Views to bookings</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Avg. Booking Value</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">$65</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Per transaction</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Avg. Rating</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">4.8</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Out of 5.0</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Detailed analytics charts coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
