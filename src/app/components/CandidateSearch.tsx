import { useState } from 'react';
import { Search, Users, MapPin, Briefcase, Star, Award, CheckCircle, Mail, Eye, Filter, X } from 'lucide-react';
import { User } from './AuthModal';

interface CandidateSearchProps {
  onContactCandidate: (candidate: User) => void;
}

export function CandidateSearch({ onContactCandidate }: CandidateSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobSeekingStatus: 'all',
    skills: '',
    location: '',
    participantType: 'all',
    hasWorkExperience: false,
    hasEducation: false,
  });

  // Mock candidates - in production this would come from the backend
  const mockCandidates: User[] = [];

  const filteredCandidates = mockCandidates.filter(candidate => {
    if (!candidate.participantProfile) return false;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = `${candidate.participantProfile.firstName} ${candidate.participantProfile.lastName}`.toLowerCase();
      const skills = candidate.participantProfile.skills?.join(' ').toLowerCase() || '';
      const jobTypes = candidate.participantProfile.desiredJobTypes?.join(' ').toLowerCase() || '';

      if (!name.includes(query) && !skills.includes(query) && !jobTypes.includes(query)) {
        return false;
      }
    }

    // Job seeking status filter
    if (filters.jobSeekingStatus !== 'all' && candidate.participantProfile.jobSeekingStatus !== filters.jobSeekingStatus) {
      return false;
    }

    // Location filter
    if (filters.location && !candidate.participantProfile.destinationCity.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Skills filter
    if (filters.skills) {
      const skillQuery = filters.skills.toLowerCase();
      const candidateSkills = candidate.participantProfile.skills?.join(' ').toLowerCase() || '';
      if (!candidateSkills.includes(skillQuery)) {
        return false;
      }
    }

    // Participant type filter
    if (filters.participantType !== 'all' && candidate.participantProfile.participantType !== filters.participantType) {
      return false;
    }

    // Work experience filter
    if (filters.hasWorkExperience && (!candidate.participantProfile.workExperience || candidate.participantProfile.workExperience.length === 0)) {
      return false;
    }

    // Education filter
    if (filters.hasEducation && (!candidate.participantProfile.education || candidate.participantProfile.education.length === 0)) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status?: string) => {
    const styles = {
      'actively-looking': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      'open-to-offers': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      'not-looking': 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600',
      'employed': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    };

    const labels = {
      'actively-looking': 'Actively Looking',
      'open-to-offers': 'Open to Offers',
      'not-looking': 'Not Looking',
      'employed': 'Employed'
    };

    const statusStyle = styles[status as keyof typeof styles] || styles['not-looking'];
    const statusLabel = labels[status as keyof typeof labels] || 'Unknown';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle}`}>
        {statusLabel}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple/5 dark:from-slate-950 dark:via-slate-900 dark:to-purple/5">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Search Candidates
        </h2>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, skills, or job type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              showFilters
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Job Seeking Status
                </label>
                <select
                  value={filters.jobSeekingStatus}
                  onChange={(e) => setFilters({ ...filters, jobSeekingStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="actively-looking">Actively Looking</option>
                  <option value="open-to-offers">Open to Offers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Miami, Orlando"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., Customer Service"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Participant Type
                </label>
                <select
                  value={filters.participantType}
                  onChange={(e) => setFilters({ ...filters, participantType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="student-j1">Student J1</option>
                  <option value="seasonal-worker">Seasonal Worker</option>
                  <option value="intern-trainee">Intern/Trainee</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasWorkExperience}
                    onChange={(e) => setFilters({ ...filters, hasWorkExperience: e.target.checked })}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Has Experience</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasEducation}
                    onChange={(e) => setFilters({ ...filters, hasEducation: e.target.checked })}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Has Education</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setFilters({
                jobSeekingStatus: 'all',
                skills: '',
                location: '',
                participantType: 'all',
                hasWorkExperience: false,
                hasEducation: false,
              })}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Found {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No Candidates Found</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {candidate.participantProfile?.firstName[0]}{candidate.participantProfile?.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {candidate.participantProfile?.firstName} {candidate.participantProfile?.lastName}
                        </h3>
                        {candidate.isVerified && (
                          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" title="Verified Account" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{candidate.participantProfile?.destinationCity}</span>
                      </div>
                      {getStatusBadge(candidate.participantProfile?.jobSeekingStatus)}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {candidate.participantProfile?.bio && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    {candidate.participantProfile.bio}
                  </p>
                )}

                {/* Skills */}
                {candidate.participantProfile?.skills && candidate.participantProfile.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.participantProfile.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Desired Jobs */}
                {candidate.participantProfile?.desiredJobTypes && candidate.participantProfile.desiredJobTypes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Interested In</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.participantProfile.desiredJobTypes.map((jobType, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium"
                        >
                          {jobType}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Available: {new Date(candidate.participantProfile?.arrivalDate || '').toLocaleDateString()} - {new Date(candidate.participantProfile?.departureDate || '').toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => onContactCandidate(candidate)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Candidate
                  </button>
                  <button
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Full Profile</span>
                    <span className="sm:hidden">Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
