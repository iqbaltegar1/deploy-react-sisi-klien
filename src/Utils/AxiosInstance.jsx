import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "/api", // relative URL so it works both locally (via proxy) and in production (on Vercel)
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;