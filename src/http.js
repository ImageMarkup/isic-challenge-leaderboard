import axios from 'axios';

let baseURL;
try {
  baseURL = process.env.VUE_APP_STADE_API_BASE;
} catch (e) {
  baseURL = 'https://challenge.isic-archive.com/api/';
}

const http = axios.create({
  baseURL,
  // withCredentials: true,
  responseType: 'json',
});

export default http;
