// src/components/chat/MessageBubble.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-4 rounded-lg shadow-md text-sm
        ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageBubble;
