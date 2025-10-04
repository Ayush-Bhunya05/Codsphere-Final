import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import AppRouter from './routes/AppRouter';

const appStyles = {
  height: '100vh',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  overflow: 'hidden'
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={appStyles}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<AppRouter />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;