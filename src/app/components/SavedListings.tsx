import { useState } from 'react';
import { Heart, MapPin, Star, Home, Briefcase, Building2, DollarSign } from 'lucide-react';
import { Housing } from './HousingCard';
import { Job } from './JobCard';

interface SavedListingsProps {
  savedListings: Housing[];
  savedJobs: Job[];
  onRemoveHousing: (id: string) => void;
  onRemoveJob: (id: string) => void;
  onViewListing: (housing: Housing) => void;
  onViewJob: (job: Job) => void;
  getAvailableSpaces?: (housingId: string) => number;
}

type SavedTab = 'homes' | 'jobs';

export function SavedListings({ savedListings, savedJobs, onRemoveHousing, onRemoveJob, onViewListing, onViewJob, getAvailableSpaces }: SavedListingsProps) {
  const [activeTab, setActiveTab] = useState<SavedTab>('homes');

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
      {/* Tab Navigation */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('homes')}
              className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
                activeTab === 'homes'
                  ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                activeTab === 'homes'
                  ? 'bg-white dark:bg-slate-800 shadow-md'
                  : ''
              }`}>
                <Home className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">Saved Homes</span>
              {savedListings.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-semibold">
                  {savedListings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                activeTab === 'jobs'
                  ? 'bg-white dark:bg-slate-800 shadow-md'
                  : ''
              }`}>
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">Saved Jobs</span>
              {savedJobs.length > 0 && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-semibold">
                  {savedJobs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'homes' && (
          <div className="p-6">
            {savedListings.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No Saved Homes</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Start saving homes you like to keep track of your favorites
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-4 p-4">
                      <div
                        onClick={() => onViewListing(listing)}
                        className="relative cursor-pointer flex-shrink-0 group"
                      >
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-32 h-32 rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div
                            onClick={() => onViewListing(listing)}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <h3 className="text-base font-bold mb-1 truncate text-slate-900 dark:text-white hover:text-primary transition-colors">
                              {listing.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{listing.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-lg font-bold text-primary">
                            ${listing.price}/mo
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{listing.rating}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({listing.reviewCount})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
                            {listing.type}
                          </span>
                          {getAvailableSpaces && listing.maxCapacity && (
                            <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                              getAvailableSpaces(listing.id) === 0
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : getAvailableSpaces(listing.id) <= 2
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {getAvailableSpaces(listing.id) === 0 ? 'Fully Booked' : `${getAvailableSpaces(listing.id)}/${listing.maxCapacity} available`}
                            </span>
                          )}
                          <button
                            onClick={() => onRemoveHousing(listing.id)}
                            className="ml-auto p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="p-6">
            {savedJobs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No Saved Jobs</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Start saving jobs you're interested in to apply later
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onViewJob(job)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold mb-1 truncate text-slate-900 dark:text-white hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm font-medium truncate">{job.company}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveJob(job.id);
                        }}
                        className="flex-shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold text-sm">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
