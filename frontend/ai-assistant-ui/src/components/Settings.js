// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiSun, FiMoon, FiTrash2, FiCode, FiUser, FiBell, FiKey } from 'react-icons/fi';
// import { FaGithub, FaDiscord } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// const Settings = () => {
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark';
//   });
//   const [activeTab, setActiveTab] = useState('general');
//   const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
//   const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
//     return localStorage.getItem('notifications') !== 'false';
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     if (darkMode) {
//       root.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       root.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   const clearHistory = () => {
//     const confirmClear = window.confirm("Are you sure you want to clear all prompt history?");
//     if (confirmClear) {
//       localStorage.removeItem('history');
//       toast.success('History cleared successfully!');
//     }
//   };

//   const saveApiKey = () => {
//     localStorage.setItem('apiKey', apiKey);
//     toast.success('API Key saved!');
//   };

//   const toggleNotifications = () => {
//     const newValue = !notificationsEnabled;
//     setNotificationsEnabled(newValue);
//     localStorage.setItem('notifications', newValue);
//     toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
//   };

//   const settingItemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.3,
//         ease: "easeOut"
//       }
//     }
//   };

//   const tabVariants = {
//     active: { 
//       backgroundColor: "rgba(99, 102, 241, 0.2)",
//       color: "#818cf8"
//     },
//     inactive: { 
//       backgroundColor: "transparent",
//       color: "#9ca3af"
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="max-w-3xl mx-auto bg-white dark:bg-gray-900 dark:text-white text-black rounded-xl shadow-lg mt-6 transition-all overflow-hidden"
//     >
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar Navigation */}
//         <div className="w-full md:w-48 bg-gray-50 dark:bg-gray-800 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
//             <FiCode className="text-indigo-500" /> Settings
//           </h2>
//           <nav className="space-y-1">
//             {[
//               { id: 'general', icon: <FiUser size={16} />, label: 'General' },
//               { id: 'account', icon: <FiKey size={16} />, label: 'Account' },
//               { id: 'notifications', icon: <FiBell size={16} />, label: 'Notifications' }
//             ].map((tab) => (
//               <motion.button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 variants={tabVariants}
//                 animate={activeTab === tab.id ? 'active' : 'inactive'}
//                 whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
//                 className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
//               >
//                 {tab.icon} {tab.label}
//               </motion.button>
//             ))}
//           </nav>

//           <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Community</p>
//             <div className="flex space-x-3">
//               <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
//                 <FaGithub size={18} />
//               </a>
//               <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-500">
//                 <FaDiscord size={18} />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6">
//           <AnimatePresence mode="wait">
//             {activeTab === 'general' && (
//               <motion.div
//                 key="general"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="space-y-6"
//               >
//                 <motion.div 
//                   variants={settingItemVariants}
//                   className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
//                 >
//                   <div>
//                     <p className="font-semibold">Dark Mode</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
//                   </div>
//                   <motion.button
//                     onClick={() => setDarkMode(!darkMode)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:opacity-80 transition"
//                     title="Toggle Theme"
//                   >
//                     {darkMode ? (
//                       <FiSun size={20} className="text-yellow-400" />
//                     ) : (
//                       <FiMoon size={20} className="text-gray-600 dark:text-gray-300" />
//                     )}
//                   </motion.button>
//                 </motion.div>

//                 <motion.div 
//                   variants={settingItemVariants}
//                   className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
//                 >
//                   <div>
//                     <p className="font-semibold">Clear History</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Delete all saved prompts and responses</p>
//                   </div>
//                   <motion.button
//                     onClick={clearHistory}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
//                   >
//                     <FiTrash2 size={16} />
//                     Clear
//                   </motion.button>
//                 </motion.div>
//               </motion.div>
//             )}

//             {activeTab === 'account' && (
//               <motion.div
//                 key="account"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="space-y-6"
//               >
//                 <motion.div 
//                   variants={settingItemVariants}
//                   className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
//                 >
//                   <div className="mb-3">
//                     <label htmlFor="apiKey" className="block font-semibold mb-1">
//                       API Key
//                     </label>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
//                       Enter your API key for enhanced features
//                     </p>
//                     <div className="flex gap-2">
//                       <input
//                         id="apiKey"
//                         type="password"
//                         value={apiKey}
//                         onChange={(e) => setApiKey(e.target.value)}
//                         className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         placeholder="sk-...your-api-key"
//                       />
//                       <motion.button
//                         onClick={saveApiKey}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//                       >
//                         Save
//                       </motion.button>
//                     </div>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}

//             {activeTab === 'notifications' && (
//               <motion.div
//                 key="notifications"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="space-y-6"
//               >
//                 <motion.div 
//                   variants={settingItemVariants}
//                   className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
//                 >
//                   <div>
//                     <p className="font-semibold">Enable Notifications</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Get alerts for code generation completion
//                     </p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={notificationsEnabled}
//                       onChange={toggleNotifications}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
//                   </label>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Settings;