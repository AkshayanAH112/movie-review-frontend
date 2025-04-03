import api from './api';

const MOVIES_ENDPOINT = '/api/movies';

// Get all movies
const getAllMovies = async () => {
  try {
    const response = await api.get(MOVIES_ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get movie by ID
const getMovieById = async (id) => {
  try {
    const response = await api.get(`${MOVIES_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Search movies by title
const searchMovies = async (title) => {
  try {
    const response = await api.get(`${MOVIES_ENDPOINT}/search?title=${title}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get movies by genre
const getMoviesByGenre = async (genre) => {
  try {
    const response = await api.get(`${MOVIES_ENDPOINT}/genre/${genre}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create new movie (admin only)
const createMovie = async (movieData) => {
  try {
    const response = await api.post(MOVIES_ENDPOINT, movieData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update movie (admin only)
const updateMovie = async (id, movieData) => {
  try {
    const response = await api.put(`${MOVIES_ENDPOINT}/${id}`, movieData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete movie (admin only)
const deleteMovie = async (id) => {
  try {
    await api.delete(`${MOVIES_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Upload movie poster (admin only)
const uploadPoster = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`${MOVIES_ENDPOINT}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const movieService = {
  getAllMovies,
  getMovieById,
  searchMovies,
  getMoviesByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
  uploadPoster
};

export default movieService;
