import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Notification from '../components/common/Notification';
import Login from '../page/Login';
import Register from '../page/Register';
import Food from '../page/Food';
import Cart from '../page/Cart';
import Checkout from '../page/Checkout';
import OrderDetail from '../page/OrderDetail';
import Home from '../page/Home';

// Layout Component
function Layout() {
  return (
    <>
      <Navbar />
      <Notification />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/food', element: <Food /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order/:orderId', element: <OrderDetail /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
]);

export default router;
