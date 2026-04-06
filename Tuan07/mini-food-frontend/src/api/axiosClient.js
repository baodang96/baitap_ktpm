import axios from 'axios';

// Cấu hình baseURL cho mỗi service
// ⚠️ Thay đổi IP theo máy của bạn!
const serviceURLs = {
  USER_SERVICE: 'http://192.168.56.1:9901',      // User Service
  FOOD_SERVICE: 'http://172.16.40.1:9902',       // Food Service
  ORDER_SERVICE: 'http://192.168.1.100:9903',    // Order Service
  PAYMENT_SERVICE: 'http://192.168.1.100:9904',  // Payment Service
};

// Tạo instance cho mỗi service
const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor để thêm token vào header nếu có
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor để xử lý lỗi response
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const userClient = createClient(serviceURLs.USER_SERVICE);
export const foodClient = createClient(serviceURLs.FOOD_SERVICE);
export const orderClient = createClient(serviceURLs.ORDER_SERVICE);
export const paymentClient = createClient(serviceURLs.PAYMENT_SERVICE);
