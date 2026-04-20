import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userApi.post('/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success(`Xin chào, ${res.data.user.name}!`, { icon: '👋' });
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🍜</span>
          <h1>Đăng nhập</h1>
          <p>Chào mừng trở lại! Hãy đăng nhập để đặt món.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <HiOutlineMail className="input-icon" />
            <input
              id="login-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <HiOutlineLockClosed className="input-icon" />
            <input
              id="login-password"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
        <div className="auth-demo">
          <p>Tài khoản demo admin:</p>
          <code>admin@food.com / admin123</code>
        </div>
      </div>
    </div>
  );
}
