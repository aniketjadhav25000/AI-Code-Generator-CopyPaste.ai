import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiProfile, apiPatch, apiDelete } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import FirstTimeSetupModal from './FirstTimeSetupModal';
import {
  FaUserCircle, FaEdit, FaCheck, FaTimes, FaSpinner,
  FaSun, FaMoon, FaInfoCircle, FaSignOutAlt, FaTrashAlt,
  FaCog, FaPalette, FaUserCog
} from 'react-icons/fa';

const Settings = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [loading, setLoading] = useState({ profile: false, delete: false, update: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [feedback, setFeedback] = useState({ success: '', error: '' });
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  // New state to store the original name when entering edit mode
  const [originalProfileName, setOriginalProfileName] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
  try {
    setLoading(prev => ({ ...prev, profile: true }));
    const res = await apiProfile.get(token);
    setProfile({
      name: res.user.name || '',
      email: res.user.email || '',
      age: res.user.age || ''
    });
    setOriginalProfileName(res.user.name || '');
    if (res.user.photoURL) setAvatar(res.user.photoURL);
    return res;
  } catch (err) {
    setFeedback({ ...feedback, error: err.message || 'Failed to load profile' });
  } finally {
    setLoading(prev => ({ ...prev, profile: false }));
  }
};


  if (user) {
  fetchProfile().then((res) => {
    const hasNoNameOrAge = !res?.user?.name || !res?.user?.age;
    if (hasNoNameOrAge) {
      setShowFirstTimeModal(true);
    }
  });
}


  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setToastMessage('🛠️ Theme switching will be available soon!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Function to handle entering edit mode
  const handleEditClick = () => {
    setOriginalProfileName(profile.name); // Save current name before clearing
    setProfile(prev => ({ ...prev, name: '' })); // Clear the name input field
    setEditMode(true);
    setFeedback({ success: '', error: '' }); // Clear any previous feedback
  };

  const handleProfileUpdate = async () => {
    // Trim the new name input to remove leading/trailing whitespace
    const newName = profile.name.trim();

    // Check if the new name is empty
    if (!newName) {
      setFeedback({ error: 'Name cannot be empty.', success: '' });
      return;
    }

    // Check if the new name is the same as the original user name (before edit)
    if (newName === originalProfileName) {
      setFeedback({ error: 'This name is same as existing name.', success: '' });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, update: true }));
      const res = await apiPatch('/user/profile', { name: newName }, token); // Use newName here
      setProfile(prev => ({ ...prev, name: res.user.name }));
      setOriginalProfileName(res.user.name); // Update original name after successful save
      setFeedback({ success: res.message || 'Profile updated successfully!', error: '' });
      setEditMode(false);
      setTimeout(() => setFeedback({ success: '', error: '' }), 3000);
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || err.message || 'Update failed', success: '' });
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      await apiDelete('/user', null, token);
      logout();
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || err.message || 'Account deletion failed', success: '' });
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
      setShowDeleteModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  // Handle Enter key press on the name input field
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleProfileUpdate();
    }
  };

  // NEW FUNCTION: Generate initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ').filter(part => part.length > 0);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-300 p-6 rounded-xl shadow-xl text-center max-w-sm w-full flex flex-col items-center gap-4"
        >
          <FaInfoCircle className="text-4xl text-blue-400" />
          <p className="text-lg font-medium">Please log in to access your settings.</p>
        </motion.div>
      </div>
    );
  }

  if (loading.profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white gap-4">
        <FaSpinner className="animate-spin text-blue-400 text-5xl" />
        <span className="text-xl font-medium text-gray-300">Loading profile...</span>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-4 z-[9999] flex justify-center pointer-events-none p-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto text-sm animate-pulse">
              <FaInfoCircle className="text-base" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen text-white p-4 sm:p-6 flex justify-center items-start pt-16 pb-20 sm:pb-6">
        <div className="w-full max-w-4xl space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
          {/* Header with animated gradient - now shared across mobile and desktop */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center sm:col-span-3 mb-6 sm:mb-0" // Span full width on desktop
          >
            <h1 className="text-3xl py-2 sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              User Settings
            </h1>
            <p className="text-gray-400 text-sm">Manage your account preferences</p>
          </motion.div>

          {/* Desktop Sidebar Navigation (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block sm:col-span-1 bg-gray-900/70 backdrop-blur-sm border border-gray-700/60 rounded-xl p-4 shadow-lg h-fit"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Sections</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left py-2 px-3 rounded-md font-medium flex items-center gap-2 transition-colors ${activeSection === 'profile' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FaUserCog className="text-base" /> Profile
              </button>
              <button
                onClick={() => setActiveSection('appearance')}
                className={`w-full text-left py-2 px-3 rounded-md font-medium flex items-center gap-2 transition-colors ${activeSection === 'appearance' ? 'bg-gray-700 text-purple-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FaPalette className="text-base" /> Appearance
              </button>
              <button
                onClick={() => setActiveSection('actions')}
                className={`w-full text-left py-2 px-3 rounded-md font-medium flex items-center gap-2 transition-colors ${activeSection === 'actions' ? 'bg-gray-700 text-red-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <FaCog className="text-base" /> Account Actions
              </button>
            </nav>
          </motion.div>

          {/* Mobile Navigation Tabs (hidden on desktop) */}
          <div className="sm:hidden flex justify-around bg-gray-800/80 rounded-lg p-1 sticky top-16 z-10 backdrop-blur-sm col-span-3">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex-1 py-2 px-1 text-sm font-medium rounded-md flex items-center justify-center gap-1 ${activeSection === 'profile' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}
            >
              <FaUserCog className="text-sm" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveSection('appearance')}
              className={`flex-1 py-2 px-1 text-sm font-medium rounded-md flex items-center justify-center gap-1 ${activeSection === 'appearance' ? 'bg-gray-700 text-purple-400' : 'text-gray-400'}`}
            >
              <FaPalette className="text-sm" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => setActiveSection('actions')}
              className={`flex-1 py-2 px-1 text-sm font-medium rounded-md flex items-center justify-center gap-1 ${activeSection === 'actions' ? 'bg-gray-700 text-red-400' : 'text-gray-400'}`}
            >
              <FaCog className="text-sm" />
              <span>Actions</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="sm:col-span-2 space-y-6">
            {/* Feedback Messages */}
            <AnimatePresence>
              {feedback.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-blue-800/40 border border-blue-700 text-blue-300 px-4 py-3 rounded-md shadow-sm flex items-center gap-2 text-sm"
                >
                  <FaCheck className="text-base" />
                  <p>{feedback.success}</p>
                </motion.div>
              )}
              {feedback.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-800/40 border border-red-700 text-red-300 px-4 py-3 rounded-md shadow-sm flex items-center gap-2 text-sm"
                >
                  <FaTimes className="text-base" />
                  <p>{feedback.error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-gray-900/70 backdrop-blur-sm border border-gray-700/60 rounded-xl p-5 sm:p-6 shadow-lg ${activeSection !== 'profile' && 'hidden'}`}
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-blue-300 flex items-center gap-3">
                <FaUserCircle className="text-2xl text-blue-400" />
                Profile Information
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
                <div className="relative group">
                  {avatar ? (
                    <div className="relative">
                      <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-purple-500 shadow-md transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <FaEdit className="text-white text-lg" />
                      </div>
                    </div>
                  ) : (
                    // MODIFIED: Display initials if no avatar is set
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 flex items-center justify-center border-3 border-purple-500 shadow-md transition-transform group-hover:scale-105">
                      <span className="text-white text-3xl sm:text-4xl font-bold">
                        {getInitials(originalProfileName)}
                      </span>
                      <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <FaEdit className="text-white text-lg" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="text-lg sm:text-xl font-medium text-white">{originalProfileName}</div> {/* Display original name here */}
                  <div className="text-sm sm:text-base text-gray-400">{profile.email}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Age: {profile.age || 'N/A'}</div>
                </div>
                {!editMode && (
                  <button
                    onClick={handleEditClick} // Use the new handler
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 font-medium text-sm transition flex items-center gap-2 shadow-md"
                    aria-label="Edit profile"
                  >
                    <FaEdit className="text-sm" /> Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {editMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="pt-5 border-t border-gray-700 mt-5"
                  >
                    <label htmlFor="name-input" className="block text-sm font-medium text-gray-300 mb-2">
                      Update Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={profile.name} // This will be blank initially due to handleEditClick
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      onKeyDown={handleKeyDown} // Added onKeyDown handler
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
                      placeholder="Enter your name"
                      aria-label="Update name"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setProfile(prev => ({ ...prev, name: originalProfileName })); // Revert name on cancel
                          setFeedback({ success: '', error: '' });
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 text-sm transition shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleProfileUpdate}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md text-white font-medium text-sm shadow-md transition flex items-center gap-2"
                        disabled={loading.update}
                      >
                        {loading.update ? <FaSpinner className="animate-spin text-sm" /> : <FaCheck className="text-sm" />}
                        {loading.update ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-gray-900/70 backdrop-blur-sm border border-gray-700/60 rounded-xl p-5 sm:p-6 shadow-lg ${activeSection !== 'appearance' && 'hidden'}`}
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-purple-300 flex items-center gap-3">
                {theme === 'dark' ? <FaMoon className="text-2xl text-purple-400" /> : <FaSun className="text-2xl text-purple-400" />}
                Appearance
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-gray-300">Current Theme: <span className="font-semibold capitalize">{theme}</span></span>
                  <p className="text-xs text-gray-500 mt-1">Choose your preferred interface color scheme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 font-medium text-sm transition flex items-center gap-2 shadow-md"
                >
                  {theme === 'dark' ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
                  Toggle Theme
                </button>
              </div>
            </motion.div>

            {/* Account Actions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-gray-900/70 backdrop-blur-sm border border-gray-700/60 rounded-xl p-5 sm:p-6 shadow-lg ${activeSection !== 'actions' && 'hidden'}`}
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-red-400 flex items-center gap-3">
                <FaTrashAlt className="text-2xl text-red-500" />
                Account Actions
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FaSignOutAlt className="text-blue-400" />
                    Session Management
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">Sign out of your account on this device</p>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 font-medium text-sm transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <FaSignOutAlt className="text-sm" /> Log Out
                  </button>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FaTrashAlt className="text-red-400" />
                    Dangerous Zone
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">Permanently delete your account and all associated data</p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <FaTrashAlt className="text-sm" /> Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals: Delete and Logout Confirmations */}
      <AnimatePresence>
        {(showDeleteModal || showLogoutConfirm) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={() => { setShowDeleteModal(false); setShowLogoutConfirm(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-xl font-bold mb-4 text-center flex items-center justify-center gap-2 ${showDeleteModal ? 'text-red-400' : 'text-blue-400'}`}>
                {showDeleteModal ? <FaTrashAlt className="text-2xl" /> : <FaSignOutAlt className="text-2xl" />}
                {showDeleteModal ? 'Confirm Account Deletion' : 'Confirm Logout'}
              </h3>
              <p className="text-gray-300 mb-6 text-center text-sm">
                {showDeleteModal
                  ? 'Are you absolutely sure you want to delete your account? This action is irreversible and all your data will be permanently removed.'
                  : 'Are you sure you want to log out of your account?'}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setShowLogoutConfirm(false); }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 text-sm transition shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={showDeleteModal ? handleDeleteAccount : handleLogout}
                  disabled={loading.delete}
                  className={`px-4 py-2 ${showDeleteModal ? 'bg-red-700 hover:bg-red-800' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} rounded-md text-white font-medium text-sm shadow-md transition flex items-center justify-center gap-2 ${
                    loading.delete ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading.delete ? <FaSpinner className="animate-spin text-sm" /> : (showDeleteModal ? 'Delete Permanently' : 'Yes, Log Out')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First Time Setup Modal */}
      {showFirstTimeModal && (
        <FirstTimeSetupModal
          token={token}
          onClose={() => setShowFirstTimeModal(false)}
          onComplete={({ name, age }) => {
            setProfile((prev) => ({ ...prev, name, age }));
            setToastMessage('🎉 Profile setup complete!');
            setTimeout(() => setToastMessage(''), 3000);
          }}
        />
      )}
    </>
  );
};

export default Settings;