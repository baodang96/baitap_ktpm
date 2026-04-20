import { useState, useEffect } from 'react';
import { foodApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

export default function AdminPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Món chính', image: '' });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await foodApi.get('/api/foods');
      setFoods(res.data);
    } catch (err) {
      toast.error('Không thể tải danh sách món.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingFood(null);
    setForm({ name: '', description: '', price: '', category: 'Món chính', image: '' });
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      description: food.description,
      price: String(food.price),
      category: food.category,
      image: food.image,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingFood) {
        await foodApi.put(`/api/foods/${editingFood.id}`, payload);
        toast.success('Cập nhật món thành công!');
      } else {
        await foodApi.post('/api/foods', payload);
        toast.success('Thêm món thành công!');
      }
      setShowModal(false);
      fetchFoods();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa "${name}"?`)) return;
    try {
      await foodApi.delete(`/api/foods/${id}`);
      toast.success('Đã xóa món!');
      fetchFoods();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) return <LoadingSpinner text="Đang tải..." />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Quản lý món ăn</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus size={18} /> Thêm món
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tên món</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id}>
                <td>
                  <img src={food.image} alt={food.name} className="admin-food-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=70&fit=crop'; }} />
                </td>
                <td>
                  <strong>{food.name}</strong>
                  <br />
                  <small className="text-muted">{food.id}</small>
                </td>
                <td><span className="badge info">{food.category}</span></td>
                <td>{formatPrice(food.price)}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon" onClick={() => openEdit(food)} title="Sửa">
                      <HiOutlinePencil size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(food.id, food.name)} title="Xóa">
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFood ? 'Sửa món ăn' : 'Thêm món mới'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <HiOutlineX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Tên món *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Món chính</option>
                    <option>Ăn nhẹ</option>
                    <option>Đồ uống</option>
                    <option>Tráng miệng</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                {editingFood ? 'Cập nhật' : 'Thêm món'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
