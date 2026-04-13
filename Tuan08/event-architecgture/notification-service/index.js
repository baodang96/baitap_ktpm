const { Kafka } = require('kafkajs');
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3307);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'movie_booking_system';

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const startNotificationService = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'payment-events', fromBeginning: false });
        await consumer.subscribe({ topic: 'user-events', fromBeginning: false });

        console.log('[Notification Service] Running. Listening for events...');

        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const event = JSON.parse(message.value.toString());
                
                try {
                   // Deduplication or logging event manually using a fake event_id timestamp since we dont use proper outbox id
                   const fakeEventId = Date.now();
                   await pool.query('INSERT IGNORE INTO event_consumer_log (event_id, consumer_service) VALUES (?, ?)', [fakeEventId, 'notification-service']);

                    if (topic === 'payment-events') {
                        let text = '';
                        if (event.type === 'PAYMENT_COMPLETED') {
                            text = `Booking #${event.data.bookingId} thành công. Đã thanh toán ${event.data.amount}$`;
                            console.log(`\n🔔 NOTIFICATION: ${text}`);
                        } else if (event.type === 'BOOKING_FAILED') {
                            text = `Booking #${event.data.bookingId} thất bại do lỗi thanh toán.`;
                            console.log(`\n🔔 NOTIFICATION: ${text}`);
                        }
                        await pool.query('INSERT INTO notifications (user_id, message, status) VALUES (?, ?, "SENT")', [event.data.userId, text]);
                    }

                    if (topic === 'user-events' && event.type === 'USER_REGISTERED') {
                        const text = `Welcome ${event.data.username} to Movie Ticket System!`;
                        console.log(`\n📧 EMAIL SENDED: ${text}`);
                        await pool.query('INSERT INTO notifications (user_id, message, status) VALUES (?, ?, "SENT")', [event.data.id, text]);
                    }
                } catch(e) {
                   console.error("DB Log error:", e.message);
                }
            },
        });
    } catch (error) {
        console.error('[Notification Service] Setup Error:', error);
    }
};

startNotificationService();
