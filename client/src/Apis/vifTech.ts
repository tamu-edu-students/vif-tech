import axios from "axios";
console.log('BASE URL:', process.env.REACT_APP_BASE_URL);
if (!process.env.REACT_APP_BASE_URL) {
  throw new Error('REACT_APP_BASE_URL environment variable not found. API calls will not work unless set.');
}

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});
