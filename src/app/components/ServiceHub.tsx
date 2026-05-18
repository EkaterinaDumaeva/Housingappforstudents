import { useState } from 'react';
import { Search, Filter, GraduationCap, FileText, Smartphone, Bed, Plane, Car, Gift, MapPin, Calendar, Users, Wrench, Globe, FileCheck, Home as HomeIcon, Plus, Star, TrendingUp, Loader2 } from 'lucide-react';

interface ServiceHubProps {
  onBecomeProvider: () => void;
  onSelectService: (serviceId: string) => void;
  isLoading?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  count: number;
  color: string;
}

export function ServiceHub({ onBecomeProvider, onSelectService, isLoading = false }: ServiceHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories: ServiceCategory[] = [
    {
      id: 'scholarships',
      name: 'Scholarships',
      icon: GraduationCap,
      description: 'Financial aid and scholarship opportunities',
      count: 12,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'tax_help',
      name: 'Tax Help',
      icon: FileText,
      description: 'Tax filing assistance and consultation',
      count: 8,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'sim_cards',
      name: 'SIM Cards & Phone Plans',
      icon: Smartphone,
      description: 'Mobile phone plans and connectivity',
      count: 15,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'bedding_kits',
      name: 'Bedding & Starter Kits',
      icon: Bed,
      description: 'Essential items for your arrival',
      count: 24,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'airport_transfers',
      name: 'Airport Transfers',
      icon: Plane,
      description: 'Airport pickup and drop-off services',
      count: 32,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'local_transfers',
      name: 'Local Transfers',
      icon: Car,
      description: 'City-to-city and local transportation',
      count: 28,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'student_discounts',
      name: 'Student Discounts',
      icon: Gift,
      description: 'Special offers and discounts for students',
      count: 45,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'travel_ideas',
      name: 'Travel Ideas',
      icon: MapPin,
      description: 'Explore destinations and travel plans',
      count: 18,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'group_trips',
      name: 'Group Trips',
      icon: Users,
      description: 'Join or organize group adventures',
      count: 14,
      color: 'from-violet-500 to-violet-600'
    },
    {
      id: 'events',
      name: 'Events',
      icon: Calendar,
      description: 'Local events and social activities',
      count: 36,
      color: 'from-rose-500 to-rose-600'
    },
    {
      id: 'local_support',
      name: 'Local Support',
      icon: Globe,
      description: 'Community support and resources',
      count: 22,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'cleaning',
      name: 'Cleaning Services',
      icon: HomeIcon,
      description: 'Professional cleaning and maintenance',
      count: 16,
      color: 'from-lime-500 to-lime-600'
    },
    {
      id: 'handyman',
      name: 'Handyman & Repair',
      icon: Wrench,
      description: 'Repair and maintenance services',
      count: 11,
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'translation',
      name: 'Translation & Documents',
      icon: FileCheck,
      description: 'Document translation and assistance',
      count: 9,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'arrival_support',
      name: 'Arrival Support',
      icon: Plane,
      description: 'Help settling in and getting started',
      count: 19,
      color: 'from-sky-500 to-sky-600'
    },
    {
      id: 'housing_inspection',
      name: 'Housing Inspection',
      icon: HomeIcon,
      description: 'Professional housing inspection services',
      count: 7,
      color: 'from-fuchsia-500 to-fuchsia-600'
    }
  ];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Service Hub</h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Discover services, support, and opportunities to make your experience amazing
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, events, offers..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent focus:border-white focus:outline-none shadow-lg"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onBecomeProvider}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Become a Provider
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Service Type
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>All Types</option>
                  <option>Free</option>
                  <option>Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>All Locations</option>
                  <option>Miami</option>
                  <option>Orlando</option>
                  <option>Charleston</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Provider Type
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>All Providers</option>
                  <option>Verified</option>
                  <option>Student-created</option>
                  <option>Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rating
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Any Rating</option>
                  <option>4+ Stars</option>
                  <option>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Browse Services</h2>
            <p className="text-slate-600 dark:text-slate-400">{filteredCategories.length} categories available</p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="p-6">
                  <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    onSelectService(`service-${category.id}-1`);
                  }}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition-all hover:shadow-xl ${
                    selectedCategory === category.id
                      ? 'border-purple-500 shadow-lg scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                <div className="relative p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-left">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-left">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {category.count} {category.count === 1 ? 'service' : 'services'}
                    </span>
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>

                {selectedCategory === category.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
          </div>
        )}

        {/* Featured Services Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Trending Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample service cards - would be populated with actual data */}
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => onSelectService(`trending-service-${i}`)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Sample Service {i}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Service description placeholder
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">$25</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No categories found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">Safety Notice</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Payments and communication outside the platform may not be protected. Always communicate through the app and use our secure payment system when available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
