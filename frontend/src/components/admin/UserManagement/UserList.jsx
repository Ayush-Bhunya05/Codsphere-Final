import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../services/api/admin.js';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userType, setUserType] = useState('students');

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px',
      flexShrink: 0
    },
    searchBox: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      width: '300px'
    },
    typeToggle: {
      display: 'flex',
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '4px'
    },
    typeBtn: {
      padding: '8px 16px',
      border: 'none',
      background: 'transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    activeType: {
      background: 'white',
      color: '#667eea',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    },
    tableContainer: {
      flex: 1,
      overflow: 'auto',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '800px'
    },
    tableHeader: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '15px',
      textAlign: 'left',
      position: 'sticky',
      top: 0
    },
    tableRow: {
      borderBottom: '1px solid #eee'
    },
    tableCell: {
      padding: '15px',
      textAlign: 'left',
      whiteSpace: 'nowrap'
    },
    actionCell: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      whiteSpace: 'nowrap'
    },
    editButton: {
      backgroundColor: '#3498db',
      color: 'white'
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white'
    },
    promoteButton: {
      backgroundColor: '#27ae60',
      color: 'white'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20px',
      gap: '10px',
      flexWrap: 'wrap',
      flexShrink: 0
    },
    pageButton: {
      padding: '8px 16px',
      border: '1px solid #667eea',
      backgroundColor: 'white',
      color: '#667eea',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontSize: '16px',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  const fetchUsers = async (page = 1, searchTerm = '', type = 'students') => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers(page, searchTerm, type);
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search, userType);
  }, [currentPage, search, userType]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(userId);
        fetchUsers(currentPage, search, userType);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handlePromoteToSubAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to promote this user to Sub-Admin?')) {
      try {
        await userAPI.promoteToSubAdmin(userId);
        fetchUsers(currentPage, search, userType);
        alert('User promoted to Sub-Admin successfully!');
      } catch (error) {
        console.error('Error promoting user:', error);
        alert('Error promoting user: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleDemoteToStudent = async (userId) => {
    if (window.confirm('Are you sure you want to demote this Sub-Admin to Student?')) {
      try {
        await userAPI.demoteToStudent(userId);
        fetchUsers(currentPage, search, userType);
        alert('Sub-Admin demoted to Student successfully!');
      } catch (error) {
        console.error('Error demoting user:', error);
        alert('Error demoting user: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.typeToggle}>
          <button
            style={{
              ...styles.typeBtn,
              ...(userType === 'students' ? styles.activeType : {})
            }}
            onClick={() => setUserType('students')}
          >
            Students
          </button>
          <button
            style={{
              ...styles.typeBtn,
              ...(userType === 'subadmins' ? styles.activeType : {})
            }}
            onClick={() => setUserType('subadmins')}
          >
            Sub-Admins
          </button>
        </div>
        
        <input
          type="text"
          placeholder={`Search ${userType}...`}
          value={search}
          onChange={handleSearchChange}
          style={styles.searchBox}
        />
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}>Loading {userType}...</div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Moodle ID</th>
                    <th style={styles.tableHeader}>Year</th>
                    <th style={styles.tableHeader}>Class</th>
                    <th style={styles.tableHeader}>Course</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Role</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{user.full_name}</td>
                      <td style={styles.tableCell}>{user.moodle_id}</td>
                      <td style={styles.tableCell}>{user.year}</td>
                      <td style={styles.tableCell}>{user.class}</td>
                      <td style={styles.tableCell}>{user.course}</td>
                      <td style={styles.tableCell}>{user.email}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: user.role === 'admin' ? '#667eea' : 
                                          user.role === 'subadmin' ? '#3498db' : '#27ae60',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{...styles.tableCell, ...styles.actionCell}}>
                        {user.role === 'student' && (
                          <button
                            onClick={() => handlePromoteToSubAdmin(user.id)}
                            style={{...styles.actionButton, ...styles.promoteButton}}
                          >
                            Promote to Sub-Admin
                          </button>
                        )}
                        {user.role === 'subadmin' && (
                          <button
                            onClick={() => handleDemoteToStudent(user.id)}
                            style={{...styles.actionButton, ...styles.editButton}}
                          >
                            Demote to Student
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)}
                          style={{...styles.actionButton, ...styles.deleteButton}}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !loading && (
              <div style={styles.noData}>
                No {userType} found.
              </div>
            )}

            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.pageButton,
                  ...(!pagination.hasPrev ? styles.disabledButton : {})
                }}
                disabled={!pagination.hasPrev}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              
              <span>Page {currentPage} of {pagination.totalPages || 1}</span>
              
              <button
                style={{
                  ...styles.pageButton,
                  ...(!pagination.hasNext ? styles.disabledButton : {})
                }}
                disabled={!pagination.hasNext}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;