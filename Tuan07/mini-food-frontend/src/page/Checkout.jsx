import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { orderAPI, paymentAPI } from '../api/services';

export default function Checkout() {
  const { user, cart, clearCart, showNotification, setLoading: setAppLoading } = useContext(AppContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD hoặc BANKING
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formattedPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const handleCheckout = async () => {
    if (!paymentMethod) {
      showNotification('Vui lòng chọn phương thức thanh toán', 'error');
      return;
    }

    setLoading(true);
    setAppLoading(true);

    try {
      // Tạo đơn hàng (Order Service)
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          foodId: item.foodId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
        status: 'PENDING',
      };

      const orderResponse = await orderAPI.createOrder(orderData);
      const orderId = orderResponse.data.id;

      // Tạo giao dịch thanh toán (Payment Service)
      const paymentData = {
        orderId,
        method: paymentMethod,
        amount: total,
      };

      await paymentAPI.createPayment(paymentData);

      // Xóa giỏ hàng
      clearCart();

      // Hiển thị thông báo thành công
      showNotification('✅ Đơn hàng tạo thành công!', 'success');

      // Chuyển đến trang chi tiết đơn hàng
      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Lỗi khi tạo đơn hàng';
      showNotification(errorMsg, 'error');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
      setAppLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">💳 Thanh Toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin người mua */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Thông Tin Người Mua</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input
                    type="text"
                    value={user.name || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Phương Thức Thanh Toán</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50"
                  style={{
                    borderColor: paymentMethod === 'COD' ? '#4f46e5' : undefined,
                    backgroundColor: paymentMethod === 'COD' ? '#eef2ff' : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Thu Tiền Khi Nhận (COD)</p>
                    <p className="text-sm text-gray-600">Thanh toán khi nhận hàng</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50"
                  style={{
                    borderColor: paymentMethod === 'BANKING' ? '#4f46e5' : undefined,
                    backgroundColor: paymentMethod === 'BANKING' ? '#eef2ff' : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="BANKING"
                    checked={paymentMethod === 'BANKING'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Chuyển Khoản Ngân Hàng</p>
                    <p className="text-sm text-gray-600">Chuyển khoản trước khi giao</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Ghi Chú</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Đơn Hàng</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formattedPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{formattedPrice(total)}</span>
                </div>
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>Phí giao dịch:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-indigo-600">
                  <span>Tổng:</span>
                  <span>{formattedPrice(total)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? '⏳ Đang xử lý...' : '✓ Xác Nhận Thanh Toán'}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Quay Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
