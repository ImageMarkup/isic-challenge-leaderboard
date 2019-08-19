import axios from 'axios';

const http = axios.create({
  baseURL: process.env.VUE_APP_STADE_API_BASE,
  withCredentials: true,
  responseType: 'json',
});

export default http;
