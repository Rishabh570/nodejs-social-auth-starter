import axios from "axios";
import { API_URL } from '../config';

export const globalSignOutHandler = () => {
  return axios.get(`${API_URL}/api/logout`, { withCredentials: true })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return null;
    })
}