import axios from 'axios';
import * as Cookies from 'js-cookie';

import settings from '@/settings';

const http = axios.create({
  baseURL: settings.stadeApiBase,
  withCredentials: false,
  responseType: 'json',
});

const token = window.location.hash.replace(/^#/, '')
  || Cookies.get('girderToken')
  || null;
if (token) {
  http.defaults.headers.common['Girder-Token'] = token;
}

export default http;
