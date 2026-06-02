import axios from 'axios';

const API_BASE_URL = 'http://localhost:5282';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ircm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 and 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Token expired or invalid
      if (status === 401) {
        localStorage.removeItem('ircm_token');
        localStorage.removeItem('ircm_user');
        
        // Only redirect if not already on login or landing page
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
