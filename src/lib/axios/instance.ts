import axios, { AxiosInstance } from 'axios';


const getToken = () => {
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  };
  return token;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken(),
  },
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${getToken()}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
