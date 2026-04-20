import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi, paymentApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = user?.role === 'ADMIN'
        ? await orderApi.get('/api/orders')
        : await orderApi.get(`/api/orders/user/${user?.id}`);
      // Sort newest first
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      toast.error('Không thể tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const statusMap = {
    PENDING: { label: 'Chờ xác nhận', color: 'warning' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'info' },
    PAID: { label: 'Đã thanh toán', color: 'success' },
    DELIVERED: { label: 'Đã giao', color: 'success' },
    CANCELLED: { label: 'Đã hủy', color: 'danger' },
  };

  const paymentStatusMap = {
    UNPAID: { label: 'Chưa thanh toán', color: 'warning' },
    PAID: { label: 'Đã thanh toán', color: 'success' },
  };

  if (loading) return <LoadingSpinner text="Đang tải đơn hàng..." />;

  return (
    <div className="orders-page">
      <h1>📦 Đơn hàng {user?.role === 'ADMIN' ? '(Tất cả)' : 'của bạn'}</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h2>Chưa có đơn hàng</h2>
          <p>Hãy đặt món đầu tiên nào!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const status = statusMap[order.status] || { label: order.status, color: 'default' };
            const payStatus = paymentStatusMap[order.paymentStatus] || { label: order.paymentStatus, color: 'default' };

            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3 className="order-id">#{order.id}</h3>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                    {user?.role === 'ADMIN' && (
                      <span className="order-user">👤 {order.userName}</span>
                    )}
                  </div>
                  <div className="order-badges">
                    <span className={`badge ${status.color}`}>{status.label}</span>
                    <span className={`badge ${payStatus.color}`}>{payStatus.label}</span>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-card-footer">
                  <span className="order-total">Tổng: {formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
