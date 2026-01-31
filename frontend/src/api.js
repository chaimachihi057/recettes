import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  // Avec proxy Vite, vous pouvez supprimer baseURL ou mettre '/'
  // baseURL: '/',
});

// User endpoints
export const register = async (email, password) => {
  const { data } = await api.post('/user/register', { email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post('/user/login', { email, password });
  return data;
};

export const getUser = async (id) => {
  const { data } = await api.get(`/user/${id}`);
  return data;
};

// Recipe endpoints
export const getRecipes = async () => {
  const { data } = await api.get('/recipe');
  return data;
};

export const getRecipe = async (id) => {
  const { data } = await api.get(`/recipe/${id}`);
  return data;
};

export const createRecipe = async (recipe, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await api.post('/recipe', recipe, { headers });
  return data;
};

export const updateRecipe = async (id, recipe, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await api.put(`/recipe/${id}`, recipe, { headers });
  return data;
};

export const deleteRecipe = async (id, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await api.delete(`/recipe/${id}`, { headers });
  return data;
};

export default api;