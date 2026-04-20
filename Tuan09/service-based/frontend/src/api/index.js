import axios from 'axios';
import config from '../config';

/**
 * Create Axios instances for each backend service.
 * Each instance has its own baseURL pointing to the respective service.
 */
function createApi(baseURL) {
  const instance = axios.create({ baseURL, timeout: 10000 });

  // Attach JWT token to every request if available
  instance.interceptors.request.use((cfg) => {
    const token = localStorage.getItem('token');
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  });

  // Unwrap response data
  instance.interceptors.response.use(
    (res) => res.data,
    (err) => {
      const message = err.response?.data?.message || err.message || 'Network Error';
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}

export const userApi    = createApi(config.USER_SERVICE);
export const foodApi    = createApi(config.FOOD_SERVICE);
export const orderApi   = createApi(config.ORDER_SERVICE);
export const paymentApi = createApi(config.PAYMENT_SERVICE);
