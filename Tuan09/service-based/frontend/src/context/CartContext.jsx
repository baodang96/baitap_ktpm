import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (food) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) =>
          i.foodId === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { foodId: food.id, name: food.name, price: food.price, image: food.image, quantity: 1 }];
    });
  };

  const removeItem = (foodId) => {
    setItems((prev) => prev.filter((i) => i.foodId !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.foodId === foodId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
