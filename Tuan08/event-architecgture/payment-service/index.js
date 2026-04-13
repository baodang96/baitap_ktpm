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
  clientId: 'payment-service',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'payment-group' });
const producer = kafka.producer();

const startPaymentService = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        await consumer.subscribe({ topic: 'booking-events', fromBeginning: false });

        console.log('[Payment Service] Running. Waiting for BOOKING_CREATED events...');

        await consumer.run({
            eachMessage: async ({ message }) => {
                const event = JSON.parse(message.value.toString());
                
                if (event.type === 'BOOKING_CREATED') {
                    const bookingData = event.data;
                    console.log(`[Payment Service] Processing payment for booking ${bookingData.id}...`);

                    setTimeout(async () => {
                        const isSuccess = Math.random() < 0.8; 
                        const status = isSuccess ? 'SUCCESS' : 'FAILED';
                        
                        try {
                            // Insert into payments table
                            await pool.query(
                                'INSERT INTO payments (booking_id, amount, status, transaction_ref) VALUES (?, ?, ?, ?)',
                                [bookingData.id, bookingData.amount, status, `TXN-${Date.now()}`]
                            );

                            const paymentEvent = {
                                type: isSuccess ? 'PAYMENT_COMPLETED' : 'BOOKING_FAILED',
                                data: {
                                    bookingId: bookingData.id,
                                    userId: bookingData.userId,
                                    amount: bookingData.amount
                                }
                            };

                            await producer.send({
                                topic: 'payment-events',
                                messages: [{ value: JSON.stringify(paymentEvent) }]
                            });
                            
                            // Log outbox
                            await pool.query(
                                "INSERT INTO event_outbox (event_type, payload, status) VALUES (?, ?, 'SENT')",
                                [paymentEvent.type, JSON.stringify(paymentEvent.data)]
                            );

                            console.log(`[Payment Service] Published ${paymentEvent.type} for booking ${bookingData.id}`);
                        } catch (err) {
                            console.error('[Payment Service] DB Error', err);
                        }

                    }, 2000); 
                }
            },
        });
    } catch (error) {
        console.error('[Payment Service] Setup Error:', error);
    }
};

startPaymentService();
