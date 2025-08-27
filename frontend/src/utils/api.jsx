import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  async post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }

  async get(url, config = {}) {
    return this.api.get(url, config);
  }

  async put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config);
  }

  // Helper method to get image URL
  getImageUrl(imagePath) {
    // If already a full URL, return as-is
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }
    // Build proper URL
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    // Remove 'uploads/' if it's already in imagePath
    const cleanPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
    return `${serverUrl}/${cleanPath}`;
  }
}

export const api = new ApiService();

