import React, { useEffect, useState, useRef } from 'react';
import {
  FiMenu, FiX, FiSearch, FiStar, FiLogOut, FiSettings, FiUser,
  FiPlus, FiMessageSquare, FiTrash2, FiEdit, FiCheck,
  FiSend, FiArrowDown, FiCopy, FiZap, FiMic, FiTerminal, FiActivity
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { CopyBlock, dracula } from 'react-code-blocks';
import { useChatContext } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiPost, apiGet, apiDelete } from '../../services/api';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ChatInterface = () => {
  const {
    chats, setChats, setActiveChatId, activeChatId,
    getActiveChat, sendMessage, receiveMessage, newChat,
    MAX_GUEST_RESPONSES
  } = useChatContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDownArrow, setShowDownArrow] = useState(false);
  const [copiedIndexes, setCopiedIndexes] = useState([]);
  const [guestUsed, setGuestUsed] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [showGuestNotification, setShowGuestNotification] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // NEW STATE

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const [initialLoading, setInitialLoading] = useState(true);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);
  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);
  const initialMouseX = useRef(0);
  const initialSidebarWidth = useRef(0);

  const chat = getActiveChat();
  const currentChatTitle = chat ? chat.title || 'Untitled Chat' : 'CopyPaste.ai';

  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 400;

  const handleMouseDown = (e) => {
    setIsResizing(true);
    initialMouseX.current = e.clientX;
    initialSidebarWidth.current = sidebarRef.current.offsetWidth;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const deltaX = e.clientX - initialMouseX.current;
      let newWidth = initialSidebarWidth.current + deltaX;
      if (newWidth < MIN_SIDEBAR_WIDTH) newWidth = MIN_SIDEBAR_WIDTH;
      if (newWidth > MAX_SIDEBAR_WIDTH) newWidth = MAX_SIDEBAR_WIDTH;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.style.cursor = 'ew-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
      setInput(transcript);
      if (transcript.trim()) handleSend(transcript.trim());
    };
    recognition.onerror = (event) => { console.error('Speech recognition error:', event.error); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in your browser or could not be initialized.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else { setInput(''); recognitionRef.current.start(); }
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) { setInitialLoading(false); return; }
      try {
        const savedChats = await apiGet('/chat/all');
        setChats(savedChats);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchChats();
  }, [user, setChats]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const threshold = 100;
      const shouldShow = container.scrollHeight - container.scrollTop - container.clientHeight > threshold;
      setShowDownArrow(shouldShow);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && showSidebar) {
        const hamburgerButton = document.querySelector('.sm\\:hidden button');
        if (hamburgerButton && !hamburgerButton.contains(event.target)) setShowSidebar(false);
      }
    };

    const handleClickOutsideUserMenu = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) && showUserMenu &&
          userProfileRef.current && !userProfileRef.current.contains(event.target)) setShowUserMenu(false);
    };

    const handleClickOutsideGuestNotification = (event) => {
      if (showGuestNotification && userProfileRef.current && !userProfileRef.current.contains(event.target)) setShowGuestNotification(false);
    };

    // NEW: Handle click outside logout confirmation modal
    const handleClickOutsideLogoutConfirm = (event) => {
      const logoutConfirmModal = document.getElementById('logout-confirm-modal');
      if (logoutConfirmModal && !logoutConfirmModal.contains(event.target) && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    };

    if (showSidebar) document.addEventListener('mousedown', handleClickOutsideSidebar);
    else document.removeEventListener('mousedown', handleClickOutsideSidebar);

    if (showUserMenu) document.addEventListener('mousedown', handleClickOutsideUserMenu);
    else document.removeEventListener('mousedown', handleClickOutsideUserMenu);

    if (showGuestNotification) document.addEventListener('mousedown', handleClickOutsideGuestNotification);
    else document.removeEventListener('mousedown', handleClickOutsideGuestNotification);

    if (showLogoutConfirm) document.addEventListener('mousedown', handleClickOutsideLogoutConfirm); // NEW
    else document.removeEventListener('mousedown', handleClickOutsideLogoutConfirm); // NEW

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSidebar);
      document.removeEventListener('mousedown', handleClickOutsideUserMenu);
      document.removeEventListener('mousedown', handleClickOutsideGuestNotification);
      document.removeEventListener('mousedown', handleClickOutsideLogoutConfirm); // NEW
    };
  }, [showSidebar, showUserMenu, showGuestNotification, showLogoutConfirm]); // DEPENDENCY ADDED

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectLanguage = (prompt) => {
    if (prompt.toLowerCase().includes('python')) return 'python';
    if (prompt.toLowerCase().includes('java')) return 'java';
    if (prompt.toLowerCase().includes('c++')) return 'cpp';
    if (prompt.toLowerCase().includes('html')) return 'html';
    return 'javascript';
  };

  const handleRename = async (chatId) => {
    const updated = chats.map(chat => (chat.chatId || chat.id) === chatId ? { ...chat, title: editTitle } : chat);
    setChats(updated);
    setEditingId(null);
    const chatToUpdate = updated.find(c => (c.chatId || c.id) === chatId);
    try {
      await apiPost('/chat/save', { chatId, title: editTitle, messages: chatToUpdate?.messages || [], favorite: chatToUpdate?.favorite });
    } catch (err) { console.error('Rename failed:', err); }
  };

  const handleDelete = async (chatId) => {
    const confirmed = window.confirm('Are you sure you want to delete this chat?');
    if (!confirmed) return;
    const filtered = chats.filter(chat => (chat.chatId || chat.id) !== chatId);
    setChats(filtered);
    if (chatId === activeChatId) setActiveChatId(null);
    try {
      await apiDelete(`/chat/${chatId}`);
    } catch (err) { console.error('Failed to delete chat:', err); }
    finally { if (window.innerWidth < 640) setShowSidebar(false); }
  };

  const handleSend = async (voiceInputText = null) => {
    const textToSend = voiceInputText || input.trim();
    if (!textToSend || !chat || loading) return;
    if (!user && guestUsed >= MAX_GUEST_RESPONSES) { setBlocked(true); return; }

    sendMessage(textToSend);
    setLoading(true);

    try {
      const contextMessages = [
        ...chat.messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
        { role: 'user', content: textToSend }
      ];
      const res = await axios.post('http://localhost:8000/generate_code', { messages: contextMessages });
      const rawReply = res.data.code || res.data.result || 'No output.';
      const lang = detectLanguage(textToSend);
      const aiReply = `Here’s your response for: "${textToSend}"\n\n\`\`\`${lang}\n${rawReply}\n\`\`\``;

      receiveMessage(aiReply);
      const updatedChats = chats.map(c => {
        const cid = c.chatId || c.id;
        if (cid === activeChatId) {
          const newTitle = c.title === 'New Chat' && c.messages.length === 0 ? textToSend.slice(0, 50) : c.title;
          return { ...c, title: newTitle, messages: [...c.messages, { sender: 'user', text: textToSend }, { sender: 'ai', text: aiReply }] };
        }
        return c;
      });
      setChats(updatedChats);

      if (user) {
        const updatedChat = updatedChats.find(c => (c.chatId || c.id) === activeChatId);
        await apiPost('/chat/save', { chatId: activeChatId, title: updatedChat?.title || 'Untitled', messages: updatedChat.messages, favorite: updatedChat?.favorite });
      } else {
        setGuestUsed(prev => prev + 1);
        if (guestUsed + 1 >= MAX_GUEST_RESPONSES) setBlocked(true);
      }
    } catch (err) {
      receiveMessage('❌ Failed to get AI response.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndexes(prev => [...prev, index]);
    setTimeout(() => { setCopiedIndexes(prev => prev.filter(i => i !== index)); }, 2000);
  };

  const handleToggleFavorite = async (chatId) => {
    const updatedChats = chats.map(c => (c.chatId || c.id) === chatId ? { ...c, favorite: !c.favorite } : c);
    setChats(updatedChats);
    if (user) {
      const chatToUpdate = updatedChats.find(c => (c.chatId || c.id) === chatId);
      try {
        await apiPost('/chat/save', { chatId, title: chatToUpdate?.title || 'Untitled', messages: chatToUpdate?.messages || [], favorite: chatToUpdate?.favorite });
      } catch (err) { console.error('Failed to update favorite status:', err); }
    }
  };

  const getFilteredChats = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return chats.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesFavoriteFilter = showFavoritesOnly ? c.favorite : true;
      return matchesSearch && matchesFavoriteFilter;
    });
  };

  const displayedChats = getFilteredChats();

  // FUNCTION TO PERFORM LOGOUT (after confirmation)
  const performLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setShowUserMenu(false);
      setShowSidebar(false);
      setShowLogoutConfirm(false); // Close modal
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // FUNCTION TO SHOW LOGOUT CONFIRMATION MODAL
  const handleLogoutClick = () => {
    setShowUserMenu(false); // Close the user menu
    setShowLogoutConfirm(true); // Open the confirmation modal
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowUserMenu(false);
    setShowSidebar(false);
  };

  const LoadingAnimation = () => (
    <div className="flex flex-1 items-center justify-center h-full bg-[#0f172a]">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <div className="text-gray-300 text-lg">Loading chats...</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`flex-col bg-[#0f172a] border-r border-gray-800 p-4 fixed top-16 bottom-0 z-30
                     ${showSidebar ? 'flex left-0' : 'hidden sm:flex -left-full sm:left-0'}
                     ${isResizing ? '' : 'transition-[left] duration-300 ease-in-out'}`}
      >
        <div className="sm:hidden flex justify-end mb-4">
          <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-white" aria-label="Close sidebar">
            <FiX size={24} />
          </button>
        </div>

        <button
          onClick={() => { newChat(); setShowSidebar(false); setShowFavoritesOnly(false); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg transition-shadow"
        >
          <FiPlus /> New Chat
        </button>

        <div className="relative mb-3">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 rounded-lg transition ${
            showFavoritesOnly ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <FiStar className={showFavoritesOnly ? 'text-white' : 'text-yellow-400'} />
          {showFavoritesOnly ? 'Show All Chats' : 'Show Favorites'}
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 pb-4">
          {user ? (
            <>
              {displayedChats.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">{showFavoritesOnly ? 'Favorite Chats' : 'All Chats'}</h3>
                  <div className="space-y-3 mx-1">
                    {displayedChats.map(chat => {
                      const id = chat.chatId || chat.id;
                      const isActive = id === activeChatId;
                      return (
                        <div key={id} className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${isActive ? 'bg-gray-800 ring-2 ring-indigo-600' : 'hover:bg-gray-800'}`}>
                          <button onClick={() => { setActiveChatId(id); setShowSidebar(false); }} className="flex-1 text-left text-sm text-gray-200 truncate flex items-center gap-2">
                            <FiMessageSquare />
                            {editingId === id ? (
                              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(id)} className="bg-transparent border-b border-indigo-400 text-white focus:outline-none w-full" autoFocus />
                            ) : (
                              <span className="truncate">{chat.title || 'Untitled Chat'}</span>
                            )}
                          </button>
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiStar onClick={() => handleToggleFavorite(id)} className={`cursor-pointer ${chat.favorite ? 'text-yellow-400' : 'hover:text-yellow-300'}`} title={chat.favorite ? 'Remove from favorites' : 'Add to favorites'} />
                            {editingId === id ? (
                              <FiCheck onClick={() => handleRename(id)} className="cursor-pointer hover:text-green-400" />
                            ) : (
                              <FiEdit onClick={() => { setEditingId(id); setEditTitle(chat.title || '') }} className="cursor-pointer hover:text-yellow-400" />
                            )}
                            <FiTrash2 onClick={() => handleDelete(id)} className="cursor-pointer hover:text-red-500" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-8">
                  {showFavoritesOnly ? "No favorite chats found." : "No chats match your search."}
                </p>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400 mt-12">🔒 Login to save chats.</p>
          )}
        </div>

        {/* User Profile Section at the bottom */}
        <div className="relative pt-2 border-t border-gray-700">
          <button
            ref={userProfileRef}
            onClick={() => {
              if (user) {
                setShowUserMenu(!showUserMenu);
                setShowGuestNotification(false);
              } else {
                setShowGuestNotification(true);
                setTimeout(() => setShowGuestNotification(false), 3000);
              }
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition"
          >
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {user && user.email ? user.email[0].toUpperCase() : <FiUser />}
              </div>
            )}
            <span className="text-white text-sm font-semibold truncate">
              {user ? user.email || 'User' : 'Guest User'}
            </span>
          </button>

          {/* User Menu Dropdown */}
          {user && showUserMenu && (
            <div ref={userMenuRef} className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 rounded-lg shadow-lg py-2 z-40">
              <div className="px-4 py-2 text-gray-300 text-sm border-b border-gray-700 truncate">
                {user.email}
              </div>
              <button onClick={handleSettingsClick} className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition">
                <FiSettings size={18} /> Settings
              </button>
              <button onClick={handleLogoutClick} className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition">
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          )}

          {/* Guest User Notification */}
          {showGuestNotification && !user && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} className="absolute bottom-full left-0 mb-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm p-3 rounded-lg shadow-lg z-40 flex items-center justify-between">
              <span>Login to unlock more features!</span>
            </motion.div>
          )}
        </div>

        {/* Resizer Handle */}
        <div className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-40 hover:bg-gray-700" onMouseDown={handleMouseDown}></div>
      </div>

      {/* Chat Page */}
      <div
        className="flex-1 flex flex-col bg-[#0f172a] text-white w-full"
        style={{ marginLeft: window.innerWidth >= 640 ? `${sidebarWidth}px` : '0px' }}
      >
        <div className="sm:hidden flex items-center p-4 bg-[#0f172a] border-b border-gray-800">
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-white focus:outline-none" aria-label="Toggle sidebar">
            <FiMenu size={24} />
          </button>
          <span className="text-lg font-semibold ml-4 truncate">{currentChatTitle}</span>
        </div>

        {initialLoading ? (
          <LoadingAnimation />
        ) : !chat ? (
          <div className="flex flex-col items-center justify-center h-full text-white relative overflow-x-hidden p-4 sm:p-6 md:p-8">
            <motion.div className="absolute w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" style={{ top: '10vh', left: '0', transform: 'translateX(-50%)' }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.10 }} transition={{ duration: 2, delay: 0.5 }}></motion.div>
            <motion.div className="absolute w-24 h-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" style={{ bottom: '10vh', right: '0', transform: 'translateX(50%)' }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.10 }} transition={{ duration: 2, delay: 0.7 }}></motion.div>
            <motion.div className="absolute w-24 h-24 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.10 }} transition={{ duration: 2, delay: 0.9 }}></motion.div>

            <div className="relative z-10 flex flex-col items-center max-w-prose sm:max-w-4xl mx-auto text-center">
              <motion.h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 flex flex-col items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 leading-tight" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "yoyo" }}>
                  <FiZap className="text-purple-400 text-4xl sm:text-5xl" />
                </motion.div>
                Welcome to <span className="text-white">CopyPaste.ai</span>
              </motion.h1>
              <motion.p className="text-sm sm:text-base mb-6 leading-relaxed text-gray-300 px-2" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
                Unlock your coding potential. Ask complex questions, generate instant code, and streamline your development workflow with intelligent AI.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:text-base mb-8 w-full max-w-sm sm:max-w-xl">
                <motion.div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg shadow-inner border border-gray-700 backdrop-blur-sm text-xs md:text-sm" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <FiTerminal className="text-teal-400 text-lg" /> Generate powerful code with AI
                </motion.div>
                <motion.div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg shadow-inner border border-gray-700 backdrop-blur-sm text-xs md:text-sm" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                  <FiMic className="text-sky-400 text-lg" /> Use voice to ask your prompt
                </motion.div>
                <motion.div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg shadow-inner border border-gray-700 backdrop-blur-sm text-xs md:text-sm" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
                  <FiCopy className="text-orange-400 text-lg" /> Copy responses instantly
                </motion.div>
                <motion.div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg shadow-inner border border-gray-700 backdrop-blur-sm text-xs md:text-sm" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
                  <FiActivity className="text-emerald-400 text-lg" /> Save and revisit chat history
                </motion.div>
              </div>
              <motion.button onClick={newChat} className="px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 text-sm sm:text-base" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.8 }}>
                Start New Chat
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <div ref={messagesContainerRef} className="flex-1 px-4 py-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 flex flex-col items-start">
              {chat.messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`relative p-4 rounded-2xl text-sm shadow-md ${msg.sender === 'user' ? 'bg-indigo-600 text-white self-end' : 'bg-gray-800 text-white self-start'} max-w-[90%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl`}>
                  <ReactMarkdown components={{ code({ inline, className, children }) {
                    const language = className?.replace('language-', '') || '';
                    const content = String(children).replace(/\n$/, '');
                    return !inline ? (
                      <CopyBlock text={content} language={language} showLineNumbers wrapLines theme={dracula} codeBlock />
                    ) : (
                      <code className="bg-gray-700 text-sm px-1 py-0.5 rounded">{children}</code>
                    );
                  } }}>
                    {msg.text}
                  </ReactMarkdown>
                  <button onClick={() => handleCopy(msg.text, idx)} className="absolute top-2 right-2 text-gray-400 hover:text-white" title="Copy">
                    {copiedIndexes.includes(idx) ? <FiCheck /> : <FiCopy />}
                  </button>
                </motion.div>
              ))}

              {loading && (
                <div className="p-4 rounded-lg max-w-3xl bg-zinc-700 text-gray-300 animate-pulse self-start">
                  Thinking...
                </div>
              )}

              {blocked && (
                <div className="bg-red-900 text-red-300 border border-red-700 p-4 rounded-md max-w-xl text-sm mt-4">
                  <p className="mb-2">🚫 You’ve reached the limit for guest responses.</p>
                  <button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition-colors">
                    Login to Continue
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showDownArrow && (
              <button onClick={scrollToBottom} className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-zinc-700 p-2 rounded-full shadow-lg z-20 hover:bg-zinc-600 transition-colors" title="Scroll to bottom">
                <FiArrowDown className="text-white" size={18} />
              </button>
            )}

            <div className="sticky bottom-0 p-4 bg-zinc-900 border-t border-zinc-700 flex items-center z-10 shadow-lg">
              <button onClick={toggleListening} className={`p-3 rounded-xl mr-2 ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse-fast' : 'bg-zinc-700 hover:bg-zinc-600'} text-white disabled:opacity-50 transition-colors`} disabled={loading || blocked} title={isListening ? 'Stop Listening' : 'Start Voice Input'}>
                <FiMic size={18} />
              </button>

              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isListening ? "Listening..." : "Type your prompt..."} className="flex-1 p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-colors" disabled={isListening} />
              <button onClick={() => handleSend()} disabled={loading || blocked || !input.trim()} className="ml-3 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                <FiSend size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            id="logout-confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-800 p-8 rounded-lg shadow-xl text-center max-w-sm w-full border border-zinc-700"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Confirm Logout</h2>
              <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={performLogout}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;