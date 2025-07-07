// import React, { useEffect, useState } from 'react';
// import {
//   FiPlus,
//   FiMessageSquare,
//   FiTrash2,
//   FiEdit,
//   FiCheck
// } from 'react-icons/fi';
// import { useChatContext } from '../../contexts/ChatContext';
// import { useAuth } from '../../contexts/AuthContext';
// import { apiGet, apiPost, apiDelete } from '../../services/api';

// const ChatSidebar = ({ onNewChat, onSelectChat, activeChatId }) => {
//   const { chats, setChats, setActiveChatId } = useChatContext();
//   const { user } = useAuth();

//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState('');

//   useEffect(() => {
//     const fetchChats = async () => {
//       if (!user) return;

//       try {
//         const savedChats = await apiGet('/chat/all');
//         setChats(savedChats);
//       } catch (err) {
//         console.error('Failed to fetch chats:', err);
//       }
//     };

//     fetchChats();
//   }, [user, setChats]);

//   const handleRename = async (chatId) => {
//     const updated = chats.map(chat =>
//       (chat.chatId || chat.id) === chatId
//         ? { ...chat, title: editTitle }
//         : chat
//     );
//     setChats(updated);
//     setEditingId(null);

//     const chatToUpdate = updated.find(c => (c.chatId || c.id) === chatId);
//     try {
//       await apiPost('/chat/save', {
//         chatId,
//         title: editTitle,
//         messages: chatToUpdate?.messages || [],
//       });
//     } catch (err) {
//       console.error('Rename failed:', err);
//     }
//   };

//   const handleDelete = async (chatId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this chat?');
//     if (!confirmed) return;

//     const filtered = chats.filter(chat => (chat.chatId || chat.id) !== chatId);
//     setChats(filtered);
//     if (chatId === activeChatId) setActiveChatId(null);

//     try {
//       await apiDelete(`/chat/${chatId}`);
//     } catch (err) {
//       console.error('Failed to delete chat:', err);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="w-full sm:w-72 h-full bg-[#0f172a] border-r border-gray-800 p-4 text-gray-400 text-sm">
//         <button
//           onClick={onNewChat}
//           className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg transition-all"
//         >
//           <FiPlus /> New Chat
//         </button>
//         <p className="text-center mt-12 px-2">
//           🔒 Login to access and save your chat history.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full sm:w-72 h-full bg-[#0f172a] border-r border-gray-800 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
//       <button
//         onClick={onNewChat}
//         className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg transition-all"
//       >
//         <FiPlus /> New Chat
//       </button>

//       <div className="space-y-2">
//         {chats.map((chat) => {
//           const id = chat.chatId || chat.id;
//           const isActive = id === activeChatId;

//           return (
//             <div
//               key={id}
//               className={`group flex flex-col sm:flex-row items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 ${
//                 isActive
//                   ? 'bg-gray-800 ring-2 ring-indigo-600'
//                   : 'hover:bg-gray-800'
//               }`}
//             >
//               <button
//                 onClick={() => {
//                   setActiveChatId(id);
//                   onSelectChat(id);
//                 }}
//                 className="flex items-center gap-2 text-left text-sm text-gray-200 flex-1 overflow-hidden w-full sm:w-auto"
//               >
//                 <FiMessageSquare className="shrink-0" />
//                 {editingId === id ? (
//                   <input
//                     value={editTitle}
//                     onChange={(e) => setEditTitle(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleRename(id)}
//                     className="flex-1 bg-transparent border-b border-indigo-400 text-white focus:outline-none"
//                     autoFocus
//                   />
//                 ) : (
//                   <span className="truncate">{chat.title || 'Untitled Chat'}</span>
//                 )}
//               </button>

//               <div className="flex items-center gap-2 text-gray-400 mt-2 sm:mt-0">
//                 {editingId === id ? (
//                   <FiCheck
//                     onClick={() => handleRename(id)}
//                     className="cursor-pointer hover:text-green-400 transition"
//                   />
//                 ) : (
//                   <FiEdit
//                     onClick={() => {
//                       setEditingId(id);
//                       setEditTitle(chat.title || '');
//                     }}
//                     className="cursor-pointer hover:text-yellow-400 transition"
//                   />
//                 )}
//                 <FiTrash2
//                   onClick={() => handleDelete(id)}
//                   className="cursor-pointer hover:text-red-500 transition"
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;
