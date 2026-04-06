import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, user } = useContext(AppContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Vui lòng đăng nhập để xem giỏ hàng</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formattedPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Giỏ Hàng</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-6">Giỏ hàng của bạn đang trống</p>
            <button
              onClick={() => navigate('/food')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Quay lại thực đơn
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Giỏ Hàng ({cart.length})</h1>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={item.image || 'https://via.placeholder.com/80x80'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-indigo-600 font-semibold">{formattedPrice(item.price)}</p>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQuantity(item.foodId, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.foodId, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[100px]">
                <p className="font-bold text-lg text-gray-900">
                  {formattedPrice(item.price * item.quantity)}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeFromCart(item.foodId)}
                className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 font-semibold"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>{formattedPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí giao dịch:</span>
              <span>Miễn phí</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
              <span>Tổng:</span>
              <span className="text-indigo-600">{formattedPrice(total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/food')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              Tiếp tục mua hàng
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
