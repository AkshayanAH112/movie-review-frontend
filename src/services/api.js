import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://13.200.236.137/api";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**AUTH */

  /* This registers a new user */
  static async registerUser(userData) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/public/register`,
      userData
    );
    return response.data;
  }

  /* This logs in a registered user */
  static async loginUser(credentials) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  }

  /**USERS */

  /* This gets the current user profile */
  static async getCurrentUserProfile() {
    const response = await axios.get(
      `${this.BASE_URL}/users/profile`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This updates a user profile */
  static async updateUserProfile(profileData) {
    const response = await axios.put(
      `${this.BASE_URL}/users/profile`,
      profileData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This changes user password */
  static async changePassword(passwordData) {
    const response = await axios.put(
      `${this.BASE_URL}/users/change-password`,
      passwordData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This gets user's reviews */
  static async getUserReviews() {
    const response = await axios.get(
      `${this.BASE_URL}/users/reviews`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /**MOVIES */

  /* This gets all movies */
  static async getAllMovies() {
    const response = await axios.get(`${this.BASE_URL}/movies`);
    return response.data;
  }

  /* This gets a movie by ID */
  static async getMovieById(id) {
    const response = await axios.get(`${this.BASE_URL}/movies/${id}`);
    return response.data;
  }

  /* This searches movies by title */
  static async searchMovies(title) {
    const response = await axios.get(`${this.BASE_URL}/movies/search?title=${title}`);
    return response.data;
  }

  /* This gets movies by genre */
  static async getMoviesByGenre(genre) {
    const response = await axios.get(`${this.BASE_URL}/movies/genre/${genre}`);
    return response.data;
  }

  /* This creates a new movie (admin only) */
  static async createMovie(movieData) {
    const response = await axios.post(
      `${this.BASE_URL}/movies`,
      movieData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This updates a movie (admin only) */
  static async updateMovie(id, movieData) {
    const response = await axios.put(
      `${this.BASE_URL}/movies/${id}`,
      movieData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This deletes a movie (admin only) */
  static async deleteMovie(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/movies/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This uploads a movie poster (admin only) */
  static async uploadPoster(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${this.BASE_URL}/movies/upload`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**REVIEWS */

  /* This gets all reviews */
  static async getAllReviews() {
    const response = await axios.get(`${this.BASE_URL}/reviews`);
    return response.data;
  }

  /* This gets a review by ID */
  static async getReviewById(id) {
    const response = await axios.get(`${this.BASE_URL}/reviews/${id}`);
    return response.data;
  }

  /* This gets reviews by movie ID */
  static async getReviewsByMovieId(movieId) {
    const response = await axios.get(`${this.BASE_URL}/reviews/movie/${movieId}`);
    return response.data;
  }

  /* This gets reviews by user ID */
  static async getReviewsByUserId(userId) {
    const response = await axios.get(`${this.BASE_URL}/reviews/user/${userId}`);
    return response.data;
  }

  /* This creates a new review */
  static async createReview(reviewData) {
    const response = await axios.post(
      `${this.BASE_URL}/reviews`,
      reviewData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This updates a review */
  static async updateReview(id, reviewData) {
    const response = await axios.put(
      `${this.BASE_URL}/reviews/${id}`,
      reviewData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This deletes a review */
  static async deleteReview(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/reviews/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // You can add JWT token validation logic here if needed
      return true;
    } catch (error) {
      return false;
    }
  }

  static isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'ADMIN';
  }

  static isUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'USER';
  }
}
