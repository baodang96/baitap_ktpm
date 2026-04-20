import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodCard({ food }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(food);
    toast.success(`Đã thêm ${food.name} vào giỏ`, { icon: '🛒' });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="food-card">
      <div className="food-card-img">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop';
          }}
        />
        <span className="food-category">{food.category}</span>
      </div>
      <div className="food-card-body">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-desc">{food.description}</p>
        <div className="food-card-footer">
          <span className="food-price">{formatPrice(food.price)}</span>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            + Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
