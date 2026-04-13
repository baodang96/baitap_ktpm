const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 8081;

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3307);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'movie_booking_system';

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kafka setup
const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092']
});
const producer = kafka.producer();

const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('[User Service] Connected to Kafka Producer');
  } catch (error) {
    console.error('[User Service] Kafka connect error:', error);
  }
};
connectKafka();

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing information' });
    }
    
    try {
        // Check if user exists
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
            [email, password, username] // Note: In production use bcrypt
        );
        const userId = result.insertId;

        // Publish event
        await producer.send({
            topic: 'user-events',
            messages: [
                { value: JSON.stringify({ type: 'USER_REGISTERED', data: { id: userId, username, email } }) },
            ],
        });
        
        // Also log into event_outbox for tracing as requested
        await pool.query(
            "INSERT INTO event_outbox (event_type, payload, status) VALUES (?, ?, 'SENT')",
            ['USER_REGISTERED', JSON.stringify({ id: userId, username, email })]
        );

        console.log(`[User Service] Registered & published event for ${username}`);
        res.status(201).json({ message: 'User registered', user: { id: userId, username, email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query(
            'SELECT id, full_name as username, email FROM users WHERE email=? AND password_hash=?',
            [email, password] // Dummy auth
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        res.json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`User Service is running on http://localhost:${PORT}`);
});
