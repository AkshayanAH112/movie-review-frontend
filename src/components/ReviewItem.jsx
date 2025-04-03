import { useState } from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState({
    rating: review.rating,
    comment: review.comment
  });
  const [error, setError] = useState('');

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? "text-warning" : "text-secondary"}
        />
      );
    }
    return stars;
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setEditedReview({ ...editedReview, rating: newRating });
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    setEditedReview({ ...editedReview, comment: e.target.value });
  };

  // Handle review update
  const handleUpdateReview = async () => {
    try {
      setError('');
      
      if (!editedReview.comment.trim()) {
        setError('Comment cannot be empty');
        return;
      }
      
      const updatedReview = await reviewService.updateReview(review.id, editedReview);
      setIsEditing(false);
      onReviewUpdated(updatedReview);
    } catch (err) {
      setError(err.message || 'Failed to update review');
    }
  };

  // Handle review delete
  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(review.id);
        onReviewDeleted(review.id);
      } catch (err) {
        setError(err.message || 'Failed to delete review');
      }
    }
  };

  // Check if current user is the author of the review
  const isAuthor = user && (user.id === review.userId || user.role === 'ADMIN');

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{review.userName}</h5>
          <div className="d-flex">
            <div className="me-2">
              {renderStars(review.rating)}
            </div>
            <small className="text-muted">
              {formatDate(review.createdAt)}
            </small>
          </div>
        </div>

        {isEditing ? (
          <div>
            <div className="mb-3">
              <label className="form-label">Rating:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= editedReview.rating ? "text-warning" : "text-secondary"}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Comment:</label>
              <textarea
                className="form-control"
                rows="3"
                value={editedReview.comment}
                onChange={handleCommentChange}
              ></textarea>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateReview}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="card-text">{review.comment}</p>
            
            {isAuthor && (
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDeleteReview}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
