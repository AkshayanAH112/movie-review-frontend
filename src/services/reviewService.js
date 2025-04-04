import ApiService from './api';

const REVIEWS_ENDPOINT = '/api/reviews';

// Get all reviews
const getAllReviews = async () => {
  try {
    return await ApiService.getAllReviews();
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get review by ID
const getReviewById = async (id) => {
  try {
    return await ApiService.getReviewById(id);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get reviews by movie ID
const getReviewsByMovieId = async (movieId) => {
  try {
    return await ApiService.getReviewsByMovieId(movieId);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get reviews by user ID
const getReviewsByUserId = async (userId) => {
  try {
    return await ApiService.getReviewsByUserId(userId);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create new review
const createReview = async (reviewData) => {
  try {
    return await ApiService.createReview(reviewData);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update review
const updateReview = async (id, reviewData) => {
  try {
    return await ApiService.updateReview(id, reviewData);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete review
const deleteReview = async (id) => {
  try {
    await ApiService.deleteReview(id);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const reviewService = {
  getAllReviews,
  getReviewById,
  getReviewsByMovieId,
  getReviewsByUserId,
  createReview,
  updateReview,
  deleteReview
};

export default reviewService;
