import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 3) {
      toast.error('Mật khẩu phải có ít nhất 3 ký tự');
      return;
    }
    setLoading(true);
    try {
      await userApi.post('/api/auth/register', { name, email, password });
      toast.success('Đăng ký thành công! Hãy đăng nhập.', { icon: '🎉' });
      navigate('/login');
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
          <h1>Đăng ký</h1>
          <p>Tạo tài khoản mới để bắt đầu đặt món.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <HiOutlineUser className="input-icon" />
            <input
              id="register-name"
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <HiOutlineMail className="input-icon" />
            <input
              id="register-email"
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
              id="register-password"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
