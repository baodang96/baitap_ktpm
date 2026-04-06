// Định dạng giá tiền theo tiêu chuẩn VND
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Định dạng ngày tháng
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Kiểm tra token có hợp lệ không
export const isTokenValid = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Lấy token từ localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Xóa token
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Lấy thông tin user từ localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (tối thiểu 6 ký tự)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Delay function (giới hạn request)
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Format order status
export const formatOrderStatus = (status) => {
  const statusMap = {
    PENDING: '⏳ Chờ xác nhận',
    CONFIRMED: '✅ Đã xác nhận',
    SHIPPING: '📦 Đang giao',
    COMPLETED: '🎉 Hoàn thành',
    CANCELLED: '❌ Đã hủy',
  };
  return statusMap[status] || status;
};

// Calculate total price
export const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
