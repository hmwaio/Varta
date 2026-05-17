import axios from "axios";
import { BACKEND_URL } from "../../config.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || BACKEND_URL,
  withCredentials: true,
});

/* Response interceptor */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookieStore.delete("token");
      // window.location.href = "/login";
      console.log("Unauthorized request");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
