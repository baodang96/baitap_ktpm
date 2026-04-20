const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '172.16.33.143',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'sapassword',
  database: process.env.DB_NAME || 'food_ordering_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  query: async (sql, params) => {
    try {
      const [results, ] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('\x1b[31m[DB Error]\x1b[0m', error.message);
      throw error;
    }
  },
  pool,
};
