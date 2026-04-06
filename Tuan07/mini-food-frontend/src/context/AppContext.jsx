import { createContext, useState, useCallback } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // User info {id, name, email, role}
  const [cart, setCart] = useState([]);             // [{foodId, name, price, quantity}]
  const [loading, setLoading] = useState(false);    // Loading state
  const [notification, setNotification] = useState(null); // {message, type, id}

  // Thêm món vào giỏ hàng
  const addToCart = useCallback((food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.foodId === food.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.foodId === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          foodId: food.id,
          name: food.name,
          price: food.price,
          quantity: 1,
          image: food.image,
        },
      ];
    });
    showNotification('Đã thêm vào giỏ hàng!', 'success');
  }, []);

  // Xóa món khỏi giỏ hàng
  const removeFromCart = useCallback((foodId) => {
    setCart((prevCart) => prevCart.filter(item => item.foodId !== foodId));
    showNotification('Đã xóa khỏi giỏ hàng', 'info');
  }, []);

  // Cập nhật số lượng
  const updateCartQuantity = useCallback((foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map(item =>
        item.foodId === foodId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Hàm hiển thị thông báo
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => setNotification(null), 3000);
  };

  // Login user
  const loginUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  // Logout user
  const logoutUser = useCallback(() => {
    setUser(null);
    clearCart();
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, [clearCart]);

  const value = {
    // State
    user,
    cart,
    loading,
    notification,
    // User actions
    setUser,
    loginUser,
    logoutUser,
    // Cart actions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    // Utils
    setLoading,
    showNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};