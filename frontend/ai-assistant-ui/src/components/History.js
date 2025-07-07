// import React, { useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import {
//   FiTrash2, FiChevronDown, FiChevronUp, FiCopy, FiClock, FiSearch, FiX, FiCheck
// } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';

// const History = () => {
//   const [history, setHistory] = useState([]);
//   const [expanded, setExpanded] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [copiedExpandedIndex, setCopiedExpandedIndex] = useState(null);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('history') || '[]');
//     setHistory(stored);
//   }, []);

//   const deleteItem = (idx) => {
//     const newHistory = [...history];
//     newHistory.splice(idx, 1);
//     setHistory(newHistory);
//     localStorage.setItem('history', JSON.stringify(newHistory));
//   };

//   const clearAll = () => {
//     if (window.confirm('Are you sure you want to clear all history?')) {
//       setHistory([]);
//       localStorage.removeItem('history');
//     }
//   };

//   const copyToClipboard = (text, idx, expanded = false) => {
//     navigator.clipboard.writeText(text);
//     if (expanded) {
//       setCopiedExpandedIndex(idx);
//       setTimeout(() => setCopiedExpandedIndex(null), 2000);
//     } else {
//       setCopiedIndex(idx);
//       setTimeout(() => setCopiedIndex(null), 2000);
//     }
//   };

//   const filteredHistory = history.filter(item =>
//     item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.language.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const fastTransition = { duration: 0.2, ease: "easeOut" };

//   return (
//     <div className="w-full px-4 sm:px-6 py-6 bg-transparent text-white min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={fastTransition}
//         className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700"
//       >
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <motion.div
//               animate={{ rotate: [0, 10, -10, 0] }}
//               transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
//               className="p-2 bg-indigo-500/20 rounded-lg"
//             >
//               <FiClock className="text-indigo-400 text-xl sm:text-2xl" />
//             </motion.div>
//             <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
//               Prompt History
//             </h2>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Search history..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-8 py-2 w-full rounded-lg bg-gray-700/80 border border-gray-600/50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//                 >
//                   <FiX size={16} />
//                 </button>
//               )}
//             </div>

//             {history.length > 0 && (
//               <motion.button
//                 onClick={clearAll}
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 className="text-sm bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2"
//               >
//                 <FiTrash2 size={16} /> Clear All
//               </motion.button>
//             )}
//           </div>
//         </div>

//         {filteredHistory.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">
//             <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
//               <FiClock className="text-gray-500 text-2xl" />
//             </div>
//             <p className="text-lg">
//               {searchTerm ? 'No matching history found' : 'No history found'}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <AnimatePresence>
//               {filteredHistory.map((item, idx) => (
//                 <motion.div
//                   key={`${item.date}-${idx}`}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={fastTransition}
//                   className="bg-gray-700/50 hover:bg-gray-700/70 p-4 rounded-xl border border-gray-600/50"
//                 >
//                   <div
//                     className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer gap-3"
//                     onClick={() => setExpanded(expanded === idx ? null : idx)}
//                   >
//                     <div className="w-full sm:w-auto flex-1">
//                       <p className="font-medium text-sm sm:text-base line-clamp-2">
//                         <span className="text-indigo-400">▸</span> {item.prompt}
//                       </p>
//                       <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
//                         <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">
//                           {item.language}
//                         </span>
//                         <span className="text-gray-400">
//                           {new Date(item.date).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex gap-3 items-center">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           copyToClipboard(item.result, idx, false);
//                         }}
//                         className="text-gray-400 hover:text-indigo-400 p-1.5 hover:bg-gray-600/50 rounded transition-colors"
//                         title="Copy code"
//                       >
//                         {copiedIndex === idx ? <FiCheck size={16} className="text-green-400" /> : <FiCopy size={16} />}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteItem(idx);
//                         }}
//                         className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-gray-600/50 rounded transition-colors"
//                         title="Delete entry"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                       {expanded === idx ? (
//                         <FiChevronUp size={20} className="text-gray-400" />
//                       ) : (
//                         <FiChevronDown size={20} className="text-gray-400" />
//                       )}
//                     </div>
//                   </div>

//                   <AnimatePresence>
//                     {expanded === idx && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={fastTransition}
//                         className="mt-4 overflow-hidden"
//                       >
//                         <div className="relative">
//                           <SyntaxHighlighter
//                             language={item.language}
//                             style={oneDark}
//                             customStyle={{
//                               padding: '1rem',
//                               backgroundColor: '#1e1e2f',
//                               borderRadius: '0.5rem',
//                               margin: 0
//                             }}
//                             showLineNumbers
//                           >
//                             {item.result}
//                           </SyntaxHighlighter>
//                           <motion.button
//                             onClick={() => copyToClipboard(item.result, idx, true)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="absolute top-2 right-2 bg-gray-700/80 hover:bg-indigo-600 text-white p-1.5 rounded-md text-xs flex items-center gap-1"
//                           >
//                             {copiedExpandedIndex === idx ? (
//                               <>
//                                 <FiCheck size={14} />
//                                 <span className="hidden sm:inline">Copied</span>
//                               </>
//                             ) : (
//                               <>
//                                 <FiCopy size={14} />
//                                 <span className="hidden sm:inline">Copy</span>
//                               </>
//                             )}
//                           </motion.button>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default History;
