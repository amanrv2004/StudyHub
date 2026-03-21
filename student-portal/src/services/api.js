import axios from 'axios';

let BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
BASE_URL = BASE_URL.replace(/\/$/, ''); 
if (BASE_URL.endsWith('/api')) {
  BASE_URL = BASE_URL.replace(/\/api$/, '');
}
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

export default api;
export { API_URL };
