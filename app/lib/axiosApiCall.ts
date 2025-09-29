import axios from "axios";

const axiosApiCall = axios.create({
  baseURL: process.env.BASE_URL,
});

// interceptor pridá aktuálny token pred každým requestom
axiosApiCall.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosApiCall;
