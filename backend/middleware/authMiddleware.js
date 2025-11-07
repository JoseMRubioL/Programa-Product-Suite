// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware para verificar token JWT
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error al verificar el token:", error.message);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

/**
 * Middleware para comprobar si el usuario tiene rol administrador
 */
export const isAdmin = (req, res, next) => {
  // Permitir a 'admin' o 'curro' acceder
  if (req.user?.role === "admin" || req.user?.username === "curro") {
    return next();
  }

  return res.status(403).json({ error: "Acceso denegado: no eres administrador" });
};
