const { Router } = require('express');
const store = require('./store');
const { asyncHandler } = require('../shared/middleware');
const { successResponse, errorResponse, validateRequired } = require('../shared/helpers');

const router = Router();

/**
 * GET /api/foods — List all foods
 */
router.get(
  '/foods',
  asyncHandler(async (_req, res) => {
    const foods = await store.getAll();
    res.json(successResponse(foods));
  })
);

/**
 * GET /api/foods/:id — Get food by ID
 */
router.get(
  '/foods/:id',
  asyncHandler(async (req, res) => {
    const food = await store.getById(req.params.id);
    if (!food) throw errorResponse('Food not found', 404);
    res.json(successResponse(food));
  })
);

/**
 * POST /api/foods — Create new food
 */
router.post(
  '/foods',
  asyncHandler(async (req, res) => {
    const err = validateRequired(req.body, ['name', 'price']);
    if (err) throw errorResponse(err);

    const food = await store.create(req.body);
    res.status(201).json(successResponse(food, 'Food created successfully'));
  })
);

/**
 * PUT /api/foods/:id — Update food
 */
router.put(
  '/foods/:id',
  asyncHandler(async (req, res) => {
    const food = await store.update(req.params.id, req.body);
    if (!food) throw errorResponse('Food not found', 404);
    res.json(successResponse(food, 'Food updated successfully'));
  })
);

/**
 * DELETE /api/foods/:id — Delete food
 */
router.delete(
  '/foods/:id',
  asyncHandler(async (req, res) => {
    const deleted = await store.delete(req.params.id);
    if (!deleted) throw errorResponse('Food not found', 404);
    res.json(successResponse(null, 'Food deleted successfully'));
  })
);

module.exports = router;
