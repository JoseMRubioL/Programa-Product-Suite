// src/services/authService.js
import api from "./api.js";

/**
 * Verifica si la clave introducida por el usuario es válida
 */
export async function verificarClaveAdmin(adminKey) {
  try {
    const res = await api.post("/auth/verify-admin", { adminKey });
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.mensaje ||
        "Error al verificar la clave de administrador.",
    };
  }
}
