import { DollarSign, Clock, Users, CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';

export type TaskStatus =
  | 'open'
  | 'accepted'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'expired';

export interface Task {
  id: string;
  listingId: string;
  listingName: string;
  title: string;
  category: string;
  description: string;
  rewardAmount: number;
  deadline: string;
  status: TaskStatus;
  hostName: string;
  hostId: string;
  assignedTo?: string[];
  maxAcceptances?: number;
  currentAcceptances: number;
  submittedProof?: {
    photos: string[];
    videos: string[];
    note: string;
    submittedAt: string;
  };
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  viewMode: 'participant' | 'host';
}

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: 'Available', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Users className="w-4 h-4" /> },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Loader className="w-4 h-4" /> },
  submitted: { label: 'Awaiting Review', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="w-4 h-4" /> },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { label: 'Revision Needed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <AlertCircle className="w-4 h-4" /> },
  completed: { label: 'Completed', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', icon: <CheckCircle className="w-4 h-4" /> },
  expired: { label: 'Expired', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', icon: <XCircle className="w-4 h-4" /> }
};

export function TaskCard({ task, onClick, viewMode }: TaskCardProps) {
  const status = statusConfig[task.status];
  const isDeadlineSoon = new Date(task.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const isExpired = new Date(task.deadline) < new Date();

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{task.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{task.category}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Info Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Reward */}
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{task.rewardAmount.toFixed(2)}</span>
          </div>

          {/* Deadline */}
          <div className={`flex items-center gap-1 text-sm ${isDeadlineSoon && !isExpired ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>
            <Clock className="w-4 h-4" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Acceptances (host view) */}
        {viewMode === 'host' && task.maxAcceptances && (
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4" />
            <span>{task.currentAcceptances}/{task.maxAcceptances}</span>
          </div>
        )}
      </div>

      {/* Host/Listing Info (participant view) */}
      {viewMode === 'participant' && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {task.listingName} • {task.hostName}
          </p>
        </div>
      )}
    </div>
  );
}
