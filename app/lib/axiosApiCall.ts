import axios from "axios";
const axiosApiCall = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Authorization:
      typeof window !== "undefined"
        ? "Bearer " + localStorage.getItem("jwt")
        : "",
  },
});

export default axiosApiCall;
