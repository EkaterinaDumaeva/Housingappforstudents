import { useState, useEffect } from 'react';
import { Send, User, MessageCircle, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  hostName: string;
  hostPhoto?: string;
  listingTitle: string;
  messages: Array<{
    id: string;
    text: string;
    sender: 'participant' | 'host';
    timestamp: string;
    status?: 'sent' | 'seen';
  }>;
  lastMessage: string;
  unread: boolean;
}

interface MessagesProps {
  userName: string;
}

const ProfileAvatar = ({ name, photo, size = 'md' }: { name: string; photo?: string; size?: 'sm' | 'md' }) => {
  const getInitials = () => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {getInitials()}
    </div>
  );
};

export function Messages({ userName }: MessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations
  const [conversations, setConversations] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `m${Date.now()}`,
              text: newMessage,
              sender: 'participant' as const,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              status: 'sent' as const
            }
          ],
          lastMessage: newMessage,
          unread: false
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    setNewMessage('');

    // Simulate marking as seen after a delay
    setTimeout(() => {
      setConversations(prevConversations =>
        prevConversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.sender === 'participant' && msg.status === 'sent'
                  ? { ...msg, status: 'seen' as const }
                  : msg
              )
            };
          }
          return conv;
        })
      );
    }, 2000);
  };

  // Mark messages as seen when conversation is opened
  useEffect(() => {
    if (selectedConversation) {
      setConversations(prevConversations =>
        prevConversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              unread: false,
              messages: conv.messages.map(msg =>
                msg.sender === 'host' && !msg.status
                  ? { ...msg, status: 'seen' as const }
                  : msg
              )
            };
          }
          return conv;
        })
      );
    }
  }, [selectedConversation?.id]);

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
      {/* Conversations List */}
      <div className="w-80 border-r border-slate-200/60 dark:border-slate-800/60 overflow-y-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10">
          <h2 className="mb-1 text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Messages</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>

        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start browsing to connect with hosts</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-3.5 text-left rounded-xl transition-all group ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-md border border-primary/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <ProfileAvatar name={conversation.hostName} photo={conversation.hostPhoto} />
                      {conversation.unread && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-semibold truncate ${
                          selectedConversation?.id === conversation.id
                            ? 'text-primary'
                            : conversation.unread
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {conversation.hostName}
                        </h4>
                        {conversation.unread && (
                          <span className="px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1.5 truncate font-medium">
                        {conversation.listingTitle}
                      </p>
                      <p className={`text-xs truncate ${
                        conversation.unread
                          ? 'text-slate-700 dark:text-slate-300 font-medium'
                          : 'text-slate-500 dark:text-slate-500'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        {selectedConversation ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <ProfileAvatar name={selectedConversation.hostName} photo={selectedConversation.hostPhoto} />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedConversation.hostName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{selectedConversation.listingTitle}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-transparent via-white/20 to-white/40 dark:from-transparent dark:via-slate-900/20 dark:to-slate-900/40">
              {selectedConversation.messages.map((message, index) => {
                const showAvatar = message.sender === 'host' && (
                  index === 0 ||
                  selectedConversation.messages[index - 1].sender !== 'host'
                );

                return (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'participant' ? 'justify-end' : 'justify-start'} gap-2`}
                  >
                    {message.sender === 'host' && (
                      <div className="flex-shrink-0 w-8">
                        {showAvatar && (
                          <ProfileAvatar name={selectedConversation.hostName} photo={selectedConversation.hostPhoto} size="sm" />
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                        message.sender === 'participant'
                          ? 'bg-gradient-to-br from-primary to-purple-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div
                        className={`flex items-center gap-1.5 text-xs mt-1.5 ${
                          message.sender === 'participant' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="font-medium">{message.timestamp}</span>
                        {message.sender === 'participant' && message.status && (
                          <span className="ml-0.5">
                            {message.status === 'sent' ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCheck className="w-3.5 h-3.5 text-white" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
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
                Press Enter to send
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-primary opacity-50" />
              </div>
              <h3 className="mb-2 text-slate-700 dark:text-slate-300 font-semibold">Select a conversation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs">
                Choose a conversation from the list to start messaging with your host
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
