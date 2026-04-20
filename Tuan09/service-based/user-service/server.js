const express = require('express');
const cors = require('cors');
const { PORTS } = require('../shared/config');
const { createCorsMiddleware, requestLogger, errorHandler } = require('../shared/middleware');
const routes = require('./routes');

const app = express();
const PORT = PORTS.USER_SERVICE;

// Middleware
app.use(createCorsMiddleware(cors));
app.use(express.json());
app.use(requestLogger('UserService'));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ service: 'user-service', status: 'UP', port: PORT });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[35m╔══════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[35m║\x1b[0m  🧑 User Service running on port \x1b[33m${PORT}\x1b[0m \x1b[35m║\x1b[0m`);
  console.log(`\x1b[35m╚══════════════════════════════════════╝\x1b[0m`);
});
