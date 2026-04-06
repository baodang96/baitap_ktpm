import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { orderAPI } from '../api/services';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  }, [orderId, user]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPING: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">✅ Đơn Hàng Thành Công</h1>
              <p className="text-gray-600 mt-2">Cảm ơn bạn đã đặt hàng!</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-blue-900 font-semibold">📢 Thông báo</p>
            <p className="text-blue-800 text-sm mt-2">
              Đơn hàng #{order.id} của bạn đã được {order.status === 'PENDING' ? 'tiếp nhận' : 'xác nhận'}. 
              Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Thông Tin Đơn Hàng</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Ngày đặt</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Tổng tiền</p>
                <p className="font-bold text-lg text-indigo-600">
                  {formattedPrice(order.totalPrice)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">👤 Thông Tin Người Đặt</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Tên</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">📦 Các Món Hàng</h2>
          </div>
          {order.items && order.items.map((item, index) => (
            <div key={index} className="p-6 border-b border-gray-200 last:border-b-0 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{item.foodId}</p>
                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
              </div>
              <p className="font-bold text-lg">{formattedPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <button
            onClick={() => navigate('/food')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Tiếp tục mua hàng
          </button>
        </div>
      </div>
    </div>
  );
}
