import { useState, useRef, useEffect } from 'react';
import { Shield, X, Send, AlertTriangle, Upload, Image as ImageIcon, Video, Clock, CheckCircle, Headphones } from 'lucide-react';

type EmergencyCategory =
  | 'employer_threatening'
  | 'unfair_firing'
  | 'visa_threat'
  | 'unsafe_work'
  | 'housing_problem'
  | 'refund_issue'
  | 'unsafe_housing'
  | 'harassment'
  | 'kicked_out'
  | 'nowhere_to_stay'
  | 'urgent_help'
  | 'feel_unsafe'
  | 'payment_problem'
  | 'emergency_travel'
  | 'other';

type SupportCategory =
  | 'booking_help'
  | 'payment_help'
  | 'technical_issue'
  | 'account_help'
  | 'verification_help'
  | 'platform_question'
  | 'billing'
  | 'other_support';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  isSystemMessage?: boolean;
}

interface HelpChatProps {
  userName?: string;
  userRole?: 'participant' | 'host' | 'employer' | null;
  isPublic?: boolean;
}

const emergencyCategories = [
  { id: 'employer_threatening', label: 'Employer threatening me', severity: 'critical' },
  { id: 'unfair_firing', label: 'Employer trying to fire me unfairly', severity: 'high' },
  { id: 'visa_threat', label: 'Employer threatening visa/sponsorship', severity: 'critical' },
  { id: 'unsafe_work', label: 'Unsafe work conditions', severity: 'high' },
  { id: 'housing_problem', label: 'Housing problem', severity: 'medium' },
  { id: 'refund_issue', label: 'Host refusing refund/deposit', severity: 'medium' },
  { id: 'unsafe_housing', label: 'Unsafe housing', severity: 'high' },
  { id: 'harassment', label: 'Harassment or discrimination', severity: 'critical' },
  { id: 'kicked_out', label: 'I was kicked out', severity: 'critical' },
  { id: 'nowhere_to_stay', label: 'I have nowhere to stay', severity: 'critical' },
  { id: 'urgent_help', label: 'I need urgent help', severity: 'high' },
  { id: 'feel_unsafe', label: 'I feel unsafe', severity: 'critical' },
  { id: 'payment_problem', label: 'Payment problem', severity: 'medium' },
  { id: 'emergency_travel', label: 'Emergency travel/help situation', severity: 'high' },
  { id: 'other', label: 'Other emergency', severity: 'medium' }
];

const supportCategories = [
  { id: 'booking_help', label: 'Help with booking' },
  { id: 'payment_help', label: 'Payment question' },
  { id: 'technical_issue', label: 'Technical issue' },
  { id: 'account_help', label: 'Account settings' },
  { id: 'verification_help', label: 'Verification help' },
  { id: 'platform_question', label: 'Platform question' },
  { id: 'billing', label: 'Billing issue' },
  { id: 'other_support', label: 'Other' }
];

export function HelpChat({ userName, userRole, isPublic = false }: HelpChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatStep, setChatStep] = useState<'category' | 'details' | 'chat'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [adminJoined, setAdminJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEmergencyMode = userRole === 'participant' || isPublic;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: isEmergencyMode
          ? 'Hi. I\'m here to help. Are you currently experiencing a problem or unsafe situation?'
          : 'Hi! Welcome to VOYA LINK Support. How can we help you today?',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);

    const category = isEmergencyMode
      ? emergencyCategories.find(c => c.id === categoryId)
      : supportCategories.find(c => c.id === categoryId);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: category?.label || categoryId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: isEmergencyMode
          ? 'I understand. Can you tell me more about what happened? Please share as many details as you feel comfortable with.'
          : 'I can help you with that. Please describe your issue and I\'ll connect you with the right person.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setChatStep('details');
    }, 800);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Bot response
    setTimeout(() => {
      if (chatStep === 'details' && !adminJoined) {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: isEmergencyMode
            ? 'Thank you for sharing. I\'m escalating this to our support team now. A specialist will join this chat shortly.'
            : 'Thank you. Let me connect you with a support team member.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
        setChatStep('chat');

        // Admin joins
        setTimeout(() => {
          const systemMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text: '✓ Support Specialist Joined',
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isSystemMessage: true
          };
          setMessages(prev => [...prev, systemMessage]);
          setAdminJoined(true);

          setTimeout(() => {
            const adminMessage: ChatMessage = {
              id: (Date.now() + 3).toString(),
              text: isEmergencyMode
                ? 'Hi, I\'m here to help you. I\'ve reviewed what you\'ve shared. You\'re safe here, and we\'ll work through this together. Can you tell me where you are right now?'
                : 'Hello! I\'ve reviewed your inquiry and I\'m here to assist you. Let me help you resolve this.',
              sender: 'admin',
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            };
            setMessages(prev => [...prev, adminMessage]);
          }, 1500);
        }, 2000);
      }
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className={`fixed bottom-6 right-6 shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 flex items-center gap-3 font-semibold ${
            isEmergencyMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl'
              : 'bg-gradient-to-r from-primary to-purple-600 text-white w-14 h-14 rounded-full justify-center'
          }`}
          aria-label={isEmergencyMode ? 'Get emergency help' : 'Open support chat'}
        >
          {isEmergencyMode ? (
            <>
              <Shield className="w-6 h-6" />
              <span className="hidden sm:inline">Need Help?</span>
              <span className="sm:hidden">Help</span>
            </>
          ) : (
            <Headphones className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[95vw] sm:w-[420px] max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className={`p-4 flex items-center justify-between flex-shrink-0 ${
            isEmergencyMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'bg-gradient-to-r from-primary to-purple-600'
          } text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {isEmergencyMode ? (
                  <Shield className="w-5 h-5" />
                ) : (
                  <Headphones className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {isEmergencyMode ? 'Emergency Support' : 'Customer Support'}
                </h3>
                <p className="text-xs opacity-90">
                  {isEmergencyMode ? 'We\'re here for you' : 'We\'re here to help'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Selection */}
          {chatStep === 'category' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {isEmergencyMode ? 'What kind of help do you need?' : 'What can we help you with?'}
              </p>
              {(isEmergencyMode ? emergencyCategories : supportCategories).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    isEmergencyMode && 'severity' in category && category.severity === 'critical'
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white">{category.label}</span>
                    {isEmergencyMode && 'severity' in category && category.severity === 'critical' && (
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          {(chatStep === 'details' || chatStep === 'chat') && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950 min-h-0">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.isSystemMessage ? (
                      <div className="w-full flex justify-center">
                        <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                            : msg.sender === 'admin'
                            ? isEmergencyMode
                              ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                      >
                        {msg.sender === 'admin' && (
                          <p className={`text-xs font-semibold mb-1 ${
                            isEmergencyMode ? 'text-blue-700 dark:text-blue-400' : 'text-primary'
                          }`}>
                            Support Specialist
                          </p>
                        )}
                        <p className={`text-sm leading-relaxed ${
                          msg.sender === 'user' ? 'text-white' : 'text-slate-900 dark:text-white'
                        }`}>
                          {msg.text}
                        </p>
                        <p
                          className={`text-xs mt-1.5 flex items-center gap-1 ${
                            msg.sender === 'user' ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
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

              {/* File Uploads */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="flex gap-2 flex-wrap">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs flex items-center gap-2">
                        {file.type.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        <span className="text-slate-700 dark:text-slate-300">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Upload files"
                  >
                    <Upload className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isEmergencyMode ? 'Type your message...' : 'Describe your issue...'}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-sm ${
                      isEmergencyMode
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                        : 'bg-gradient-to-br from-primary to-purple-600'
                    } text-white`}
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  {isEmergencyMode ? 'Your safety is our priority' : 'Powered by VOYA LINK Support Team'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
