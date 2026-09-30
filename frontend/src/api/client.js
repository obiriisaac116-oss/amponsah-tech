import axios from 'axios';

// Priority:
//  1. VITE_API_URL env var set in Netlify dashboard
//  2. Hardcoded Render backend URL (fallback so the site works even if env var is missing)
//  3. /api proxy — only works in local dev (Vite proxy)
const RENDER_URL = 'https://amponsah-tech-api.onrender.com';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.DEV
    ? '/api'                    // local dev → Vite proxy
    : `${RENDER_URL}/api`;      // production → Render directly

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT for admin calls
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
