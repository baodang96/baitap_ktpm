const { Router } = require('express');
const store = require('./store');
const { SERVICES } = require('../shared/config');
const { asyncHandler } = require('../shared/middleware');
const { successResponse, errorResponse, validateRequired } = require('../shared/helpers');

const router = Router();

/**
 * Helper: call another service via fetch
 */
async function callService(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Service unavailable' }));
    throw errorResponse(err.message || `Service error: ${res.status}`, res.status);
  }
  return res.json();
}

/**
 * POST /api/payments — Process payment
 * Body: { orderId, method: 'COD' | 'BANKING' }
 * 
 * Flow:
 * 1. Fetch order from Order Service
 * 2. Create payment record
 * 3. Update order payment status via Order Service
 * 4. Create notification (log to console)
 */
router.post(
  '/payments',
  asyncHandler(async (req, res) => {
    const err = validateRequired(req.body, ['orderId', 'method']);
    if (err) throw errorResponse(err);

    const { orderId, method } = req.body;

    if (!['COD', 'BANKING'].includes(method)) {
      throw errorResponse('Payment method must be COD or BANKING');
    }

    // 1. Fetch order from Order Service
    let orderData;
    try {
      const orderRes = await callService(`${SERVICES.ORDER_SERVICE}/api/orders/${orderId}`);
      orderData = orderRes.data;
    } catch {
      throw errorResponse('Order not found — Order Service might be down', 502);
    }

    if (orderData.paymentStatus === 'PAID') {
      throw errorResponse('Order has already been paid', 400);
    }

    // 2. Create payment
    const payment = await store.createPayment({
      orderId: orderData.id,
      userId: orderData.userId,
      userName: orderData.userName,
      amount: orderData.totalAmount,
      method,
    });

    // 3. Update order payment status via Order Service
    try {
      await callService(`${SERVICES.ORDER_SERVICE}/api/orders/${orderId}/payment`, {
        method: 'PUT',
        body: JSON.stringify({ paymentStatus: 'PAID' }),
      });
    } catch (e) {
      console.error('\x1b[31m[Payment]\x1b[0m Failed to update order status:', e.message);
    }

    // 4. Create notification & log to console
    const message = `🎉 ${orderData.userName} đã đặt đơn #${orderId} thành công! Thanh toán: ${method} — ${orderData.totalAmount.toLocaleString('vi-VN')}đ`;
    const notification = await store.addNotification({
      userId: orderData.userId,
      userName: orderData.userName,
      orderId,
      message,
    });

    console.log(`\n\x1b[42m\x1b[30m ★ NOTIFICATION ★ \x1b[0m`);
    console.log(`\x1b[32m${message}\x1b[0m\n`);

    res.status(201).json(
      successResponse({ payment, notification }, 'Payment processed successfully')
    );
  })
);

/**
 * GET /api/payments — List all payments
 */
router.get(
  '/payments',
  asyncHandler(async (_req, res) => {
    res.json(successResponse(await store.getAllPayments()));
  })
);

/**
 * GET /api/payments/order/:orderId — Get payment by order ID
 */
router.get(
  '/payments/order/:orderId',
  asyncHandler(async (req, res) => {
    const payment = await store.getPaymentByOrderId(req.params.orderId);
    if (!payment) throw errorResponse('Payment not found', 404);
    res.json(successResponse(payment));
  })
);

/**
 * GET /api/notifications — List all notifications
 */
router.get(
  '/notifications',
  asyncHandler(async (_req, res) => {
    res.json(successResponse(await store.getAllNotifications()));
  })
);

module.exports = router;
