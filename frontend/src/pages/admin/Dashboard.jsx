import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: '#f8f9fa',
      overflow: 'auto' // Added scroll
    },
    header: {
      background: 'white',
      padding: '20px 40px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    headerTitle: {
      margin: '0',
      color: '#333',
      fontSize: '1.8rem'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      color: '#666'
    },
    logoutBtn: {
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500'
    },
    content: {
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 100px)' // Ensure content area has proper height
    },
    welcomeCard: {
      background: 'white',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    },
    welcomeTitle: {
      color: '#333',
      marginBottom: '15px'
    },
    welcomeText: {
      color: '#666',
      fontSize: '1.1rem',
      marginBottom: '30px'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    featureCard: {
      background: '#f8f9fa',
      padding: '25px',
      borderRadius: '10px',
      borderLeft: '4px solid #667eea',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    featureTitle: {
      color: '#333',
      marginBottom: '10px'
    },
    featureText: {
      color: '#666',
      margin: '0',
      fontSize: '0.9rem'
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.email}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>
      <main style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Welcome to CodeSphere Admin Panel</h2>
          <p style={styles.welcomeText}>Manage users, courses, and platform settings</p>
          
          <div style={styles.featureGrid}>
            <div 
              style={styles.featureCard}
              onClick={() => handleNavigation('/admin/user-management')}
            >
              <h3 style={styles.featureTitle}>User Management</h3>
              <p style={styles.featureText}>Add, remove, and manage users and sub-admins</p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Course Progress</h3>
              <p style={styles.featureText}>Track student progress and performance</p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Resource Management</h3>
              <p style={styles.featureText}>Upload and manage learning resources</p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Activity Monitor</h3>
              <p style={styles.featureText}>Monitor user activities and system logs</p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Test Management</h3>
              <p style={styles.featureText}>Create and manage tests and assessments</p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Feedback System</h3>
              <p style={styles.featureText}>View and manage user feedback</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;