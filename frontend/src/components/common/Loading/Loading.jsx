import React from 'react';

const Loading = () => {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    spinner: {
      textAlign: 'center',
      color: 'white'
    },
    spinnerElement: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      borderTop: '4px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px'
    },
    text: {
      margin: '0',
      fontSize: '1.1rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}>
        <div style={styles.spinnerElement}></div>
        <p style={styles.text}>Loading CodeSphere...</p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;