import axios from 'axios';

import { API_URL } from '../config';

export const fetchUser = () => {
  const url = `${API_URL}/api/user`;

  return axios
    .get(url, { withCredentials: true })
    .then((res) => {
      const resp = res.data;
      return resp.data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}
