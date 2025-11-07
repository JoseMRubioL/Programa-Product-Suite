// controllers/incidenciasController.js
import { pool } from "../database.js";
import PDFDocument from "pdfkit";

/**
 * Devuelve incidencias según rol:
 *  - admin y curro → todas
 *  - worker → solo las suyas
 */
export const getIncidencias = async (req, res) => {
  try {
    const user = req.user;
    let incidencias;

    if (user.role === "admin" || user.username === "curro") {
      const result = await pool.query(`
        SELECT i.*, u.fullname AS assigned_name
        FROM incidencias i
        LEFT JOIN users u ON i.assigned_to = u.id
        ORDER BY i.fecha_creacion DESC
      `);
      incidencias = result.rows;
    } else {
      const result = await pool.query(
        `
        SELECT i.*, u.fullname AS assigned_name
        FROM incidencias i
        LEFT JOIN users u ON i.assigned_to = u.id
        WHERE i.assigned_to = $1
        ORDER BY i.fecha_creacion DESC
        `,
        [user.id]
      );
      incidencias = result.rows;
    }

    res.json(incidencias);
  } catch (error) {
    console.error("❌ Error al obtener incidencias:", error);
    res.status(500).json({ error: "Error al obtener incidencias" });
  }
};

/**
 * Crear una incidencia
 */
export async function createIncidencia(req, res) {
  try {
    const { titulo, descripcion, assigned_to } = req.body;

    if (!titulo || !assigned_to) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    await pool.query(
      `INSERT INTO incidencias (titulo, descripcion, assigned_to, estado)
       VALUES ($1, $2, $3, 'pendiente')`,
      [titulo, descripcion, assigned_to]
    );

    res.json({ message: "✅ Incidencia creada correctamente" });
  } catch (err) {
    console.error("❌ Error al crear incidencia:", err);
    res.status(500).json({ error: "Error al crear incidencia" });
  }
}

/**
 * Actualizar estado
 */
export async function updateEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await pool.query(
      `UPDATE incidencias
       SET estado=$1, fecha_actualizacion=CURRENT_TIMESTAMP
       WHERE id=$2`,
      [estado, id]
    );

    res.json({ message: "✅ Estado actualizado" });
  } catch (err) {
    console.error("❌ Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
}

/**
 * Actualizar contestación
 */
export async function updateContestacion(req, res) {
  try {
    const { id } = req.params;
    const { contestacion } = req.body;

    await pool.query(
      `UPDATE incidencias
       SET contestacion=$1, fecha_actualizacion=CURRENT_TIMESTAMP
       WHERE id=$2`,
      [contestacion, id]
    );

    res.json({ message: "✅ Contestación actualizada" });
  } catch (err) {
    console.error("❌ Error al actualizar contestación:", err);
    res.status(500).json({ error: "Error al actualizar contestación" });
  }
}

/**
 * Eliminar incidencia
 */
export async function deleteIncidencia(req, res) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM incidencias WHERE id=$1", [id]);
    res.json({ message: "🗑️ Incidencia eliminada" });
  } catch (err) {
    console.error("❌ Error al eliminar incidencia:", err);
    res.status(500).json({ error: "Error al eliminar incidencia" });
  }
}

/**
 * Estadísticas globales
 */
export async function getEstadisticas(req, res) {
  try {
    const result = await pool.query(`
      SELECT estado, COUNT(*) AS cantidad
      FROM incidencias
      GROUP BY estado
    `);

    const stats = result.rows.map(row => ({
      estado: row.estado,
      cantidad: Number(row.cantidad),
    }));

    res.json(stats);
  } catch (err) {
    console.error("❌ Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error interno al obtener estadísticas" });
  }
}

/**
 * Exportar incidencias en PDF (solo admin o curro)
 */
export async function exportIncidenciasPDF(req, res) {
  try {
    const user = req.user;
    if (user.role !== "admin" && user.username !== "curro") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const result = await pool.query(`
      SELECT i.id, i.titulo, i.descripcion, i.estado, i.contestacion, 
             u.fullname AS assigned_to_name, i.fecha_creacion
      FROM incidencias i
      LEFT JOIN users u ON i.assigned_to = u.id
      ORDER BY i.fecha_creacion DESC
    `);

    const incidencias = result.rows;

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Disposition", "attachment; filename=incidencias.pdf");
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text("📋 Lista de Incidencias", { align: "center" });
    doc.moveDown();

    // Cuerpo
    incidencias.forEach((inc, index) => {
      doc.fontSize(12).text(`ID: ${inc.id}`, { continued: true });
      doc.text(`  Estado: ${inc.estado}`);
      doc.text(`Título: ${inc.titulo}`);
      doc.text(`Descripción: ${inc.descripcion || "—"}`);
      doc.text(`Asignado a: ${inc.assigned_to_name || "No asignado"}`);
      doc.text(`Contestación: ${inc.contestacion || "—"}`);
      doc.text(`Fecha: ${new Date(inc.fecha_creacion).toLocaleString()}`);
      doc.moveDown();

      if (index < incidencias.length - 1) {
        doc.moveDown(0.5).text("──────────────────────────────");
        doc.moveDown(0.5);
      }
    });

    doc.end();
  } catch (error) {
    console.error("❌ Error al exportar incidencias en PDF:", error);
    res.status(500).json({ message: "Error al generar el PDF" });
  }
}
