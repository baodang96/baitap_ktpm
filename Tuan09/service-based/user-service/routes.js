const { Router } = require('express');
const jwt = require('jsonwebtoken');
const store = require('./store');
const { JWT_SECRET } = require('../shared/config');
const { asyncHandler } = require('../shared/middleware');
const { successResponse, errorResponse, validateRequired } = require('../shared/helpers');

const router = Router();

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
router.post(
  '/auth/register',
  asyncHandler(async (req, res) => {
    const err = validateRequired(req.body, ['name', 'email', 'password']);
    if (err) throw errorResponse(err);

    const { name, email, password } = req.body;

    if (await store.findByEmail(email)) {
      throw errorResponse('Email already exists', 409);
    }

    const user = await store.create({ name, email, password });
    res.status(201).json(successResponse(user, 'Registration successful'));
  })
);

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post(
  '/auth/login',
  asyncHandler(async (req, res) => {
    const err = validateRequired(req.body, ['email', 'password']);
    if (err) throw errorResponse(err);

    const { email, password } = req.body;
    const user = await store.findByEmail(email);

    if (!user || !(await store.verifyPassword(password, user.password))) {
      throw errorResponse('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...safeUser } = user;
    res.json(successResponse({ user: safeUser, token }, 'Login successful'));
  })
);

/**
 * GET /api/auth/verify
 * Headers: Authorization: Bearer <token>
 * Used by other services to validate tokens.
 */
router.get(
  '/auth/verify',
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw errorResponse('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json(successResponse(decoded, 'Token is valid'));
    } catch {
      throw errorResponse('Invalid or expired token', 401);
    }
  })
);

/**
 * GET /api/users
 */
router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await store.getAll();
    res.json(successResponse(users));
  })
);

/**
 * GET /api/users/:id
 */
router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await store.findById(req.params.id);
    if (!user) throw errorResponse('User not found', 404);

    const { password, ...safe } = user;
    res.json(successResponse(safe));
  })
);

module.exports = router;
