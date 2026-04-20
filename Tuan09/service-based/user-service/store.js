/**
 * User Service — MariaDB user store
 */
const bcrypt = require('bcryptjs');
const { generateId } = require('../shared/helpers');
const db = require('../shared/db');

const store = {
  async findByEmail(email) {
    const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  async findById(id) {
    const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async getAll() {
    const rows = await db.query('SELECT id, name, email, role, createdAt FROM users');
    return rows;
  },

  async create({ name, email, password, role = 'USER' }) {
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: generateId('USR'),
      name,
      email,
      password: hash,
      role,
      createdAt: new Date(),
    };
    await db.query(
      'INSERT INTO users (id, name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, user.password, user.role, user.createdAt]
    );
    const { password: _, ...safe } = user;
    return safe;
  },

  async verifyPassword(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
  },
};

module.exports = store;
