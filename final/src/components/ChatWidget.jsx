import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hi! I'm your assistant. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages((s) => [...s, userMsg]);
    setInput('');

    // Send message to backend as contact message (stores support requests)
    fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Chat Widget', email: 'chat@local', message: text })
    }).then(() => {
      // Mock reply on success
      setTimeout(() => {
        setMessages((s) => [...s, { id: Date.now() + 1, from: 'bot', text: "Thanks — we've received your message and will respond shortly." }]);
      }, 700);
    }).catch(() => {
      setTimeout(() => {
        setMessages((s) => [...s, { id: Date.now() + 1, from: 'bot', text: "Unable to send message. Please try again later." }]);
      }, 700);
    });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-black text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">Help</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white border-2 border-black rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setOpen(false)} className="p-1 hover:opacity-90">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50" style={{ maxHeight: '320px' }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'user' ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-800'} px-4 py-2 rounded-lg max-w-[80%]`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none"
              />
              <button onClick={sendMessage} className="bg-black text-white px-3 py-2 rounded-md hover:opacity-90">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
