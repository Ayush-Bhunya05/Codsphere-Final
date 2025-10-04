import User from '../../models/User.js';
import pool from '../../config/database.js';
import xlsx from 'xlsx';
import bcrypt from 'bcrypt';

class UserManagementController {
  // Bulk upload users from Excel/CSV
  static async bulkUpload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      const results = {
        total: data.length,
        successful: 0,
        failed: 0,
        errors: []
      };

      // Process each row
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Validate required fields
          if (!row['First Name'] || !row['Last Name'] || !row['Moodle ID'] || !row['Email']) {
            results.errors.push(`Row ${i + 2}: Missing required fields`);
            results.failed++;
            continue;
          }

          // Construct full name
          const fullName = `${row['First Name']} ${row['Middle Name'] || ''} ${row['Last Name']}`.trim();
          
          // Generate password: Name@Moodle_ID
          const password = `${row['First Name']}@${row['Moodle ID']}`;
          
          // Prepare user data
          const userData = {
            full_name: fullName,
            moodle_id: row['Moodle ID'].toString(),
            year: row['Year'],
            batch: row['Batch'],
            class: row['Class'],
            course: row['Course'],
            email: row['Email'],
            password: password,
            role: 'student'
          };

          // Create user with conflict checking
          await User.createWithCheck(userData);
          results.successful++;

        } catch (error) {
          results.errors.push(`Row ${i + 2}: ${error.message}`);
          results.failed++;
        }
      }

      res.status(200).json({
        success: true,
        message: 'Bulk upload completed',
        data: results
      });

    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during bulk upload'
      });
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search = '', type = 'students' } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, full_name, moodle_id, year, batch, class, course, email, role, must_change_pwd, created_at
        FROM users
        WHERE 1=1
      `;
      let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
      const queryParams = [];

      // Filter by user type
      if (type === 'students') {
        query += ` AND role = 'student'`;
        countQuery += ` AND role = 'student'`;
      } else if (type === 'subadmins') {
        query += ` AND role = 'subadmin'`;
        countQuery += ` AND role = 'subadmin'`;
      }

      // Add search functionality
      if (search) {
        query += ` AND (full_name ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 1} OR moodle_id ILIKE $${queryParams.length + 1})`;
        countQuery += ` AND (full_name ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 1} OR moodle_id ILIKE $${queryParams.length + 1})`;
        queryParams.push(`%${search}%`);
      }

      query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(parseInt(limit), offset);

      const usersResult = await pool.query(query, queryParams);
      
      // For count query, we need to handle parameters differently
      const countParams = [];
      let finalCountQuery = countQuery;
      
      if (type === 'students') {
        finalCountQuery += ` AND role = 'student'`;
      } else if (type === 'subadmins') {
        finalCountQuery += ` AND role = 'subadmin'`;
      }
      
      if (search) {
        finalCountQuery += ` AND (full_name ILIKE $1 OR email ILIKE $1 OR moodle_id ILIKE $1)`;
        countParams.push(`%${search}%`);
      }

      const countResult = await pool.query(finalCountQuery, countParams);

      const totalUsers = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).json({
        success: true,
        data: {
          users: usersResult.rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalUsers,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const query = 'DELETE FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Add single user
  static async addSingleUser(req, res) {
    try {
      const { firstName, middleName, lastName, full_name, moodle_id, year, batch, class: userClass, course, email } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !moodle_id || !email || !year || !batch || !userClass || !course) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // Generate password: FirstName@MoodleID
      const password = `${firstName}@${moodle_id}`;

      const userData = {
        full_name,
        moodle_id,
        year,
        batch,
        class: userClass,
        course,
        email,
        password,
        role: 'student'
      };

      // Create user with conflict checking
      const newUser = await User.createWithCheck(userData);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: newUser,
          password: password
        }
      });

    } catch (error) {
      console.error('Add single user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Promote user to sub-admin
  static async promoteToSubAdmin(req, res) {
    try {
      const { id } = req.params;

      const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING *';
      const result = await pool.query(query, ['subadmin', id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User promoted to sub-admin successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Promote user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Demote sub-admin to student
  static async demoteToStudent(req, res) {
    try {
      const { id } = req.params;

      const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING *';
      const result = await pool.query(query, ['student', id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Sub-admin demoted to student successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Demote user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Add sub-admin
  static async addSubAdmin(req, res) {
    try {
      const { full_name, email, password } = req.body;

      // Validate required fields
      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      const userData = {
        full_name,
        moodle_id: `subadmin-${Date.now()}`,
        year: 'ADMIN',
        batch: 'ADMIN',
        class: 'A',
        course: 'Admin',
        email,
        password,
        role: 'subadmin',
        must_change_pwd: false
      };

      // Create sub-admin with conflict checking
      const newSubAdmin = await User.createWithCheck(userData);

      res.status(201).json({
        success: true,
        message: 'Sub-admin created successfully',
        data: newSubAdmin
      });

    } catch (error) {
      console.error('Add sub-admin error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default UserManagementController;