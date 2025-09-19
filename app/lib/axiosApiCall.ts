import axios from "axios";

const axiosApiCall = axios.create({
  baseURL: "https://finance-app-be-c1f3.onrender.com", // tvoja Render URL
  headers: {
    Authorization:
      typeof window !== "undefined"
        ? "Bearer " + localStorage.getItem("jwt")
        : "",
  },
});

export default axiosApiCall;
