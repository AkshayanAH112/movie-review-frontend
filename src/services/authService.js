import ApiService from './api';
import { jwtDecode } from 'jwt-decode';

const AUTH_ENDPOINT = '/api/auth';

// Register new user
const register = async (userData) => {
  try {
    console.log('Attempting to register user:', userData.email);
    const response = await ApiService.registerUser(userData);
    console.log('Registration response:', response);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message);
    }
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await ApiService.loginUser(credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    return response;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Logout user
const logout = () => {
  ApiService.logout();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Check if user is admin
const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ADMIN';
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin
};

export default authService;
