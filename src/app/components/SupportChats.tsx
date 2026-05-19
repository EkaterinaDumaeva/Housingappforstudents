import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, AlertCircle, CheckCircle, Clock, User, Mail, Shield, X, Filter, Search, ArrowLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  isSystemMessage?: boolean;
}

export interface SupportChat {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  userRole: 'participant' | 'host' | 'employer' | 'service-provider' | 'guest';
  category: string;
  status: 'active' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'critical';
  messages: ChatMessage[];
  createdAt: string;
  lastMessageAt: string;
  assignedAdmin?: string;
}

interface SupportChatsProps {
  chats: SupportChat[];
  currentAdminEmail: string;
  onAddMessage: (chatId: string, message: ChatMessage) => void;
  onUpdateStatus: (chatId: string, status: 'active' | 'resolved' | 'pending') => void;
  onAssignChat: (chatId: string, adminEmail: string) => void;
}

export function SupportChats({ chats, currentAdminEmail, onAddMessage, onUpdateStatus, onAssignChat }: SupportChatsProps) {
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null);
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'resolved'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const filteredChats = chats.filter(chat => {
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || chat.priority === filterPriority;
    const matchesSearch = searchQuery === '' ||
      chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    onAddMessage(selectedChat.id, newMessage);
    setMessage('');

    // Auto-assign chat to current admin if not assigned
    if (!selectedChat.assignedAdmin) {
      onAssignChat(selectedChat.id, currentAdminEmail);
    }

    // Update status to active if it was pending
    if (selectedChat.status === 'pending') {
      onUpdateStatus(selectedChat.id, 'active');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'resolved': return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'participant': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'host': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'employer': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300';
      case 'service-provider': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300';
    }
  };

  if (selectedChat) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b-2 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-primary to-purple-600">
          <button
            onClick={() => setSelectedChat(null)}
            className="flex items-center gap-2 text-white hover:text-white/80 font-semibold mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Chats
          </button>

          <div className="flex items-start justify-between text-white">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedChat.userName}</h3>
                  <p className="text-sm opacity-90">{selectedChat.userEmail}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mt-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(selectedChat.priority)}`}>
                  {selectedChat.priority.toUpperCase()}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedChat.status)}`}>
                  {selectedChat.status.toUpperCase()}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRoleColor(selectedChat.userRole)}`}>
                  {selectedChat.userRole.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <p className="text-sm mt-2 opacity-90">
                <strong>Category:</strong> {selectedChat.category}
              </p>
            </div>

            <div className="flex gap-2 ml-4">
              {selectedChat.status !== 'resolved' && (
                <button
                  onClick={() => onUpdateStatus(selectedChat.id, 'resolved')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button>
              )}
              {selectedChat.status === 'active' && (
                <button
                  onClick={() => onUpdateStatus(selectedChat.id, 'pending')}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Mark Pending
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
          {selectedChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.isSystemMessage ? (
                <div className="w-full flex justify-center">
                  <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.sender === 'admin'
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                      : msg.sender === 'bot'
                      ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {msg.sender === 'admin' && (
                    <p className="text-xs font-semibold mb-1 text-white/90">
                      You (Support Specialist)
                    </p>
                  )}
                  {msg.sender === 'user' && (
                    <p className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                      {selectedChat.userName}
                    </p>
                  )}
                  {msg.sender === 'bot' && (
                    <p className="text-xs font-semibold mb-1 text-primary">
                      VOYA LINK Bot
                    </p>
                  )}
                  <p className={`text-sm leading-relaxed ${
                    msg.sender === 'admin' ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}>
                    {msg.text}
                  </p>
                  <p
                    className={`text-xs mt-1.5 flex items-center gap-1 ${
                      msg.sender === 'admin' ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your response..."
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary text-sm text-slate-900 dark:text-white"
              disabled={selectedChat.status === 'resolved'}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || selectedChat.status === 'resolved'}
              className="px-5 py-2.5 bg-gradient-to-br from-primary to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-sm font-semibold flex items-center gap-2"
            >
              <Send className="w-4.5 h-4.5" />
              Send
            </button>
          </div>
          {selectedChat.status === 'resolved' && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
              This chat has been resolved and is read-only
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-primary" />
          Support Chats
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage and respond to user support requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, category..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {filteredChats.length} {filteredChats.length === 1 ? 'Chat' : 'Chats'}
          </h3>
        </div>

        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No support chats found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-md transition-all cursor-pointer bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {chat.userName[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{chat.userName}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{chat.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(chat.priority)}`}>
                        {chat.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(chat.status)}`}>
                        {chat.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRoleColor(chat.userRole)}`}>
                        {chat.userRole.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                      <strong>Category:</strong> {chat.category}
                    </p>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
                    </p>
                  </div>

                  <div className="ml-4 text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {new Date(chat.lastMessageAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(chat.lastMessageAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    {chat.assignedAdmin && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                        <Shield className="w-3 h-3" />
                        {chat.assignedAdmin === currentAdminEmail ? 'You' : chat.assignedAdmin}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {chat.messages.length} {chat.messages.length === 1 ? 'message' : 'messages'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
