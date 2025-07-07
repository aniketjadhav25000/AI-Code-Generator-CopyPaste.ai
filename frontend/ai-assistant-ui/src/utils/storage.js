export const savePromptToHistory = (prompt, code) => {
  const history = JSON.parse(localStorage.getItem('promptHistory')) || [];
  const newEntry = { prompt, code, date: new Date().toISOString() };
  localStorage.setItem('promptHistory', JSON.stringify([newEntry, ...history].slice(0, 10)));
};

export const getPromptHistory = () => {
  return JSON.parse(localStorage.getItem('promptHistory')) || [];
};
