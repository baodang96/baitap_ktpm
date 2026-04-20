/**
 * Central Service Configuration
 * 
 * For single-machine testing: all services use localhost (default).
 * For multi-machine deployment: set environment variables with actual IPs.
 * 
 * Example (multi-machine):
 *   set USER_SERVICE_URL=http://192.168.1.10:8081
 *   set FOOD_SERVICE_URL=http://192.168.1.11:8082
 *   ...
 */

const SERVICES = {
  USER_SERVICE:    process.env.USER_SERVICE_URL    || 'localhost:8081',
  FOOD_SERVICE:    process.env.FOOD_SERVICE_URL    || '172.16.33.143:8082',
  ORDER_SERVICE:   process.env.ORDER_SERVICE_URL   || 'localhost:8083',
  PAYMENT_SERVICE: process.env.PAYMENT_SERVICE_URL || '172.16.40.124:8084',
};

const PORTS = {
  USER_SERVICE:    parseInt(process.env.USER_SERVICE_PORT    || '8081'),
  FOOD_SERVICE:    parseInt(process.env.FOOD_SERVICE_PORT    || '8082'),
  ORDER_SERVICE:   parseInt(process.env.ORDER_SERVICE_PORT   || '8083'),
  PAYMENT_SERVICE: parseInt(process.env.PAYMENT_SERVICE_PORT || '8084'),
};

const JWT_SECRET = process.env.JWT_SECRET || 'mini-food-ordering-secret-key-2024';

module.exports = { SERVICES, PORTS, JWT_SECRET };
