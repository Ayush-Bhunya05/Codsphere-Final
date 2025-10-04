import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserList from '../../components/admin/UserManagement/UserList';
import BulkUpload from '../../components/admin/UserManagement/BulkUpload';
import AddUser from '../../components/admin/UserManagement/AddUser';
import AddSubAdmin from '../../components/admin/UserManagement/AddSubAdmin';

const UserManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/user/dashboard');
      return;
    }
  }, [user, navigate]);

  const styles = {
    container: {
      height: '100vh', // Changed to 100vh
      background: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'white',
      padding: '20px 40px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0 // Prevent header from shrinking
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
    backBtn: {
      background: '#667eea',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      marginRight: '10px'
    },
    content: {
      flex: 1, // Take remaining space
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      overflow: 'auto' // Add scroll to content area
    },
    section: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      minHeight: '400px'
    },
    sectionTitle: {
      color: '#333',
      marginBottom: '20px',
      borderBottom: '2px solid #667eea',
      paddingBottom: '10px'
    },
    tabContainer: {
      display: 'flex',
      marginBottom: '20px',
      borderBottom: '1px solid #ddd',
      background: '#f8f9fa',
      padding: '10px 0',
      flexShrink: 0 // Prevent tabs from shrinking
    },
    tab: {
      padding: '12px 24px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '16px',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      borderBottom: '2px solid #667eea',
      color: '#667eea',
      fontWeight: '600'
    }
  };

  const [activeTab, setActiveTab] = React.useState('users');

  // Show loading or redirect if no user
  if (!user || user.role !== 'admin') {
    return <div>Redirecting...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <button 
            style={styles.backBtn}
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 style={styles.headerTitle}>User Management</h1>
        </div>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.email}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.content}>
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'users' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'bulk-upload' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('bulk-upload')}
          >
            Bulk Upload
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'add-user' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('add-user')}
          >
            Add Single User
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'sub-admin' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('sub-admin')}
          >
            Manage Sub-Admins
          </button>
        </div>

        {activeTab === 'users' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Manage Users</h2>
            <UserList />
          </div>
        )}

        {activeTab === 'bulk-upload' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Bulk Upload Users</h2>
            <BulkUpload />
          </div>
        )}

        {activeTab === 'add-user' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Add Single User</h2>
            <AddUser />
          </div>
        )}

        {activeTab === 'sub-admin' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Manage Sub-Admins</h2>
            <AddSubAdmin />
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;