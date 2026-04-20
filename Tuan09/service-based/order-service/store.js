/**
 * Order Service — MariaDB order store
 */
const { generateId } = require('../shared/helpers');
const db = require('../shared/db');

const store = {
  async getAll() {
    const rows = await db.query('SELECT * FROM orders ORDER BY createdAt DESC');
    return rows;
  },

  async getById(id) {
    const rows = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async getByUserId(userId) {
    const rows = await db.query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return rows;
  },

  async create({ userId, userName, items, totalAmount }) {
    const order = {
      id: generateId('ORD'),
      userId,
      userName,
      items, // array of objects
      totalAmount: Number(totalAmount),
      status: 'PENDING',         // PENDING → CONFIRMED → PAID → DELIVERED
      paymentStatus: 'UNPAID',   // UNPAID → PAID
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.query(
      'INSERT INTO orders (id, userId, userName, items, totalAmount, status, paymentStatus, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [order.id, order.userId, order.userName, JSON.stringify(order.items), order.totalAmount, order.status, order.paymentStatus, order.createdAt, order.updatedAt]
    );
    return order;
  },

  async updateStatus(id, status) {
    const order = await this.getById(id);
    if (!order) return null;
    await db.query('UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?', [status, id]);
    return await this.getById(id);
  },

  async updatePaymentStatus(id, paymentStatus) {
    const order = await this.getById(id);
    if (!order) return null;
    await db.query('UPDATE orders SET paymentStatus = ?, status = ?, updatedAt = NOW() WHERE id = ?', [paymentStatus, 'CONFIRMED', id]);
    return await this.getById(id);
  },
};

module.exports = store;
