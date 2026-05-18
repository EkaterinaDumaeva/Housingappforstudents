import { useState } from 'react';
import { X, Calendar, Lock, Unlock, AlertCircle } from 'lucide-react';
import { Room } from './RoomManagement';

interface DateBlockingModalProps {
  onClose: () => void;
  rooms: Room[];
  onBlockDates: (blockData: DateBlock) => void;
  existingBlocks?: DateBlock[];
}

export interface DateBlock {
  id: string;
  roomId?: string; // If undefined, blocks entire listing
  startDate: string;
  endDate: string;
  reason: 'personal_use' | 'maintenance' | 'private_booking' | 'cleaning' | 'not_available' | 'other';
  customReason?: string;
}

export function DateBlockingModal({ onClose, rooms, onBlockDates, existingBlocks = [] }: DateBlockingModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [reason, setReason] = useState<DateBlock['reason']>('not_available');
  const [customReason, setCustomReason] = useState('');
  const [viewMode, setViewMode] = useState<'block' | 'manage'>('block');

  const handleBlockDates = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('End date must be after start date');
      return;
    }

    if (reason === 'other' && !customReason.trim()) {
      alert('Please provide a reason for blocking these dates');
      return;
    }

    const block: DateBlock = {
      id: `block-${Date.now()}`,
      roomId: selectedRoomId === 'all' ? undefined : selectedRoomId,
      startDate,
      endDate,
      reason,
      customReason: reason === 'other' ? customReason : undefined
    };

    onBlockDates(block);

    // Reset form
    setStartDate('');
    setEndDate('');
    setSelectedRoomId('all');
    setReason('not_available');
    setCustomReason('');
  };

  const getReasonLabel = (reasonValue: DateBlock['reason']) => {
    switch (reasonValue) {
      case 'personal_use': return 'Personal Use';
      case 'maintenance': return 'Maintenance';
      case 'private_booking': return 'Private Booking';
      case 'cleaning': return 'Cleaning / Preparation';
      case 'not_available': return 'Not Available';
      case 'other': return 'Other';
      default: return reasonValue;
    }
  };

  const getRoomName = (roomId?: string) => {
    if (!roomId) return 'Entire Listing';
    const room = rooms.find(r => r.id === roomId);
    return room?.name || 'Unknown Room';
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">Manage Date Availability</h2>
            <p className="text-sm text-white/90 mt-1">Block or unblock dates for your listing</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('block')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'block'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Block Dates
            </button>
            <button
              onClick={() => setViewMode('manage')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'manage'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Unlock className="w-4 h-4 inline mr-2" />
              Manage Blocks ({existingBlocks.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'block' ? (
            <div className="space-y-6">
              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Important Rules:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You can only block dates that are currently available</li>
                      <li>Dates with active bookings cannot be blocked</li>
                      <li>To cancel a booking, use the cancellation flow</li>
                      <li>Blocked dates can be unblocked later</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Block for <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Entire Listing (All Rooms)</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.capacity} {room.capacity === 1 ? 'spot' : 'spots'})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select which room(s) to block, or block the entire listing
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={getTodayDate()}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || getTodayDate()}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Reason for Blocking <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as DateBlock['reason'])}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="not_available">Not Available</option>
                  <option value="personal_use">Personal Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="private_booking">Private Booking</option>
                  <option value="cleaning">Cleaning / Preparation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Custom Reason */}
              {reason === 'other' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Please specify the reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter the reason for blocking these dates..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Block Button */}
              <button
                onClick={handleBlockDates}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Block Selected Dates
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Blocked Dates</h3>

              {existingBlocks.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No blocked dates yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Switch to "Block Dates" to add unavailable periods
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingBlocks.map((block) => (
                    <div key={block.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
                              {getRoomName(block.roomId)}
                            </span>
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
                              BLOCKED
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(block.startDate).toLocaleDateString()} - {new Date(block.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Reason: {getReasonLabel(block.reason)}
                            {block.customReason && ` - ${block.customReason}`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Unblock these dates?')) {
                              // In production, would call onUnblock handler
                              console.log('Unblock:', block.id);
                            }
                          }}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Unlock className="w-4 h-4" />
                          Unblock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
