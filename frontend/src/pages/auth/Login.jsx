import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api/auth';

const Login = () => {
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'hidden'
    },
    background: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      color: '#333',
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: '0',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    toggleContainer: {
      display: 'flex',
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '4px',
      marginBottom: '25px'
    },
    toggleBtn: {
      flex: '1',
      padding: '12px',
      border: 'none',
      background: 'transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      color: '#666'
    },
    toggleBtnActive: {
      background: 'white',
      color: '#667eea',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    input: {
      padding: '15px',
      border: '2px solid #e1e5e9',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      background: '#f8f9fa'
    },
    inputError: {
      borderColor: '#e74c3c',
      background: '#fdf2f2'
    },
    errorText: {
      color: '#e74c3c',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    loginBtn: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      opacity: loading ? 0.7 : 1
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        // Create complete user object with token
        const userData = {
          ...response.data.user,
          token: response.data.token
        };
        
        // Store in localStorage
        localStorage.setItem('codesphere_token', response.data.token);
        localStorage.setItem('codesphere_user', JSON.stringify(userData));
        
        // Update auth context
        login(userData);
        
        // Navigate based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>CodeSphere</h1>
          </div>

          <div style={styles.toggleContainer}>
            <button
              style={{
                ...styles.toggleBtn,
                ...(isUserLogin ? styles.toggleBtnActive : {})
              }}
              onClick={() => setIsUserLogin(true)}
            >
              User
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                ...(!isUserLogin ? styles.toggleBtnActive : {})
              }}
              onClick={() => setIsUserLogin(false)}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
                disabled={loading}
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.formGroup}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {})
                }}
                disabled={loading}
              />
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            {errors.submit && (
              <div style={styles.errorText}>
                {errors.submit}
              </div>
            )}

            <button 
              type="submit" 
              style={styles.loginBtn}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;