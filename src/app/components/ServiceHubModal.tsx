import { X, Star, ChevronRight, Car, Users, Gift, FileText, Plus, Sparkles } from 'lucide-react';

interface ServiceHubModalProps {
  onClose: () => void;
  onBrowseServices: () => void;
  onBecomeProvider: () => void;
  onSelectCategory?: (category: string) => void;
}

export function ServiceHubModal({ onClose, onBrowseServices, onBecomeProvider, onSelectCategory }: ServiceHubModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 z-10 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold mb-4 shadow-lg">
              <Star className="w-4 h-4" />
              <span>Service Hub</span>
              <Star className="w-4 h-4" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
              Everything You Need<br />Beyond Housing & Jobs
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Access essential services, connect with the community, discover exclusive student discounts, and make your J1 experience unforgettable
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Service Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Airport Transfers */}
            <button
              onClick={() => {
                onSelectCategory?.('airport_transfers');
                onClose();
              }}
              className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:scale-105 cursor-pointer text-left w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Airport Transfers</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Safe rides from airport to your accommodation</p>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                <span>32+ services</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Events & Trips */}
            <button
              onClick={() => {
                onSelectCategory?.('events_trips');
                onClose();
              }}
              className="group relative bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-500 transition-all hover:scale-105 cursor-pointer text-left w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Events & Trips</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Join group trips and social activities</p>
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold text-sm">
                <span>50+ events</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Student Discounts */}
            <button
              onClick={() => {
                onSelectCategory?.('student_discounts');
                onClose();
              }}
              className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:scale-105 cursor-pointer text-left w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Student Discounts</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Exclusive deals and special offers</p>
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold text-sm">
                <span>45+ offers</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Essential Services */}
            <button
              onClick={() => {
                onSelectCategory?.('essential_services');
                onClose();
              }}
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105 cursor-pointer text-left w-full"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Essential Services</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Tax help, SIM cards, bedding & more</p>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                <span>80+ services</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* More Categories List */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              More Services Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Tax Help',
                'SIM Cards & Phone Plans',
                'Bedding & Starter Kits',
                'Local Transfers',
                'Travel Ideas',
                'Group Trips',
                'Scholarships',
                'Special Student Offers',
                'Cleaning Services',
                'Handyman Services',
                'Translation Help',
                'Arrival Support',
                'Housing Inspection',
                'Emergency Support',
                'Document Assistance'
              ].map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBrowseServices}
              className="flex-1 group relative bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Star className="w-6 h-6" />
              <span>Browse All Services</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onBecomeProvider}
              className="flex-1 group relative bg-white dark:bg-slate-800 border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6" />
              <span>Become a Provider</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-6 justify-center text-center">
              <div>
                <p className="text-2xl font-bold text-primary">207+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Services</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">45+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Verified Providers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">4.8★</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Average Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">100%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Community Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
