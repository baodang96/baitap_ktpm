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
 * POST /api/orders — Create a new order
 * Body: { userId, items: [{ foodId, quantity }], token }
 * Calls Food Service to get food info & calculate total.
 * Calls User Service to validate user token.
 */
router.post(
  '/orders',
  asyncHandler(async (req, res) => {
    const err = validateRequired(req.body, ['userId', 'items']);
    if (err) throw errorResponse(err);

    const { userId, items, token } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw errorResponse('Items must be a non-empty array');
    }

    // Validate user via User Service
    let userData;
    console.log(userData || "null")
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const userRes = await callService(`${SERVICES.USER_SERVICE}/api/users/${userId}`, {
        headers: authHeader,
      });
      userData = userRes.data;
    } catch {
      throw errorResponse('User validation failed — User Service might be down', 502);
    }

    // Fetch food details from Food Service & build order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      try {
        const foodRes = await callService(`${SERVICES.FOOD_SERVICE}/api/foods/${item.foodId}`);
        const food = foodRes.data;
        const qty = Math.max(1, Number(item.quantity) || 1);
        orderItems.push({
          foodId: food.id,
          name: food.name,
          price: food.price,
          quantity: qty,
          subtotal: food.price * qty,
        });
        totalAmount += food.price * qty;
      } catch {
        throw errorResponse(`Food item ${item.foodId} not found — Food Service might be down`, 502);
      }
    }

    const order = await store.create({
      userId: userData.id,
      userName: userData.name,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json(successResponse(order, 'Order created successfully'));
  })
);

/**
 * GET /api/orders — List all orders
 */
router.get(
  '/orders',
  asyncHandler(async (_req, res) => {
    res.json(successResponse(await store.getAll()));
  })
);

/**
 * GET /api/orders/user/:userId — Get orders by user
 */
router.get(
  '/orders/user/:userId',
  asyncHandler(async (req, res) => {
    res.json(successResponse(await store.getByUserId(req.params.userId)));
  })
);

/**
 * GET /api/orders/:id — Get order by ID
 */
router.get(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const order = await store.getById(req.params.id);
    if (!order) throw errorResponse('Order not found', 404);
    res.json(successResponse(order));
  })
);

/**
 * PUT /api/orders/:id/status — Update order status
 */
router.put(
  '/orders/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status) throw errorResponse('Status is required');

    const order = await store.updateStatus(req.params.id, status);
    if (!order) throw errorResponse('Order not found', 404);
    res.json(successResponse(order, 'Order status updated'));
  })
);

/**
 * PUT /api/orders/:id/payment — Update payment status
 * Called by Payment Service
 */
router.put(
  '/orders/:id/payment',
  asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;
    if (!paymentStatus) throw errorResponse('Payment status is required');

    const order = await store.updatePaymentStatus(req.params.id, paymentStatus);
    if (!order) throw errorResponse('Order not found', 404);
    res.json(successResponse(order, 'Payment status updated'));
  })
);

module.exports = router;
