import api from './auth.js';

export const userAPI = {
  // Bulk upload users
  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/users/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all users
  getUsers: async (page = 1, search = '', type = 'students') => {
    const response = await api.get('/admin/users', {
      params: { page, search, type }
    });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Add single user
  addSingleUser: async (userData) => {
    const response = await api.post('/admin/users/single', userData);
    return response.data;
  },

  // Add sub-admin
  addSubAdmin: async (subAdminData) => {
    const response = await api.post('/admin/users/subadmin', subAdminData);
    return response.data;
  },

  // Promote user to sub-admin
  promoteToSubAdmin: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/promote`);
    return response.data;
  },

  // Demote sub-admin to student
  demoteToStudent: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/demote`);
    return response.data;
  }
};