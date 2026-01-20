import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // يمكنك تغييره لاحقًا عند النشر
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
