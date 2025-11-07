// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { verificarClaveAdmin } from "../services/authService.js";

export default function useAuth() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem("adminKey") || "");
  const [autenticado, setAutenticado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🟢 Verificar clave con el backend
  const login = useCallback(async (claveIntroducida) => {
    const { success, data, error } = await verificarClaveAdmin(claveIntroducida);
    if (success) {
      setAutenticado(true);
      setAdminKey(claveIntroducida);
      localStorage.setItem("adminKey", claveIntroducida);
      setMensaje(data.mensaje || "Acceso de administrador verificado.");
      return { success: true };
    } else {
      setAutenticado(false);
      setMensaje(error);
      return { success: false, error };
    }
  }, []);

  // 🟢 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("adminKey");
    setAdminKey("");
    setAutenticado(false);
    setMensaje("Sesión de administrador cerrada.");
  };

  // Restaurar sesión si hay clave en localStorage
  useEffect(() => {
    if (adminKey) {
      setAutenticado(true);
    }
  }, [adminKey]);

  return {
    adminKey,
    autenticado,
    mensaje,
    login,
    logout,
  };
}
