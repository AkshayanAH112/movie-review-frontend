import ApiService from './api';

const MOVIES_ENDPOINT = '/api/movies';

// Get all movies
const getAllMovies = async () => {
  try {
    return await ApiService.getAllMovies();
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get movie by ID
const getMovieById = async (id) => {
  try {
    return await ApiService.getMovieById(id);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Search movies by title
const searchMovies = async (title) => {
  try {
    return await ApiService.searchMovies(title);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get movies by genre
const getMoviesByGenre = async (genre) => {
  try {
    return await ApiService.getMoviesByGenre(genre);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create new movie (admin only)
const createMovie = async (movieData) => {
  try {
    return await ApiService.createMovie(movieData);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update movie (admin only)
const updateMovie = async (id, movieData) => {
  try {
    return await ApiService.updateMovie(id, movieData);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete movie (admin only)
const deleteMovie = async (id) => {
  try {
    await ApiService.deleteMovie(id);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Upload movie poster (admin only)
const uploadPoster = async (file) => {
  try {
    return await ApiService.uploadPoster(file);
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
