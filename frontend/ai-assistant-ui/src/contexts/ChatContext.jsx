import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiGet } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem('activeChatId') || null;
  });
  const MAX_GUEST_RESPONSES = 3;

  // ✅ Clears chat state completely (used on logout or switch user)
  const resetChat = () => {
    setChats([]);
    setActiveChatId(null);
    localStorage.removeItem('activeChatId');
  };

  // ✅ Fetch user-specific chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        resetChat(); // Guest or logged out
        return;
      }

      try {
        const res = await apiGet('/chat/all');
        setChats(res || []);

        const savedId = localStorage.getItem('activeChatId');
        const found = res.find(chat => chat.chatId === savedId);
        if (found) {
          setActiveChatId(savedId);
        } else if (res.length > 0) {
          setActiveChatId(res[0].chatId || res[0].id);
          localStorage.setItem('activeChatId', res[0].chatId || res[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        resetChat();
      }
    };

    fetchChats();
  }, [user]);

  const newChat = useCallback(() => {
    const id = uuidv4();
    const chat = { id, title: 'New Chat', messages: [] };

    if (!user) {
      setChats([chat]);
    } else {
      setChats(prev => [chat, ...prev]);
    }

    setActiveChatId(id);
    localStorage.setItem('activeChatId', id);
    return id;
  }, [user]);

  const addMessageToActiveChat = useCallback((message) => {
    if (!activeChatId) return;

    setChats(prevChats => {
      const updated = prevChats.map(chat => {
        const cid = chat.chatId || chat.id;
        if (cid === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, message]
          };
        }
        return chat;
      });
      return updated;
    });
  }, [activeChatId]);

  const sendMessage = (text) => {
    addMessageToActiveChat({ sender: 'user', text });
  };

  const receiveMessage = (text) => {
    addMessageToActiveChat({ sender: 'ai', text });
  };

  const getActiveChat = useCallback(() => {
    return chats.find(c => (c.chatId || c.id) === activeChatId);
  }, [chats, activeChatId]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('activeChatId', activeChatId);
    }
  }, [activeChatId]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        activeChatId,
        setActiveChatId,
        newChat,
        addMessageToActiveChat,
        sendMessage,
        receiveMessage,
        getActiveChat,
        resetChat,
        MAX_GUEST_RESPONSES,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);