import React, { useState } from 'react';
import { userAPI } from '../../../services/api/admin.js';

const AddSubAdmin = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
      maxWidth: '500px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontWeight: '600',
      color: '#333'
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px'
    },
    submitButton: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600'
    },
    message: {
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '20px'
    },
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      setLoading(false);
      return;
    }

    try {
      const subAdminData = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'subadmin'
      };

      const response = await userAPI.addSubAdmin(subAdminData);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Sub-Admin added successfully!'
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error adding sub-admin'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Add Sub-Admin</h3>
      
      {message && (
        <div style={{
          ...styles.message,
          ...(message.type === 'success' ? styles.success : styles.error)
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            minLength="8"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
            minLength="8"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? 'Adding Sub-Admin...' : 'Add Sub-Admin'}
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Sub-Admin Permissions:</h4>
        <ul>
          <li>Can manage users (add, edit, delete)</li>
          <li>Can upload users in bulk</li>
          <li>Can view user progress and reports</li>
          <li>Cannot modify system settings</li>
          <li>Cannot manage other admins</li>
        </ul>
      </div>
    </div>
  );
};

export default AddSubAdmin;