import pool from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const query = `
        SELECT id, full_name, moodle_id, year, batch, class, course, email, 
               password_hash, role, must_change_pwd, created_at
        FROM users 
        WHERE email = $1
      `;
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by moodle_id
  static async findByMoodleId(moodleId) {
    try {
      const query = `
        SELECT id, full_name, moodle_id, year, batch, class, course, email, 
               password_hash, role, must_change_pwd, created_at
        FROM users 
        WHERE moodle_id = $1
      `;
      const result = await pool.query(query, [moodleId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by moodle ID: ${error.message}`);
    }
  }

  // Create new user
  static async create(userData) {
    const {
      full_name,
      moodle_id,
      year,
      batch,
      class: userClass,
      course,
      email,
      password,
      role = 'student'
    } = userData;

    try {
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users 
        (full_name, moodle_id, year, batch, class, course, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, full_name, moodle_id, year, batch, class, course, email, role, must_change_pwd, created_at
      `;

      const values = [
        full_name,
        moodle_id,
        year,
        batch,
        userClass,
        course,
        email,
        password_hash,
        role
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }

  // Update password
  static async updatePassword(userId, newPassword) {
    try {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      const query = `
        UPDATE users 
        SET password_hash = $1, must_change_pwd = false
        WHERE id = $2
        RETURNING id, email
      `;

      const result = await pool.query(query, [password_hash, userId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }

  // Check if user needs to change password
  static async checkPasswordChangeRequired(userId) {
    try {
      const query = 'SELECT must_change_pwd FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
      return result.rows[0]?.must_change_pwd || false;
    } catch (error) {
      throw new Error(`Error checking password change requirement: ${error.message}`);
    }
  }

  // Check if user exists by email or moodle_id
  static async checkExistingUser(email, moodleId) {
    try {
      const query = `
        SELECT id FROM users 
        WHERE email = $1 OR moodle_id = $2
      `;
      const result = await pool.query(query, [email, moodleId]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking existing user: ${error.message}`);
    }
  }

  // Create user with conflict handling
  static async createWithCheck(userData) {
    const {
      full_name,
      moodle_id,
      year,
      batch,
      class: userClass,
      course,
      email,
      password,
      role = 'student'
    } = userData;

    try {
      // Check if user already exists
      const exists = await User.checkExistingUser(email, moodle_id);
      if (exists) {
        throw new Error('User with this email or moodle ID already exists');
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users 
        (full_name, moodle_id, year, batch, class, course, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, full_name, moodle_id, year, batch, class, course, email, role, must_change_pwd, created_at
      `;

      const values = [
        full_name,
        moodle_id,
        year,
        batch,
        userClass,
        course,
        email,
        password_hash,
        role
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
}

export default User;