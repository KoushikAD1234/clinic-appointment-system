import axios from "axios";

const api = axios.create({
  baseURL: "https://clinic-appointment-system-i94m.onrender.com",
});

// Attach access_token automatically
api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  return config;
});

export default api;
