import api from './api';

const USER_ENDPOINT = '/users';

// Get current user profile
const getCurrentUserProfile = async () => {
  try {
    const response = await api.get(`${USER_ENDPOINT}/profile`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update user profile
const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put(`${USER_ENDPOINT}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Change password
const changePassword = async (passwordData) => {
  try {
    const response = await api.put(`${USER_ENDPOINT}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get user's reviews
const getUserReviews = async () => {
  try {
    const response = await api.get(`${USER_ENDPOINT}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

const userService = {
  getCurrentUserProfile,
  updateUserProfile,
  changePassword,
  getUserReviews
};

export default userService;
