import ApiService from './api';

const USER_ENDPOINT = '/api/users';

// Get current user profile
const getCurrentUserProfile = async () => {
  try {
    return await ApiService.getCurrentUserProfile();
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update user profile
const updateUserProfile = async (profileData) => {
  try {
    return await ApiService.updateUserProfile(profileData);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Change password
const changePassword = async (passwordData) => {
  try {
    return await ApiService.changePassword(passwordData);
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get user's reviews
const getUserReviews = async () => {
  try {
    return await ApiService.getUserReviews();
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
