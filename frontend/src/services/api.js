// src/services/api.js
import axios from "axios";

const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://productsuite-backend-jfjz.onrender.com/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 15000, // un poco más de margen para Render
});

// Adjunta el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de 401:
// - SI es /auth/login => no redirigir (deja que Login.jsx muestre el error)
// - SI es cualquier otra ruta => limpiar token y mandar al login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = (error?.config?.url || "").toLowerCase();

    if (status === 401 && !url.includes("/auth/login")) {
      try {
        localStorage.removeItem("token");
      } catch {}
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
