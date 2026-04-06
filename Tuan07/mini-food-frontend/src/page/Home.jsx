import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-amber-50 to-red-100 opacity-50"></div>
        <div className="max-w-6xl mx-auto px-4 py-32 text-center relative z-10">
          <div className="mb-8 inline-block">
            <span className="inline-block p-3 bg-orange-100 rounded-full">
              <span className="text-6xl">🍔</span>
            </span>
          </div>

          <h1 className="text-7xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 mb-6 tracking-tight">
            Mini Food
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Đặt hoàn hảo, giao nhanh chóng!
          </p>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Hệ thống đặt môn ăn nội bộ cho nhân viên công ty. Thực đơn đa dạng, thanh toán linh hoạt, giao hàng nhanh.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/food')}
              className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-full hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
            >
              <span>🍽️</span> Xem Thực Đơn
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-lg rounded-full hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
            >
              <span>✨</span> Đăng Ký Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-black text-center text-gray-900 mb-4">Tính Năng Nổi Bật</h2>
        <p className="text-center text-gray-600 text-lg mb-16">Mọi thứ bạn cần để đặt hàng dễ dàng</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-2 border-blue-200">
            <div className="inline-block p-4 bg-blue-500 rounded-full text-white text-4xl mb-4 transform group-hover:scale-110 transition">
              🔐
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bảo Mật</h3>
            <p className="text-gray-700 font-medium">Tài khoản riêng, bảo mật thông tin tuyệt đối</p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-2 border-orange-200">
            <div className="inline-block p-4 bg-orange-500 rounded-full text-white text-4xl mb-4 transform group-hover:scale-110 transition">
              🍜
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Đa Dạng</h3>
            <p className="text-gray-700 font-medium">Hàng trăm món ăn ngon lừng danh lựa chọn</p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-2 border-purple-200">
            <div className="inline-block p-4 bg-purple-500 rounded-full text-white text-4xl mb-4 transform group-hover:scale-110 transition">
              🛒
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Thông Minh</h3>
            <p className="text-gray-700 font-medium">Quản lý giỏ hàng dễ dàng, tính toán tự động</p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-2 border-emerald-200">
            <div className="inline-block p-4 bg-emerald-500 rounded-full text-white text-4xl mb-4 transform group-hover:scale-110 transition">
              💳
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Linh Hoạt</h3>
            <p className="text-gray-700 font-medium">COD hoặc chuyển khoản, lựa chọn tùy bạn</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 py-16 my-12 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-black mb-2">100+</p>
              <p className="text-lg font-semibold">Món Ăn</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-2">1000+</p>
              <p className="text-lg font-semibold">Khách Hàng</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-2">50+</p>
              <p className="text-lg font-semibold">Nhà Hàng</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-2">24/7</p>
              <p className="text-lg font-semibold">Hỗ Trợ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-black text-center text-gray-900 mb-4">Công Nghệ Hiện Đại</h2>
        <p className="text-center text-gray-600 text-lg mb-16">Xây dựng với những công nghệ tốt nhất</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '⚛️', name: 'React 19', color: 'from-blue-400 to-blue-600' },
            { icon: '⚡', name: 'Vite', color: 'from-purple-400 to-purple-600' },
            { icon: '🎨', name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' },
            { icon: '🔗', name: 'Axios', color: 'from-orange-400 to-orange-600' },
          ].map((tech, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${tech.color} rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300`}
            >
              <p className="text-5xl mb-3">{tech.icon}</p>
              <p className="font-bold text-lg">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="relative overflow-hidden py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-5xl font-black mb-4">Sẵn Sàng Bắt Đầu?</h2>
            <p className="text-xl mb-10 font-medium opacity-90">Đơn giản, nhanh, tiện lợi - tất cả trong một ứng dụng</p>
            <button
              onClick={() => navigate('/food')}
              className="px-12 py-4 bg-white text-orange-600 font-bold text-lg rounded-full hover:shadow-2xl transform hover:scale-105 transition duration-300"
            >
              🚀 Đặt Hàng Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
