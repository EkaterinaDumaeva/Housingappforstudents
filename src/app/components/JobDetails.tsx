import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Building2, Bookmark, CheckCircle, Send, Shield } from 'lucide-react';
import { Job } from './JobCard';
import { ReliabilityProfile, ReliabilityData } from './ReliabilityProfile';

interface JobDetailsProps {
  job: Job;
  onBack: () => void;
  onApply: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function JobDetails({ job, onBack, onApply, isSaved, onToggleSave }: JobDetailsProps) {
  // Mock employer reliability data - in production this would come from the backend
  const employerReliability: ReliabilityData = {
    reliabilityScore: 96,
    cancellationRate: 0,
    totalCancellations: 0,
    responseRate: 100,
    averageResponseTime: '1 hour',
    casesOpened: 0,
    casesResolved: 0,
    totalReservations: 23,
    verifications: {
      email: true,
      phone: true,
      identity: true,
      government: true
    },
    strikes: 0,
    warnings: 0,
    badges: ['Verified Employer', 'Top Rated']
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 z-10 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>
          {onToggleSave && (
            <button
              onClick={onToggleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isSaved
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Job Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3">
                  <Building2 className="w-5 h-5" />
                  <span className="text-lg font-semibold">{job.company}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  {job.duration && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{job.duration}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-bold text-green-700 dark:text-green-400">{job.salary}</span>
            </div>
          </div>

          {/* Employer Rating */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Employer Rating
            </h2>
            <ReliabilityProfile userType="host" data={employerReliability} customLabel="Employer Rating" />
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Job Description</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Benefits & Perks</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posted Date */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Posted on {new Date(job.postedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 p-6 shadow-lg">
        <button
          onClick={onApply}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-purple-700 text-white rounded-xl py-4 text-lg font-bold hover:shadow-2xl hover:shadow-primary/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            <span>Apply for this Job</span>
          </div>
        </button>
      </div>
    </div>
  );
}
