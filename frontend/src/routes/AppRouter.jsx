import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading/Loading';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';

// User Pages
import UserDashboard from '../pages/user/Dashboard';

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin routes
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // User routes (for students/sub-admins)
  return (
    <Routes>
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;