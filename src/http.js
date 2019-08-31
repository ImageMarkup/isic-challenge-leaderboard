import axios from 'axios';

const http = axios.create({
  baseURL: (process && process.env && process.env.VUE_APP_STADE_API_BASE)
    || 'https://challenge.isic-archive.com/api/',
  // withCredentials: true,
  responseType: 'json',
});

export default http;
