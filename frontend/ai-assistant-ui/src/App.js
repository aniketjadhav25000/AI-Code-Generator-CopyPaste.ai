import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CodeGenerator from './components/CodeGenerator';
import Settings from './components/Profile/Settings';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import SavedCode from './components/user/SavedCode';
import PasswordReset from './components/Auth/PasswordReset';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './components/home.jsx';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ChatProvider } from './contexts/ChatContext';

import ParticlesBackground from './components/ParticlesBackground';
import ChatInterface from './components/chat/ChatUI.jsx';

import { Toaster } from 'react-hot-toast'; // ✅ NEW

const ProtectedRoute = ({ children, tab }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}&reason=${tab}`}
        replace
      />
    );
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPrompt, setResponse } = useAppContext();

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const path = location.pathname.split('/')[1];
  const activeTab = path === '' ? 'home' : path;

  return (
    <>
      <ParticlesBackground />
      <Navbar activeTab={activeTab} navigate={navigate} />

      {/* ✅ Main Content Layout */}
      <div className="pt-16 flex flex-col min-h-screen overflow-hidden text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/saved"
            element={<ProtectedRoute tab="Saved"><SavedCode /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute tab="Profile"><Profile /></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute tab="Settings"><Settings /></ProtectedRoute>}
          />

          {/* ✅ Unified chat route */}
          <Route path="/generate" element={<ChatInterface />} />
          <Route path="/chat" element={<ChatInterface />} />

          {/* Fallback route */}
          <Route path="*" element={<ChatInterface />} />
        </Routes>
      </div>


      {/* ✅ Global Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: 'mt-[4.5rem]', // pushes below fixed navbar (approx 72px)
        }}
      />

    </>
  );
};

const App = () => (
  <AuthProvider>
    <AppProvider>
      <ChatProvider>
        <Router>
          <AppContent />
        </Router>
      </ChatProvider>
    </AppProvider>
  </AuthProvider>
);

export default App;
