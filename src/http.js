import axios from 'axios';
import * as Cookies from 'js-cookie';

const covalicApiBase = 'https://challenge.kitware.com/api/v1/';

const http = axios.create({
  baseURL: covalicApiBase,
});

const token =
  window.location.hash.replace(/^#/, '') ||
  Cookies.get('girderToken') ||
  null;
if (token) {
  http.defaults.headers.common['Girder-Token'] = token;
}

export default http;
