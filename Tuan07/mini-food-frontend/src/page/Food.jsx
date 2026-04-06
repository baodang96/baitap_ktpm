import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { foodAPI } from '../api/services';
import FoodCard from '../components/food/FoodCard';

export default function Food() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { addToCart, showNotification } = useContext(AppContext);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFoods();
      
      // Debug: Check response structure
      console.log('Food API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let foodsList = [];
      if (Array.isArray(response.data)) {
        foodsList = response.data;
      } else if (Array.isArray(response.data?.data)) {
        foodsList = response.data.data;
      } else if (Array.isArray(response.data?.foods)) {
        foodsList = response.data.foods;
      } else if (Array.isArray(response)) {
        foodsList = response;
      }
      
      setFoods(foodsList || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi tải danh sách món ăn';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      console.error('Food fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    addToCart(food);
  };

  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-indigo-200 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-600 text-lg">Đang tải danh sách món ăn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchFoods}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🍽️ Thực Đơn</h1>
          <p className="text-gray-600">Chọn những món ăn ngon tại đây</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Food Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy món ăn nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
