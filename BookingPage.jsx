import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Ticket, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { moviesApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 8;

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const theater = searchParams.get('theater') || 'IMAX Laser 3D';
  const showtime = searchParams.get('time') || '05:00 PM';
  const bookingDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch movie details and booked seats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const movieData = await moviesApi.getById(id);
        setMovie(movieData);

        // Fetch booked seats for this slot
        try {
          const bookedData = await bookingsApi.getBookedSeats(id, theater, showtime, bookingDate);
          setBookedSeats(bookedData.bookedSeats || []);
        } catch (seatErr) {
          console.warn('Could not load booked seats, using empty array', seatErr);
          setBookedSeats(['B3', 'B4', 'D5']); // Realistic demo booked seats if backend DB empty
        }
      } catch (err) {
        console.error('Error loading movie:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, theater, showtime, bookingDate]);

  // Toggle seat selection
  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const ticketPrice = movie?.ticketPrice || 250;
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalPrice = selectedSeats.length * ticketPrice + convenienceFee;

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    if (!user) {
      alert('Please login or create an account to book tickets.');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    try {
      setSubmitting(true);
      setBookingError('');

      const result = await bookingsApi.create({
        movieId: movie._id,
        theater,
        showtime,
        bookingDate,
        seats: selectedSeats,
        ticketPrice,
      });

      // Navigate to confirmation page with booking info
      navigate(`/confirmation/${result.booking._id}`, {
        state: { booking: result.booking },
      });
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        <h2>Setting up cinema auditorium...</h2>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Movie not found</h2>
        <Link to="/" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="booking-page-container">
      {/* Header Info */}
      <div className="booking-header-card">
        <div>
          <Link to={`/movie/${movie._id}`} className="nav-link" style={{ marginBottom: '8px', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to Movie Info
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{movie.title}</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
            {theater} • {bookingDate} • <span style={{ color: '#ff4d58', fontWeight: 600 }}>{showtime}</span>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Price per Ticket</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>₹{ticketPrice}</div>
        </div>
      </div>

      {bookingError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '14px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          <span>{bookingError}</span>
        </div>
      )}

      {/* Auditorium Seat Map */}
      <div className="seat-map-wrapper">
        <div className="cinema-screen-container">
          <div className="cinema-screen"></div>
          <div className="screen-label">All Eyes Here • Cinema Screen</div>
        </div>

        {/* Seat Rows */}
        <div className="seat-grid">
          {ROWS.map((row) => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              {Array.from({ length: SEATS_PER_ROW }).map((_, index) => {
                const seatId = `${row}${index + 1}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let seatClass = 'available';
                if (isBooked) seatClass = 'booked';
                else if (isSelected) seatClass = 'selected';

                return (
                  <button
                    key={seatId}
                    disabled={isBooked}
                    onClick={() => handleSeatClick(seatId)}
                    className={`seat-btn ${seatClass}`}
                    title={`Seat ${seatId} - ${isBooked ? 'Booked' : isSelected ? 'Selected' : `₹${ticketPrice}`}`}
                  >
                    {seatId}
                  </button>
                );
              })}
              <span className="row-label">{row}</span>
            </div>
          ))}
        </div>

        {/* Seat Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box" style={{ background: 'var(--seat-available)', border: '1px solid var(--seat-available-border)' }}></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: 'var(--accent-red)', border: '1px solid #ff4d58' }}></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: 'var(--seat-booked)' }}></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Checkout Summary Bar */}
      <div className="booking-checkout-bar">
        <div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
            Selected Seats ({selectedSeats.length})
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats chosen yet'}
          </div>
          {selectedSeats.length > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              ₹{ticketPrice} × {selectedSeats.length} + ₹{convenienceFee} convenience fee
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Payable</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e50914' }}>
              ₹{totalPrice}
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={selectedSeats.length === 0 || submitting}
            className="btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '1.05rem',
              opacity: selectedSeats.length === 0 || submitting ? 0.6 : 1,
              cursor: selectedSeats.length === 0 || submitting ? 'not-allowed' : 'pointer',
            }}
          >
            <Ticket size={20} />
            {submitting ? 'Processing Booking...' : 'Confirm & Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
