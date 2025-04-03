import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaEye, FaCalendarAlt, FaUser } from 'react-icons/fa';
import defaultPoster from '../assets/default-movie.png';

const MovieCard = ({ movie }) => {
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-warning" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="movie-card h-100">
      <div className="movie-poster position-relative overflow-hidden">
        <img 
          src={movie.imageUrl || movie.posterPath || defaultPoster} 
          className="img-fluid" 
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultPoster;
          }}
        />
        <div className="movie-year">
          <FaCalendarAlt className="me-1" /> {movie.releaseYear}
        </div>
        <div className="movie-overlay">
          <div className="movie-rating">
            {renderStars(movie.averageRating)}
            <span className="ms-1">({movie.averageRating.toFixed(1)})</span>
          </div>
          <Link 
            to={`/movies/${movie.id}`} 
            className="btn btn-primary btn-sm mt-2"
          >
            <FaEye className="me-1" /> View Details
          </Link>
        </div>
      </div>
      
      <div className="movie-info">
        <h5 className="movie-title text-truncate">{movie.title}</h5>
        
        <div className="movie-meta">
          <div className="movie-genre">
            {movie.genre}
          </div>
          <div className="movie-reviews">
            <small>{movie.reviewCount} reviews</small>
          </div>
        </div>
        
        <div className="movie-director">
          <FaUser className="me-1" /> {movie.director}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
