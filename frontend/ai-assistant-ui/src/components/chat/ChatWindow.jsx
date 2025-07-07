import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import MessageBubble from './MessageBubble';
import { apiPost } from '../../services/api';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const { messages, setMessages, activeChat } = useChat();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return toast.error("Prompt can't be empty");

    const userMsg = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const data = await apiPost('/code/generate_code', { prompt }); // ✅ Updated path
      const aiMsg = { sender: 'ai', text: data.code || data.result || 'No response' };

      setMessages(prev => {
        const updated = [...prev, aiMsg];

        // Save updated messages as a chat
        apiPost('/chats/save', {
          _id: activeChat || null,
          title: prompt.slice(0, 40),
          messages: updated
        });

        return updated;
      });

    } catch (err) {
      console.error(err);
      toast.error("Error generating code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <MessageBubble sender="ai" text="⌛ Generating..." />}
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900 flex">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your request here..."
          className="flex-1 p-3 rounded bg-gray-800 text-white"
          onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
        />
        <button onClick={sendPrompt} disabled={loading} className="ml-2 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">
          🚀
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
