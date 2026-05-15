```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

export const getContents = async () => {
  try {
    const response = await api.get('/contents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContent = async (id) => {
  try {
    const response = await api.get(`/contents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createContent = async (content) => {
  try {
    const response = await api.post('/contents', content);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContent = async (id, content) => {
  try {
    const response = await api.put(`/contents/${id}`, content);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContent = async (id) => {
  try {
    await api.delete(`/contents/${id}`);
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const response = await api.post('/users', user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (user) => {
  try {
    const response = await api.post('/auth/register', user);
    return response.data;
  } catch (error) {
    throw error;
  }
};
```