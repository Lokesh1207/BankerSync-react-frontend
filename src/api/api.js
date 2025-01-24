import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/', // Fallback to localhost if the env variable is not set
  headers: {
    'Content-Type': 'application/json',
  }, 
});

export default api;
