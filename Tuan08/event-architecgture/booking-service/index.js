const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 8083;

const DB_HOST = process.env.DB_HOST || '172.16.48.192';
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
  clientId: 'booking-service',
  brokers: ['172.16.48.192:9092']
});
const producer = kafka.producer();

const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('[Booking Service] Connected to Kafka Producer');
  } catch (error) {
    console.error('[Booking Service] Kafka connect error:', error);
  }
};
connectKafka();

app.post('/', async (req, res) => {
    const { userId, movieId, movieTitle, seats } = req.body;
    
    if (!userId || !movieId || !seats || seats.length === 0) {
        return res.status(400).json({ error: 'Missing required booking details' });
    }

    try {
        // Find showtime for this movie (lazy matching the first showtime)
        const [showtimeRows] = await pool.query('SELECT id, price FROM showtimes WHERE movie_id = ? LIMIT 1', [movieId]);
        if (showtimeRows.length === 0) return res.status(400).json({ error: 'No showtimes found' });
        const showtime = showtimeRows[0];
        const totalAmount = showtime.price * seats.length;

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Insert Booking
            const [bResult] = await connection.query(
                'INSERT INTO bookings (user_id, showtime_id, total_amount, status) VALUES (?, ?, ?, "PENDING")',
                [userId, showtime.id, totalAmount]
            );
            const bookingId = bResult.insertId;

            // 2. Fetch seats IDs mapping
            const [seatRows] = await connection.query('SELECT id, seat_number FROM seats');
            const seatMap = {};
            seatRows.forEach(s => seatMap[s.seat_number] = s.id);

            // 3. Insert Booking Seats
            for (let seatCode of seats) {
                const seatId = seatMap[seatCode];
                if (seatId) {
                    await connection.query('INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)', [bookingId, seatId]);
                }
            }

            // Publish Event
            const eventPayload = {
                id: bookingId, // Use DB primary key id as the booking identifier!
                userId,
                movieId,
                seats,
                amount: totalAmount
            };

            await connection.commit();
            connection.release();

            await producer.send({
                topic: 'booking-events',
                messages: [
                    { value: JSON.stringify({ type: 'BOOKING_CREATED', data: eventPayload }) },
                ],
            });
            
            // Log outbox
            await pool.query(
                "INSERT INTO event_outbox (event_type, payload, status) VALUES (?, ?, 'SENT')",
                ['BOOKING_CREATED', JSON.stringify(eventPayload)]
            );

            console.log(`[Booking Service] Created booking ${bookingId}`);
            res.status(201).json({ message: 'Booking created', booking: { id: bookingId, ...eventPayload } });
        } catch (trxErr) {
            await connection.rollback();
            connection.release();
            throw trxErr;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Listener to update status
const consumer = kafka.consumer({ groupId: 'booking-updater-group' });
const connectConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'payment-events', fromBeginning: false });
    await consumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());
            if (event.type === 'PAYMENT_COMPLETED' || event.type === 'BOOKING_FAILED') {
                const newStatus = event.type === 'PAYMENT_COMPLETED' ? 'CONFIRMED' : 'FAILED';
                await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [newStatus, event.data.bookingId]);
                console.log(`[Booking Service] Updated booking ${event.data.bookingId} to ${newStatus}`);
            }
        },
    });
};
connectConsumer().catch(console.error);

app.listen(PORT, () => console.log(`Booking Service is running on http://172.16.33.142:${PORT}`));
