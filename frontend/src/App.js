import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEdit';
import './App.css';

function RtlSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return null;
}

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <RtlSync />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="tasks" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route index element={<TaskList />} />
              <Route path="new" element={<TaskCreate />} />
              <Route path=":id" element={<TaskDetail />} />
              <Route path=":id/edit" element={<TaskEdit />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
