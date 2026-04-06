import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Notification() {
  const { notification } = useContext(AppContext);

  if (!notification) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[notification.type] || 'bg-gray-500';

  return (
    <div
      className={`fixed top-20 right-4 px-6 py-3 text-white rounded-lg shadow-lg ${bgColor} animate-pulse z-50`}
    >
      {notification.message}
    </div>
  );
}
