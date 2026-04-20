export default function LoadingSpinner({ text = 'Đang tải...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}
