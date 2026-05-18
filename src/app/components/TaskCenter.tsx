import { useState } from 'react';
import { Search, Filter, Plus, CheckCircle, Clock, DollarSign, AlertCircle, Trophy, TrendingUp } from 'lucide-react';
import { Task, TaskCard } from './TaskCard';

interface TaskCenterProps {
  viewMode: 'participant' | 'host';
  tasks: Task[];
  onCreateTask?: () => void;
  onSelectTask: (taskId: string) => void;
}

type ParticipantTab = 'available' | 'accepted' | 'submitted' | 'completed';
type HostTab = 'active' | 'pending_review' | 'approved' | 'history';

export function TaskCenter({ viewMode, tasks, onCreateTask, onSelectTask }: TaskCenterProps) {
  const [participantTab, setParticipantTab] = useState<ParticipantTab>('available');
  const [hostTab, setHostTab] = useState<HostTab>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on current tab
  const getFilteredTasks = () => {
    let filtered = tasks;

    if (viewMode === 'participant') {
      switch (participantTab) {
        case 'available':
          filtered = tasks.filter(t => t.status === 'open');
          break;
        case 'accepted':
          filtered = tasks.filter(t => t.status === 'accepted' || t.status === 'in_progress');
          break;
        case 'submitted':
          filtered = tasks.filter(t => t.status === 'submitted');
          break;
        case 'completed':
          filtered = tasks.filter(t => t.status === 'approved' || t.status === 'completed');
          break;
      }
    } else {
      switch (hostTab) {
        case 'active':
          filtered = tasks.filter(t => t.status === 'open' || t.status === 'accepted' || t.status === 'in_progress');
          break;
        case 'pending_review':
          filtered = tasks.filter(t => t.status === 'submitted');
          break;
        case 'approved':
          filtered = tasks.filter(t => t.status === 'approved');
          break;
        case 'history':
          filtered = tasks.filter(t => t.status === 'completed' || t.status === 'expired' || t.status === 'rejected');
          break;
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Calculate stats
  const stats = {
    participant: {
      available: tasks.filter(t => t.status === 'open').length,
      accepted: tasks.filter(t => t.status === 'accepted' || t.status === 'in_progress').length,
      totalEarned: tasks
        .filter(t => t.status === 'approved' || t.status === 'completed')
        .reduce((sum, t) => sum + t.rewardAmount, 0),
      completed: tasks.filter(t => t.status === 'approved' || t.status === 'completed').length
    },
    host: {
      active: tasks.filter(t => t.status === 'open' || t.status === 'accepted' || t.status === 'in_progress').length,
      pendingReview: tasks.filter(t => t.status === 'submitted').length,
      totalPaid: tasks
        .filter(t => t.status === 'approved' || t.status === 'completed')
        .reduce((sum, t) => sum + t.rewardAmount, 0),
      completed: tasks.filter(t => t.status === 'approved' || t.status === 'completed').length
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {viewMode === 'participant' ? 'Community Tasks' : 'Task Management'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {viewMode === 'participant'
                  ? 'Earn rewards by helping around the house'
                  : 'Create and manage tasks for your participants'}
              </p>
            </div>
            {viewMode === 'host' && onCreateTask && (
              <button
                onClick={onCreateTask}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {viewMode === 'participant' ? (
              <>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Available</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.participant.available}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.participant.accepted}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.participant.completed}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">${stats.participant.totalEarned.toFixed(0)}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Active Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.host.active}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Pending Review</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.host.pendingReview}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.host.completed}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Paid</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${stats.host.totalPaid.toFixed(0)}</p>
                </div>
              </>
            )}
          </div>

          {/* Tabs */}
          {viewMode === 'participant' ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['available', 'accepted', 'submitted', 'completed'] as ParticipantTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setParticipantTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    participantTab === tab
                      ? 'bg-primary text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab === 'available' && 'Available Tasks'}
                  {tab === 'accepted' && 'In Progress'}
                  {tab === 'submitted' && 'Awaiting Review'}
                  {tab === 'completed' && 'Completed'}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['active', 'pending_review', 'approved', 'history'] as HostTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHostTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    hostTab === tab
                      ? 'bg-primary text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab === 'active' && 'Active Tasks'}
                  {tab === 'pending_review' && 'Pending Review'}
                  {tab === 'approved' && 'Approved'}
                  {tab === 'history' && 'History'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onSelectTask(task.id)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? 'Try adjusting your search' : 'Check back later for new opportunities'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
