// routes/incidenciasRoutes.js
import express from "express";
import {
  getIncidencias,
  createIncidencia,
  updateEstado,
  updateContestacion,
  deleteIncidencia,
  getEstadisticas,
  exportIncidenciasPDF,
} from "../controllers/incidenciasController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🔐 Rutas protegidas
 */
router.get("/", verifyToken, getIncidencias);
router.post("/", verifyToken, createIncidencia);
router.patch("/:id/estado", verifyToken, updateEstado);
router.patch("/:id/contestacion", verifyToken, updateContestacion);
router.delete("/:id", verifyToken, deleteIncidencia);
router.get("/estadisticas", verifyToken, getEstadisticas);

/**
 * 📄 Exportar PDF (solo admin)
 */
router.get("/export/pdf", verifyToken, isAdmin, exportIncidenciasPDF);

export default router;
