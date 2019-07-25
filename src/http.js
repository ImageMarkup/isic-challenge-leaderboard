import axios from 'axios';
import * as Cookies from 'js-cookie';

import settings from '@/settings';

const http = axios.create({
  baseURL: settings.stadeApiBase,
  withCredentials: false,
  responseType: 'json',
});

export default http;
