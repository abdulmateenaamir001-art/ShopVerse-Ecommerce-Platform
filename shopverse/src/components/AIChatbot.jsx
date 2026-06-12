import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiLoader } from 'react-icons/fi';
import { useSelector } from 'react-redux';

// Markdown-to-HTML formatting parser for pristine assistant outputs
const formatMarkdown = (text) => {
  if (!text) return "";
  
  // 1. Convert bold formatting (**text**) to HTML <strong> tags safely
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 2. Format bullet points starting with a * or - into clean indent visual characters
  formattedText = formattedText.replace(/^\s*[\*\-]\s(.*)$/gm, '• $1');
  
  // 3. Convert inline backticks into clean code block tags
  formattedText = formattedText.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">$1</code>');

  // 4. Split strings into manageable blocks and map them down as clean structural breaks
  return formattedText.split('\n').map((str, index) => {
    if (!str.trim()) return <div key={index} className="h-2" />; // Handles blank lines nicely
    return (
      <p 
        key={index} 
        dangerouslySetInnerHTML={{ __html: str }} 
        className="mb-1 last:mb-0 leading-relaxed break-words" 
      />
    );
  });
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! I'm your ShopVerse AI Assistant. How can I help you find the perfect product today?" }
  ]);

  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setIsTyping(true);

    const updatedHistory = [...messages, { role: 'user', content: userText }];
    setMessages(updatedHistory);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { Authorization: `Bearer ${user.token}` })
        },
        body: JSON.stringify({ messages: updatedHistory })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...updatedHistory, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error(data.message || 'Failed to get bot reply');
      }
    } catch (error) {
      console.error("Chat Client Error:", error);
      setMessages([
        ...updatedHistory, 
        { role: 'assistant', content: "I'm having trouble connecting to my cloud server. Please verify your internet connection or try again shortly!" }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* The Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30 z-50 transition-transform ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <FiMessageSquare size={24} />
      </motion.button>

      {/* The Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  ShopVerse AI <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                </h3>
                <p className="text-xs text-primary-100">Powered by Llama 3 Cloud</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-bg/50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-br-sm shadow-md' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {/* FIXED: We run the helper function ONLY on the assistant's output messages */}
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1">
                        {formatMarkdown(msg.content)}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about live inventory or shipping..."
                  className="flex-1 bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-white px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm border border-transparent dark:border-gray-700"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                >
                  {isTyping ? <FiLoader className="animate-spin" /> : <FiSend />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}