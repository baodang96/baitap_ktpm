const crypto = require('crypto');

/**
 * Generate a unique ID with optional prefix.
 * @param {string} prefix - e.g. 'USR', 'FOOD', 'ORD', 'PAY'
 * @returns {string}
 */
function generateId(prefix = '') {
  const id = crypto.randomBytes(6).toString('hex');
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Create a standardized success response.
 */
function successResponse(data, message = 'Success') {
  return { success: true, message, data };
}

/**
 * Create a standardized error response.
 */
function errorResponse(message = 'Error', status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Validate required fields in request body.
 * @param {object} body - req.body
 * @param {string[]} fields - required field names
 * @returns {string|null} error message or null if valid
 */
function validateRequired(body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === '');
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return null;
}

module.exports = { generateId, successResponse, errorResponse, validateRequired };
