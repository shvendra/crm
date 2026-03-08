import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create();

// List of URLs to skip the 401 redirect
const skipRedirectUrls = ["/api/v1/user/login", "/api/v1/user/getuser"]; // add any public API

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "";
    const requestUrl = error.config?.url || "";

    // Skip redirect for certain URLs
    const skip = skipRedirectUrls.some((url) => requestUrl.includes(url));
    if (skip) return Promise.reject(error);

    if (
      status === 401 ||
      message.toLowerCase().includes("user not authorized") ||
      message.toLowerCase().includes("unauthorized")
    ) {
      console.warn("🚫 Unauthorized! Redirecting to login...");

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/landing"; // ✅ safe now, won't loop
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
