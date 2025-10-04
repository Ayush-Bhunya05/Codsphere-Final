import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();

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
    userDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    detailCard: {
      background: '#f8f9fa',
      padding: '25px',
      borderRadius: '10px',
      borderLeft: '4px solid #667eea',
      transition: 'transform 0.3s ease',
      minHeight: '150px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    detailTitle: {
      color: '#333',
      marginBottom: '10px',
      fontSize: '1.1rem'
    },
    detailValue: {
      color: '#666',
      margin: '0',
      fontSize: '1rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Student Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.full_name}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>
      <main style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Welcome to CodeSphere Learning Platform</h2>
          <p style={styles.welcomeText}>Access your courses, track progress, and enhance your learning experience</p>
          
          <div style={styles.userDetails}>
            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Student Information</h3>
              <p style={styles.detailValue}>Name: {user?.full_name}</p>
              <p style={styles.detailValue}>Moodle ID: {user?.moodle_id}</p>
              <p style={styles.detailValue}>Email: {user?.email}</p>
            </div>
            
            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Academic Details</h3>
              <p style={styles.detailValue}>Year: {user?.year}</p>
              <p style={styles.detailValue}>Batch: {user?.batch}</p>
              <p style={styles.detailValue}>Class: {user?.class}</p>
              <p style={styles.detailValue}>Course: {user?.course}</p>
            </div>
            
            <div style={styles.detailCard}>
              <h3 style={styles.detailTitle}>Quick Actions</h3>
              <p style={styles.detailValue}>View Courses</p>
              <p style={styles.detailValue}>Access Compiler</p>
              <p style={styles.detailValue}>Take Tests</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;