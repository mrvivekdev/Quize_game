import axios from 'axios';

const API_URL = '/api';

// Create an axios instance with credentials enabled for cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor to add auth token (keeping for legacy/mobile header support if needed, but cookies take precedence)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('guestToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authenticateGuest = async () => {
  try {
    const existingId = localStorage.getItem('guestId');
    const response = await api.post('/auth/guest', { guestId: existingId });
    
    // Store credentials
    localStorage.setItem('guestToken', response.data.token);
    localStorage.setItem('guestId', response.data.guestId);
    if (response.data.name) {
      localStorage.setItem('userName', response.data.name);
    }
    
    return response.data;
  } catch (error) {
    console.error('Guest authentication failed:', error);
    throw error;
  }
};

export const loginWithGoogle = async (idToken) => {
  try {
    const guestId = localStorage.getItem('guestId');
    const response = await api.post('/auth/google', { idToken, guestId });
    
    // Store profile info
    if (response.data.name) {
      localStorage.setItem('userName', response.data.name);
    }
    if (response.data.avatar) {
      localStorage.setItem('userAvatar', response.data.avatar);
    }
    // Still store token if needed for other parts, but cookies handle most auth now
    localStorage.setItem('guestToken', response.data.token);
    
    window.dispatchEvent(new Event('coinsUpdated'));
    return response.data;
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('guestToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        // We might want to keep guestId if they log back in as guest, 
        // but often logout should be a clean slate or reset to guest.
        window.dispatchEvent(new Event('coinsUpdated'));
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/questions/categories');
    return response.data; // Expected array of strings
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

export const getQuestions = async (category, difficulty = '', limit = 10) => {
  try {
    const params = { limit };
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;

    const response = await api.get('/questions', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw error;
  }
};

// Submit quiz result - awards 5 coins per correct, subtracts 2 per wrong
export const submitScore = async (correctAnswers, totalQuestions, category) => {
  try {
    const response = await api.post('/users/submit-score', { correctAnswers, totalQuestions, category });
    window.dispatchEvent(new Event('coinsUpdated'));
    return response.data; // { coinsEarned, totalCoins, totalScore }
  } catch (error) {
    console.error('Failed to submit score:', error);
    throw error;
  }
};

// Get current user's coin history
export const getCoinHistory = async () => {
    try {
        const response = await api.get('/users/coin-history');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch coin history:', error);
        throw error;
    }
};

// Get current user profile (includes coins)
export const getMe = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export default api;
