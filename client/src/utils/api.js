import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('echosonder_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

export const getContents = () => api.get('/contents').then((r) => r.data);
export const getContent = (id) => api.get(`/contents/${id}`).then((r) => r.data);
export const createContent = (content) => api.post('/contents', content).then((r) => r.data);
export const updateContent = (id, content) => api.put(`/contents/${id}`, content).then((r) => r.data);
export const deleteContent = (id) => api.delete(`/contents/${id}`).then((r) => r.data);

export const login = (email, password) => api.post('/users/login', { email, password }).then((r) => r.data);
export const register = (name, email, password) => api.post('/users/register', { name, email, password }).then((r) => r.data);
export const getProfile = () => api.get('/users/me').then((r) => r.data);
export const getUsers = () => api.get('/users').then((r) => r.data);
export const getUser = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);

export default api;
