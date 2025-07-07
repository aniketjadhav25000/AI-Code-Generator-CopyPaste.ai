import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Zap, Home as HomeIcon, Settings, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const tabConfig = [
  { key: '', label: 'Home', icon: <HomeIcon size={16} />, protected: false },
  { key: 'generate', label: 'Generate', icon: <Zap size={16} />, protected: false },
  { key: 'settings', label: 'Settings', icon: <Settings size={16} />, protected: true },
];

const Navbar = ({ activeTab, navigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleTabClick = (tabKey, isProtected) => {
    if (isProtected && !user) {
      toast.error(`You need to log in to access ${tabKey || 'home'}.`);
      navigate('/login');
      setIsMobileMenuOpen(false);
      return;
    }
    navigate(`/${tabKey}`);
    setIsMobileMenuOpen(false);
    scrollToTop();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/30 backdrop-blur-sm z-50 shadow-md h-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mr-2">
            <Bot size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CopyPaste.ai
          </h1>
        </motion.div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-2 items-center">
          {tabConfig.map(({ key, label, icon, protected: isProtected }) => (
            <motion.button
              key={key}
              onClick={() => handleTabClick(key, isProtected)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`capitalize flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-gray-200 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              {icon}
              {label}
            </motion.button>
          ))}

          {!user && (
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white hover:opacity-90 transition shadow-md shadow-cyan-500/30"
            >
              <LogIn size={16} className="inline-block mr-1" /> Login
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-gray-800/30 text-white backdrop-blur-sm"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/90 backdrop-blur-md overflow-hidden shadow-lg"
          >
            <motion.div className="flex flex-col px-4 py-2 space-y-1">
              {tabConfig.map(({ key, label, icon, protected: isProtected }) => (
                <motion.button
                  key={key}
                  onClick={() => handleTabClick(key, isProtected)}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`capitalize flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white font-medium'
                      : 'text-gray-200 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  {icon} {label}
                </motion.button>
              ))}

              {!user && (
                <motion.button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 rounded-lg text-left text-cyan-400 hover:text-white bg-gradient-to-r from-cyan-600/20 to-blue-600/20"
                >
                  <LogIn size={16} className="inline-block mr-1" /> Login
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;