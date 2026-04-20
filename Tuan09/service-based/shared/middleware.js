/**
 * Shared middleware factory functions.
 * Note: cors is passed in to avoid module resolution issues
 * when shared/ is outside individual service directories.
 */

/**
 * Create CORS middleware. Accepts the cors module from the calling service.
 */
function createCorsMiddleware(cors) {
  return cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

/**
 * Request logger middleware — logs method, URL, and response time.
 */
function requestLogger(serviceName) {
  return (req, res, next) => {
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const color = status >= 400 ? '\x1b[31m' : '\x1b[32m';
      console.log(
        `\x1b[36m[${serviceName}]\x1b[0m ${method} ${url} ${color}${status}\x1b[0m ${duration}ms`
      );
    });

    next();
  };
}

/**
 * Global error handler — catches unhandled errors and returns JSON.
 */
function errorHandler(err, _req, res, _next) {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

/**
 * Wrap async route handlers to catch errors automatically.
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { createCorsMiddleware, requestLogger, errorHandler, asyncHandler };
