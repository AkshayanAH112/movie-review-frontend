import api from './api';

const REVIEWS_ENDPOINT = '/reviews';

// Get all reviews
const getAllReviews = async () => {
  try {
    const response = await api.get(REVIEWS_ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get review by ID
const getReviewById = async (id) => {
  try {
    const response = await api.get(`${REVIEWS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get reviews by movie ID
const getReviewsByMovieId = async (movieId) => {
  try {
    const response = await api.get(`${REVIEWS_ENDPOINT}/movie/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get reviews by user ID
const getReviewsByUserId = async (userId) => {
  try {
    const response = await api.get(`${REVIEWS_ENDPOINT}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create new review
const createReview = async (reviewData) => {
  try {
    const response = await api.post(REVIEWS_ENDPOINT, reviewData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update review
const updateReview = async (id, reviewData) => {
  try {
    const response = await api.put(`${REVIEWS_ENDPOINT}/${id}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete review
const deleteReview = async (id) => {
  try {
    await api.delete(`${REVIEWS_ENDPOINT}/${id}`);
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
