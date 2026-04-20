/**
 * Payment + Notification Service — MariaDB store
 */
const { generateId } = require('../shared/helpers');
const db = require('../shared/db');

const store = {
  // ── Payment ──
  async getAllPayments() {
    const rows = await db.query('SELECT * FROM payments ORDER BY createdAt DESC');
    return rows;
  },

  async getPaymentByOrderId(orderId) {
    const rows = await db.query('SELECT * FROM payments WHERE orderId = ?', [orderId]);
    return rows.length > 0 ? rows[0] : null;
  },

  async createPayment({ orderId, userId, userName, amount, method }) {
    const payment = {
      id: generateId('PAY'),
      orderId,
      userId,
      userName,
      amount: Number(amount),
      method, // 'COD' | 'BANKING'
      status: 'SUCCESS',
      createdAt: new Date(),
    };
    await db.query(
      'INSERT INTO payments (id, orderId, userId, userName, amount, method, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [payment.id, payment.orderId, payment.userId, payment.userName, payment.amount, payment.method, payment.status, payment.createdAt]
    );
    return payment;
  },

  // ── Notification ──
  async getAllNotifications() {
    const rows = await db.query('SELECT * FROM notifications ORDER BY createdAt DESC');
    return rows;
  },

  async addNotification({ userId, userName, orderId, message }) {
    const notification = {
      id: generateId('NTF'),
      userId,
      userName,
      orderId,
      message,
      read: false,
      createdAt: new Date(),
    };
    await db.query(
      'INSERT INTO notifications (id, userId, userName, orderId, message, r_read, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [notification.id, notification.userId, notification.userName, notification.orderId, notification.message, notification.read, notification.createdAt]
    );
    return notification;
  },
};

module.exports = store;
