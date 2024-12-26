import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://personalfinancedashboard-production.up.railway.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
