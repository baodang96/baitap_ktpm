import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi, paymentApi } from '../api';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      toast.error('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order via Order Service
      const orderRes = await orderApi.post('/api/orders', {
        userId: user.id,
        items: items.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
        token: localStorage.getItem('token'),
      });
      const order = orderRes.data;

      // 2. Process payment via Payment Service
      const payRes = await paymentApi.post('/api/payments', {
        orderId: order.id,
        method: paymentMethod,
      });

      clearCart();
      toast.success('🎉 Đặt hàng và thanh toán thành công!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <h2>Giỏ hàng trống</h2>
          <p>Hãy thêm món ăn vào giỏ hàng nhé!</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Xem thực đơn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>🛒 Giỏ hàng</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.foodId} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop';
                }}
              />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{formatPrice(item.price)}</p>
              </div>
              <div className="cart-item-actions">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                  >
                    <HiOutlineMinus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                  >
                    <HiOutlinePlus size={14} />
                  </button>
                </div>
                <span className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</span>
                <button
                  className="btn-icon danger"
                  onClick={() => removeItem(item.foodId)}
                  title="Xóa"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Thanh toán</h2>
          <div className="summary-row">
            <span>Tổng tiền hàng</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="summary-row">
            <span>Phí giao hàng</span>
            <span className="free">Miễn phí</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Tổng cộng</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>

          <div className="payment-methods">
            <h3>Phương thức thanh toán</h3>
            <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <span className="payment-label">
                <span className="payment-icon">💵</span>
                Tiền mặt (COD)
              </span>
            </label>
            <label className={`payment-option ${paymentMethod === 'BANKING' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="BANKING"
                checked={paymentMethod === 'BANKING'}
                onChange={() => setPaymentMethod('BANKING')}
              />
              <span className="payment-label">
                <span className="payment-icon">🏦</span>
                Chuyển khoản (Banking)
              </span>
            </label>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : `Đặt hàng — ${formatPrice(totalAmount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
