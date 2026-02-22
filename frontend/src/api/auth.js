import api from './axios';

export const register = (name, email, password) =>
  api.post('/users/register', { name, email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => {
    if (res.data?.access_token) {
      localStorage.setItem('access_token', res.data.access_token);
    }
    return res.data;
  });

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const isAuthenticated = () => !!localStorage.getItem('access_token');
