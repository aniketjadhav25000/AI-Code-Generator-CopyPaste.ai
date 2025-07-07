import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CodeGenerator from './components/CodeGenerator';
import History from './components/History';
import Settings from './components/Settings';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import PrivateRoute from './components/auth/PrivateRoute';
import AnimatedStarsBackground from './components/AnimatedStarsBackground';
import ParticlesBackground from './components/ParticlesBackground';
import { ToastContainer } from './components/Toast';

const AppRoutes = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const activeTab = location.pathname.split('/')[1] || 'generate';

  return (
    <>
      <AnimatedStarsBackground />
      <ParticlesBackground />
      <ToastContainer />
      
      <div className="min-h-screen pt-20 px-4 pb-10 text-white relative z-10">
        <Navbar activeTab={activeTab} />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <CodeGenerator
                prompt={prompt}
                setPrompt={setPrompt}
                language={language}
                setLanguage={setLanguage}
                response={response}
                setResponse={setResponse}
                loading={loading}
                setLoading={setLoading}
              />
            </PrivateRoute>
          } />
          
          <Route path="/generate" element={
            <PrivateRoute>
              <CodeGenerator
                prompt={prompt}
                setPrompt={setPrompt}
                language={language}
                setLanguage={setLanguage}
                response={response}
                setResponse={setResponse}
                loading={loading}
                setLoading={setLoading}
              />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      
      <Footer />
    </>
  );
};

export default AppRoutes;