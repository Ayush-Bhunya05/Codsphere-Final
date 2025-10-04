import express from 'express';
import UserManagementController from '../../controllers/admin/userManagement.js';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Bulk upload users
router.post('/bulk-upload', upload.single('file'), UserManagementController.bulkUpload);

// Get all users with pagination
router.get('/', UserManagementController.getAllUsers);

// Delete user
router.delete('/:id', UserManagementController.deleteUser);

// Add single user
router.post('/single', UserManagementController.addSingleUser);

// Add sub-admin
router.post('/subadmin', UserManagementController.addSubAdmin);

// Promote user to sub-admin
router.put('/:id/promote', UserManagementController.promoteToSubAdmin);

// Demote sub-admin to student
router.put('/:id/demote', UserManagementController.demoteToStudent);

export default router;