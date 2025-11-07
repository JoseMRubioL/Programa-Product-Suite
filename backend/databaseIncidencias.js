// databaseIncidencias.js
import { pool } from "./database.js";

/**
 * Simple helper para obtener el pool de PostgreSQL (compatibilidad con controladores antiguos)
 */
export async function getDb() {
  return pool;
}

export async function initializeIncidenciasDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS incidencias (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        estado TEXT DEFAULT 'pendiente',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        contestacion TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Base de datos de incidencias (PostgreSQL) inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos de incidencias:", error);
  }
}
