import { useState } from 'react';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

interface HelpChatProps {
  userName?: string;
}

export function HelpChat({ userName }: HelpChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! Welcome to Voya Link Support. How can we help you today?',
      sender: 'support',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Auto-response after 1 second
    setTimeout(() => {
      const autoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for reaching out! A support team member will respond to you shortly. Our average response time is under 5 minutes.',
        sender: 'support',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform z-50 flex items-center justify-center"
          aria-label="Open help chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[90vw] sm:w-96 max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Headphones className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Voya Link Support</h3>
                <p className="text-xs opacity-90">We're here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gradient-to-b from-accent/20 to-transparent min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                      : 'bg-card border border-border shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3.5 border-t border-border bg-background flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3.5 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-3.5 py-2 bg-gradient-to-br from-primary to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-sm"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by Voya Link Support Team
            </p>
          </div>
        </div>
      )}
    </>
  );
}
