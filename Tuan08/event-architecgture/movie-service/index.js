const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 8082;

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

app.get('/', async (req, res) => {
    try {
        // Fetch movies
        const [rows] = await pool.query('SELECT * FROM movies WHERE status = "NOW_SHOWING"');
        
        // Map to frontend expected shape
        const movies = rows.map(r => ({
            id: r.id,
            title: r.title,
            genre: 'General', // Fallback
            duration: r.duration,
            // Fallback default poster to avoid broken UI
            posterImage: r.id % 2 === 0 ? 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' : 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
        }));
        
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.listen(PORT, () => {
    console.log(`Movie Service is running on http://localhost:${PORT}`);
});
