import api from './api';
import { jwtDecode } from 'jwt-decode';

const AUTH_ENDPOINT = '/api/auth';

// Register new user
const register = async (userData) => {
  try {
    console.log('Attempting to register user:', userData.email);
    // Use the public registration endpoint that bypasses security filters
    const response = await api.post(`${AUTH_ENDPOINT}/public/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Registration response:', response);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
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
    const response = await api.post(`${AUTH_ENDPOINT}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Logout user
const logout = () => {
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
