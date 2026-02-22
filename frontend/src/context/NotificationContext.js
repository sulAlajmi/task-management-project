import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showSuccess = useCallback((message) => {
    setNotification({ type: 'success', message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const showError = useCallback((message) => {
    setNotification({ type: 'error', message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const clear = useCallback(() => setNotification(null), []);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, clear, notification }}>
      {children}
    </NotificationContext.Provider>
  );
}
