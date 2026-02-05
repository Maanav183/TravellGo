export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-container">
      <div className="auth-image">
        <div className="overlay">
          <h1>TravelGO ✈️</h1>
          <p>Explore the world with us</p>
        </div>
      </div>

      <div className="auth-form">
        <div className="card shadow-lg p-4">
          <h3 className="text-center mb-2">{title}</h3>
          <p className="text-center text-muted mb-4">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
