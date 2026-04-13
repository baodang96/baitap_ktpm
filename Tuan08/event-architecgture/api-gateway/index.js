const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[Gateway] ${req.method} ${req.url}`);
    next();
});

// Proxy routes
app.use('/api/users', createProxyMiddleware({ target: 'http://localhost:8081', changeOrigin: true, pathRewrite: { '^/api/users': '' } }));
app.use('/api/movies', createProxyMiddleware({ target: 'http://localhost:8082', changeOrigin: true, pathRewrite: { '^/api/movies': '' } }));
app.use('/api/bookings', createProxyMiddleware({ target: 'http://localhost:8083', changeOrigin: true, pathRewrite: { '^/api/bookings': '' } }));

app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});
