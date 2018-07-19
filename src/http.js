import axios from 'axios';

const covalicApiBase = 'https://challenge.kitware.com/api/v1/';

const http = axios.create({
  baseURL: covalicApiBase,
});

const token = window.location.hash.replace(/^#/, '');
if (token) {
  http.defaults.headers.common['Girder-Token'] = token;
}

export default http;
