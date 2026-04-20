import { useState, useEffect } from 'react';
import { foodApi } from '../api';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineSearch } from 'react-icons/hi';

export default function MenuPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await foodApi.get('/api/foods');
      setFoods(res.data);
    } catch (err) {
      toast.error('Không thể tải thực đơn. Food Service có thể chưa chạy.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(foods.map((f) => f.category))];

  const filtered = foods.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || f.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return <LoadingSpinner text="Đang tải thực đơn..." />;

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>🍽️ Thực đơn hôm nay</h1>
        <p>Khám phá các món ăn ngon và đặt hàng ngay!</p>
      </div>

      <div className="menu-controls">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input
            id="food-search"
            type="text"
            placeholder="Tìm món ăn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>Không tìm thấy món ăn nào</p>
        </div>
      ) : (
        <div className="food-grid">
          {filtered.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
