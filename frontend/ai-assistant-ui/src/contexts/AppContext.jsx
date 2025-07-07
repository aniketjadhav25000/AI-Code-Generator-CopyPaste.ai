// 📁 src/contexts/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{
      prompt, setPrompt,
      language, setLanguage,
      response, setResponse,
      loading, setLoading
    }}>
      {children}
    </AppContext.Provider>  
  );
};

export const useAppContext = () => useContext(AppContext);
