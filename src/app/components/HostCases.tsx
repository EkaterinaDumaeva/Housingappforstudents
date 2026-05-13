import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, MessageSquare, X, User, Send } from 'lucide-react';

interface Case {
  id: string;
  participantName: string;
  listingTitle: string;
  category: string;
  urgency: 'low' | 'normal' | 'high' | 'emergency';
  description: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  messages: Array<{
    id: string;
    sender: 'participant' | 'host' | 'support';
    text: string;
    timestamp: string;
  }>;
}

interface HostCasesProps {
  hostName: string;
  onClose: () => void;
}

export function HostCases({ hostName, onClose }: HostCasesProps) {
  // Mock cases data
  const [cases, setCases] = useState<Case[]>([
    {
      id: '1',
      participantName: 'John Smith',
      listingTitle: 'Modern Downtown Apartment',
      category: 'maintenance',
      urgency: 'high',
      description: 'The air conditioning unit is not working properly. It\'s making loud noises and not cooling the apartment adequately. This is urgent as temperatures are very high this week.',
      status: 'new',
      createdAt: '2026-05-12T10:30:00',
      messages: [
        {
          id: 'm1',
          sender: 'participant',
          text: 'The air conditioning unit is not working properly. It\'s making loud noises and not cooling the apartment adequately. This is urgent as temperatures are very high this week.',
          timestamp: '10:30 AM'
        }
      ]
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'normal': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'emergency': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };

  const getUrgencyGradient = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'from-blue-500 to-blue-600';
      case 'normal': return 'from-yellow-500 to-yellow-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'emergency': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return { text: 'New', color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm' };
      case 'in-progress': return { text: 'In Progress', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm' };
      case 'resolved': return { text: 'Resolved', color: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm' };
      default: return { text: status, color: 'bg-gray-500 text-white shadow-sm' };
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'maintenance': 'Maintenance Issue',
      'safety': 'Safety Concern',
      'cleanliness': 'Cleanliness Issue',
      'amenities': 'Amenities Not Working',
      'noise': 'Noise Complaint',
      'payment': 'Payment/Billing Issue',
      'lease': 'Lease Agreement Question',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCase) return;

    const updatedCases = cases.map(c => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: 'in-progress' as const,
          messages: [
            ...c.messages,
            {
              id: `m${Date.now()}`,
              sender: 'host' as const,
              text: newMessage,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }
          ]
        };
      }
      return c;
    });

    setCases(updatedCases);
    setSelectedCase(updatedCases.find(c => c.id === selectedCase.id) || null);
    setNewMessage('');
  };

  const handleMarkResolved = (caseId: string) => {
    const updatedCases = cases.map(c =>
      c.id === caseId ? { ...c, status: 'resolved' as const } : c
    );
    setCases(updatedCases);
    if (selectedCase?.id === caseId) {
      setSelectedCase(updatedCases.find(c => c.id === caseId) || null);
    }
  };

  const newCasesCount = cases.filter(c => c.status === 'new').length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-700/60">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Participant Cases & Issues</h2>
              {newCasesCount > 0 && (
                <p className="text-sm text-white/90 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  {newCasesCount} new {newCasesCount === 1 ? 'case' : 'cases'} requiring attention
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
          {/* Cases List */}
          <div className="w-[400px] border-r border-slate-200/60 dark:border-slate-800/60 overflow-y-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10">
              <h3 className="text-sm font-bold mb-1 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Active Cases</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {cases.filter(c => c.status !== 'resolved').length} open • {cases.filter(c => c.status === 'resolved').length} resolved
              </p>
            </div>

            <div className="p-2">
              {cases.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-orange-500 opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">No cases yet</p>
                  <p className="text-xs text-muted-foreground mt-1">All participant issues will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cases.map((caseItem) => {
                    const statusBadge = getStatusBadge(caseItem.status);
                    const isSelected = selectedCase?.id === caseItem.id;
                    return (
                      <button
                        key={caseItem.id}
                        onClick={() => setSelectedCase(caseItem)}
                        className={`w-full p-4 text-left rounded-xl transition-all group border ${
                          isSelected
                            ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-md border-primary/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                              {statusBadge.text}
                            </span>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getUrgencyColor(caseItem.urgency)}`}>
                              {caseItem.urgency.charAt(0).toUpperCase() + caseItem.urgency.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${
                              isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'
                            }`}>
                              {caseItem.participantName}
                            </h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium truncate">
                          {caseItem.listingTitle}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 font-medium">
                          {getCategoryLabel(caseItem.category)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {caseItem.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                            {formatDate(caseItem.createdAt)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Case Details */}
          <div className="flex-1 flex flex-col bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
            {selectedCase ? (
              <>
                {/* Case Header */}
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedCase.participantName}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{selectedCase.listingTitle}</p>
                      </div>
                    </div>
                    {selectedCase.status !== 'resolved' && (
                      <button
                        onClick={() => handleMarkResolved(selectedCase.id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all active:scale-95 text-sm font-semibold"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Resolved
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${getUrgencyColor(selectedCase.urgency)}`}>
                      {selectedCase.urgency.charAt(0).toUpperCase() + selectedCase.urgency.slice(1)} Priority
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{getCategoryLabel(selectedCase.category)}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">{formatDate(selectedCase.createdAt)}</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-transparent via-white/20 to-white/40 dark:from-transparent dark:via-slate-900/20 dark:to-slate-900/40">
                  {selectedCase.messages.map((message, index) => {
                    const showAvatar = message.sender === 'participant' && (
                      index === 0 ||
                      selectedCase.messages[index - 1].sender !== 'participant'
                    );

                    return (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'host' ? 'justify-end' : 'justify-start'} gap-2`}
                      >
                        {message.sender === 'participant' && (
                          <div className="flex-shrink-0 w-8">
                            {showAvatar && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                            message.sender === 'host'
                              ? 'bg-gradient-to-br from-primary to-purple-600 text-white rounded-br-sm'
                              : message.sender === 'support'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700 rounded-bl-sm'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-sm'
                          }`}
                        >
                          {message.sender === 'support' && (
                            <p className="text-xs font-bold mb-1.5 text-blue-700 dark:text-blue-300">Voya Link Support Team</p>
                          )}
                          {message.sender === 'participant' && (
                            <p className="text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">{selectedCase.participantName}</p>
                          )}
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p
                            className={`text-xs mt-1.5 font-medium ${
                              message.sender === 'host'
                                ? 'text-white/80'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                {selectedCase.status !== 'resolved' ? (
                  <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your response to the participant..."
                        className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm placeholder:text-slate-400"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`px-4 py-3 rounded-xl transition-all shadow-sm ${
                          newMessage.trim()
                            ? 'bg-gradient-to-br from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center">
                      Press Enter to send • Participant and Voya Link support will see your response
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        This case has been marked as resolved
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-10 h-10 text-orange-500 opacity-50" />
                  </div>
                  <h3 className="mb-2 text-slate-700 dark:text-slate-300 font-semibold text-lg">Select a case</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs">
                    Choose a case from the list to view details and respond to your participant
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
