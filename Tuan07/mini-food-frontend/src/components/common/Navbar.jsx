import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

export default function Navbar() {
  const { user, cart, logoutUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-indigo-600 cursor-pointer hover:opacity-80"
          >
            🍔 Mini Food
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/food" className={`pb-2 font-medium transition ${isActive('/food')}`}>
              🍽️ Thực Đơn
            </a>
            {user?.role === 'ADMIN' && (
              <a href="/admin" className={`pb-2 font-medium transition ${isActive('/admin')}`}>
                ⚙️ Quản Lý
              </a>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            {user && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
              >
                <span className="text-2xl">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* User Info / Auth */}
            {user ? (
              <div className="flex items-center gap-4 border-l border-gray-300 pl-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.role === 'ADMIN' ? '👨‍💼 Admin' : '👤 User'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Đăng Ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
