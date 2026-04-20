/**
 * Frontend Service Configuration
 * 
 * Change these URLs when deploying across multiple machines.
 * For single-machine testing, all use localhost (default).
 */
const config = {
  USER_SERVICE:    'http://localhost:8081',
  FOOD_SERVICE:    'http://172.16.33.143:8082',
  ORDER_SERVICE:   'http://localhost:8083',
  PAYMENT_SERVICE: 'http://172.16.40.124:8084',
};

export default config;
