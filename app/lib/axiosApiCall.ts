import axios from "axios";

const axiosApiCall = axios.create({
  baseURL: "https://finance-app-be-c1f3.onrender.com",
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
