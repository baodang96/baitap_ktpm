import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FoodCard({ food, onAddToCart }) {
  const navigate = useNavigate();
  const { user } = useContext(require('../../context/AppContext').AppContext);

  const handleAddClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onAddToCart(food);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(food.price || 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={food.image || 'https://via.placeholder.com/300x200'}
          alt={food.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 truncate mb-2">{food.name}</h3>
        <p className="text-sm text-gray-600 h-10 overflow-hidden mb-3 line-clamp-2">
          {food.description || 'Không có mô tả'}
        </p>

        {/* Price & Button */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">{formattedPrice}</span>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
