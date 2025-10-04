import React, { useState } from 'react';
import { userAPI } from '../../../services/api/admin.js';

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    moodleId: '',
    year: 'FE',
    batch: '',
    class: 'A',
    course: 'Python',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    formContainer: {
      flex: 1,
      overflow: 'auto',
      padding: '20px'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
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
    select: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      background: 'white'
    },
    submitButton: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      gridColumn: '1 / -1',
      justifySelf: 'start'
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
    },
    infoBox: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      borderLeft: '4px solid #667eea'
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

    try {
      // Construct full name
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
      
      // Prepare user data
      const userData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        full_name: fullName,
        moodle_id: formData.moodleId,
        year: formData.year,
        batch: formData.batch,
        class: formData.class,
        course: formData.course,
        email: formData.email
      };

      const response = await userAPI.addSingleUser(userData);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: `User added successfully! Password: ${response.data.password}`
        });
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          moodleId: '',
          year: 'FE',
          batch: '',
          class: 'A',
          course: 'Python',
          email: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error adding user'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h3>Add Single User</h3>
        
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
            <label style={styles.label}>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Moodle ID *</label>
            <input
              type="text"
              name="moodleId"
              value={formData.moodleId}
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
            <label style={styles.label}>Year *</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="FE">FE</option>
              <option value="SE">SE</option>
              <option value="TE">TE</option>
              <option value="BE">BE</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Batch *</label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="e.g., 2024-25"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Class *</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Course *</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Adding User...' : 'Add User'}
          </button>
        </form>

        <div style={styles.infoBox}>
          <h4>Password Information:</h4>
          <p>Password will be automatically generated in the format: <strong>FirstName@MoodleID</strong></p>
          <p>Example: If First Name is "John" and Moodle ID is "12345", password will be "John@12345"</p>
        </div>
      </div>
    </div>
  );
};

export default AddUser;