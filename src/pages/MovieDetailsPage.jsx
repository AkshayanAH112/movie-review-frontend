import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import movieService from '../services/movieService';
import reviewService from '../services/reviewService';
import ReviewItem from '../components/ReviewItem';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';
import defaultPoster from '../assets/default-movie.png';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);
        
        // Fetch reviews for this movie
        const reviewsData = await reviewService.getReviewsByMovieId(id);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndReviews();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    
    // Update movie rating in UI without refetching
    if (movie) {
      const updatedMovie = { ...movie };
      const totalRating = movie.averageRating * movie.reviewCount + newReview.rating;
      const newCount = movie.reviewCount + 1;
      updatedMovie.reviewCount = newCount;
      updatedMovie.averageRating = totalRating / newCount;
      setMovie(updatedMovie);
    }
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews(
      reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-border me-2" />
        <span>Loading movie details...</span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || 'Movie not found'}
        </div>
        <Link to="/movies" className="btn btn-primary">
          <FaArrowLeft className="me-2" /> Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4 text-start">
        <Link to="/movies" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to Movies
        </Link>
      </div>

      <div className="row">
        {/* Movie Poster */}
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <img
              src={movie.imageUrl || movie.posterPath || defaultPoster}
              className="card-img-top"
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultPoster;
              }}
              style={{ height: '500px', objectFit: 'cover' }}
            />
            
            {isAdmin() && (
              <div className="card-footer">
                <Link 
                  to={`/admin/movies/edit/${movie.id}`}
                  className="btn btn-warning w-100"
                >
                  Edit Movie
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Movie Details */}
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h1 className="card-title mb-2">{movie.title} ({movie.releaseYear})</h1>
              
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(movie.averageRating)
                          ? "text-warning"
                          : "text-secondary"
                      }
                    />
                  ))}
                </div>
                <span className="fw-bold">{movie.averageRating.toFixed(1)}</span>
                <span className="text-muted ms-2">({movie.reviewCount} reviews)</span>
              </div>
              
              <div className="mb-3">
                <strong>Director:</strong> {movie.director}
              </div>
              
              <div className="mb-3">
                <strong>Genre:</strong> {movie.genre}
              </div>
              
              <div className="mb-3">
                <strong>Cast:</strong> {movie.actors.join(', ')}
              </div>
              
              <div className="mb-4">
                <h5>Synopsis</h5>
                <p>{movie.synopsis}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <h3 className="mb-3">Reviews</h3>
          
          <ReviewForm 
            movieId={movie.id} 
            onReviewAdded={handleReviewAdded} 
          />
          
          {reviews.length === 0 ? (
            <div className="alert alert-info">
              No reviews yet. Be the first to review this movie!
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onReviewUpdated={handleReviewUpdated}
                  onReviewDeleted={handleReviewDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
