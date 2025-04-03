import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';
import { FaStar, FaEdit, FaTrash, FaFilm } from 'react-icons/fa';

const MyReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await reviewService.getReviewsByUserId(user.id);
        setReviews(data);
        setError('');
      } catch (err) {
        setError('Failed to load reviews. Please try again later.');
        console.error('Error fetching user reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  const handleDeleteClick = (reviewId) => {
    setDeleteId(reviewId);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await reviewService.deleteReview(deleteId);
      setReviews(reviews.filter(review => review.id !== deleteId));
      setShowConfirmModal(false);
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete review. Please try again.');
      console.error('Error deleting review:', err);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? 'text-warning' : 'text-secondary'} 
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <FaFilm className="me-2 text-primary" size={24} />
        <h1 className="mb-0">My Reviews</h1>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead">You haven't written any reviews yet.</p>
          <Link to="/movies" className="btn btn-primary mt-3">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div className="col-md-6 mb-4" key={review.id}>
              <div className="card h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">
                      <Link to={`/movies/${review.movieId}`} className="text-decoration-none">
                        {review.movieTitle}
                      </Link>
                    </h5>
                    <div className="mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/movies/${review.movieId}?editReview=${review.id}`} 
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteClick(review.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text">{review.content}</p>
                </div>
                <div className="card-footer bg-white text-muted">
                  <small>Reviewed on {formatDate(review.createdAt)}</small>
                  {review.updatedAt !== review.createdAt && (
                    <small> (Edited on {formatDate(review.updatedAt)})</small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleDeleteCancel}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this review? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
