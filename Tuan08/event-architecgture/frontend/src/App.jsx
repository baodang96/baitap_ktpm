import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [view, setView] = useState('login'); // login, register, movies
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingMessage, setBookingMessage] = useState(null);

  // Auth Forms State
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API_URL}/movies`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error('Failed to fetch movies', err);
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.user);
      setView('movies');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      setView('movies');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const logout = () => {
    setUser(null);
    setView('login');
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleBookTicket = async () => {
    if (selectedSeats.length === 0) return;
    
    setBookingMessage({ type: 'info', text: 'Đang xử lý booking...' });

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          movieId: selectedMovie.id,
          movieTitle: selectedMovie.title,
          seats: selectedSeats
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      
      setBookingMessage({ type: 'success', text: `Booking created (ID: ${data.booking.id}). Please check console for asynchronous payment / notification events.` });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setBookingMessage(null);
        setSelectedMovie(null);
        setSelectedSeats([]);
      }, 4000);

    } catch (err) {
      setBookingMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">EventCinema</div>
        {user ? (
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <span>Hello, {user.username}</span>
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: '1rem'}}>
            <button className="btn btn-secondary" onClick={() => setView('login')}>Login</button>
            <button className="btn" onClick={() => setView('register')}>Register</button>
          </div>
        )}
      </nav>

      {/* AUTHENTICATION VIEW */}
      {!user && (view === 'login' || view === 'register') && (
        <div className="auth-container">
          <h2>{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          {authError && <div className="alert alert-error" style={{marginTop: '1rem'}}>{authError}</div>}
          <form onSubmit={view === 'login' ? handleLogin : handleRegister} style={{marginTop: '1.5rem'}}>
            {view === 'register' && (
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" value={authForm.username} onChange={handleAuthChange} required />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={authForm.email} onChange={handleAuthChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={authForm.password} onChange={handleAuthChange} required />
            </div>
            <button type="submit" className="btn" style={{width: '100%', marginTop: '1rem'}}>
              {view === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      )}

      {/* MOVIE LIST VIEW */}
      {user && view === 'movies' && (
        <div>
          <h2 style={{marginBottom: '2rem'}}>Now Showing</h2>
          <div className="movies-grid">
            {movies.map(movie => (
              <div key={movie.id} className="movie-card" onClick={() => setSelectedMovie(movie)}>
                <img src={movie.posterImage} alt={movie.title} className="movie-poster" />
                <div className="movie-info">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-meta">{movie.genre} • {movie.duration} min</div>
                  <button className="btn" style={{width: '100%'}}>Book Tickets</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3>Book: {selectedMovie.title}</h3>
              <button className="btn-secondary" style={{padding: '0.2rem 0.5rem', border: 'none'}} onClick={() => {
                setSelectedMovie(null);
                setSelectedSeats([]);
                setBookingMessage(null);
              }}>✕</button>
            </div>
            
            {bookingMessage ? (
              <div className={`alert ${bookingMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {bookingMessage.text}
              </div>
            ) : (
              <>
                <p style={{color: 'var(--text-secondary)'}}>Select your seats (Screen is this way ↑)</p>
                
                <div className="seats-grid">
                  {Array.from({length: 20}, (_, i) => {
                    const seatId = `A${i+1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <div 
                        key={seatId} 
                        className={`seat ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSeat(seatId)}
                      >
                        {seatId}
                      </div>
                    )
                  })}
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem'}}>
                  <div>
                    <span style={{color: 'var(--text-secondary)'}}>Selected: </span> 
                    <strong>{selectedSeats.length} seats</strong>
                  </div>
                  <button 
                    className="btn" 
                    onClick={handleBookTicket}
                    disabled={selectedSeats.length === 0}
                    style={{opacity: selectedSeats.length === 0 ? 0.5 : 1}}
                  >
                    Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
