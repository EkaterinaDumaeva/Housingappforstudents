import { MapPin, Clock, DollarSign, Briefcase, Building2, Bookmark } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  salary: string;
  description: string;
  postedDate: string;
  requirements?: string[];
  benefits?: string[];
}

interface JobCardProps {
  job: Job;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  showSaveButton?: boolean;
}

export function JobCard({ job, onClick, isSaved, onToggleSave, showSaveButton }: JobCardProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave?.();
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/30 transition-all cursor-pointer hover:scale-[1.01]"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{job.company}</span>
            </div>
          </div>
          {showSaveButton && onToggleSave && (
            <button
              onClick={handleSaveClick}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                isSaved
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Location and Details */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{job.type}</span>
          </div>
          {job.duration && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.duration}</span>
              </div>
            </>
          )}
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold text-sm">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
          {job.description}
        </p>

        {/* Benefits Tags */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.benefits.slice(0, 3).map((benefit, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium">
                +{job.benefits.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
