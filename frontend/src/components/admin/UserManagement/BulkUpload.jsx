import React, { useState } from 'react';
import { userAPI } from '../../../services/api/admin.js';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    dropzone: {
      border: '2px dashed #667eea',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    fileInput: {
      display: 'none'
    },
    uploadButton: {
      backgroundColor: '#667eea',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    results: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    },
    error: {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '5px'
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert('Please select an Excel or CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const response = await userAPI.bulkUpload(file);
      if (response.success) {
        setResults(response.data);
        alert('Bulk upload completed successfully!');
        setFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Bulk Upload Users</h3>
      
      <div 
        style={styles.dropzone}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          style={styles.fileInput}
        />
        
        {file ? (
          <p>Selected file: {file.name}</p>
        ) : (
          <div>
            <p>Click to select Excel or CSV file</p>
            <p style={{fontSize: '14px', color: '#666'}}>
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={handleUpload} 
        disabled={uploading || !file}
        style={styles.uploadButton}
      >
        {uploading ? 'Uploading...' : 'Upload Users'}
      </button>

      {results && (
        <div style={styles.results}>
          <h4>Upload Results:</h4>
          <p>Total: {results.total}</p>
          <p>Successful: {results.successful}</p>
          <p>Failed: {results.failed}</p>
          
          {results.errors.length > 0 && (
            <div>
              <h5>Errors:</h5>
              <ul>
                {results.errors.map((error, index) => (
                  <li key={index} style={styles.error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;