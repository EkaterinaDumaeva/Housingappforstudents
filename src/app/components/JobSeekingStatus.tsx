import { useState } from 'react';
import { Briefcase, CheckCircle, Info } from 'lucide-react';

interface JobSeekingStatusProps {
  currentStatus?: 'actively-looking' | 'open-to-offers' | 'not-looking' | 'employed';
  onStatusChange: (status: 'actively-looking' | 'open-to-offers' | 'not-looking' | 'employed') => void;
}

export function JobSeekingStatus({ currentStatus = 'not-looking', onStatusChange }: JobSeekingStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [hasChanges, setHasChanges] = useState(false);

  const statuses = [
    {
      value: 'actively-looking' as const,
      label: 'Actively Looking',
      description: 'I am actively searching for job opportunities',
      color: 'green',
      icon: '🔍'
    },
    {
      value: 'open-to-offers' as const,
      label: 'Open to Offers',
      description: 'I am open to considering job opportunities',
      color: 'blue',
      icon: '💼'
    },
    {
      value: 'not-looking' as const,
      label: 'Not Looking',
      description: 'I am not currently looking for work',
      color: 'slate',
      icon: '🚫'
    },
    {
      value: 'employed' as const,
      label: 'Employed',
      description: 'I have already found employment',
      color: 'purple',
      icon: '✅'
    }
  ];

  const handleStatusClick = (status: typeof selectedStatus) => {
    setSelectedStatus(status);
    setHasChanges(status !== currentStatus);
  };

  const handleSave = () => {
    onStatusChange(selectedStatus);
    setHasChanges(false);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      green: isSelected
        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-500 ring-2 ring-green-500/50'
        : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/20',
      blue: isSelected
        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/50'
        : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20',
      slate: isSelected
        ? 'bg-slate-100 dark:bg-slate-700 border-slate-500 dark:border-slate-500 ring-2 ring-slate-500/50'
        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700',
      purple: isSelected
        ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/50'
        : 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20'
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Job Seeking Status</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Let employers know your availability
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <div className="flex gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Your status will be visible to employers searching for candidates.
            {selectedStatus === 'actively-looking' || selectedStatus === 'open-to-offers'
              ? ' Your profile will appear in employer searches.'
              : ' Your profile will be hidden from employer searches.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusClick(status.value)}
            className={`relative p-4 border-2 rounded-xl transition-all text-left ${getColorClasses(status.color, selectedStatus === status.value)}`}
          >
            {selectedStatus === status.value && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div className="text-2xl mb-2">{status.icon}</div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{status.label}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{status.description}</p>
          </button>
        ))}
      </div>

      {hasChanges && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Save Status
          </button>
          <button
            onClick={() => {
              setSelectedStatus(currentStatus);
              setHasChanges(false);
            }}
            className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {!hasChanges && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Current status: <span className="font-semibold">{statuses.find(s => s.value === selectedStatus)?.label}</span>
        </p>
      )}
    </div>
  );
}
