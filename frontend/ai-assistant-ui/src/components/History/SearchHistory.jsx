// // 📁 frontend/src/components/user/HistoryDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost } from '../../services/api';
// import {
//   ChevronDown,
//   ChevronUp,
//   Trash2,
//   Search,
//   Copy,
//   Check,
//   Download,
//   Loader
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import { useAuth } from '../../contexts/AuthContext';

// const HistoryDetail = () => {
//   const [history, setHistory] = useState([]);
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [languageFilter, setLanguageFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('');
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOrder, setSortOrder] = useState('newest');
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const itemsPerPage = 6;

//   useEffect(() => {
//     if (!user) {
//       toast.error('To access History you need to log in first');
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       const resHistory = await apiGet('/history');
//       const sorted = Array.isArray(resHistory) ? resHistory : resHistory.history || [];
//       setHistory(sorted);
//     } catch (err) {
//       console.error('Failed to load history:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearHistory = async () => {
//     if (!window.confirm('Are you sure you want to clear your entire history?')) return;
//     try {
//       await apiPost('/history/clear', {});
//       setHistory([]);
//     } catch (err) {
//       console.error('Failed to clear history:', err);
//     }
//   };

//   const deleteOne = async (id) => {
//     if (!window.confirm('Delete this history item?')) return;
//     try {
//       await apiPost('/history/delete', { id });
//       setHistory(history.filter(h => h._id !== id));
//     } catch (err) {
//       console.error('Failed to delete item:', err);
//     }
//   };

//   const handleCopy = (text, index) => {
//     navigator.clipboard.writeText(text);
//     setCopiedIndex(index);
//     toast.success('Copied to clipboard');
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const exportAsFile = (type = 'json') => {
//     const blob = new Blob([
//       type === 'json' ? JSON.stringify(history, null, 2) : history.map(h => `Prompt: ${h.query}\nLanguage: ${h.language}\n\nResult:\n${h.result}\n\n---\n`).join('\n')
//     ], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `search-history.${type}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   useEffect(() => {
//     if (user) fetchHistory();
//   }, [user]);

//   const filteredHistory = history
//     .filter(item => {
//       const matchesQuery = item.query.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesLanguage = languageFilter === 'all' || item.language === languageFilter;
//       const matchesDate = !dateFilter || new Date(item.createdAt).toISOString().split('T')[0] === dateFilter;
//       return matchesQuery && matchesLanguage && matchesDate;
//     })
//     .sort((a, b) => {
//       return sortOrder === 'newest'
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt);
//     });

//   const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
//   const currentItems = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const uniqueLanguages = Array.from(new Set(history.map(h => h.language || 'unknown')));

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-white">Search History</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={() => exportAsFile('txt')}
//             className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded shadow flex items-center gap-1"
//           >
//             <Download size={16} /> Export TXT
//           </button>
//           <button
//             onClick={() => exportAsFile('json')}
//             className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded shadow flex items-center gap-1"
//           >
//             <Download size={16} /> Export JSON
//           </button>
//           {history.length > 0 && (
//             <button
//               onClick={clearHistory}
//               className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded shadow"
//             >
//               Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="mb-4 flex flex-col md:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search prompts..."
//             className="pl-10 pr-3 py-2 w-full rounded bg-gray-800 text-white border border-gray-700"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select
//           className="bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded"
//           value={languageFilter}
//           onChange={(e) => setLanguageFilter(e.target.value)}
//         >
//           <option value="all">All Languages</option>
//           {uniqueLanguages.map((lang, idx) => (
//             <option key={idx} value={lang}>{lang}</option>
//           ))}
//         </select>
//         <input
//           type="date"
//           className="bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//         />
//         <select
//           className="bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded"
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//         >
//           <option value="newest">Newest First</option>
//           <option value="oldest">Oldest First</option>
//         </select>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <Loader className="animate-spin text-indigo-400" size={32} />
//         </div>
//       ) : currentItems.length === 0 ? (
//         <p className="text-gray-400 text-center py-8 animate-pulse">No search history found.</p>
//       ) : (
//         currentItems.map((item, index) => (
//           <motion.div
//             key={item._id || index}
//             layout
//             className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-white relative shadow-md hover:border-indigo-600 transition-all duration-200 mb-4"
//           >
//             <div
//               className="cursor-pointer flex justify-between items-center"
//               onClick={() => setExpandedIndex(expandedIndex === item._id ? null : item._id)}
//             >
//               <div>
//                 <h4 className="font-bold text-lg mb-1 text-indigo-300 break-words">{item.query}</h4>
//                 <div className="text-sm text-gray-400">
//                   {new Date(item.createdAt).toLocaleString()} — {item.language || 'Unknown'}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deleteOne(item._id);
//                   }}
//                   title="Delete"
//                   className="text-red-400 hover:text-red-600"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//                 {expandedIndex === item._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </div>
//             </div>
//             <AnimatePresence>
//               {expandedIndex === item._id && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-4 bg-gray-800 rounded-lg overflow-hidden"
//                 >
//                   <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50">
//                     <span className="text-xs text-gray-300 font-mono">Code Snippet</span>
//                     <motion.button
//                       onClick={() => handleCopy(item.result, index)}
//                       className="text-gray-400 hover:text-indigo-300 p-1 rounded transition-colors flex items-center gap-1"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {copiedIndex === index ? (
//                         <>
//                           <Check size={16} /> Copied!
//                         </>
//                       ) : (
//                         <>
//                           <Copy size={16} /> Copy
//                         </>
//                       )}
//                     </motion.button>
//                   </div>
//                   <SyntaxHighlighter
//                     language={item.language || 'javascript'}
//                     style={oneDark}
//                     customStyle={{
//                       backgroundColor: '#111827',
//                       padding: '1rem',
//                       borderRadius: '0 0 0.5rem 0.5rem',
//                       fontSize: '0.875rem',
//                       overflowX: 'auto',
//                       whiteSpace: 'pre-wrap',
//                       wordBreak: 'break-word',
//                       margin: '0',
//                     }}
//                     showLineNumbers
//                     wrapLines
//                   >
//                     {item.result || 'No result available for this query.'}
//                   </SyntaxHighlighter>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         ))
//       )}

//       {totalPages > 1 && (
//         <div className="mt-6 flex justify-center gap-3">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//             <button
//               key={num}
//               onClick={() => setCurrentPage(num)}
//               className={`px-3 py-1.5 rounded text-sm ${
//                 num === currentPage ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
//               } hover:bg-indigo-500 hover:text-white`}
//             >
//               {num}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoryDetail;
