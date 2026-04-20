import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { HiOutlineShoppingCart, HiOutlineLogout, HiOutlineUser, HiOutlineCog } from 'react-icons/hi';
import { HiOutlineBars3 } from 'react-icons/hi2';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Thực đơn' },
    { to: '/orders', label: 'Đơn hàng' },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Quản lý' });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-icon">🍜</span>
          <span className="brand-text">FoodOrder</span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <HiOutlineBars3 size={24} />
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {user && navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn" onClick={() => setMobileOpen(false)}>
                <HiOutlineShoppingCart size={22} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <div className="user-menu">
                <button className="user-btn">
                  <HiOutlineUser size={18} />
                  <span className="user-name">{user.name}</span>
                  {isAdmin && <span className="role-badge">ADMIN</span>}
                </button>
                <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
                  <HiOutlineLogout size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
