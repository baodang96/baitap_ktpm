import { userClient, foodClient, orderClient, paymentClient } from './axiosClient';

// ==================== USER SERVICE ====================
export const userAPI = {
  // Đăng ký
  register: (username, password, name) =>
    userClient.post('/api/register', { username, password, name }),

  // Đăng nhập
  login: (username, password) =>
    userClient.post('/login', { username, password }),

  // Lấy danh sách users (admin)
  getAllUsers: () =>
    userClient.get('/api/users'),

  // Lấy thông tin user hiện tại
  getCurrentUser: () =>
    userClient.get('/api/users/me'),
};

// ==================== FOOD SERVICE ====================
export const foodAPI = {
  // Lấy danh sách tất cả món ăn
  getAllFoods: () =>
    foodClient.get('/foods'),

  // Lấy chi tiết một món ăn
  getFoodById: (id) =>
    foodClient.get(`/api/foods/${id}`),

  // Thêm món ăn (admin)
  createFood: (foodData) =>
    foodClient.post('/api/foods', foodData),

  // Cập nhật món ăn (admin)
  updateFood: (id, foodData) =>
    foodClient.put(`/api/foods/${id}`, foodData),

  // Xóa món ăn (admin)
  deleteFood: (id) =>
    foodClient.delete(`/api/foods/${id}`),
};

// ==================== ORDER SERVICE ====================
export const orderAPI = {
  // Tạo đơn hàng mới
  createOrder: (orderData) =>
    orderClient.post('/api/orders', orderData),

  // Lấy danh sách đơn hàng của user
  getUserOrders: (userId) =>
    orderClient.get(`/api/orders/user/${userId}`),

  // Lấy tất cả đơn hàng (admin)
  getAllOrders: () =>
    orderClient.get('/api/orders'),

  // Lấy chi tiết một đơn hàng
  getOrderById: (orderId) =>
    orderClient.get(`/api/orders/${orderId}`),

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (orderId, status) =>
    orderClient.put(`/api/orders/${orderId}/status`, { status }),
};

// ==================== PAYMENT SERVICE ====================
export const paymentAPI = {
  // Tạo thanh toán
  createPayment: (paymentData) =>
    paymentClient.post('/api/payments', paymentData),

  // Lấy danh sách thanh toán
  getPayments: () =>
    paymentClient.get('/api/payments'),

  // Lấy chi tiết thanh toán
  getPaymentById: (paymentId) =>
    paymentClient.get(`/api/payments/${paymentId}`),

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: (paymentId, status) =>
    paymentClient.put(`/api/payments/${paymentId}/status`, { status }),
};
