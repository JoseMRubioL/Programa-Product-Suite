import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/incidencias.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useAuth } from "../context/AuthContext";

export default function IncidenciasPanel() {
  const { username } = useParams();
  const { user } = useAuth();

  const [incidencias, setIncidencias] = useState([]);
  const [nueva, setNueva] = useState({ titulo: "", descripcion: "", assigned_to: "" });
  const [estadisticas, setEstadisticas] = useState([]);

  const isAdmin = user?.role === "admin";

  // Mapa estable de timeouts: idIncidencia -> timeoutId
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    fetchIncidencias();
    fetchEstadisticas();
    return () => {
      // Limpieza de todos los temporizadores en unmount
      for (const id of timeoutsRef.current.keys()) {
        clearTimeout(timeoutsRef.current.get(id));
      }
      timeoutsRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchIncidencias = useCallback(async () => {
    try {
      const res = await api.get("/incidencias");
      setIncidencias(res.data || []);
    } catch (err) {
      console.error("❌ Error al cargar incidencias:", err);
    }
  }, []);

  const fetchEstadisticas = useCallback(async () => {
    try {
      const res = await api.get("/incidencias/estadisticas");
      setEstadisticas(res.data || []);
    } catch (err) {
      console.error("❌ Error al obtener estadísticas:", err);
    }
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!nueva.titulo || !nueva.assigned_to) return alert("Faltan campos obligatorios");
    try {
      await api.post("/incidencias", nueva);
      setNueva({ titulo: "", descripcion: "", assigned_to: "" });
      fetchIncidencias();
      fetchEstadisticas();
    } catch (err) {
      console.error("❌ Error al crear incidencia:", err);
    }
  }

  async function handleEstadoChange(id, estado) {
    try {
      await api.patch(`/incidencias/${id}/estado`, { estado });
      // Refrescamos para reflejar el cambio y actualizar estadísticas
      fetchIncidencias();
      fetchEstadisticas();
    } catch (err) {
      console.error("❌ Error al actualizar estado:", err);
    }
  }

  // Debounce de contestación: actualiza UI al instante y envía al backend tras 800 ms sin teclear
  const handleContestacionChange = useCallback((id, contestacion) => {
    // 1) Estado local inmediato para que el textarea sea fluido
    setIncidencias(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, contestacion } : inc))
    );

    // 2) Reiniciar temporizador de ese ID
    const map = timeoutsRef.current;
    if (map.has(id)) clearTimeout(map.get(id));

    const timeoutId = setTimeout(async () => {
      try {
        await api.patch(`/incidencias/${id}/contestacion`, { contestacion });
        // No hace falta refetch: ya reflejamos el valor local
      } catch (err) {
        console.error("❌ Error al actualizar contestación:", err);
      } finally {
        map.delete(id);
      }
    }, 800);

    map.set(id, timeoutId);
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que deseas eliminar esta incidencia?")) return;
    try {
      // Cancelamos cualquier envío pendiente de contestación para ese id
      const map = timeoutsRef.current;
      if (map.has(id)) {
        clearTimeout(map.get(id));
        map.delete(id);
      }

      await api.delete(`/incidencias/${id}`);
      fetchIncidencias();
      fetchEstadisticas();
    } catch (err) {
      console.error("❌ Error al eliminar incidencia:", err);
    }
  }

  // 🔽 Descargar PDF (solo admin)
  async function handleDownloadPDF() {
    try {
      const res = await api.get("/incidencias/export/pdf", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "incidencias.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
      alert("Error al generar el PDF. Verifica que eres administrador.");
    }
  }

  const COLORS = ["#e74c3c", "#3498db", "#2ecc71"];
  const data = estadisticas.map((s) => ({
    name: s.estado === "pendiente" ? "Pendiente" : s.estado === "en_proceso" ? "En proceso" : "Resuelta",
    value: s.cantidad,
  }));

  return (
    <section className="incidencias-wrapper">
      <div className="incidencias-header">
        <h2>Incidencias — {username.charAt(0).toUpperCase() + username.slice(1)}</h2>
        <p>Gestión de incidencias y seguimiento de clientes.</p>

        {isAdmin && (
          <button className="btn-export-pdf" onClick={handleDownloadPDF}>
            📄 Descargar PDF
          </button>
        )}
      </div>

      <div className="incidencias-content">
        {/* LISTA IZQUIERDA */}
        <div className="incidencias-left">
          {isAdmin && (
            <form className="incidencia-form" onSubmit={handleCreate}>
              <h3>➕ Nueva incidencia</h3>
              <input
                type="text"
                placeholder="Título *"
                value={nueva.titulo}
                onChange={(e) => setNueva({ ...nueva, titulo: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                value={nueva.descripcion}
                onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
              />
              <label>Asignar a:</label>
              <select
                value={nueva.assigned_to}
                onChange={(e) => setNueva({ ...nueva, assigned_to: e.target.value })}
                required
              >
                <option value="">-- Selecciona un usuario --</option>
                <option value="2">Tania</option>
                <option value="3">Maria</option>
                <option value="4">Chari</option>
                <option value="5">Lourdes</option>
                <option value="6">Eva</option>
                <option value="8">José Miguel</option>
              </select>

              <button type="submit" className="btn-primary">Crear incidencia</button>
            </form>
          )}

          <h3>📋 Lista de incidencias</h3>
          <div className="incidencias-list">
            {incidencias.length === 0 ? (
              <p className="empty">No hay incidencias registradas</p>
            ) : (
              incidencias.map((inc) => (
                <div key={inc.id} className="inc-card">
                  <div className="inc-header">
                    <h4>{inc.titulo}</h4>
                    {isAdmin && (
                      <button className="btn-delete" onClick={() => handleDelete(inc.id)}>🗑️</button>
                    )}
                  </div>

                  <p className="inc-desc">{inc.descripcion}</p>

                  <div className="inc-info">
                    <label>Estado:</label>
                    <select
                      value={inc.estado}
                      onChange={(e) => handleEstadoChange(inc.id, e.target.value)}
                      className={`estado-select ${inc.estado}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="resuelta">Resuelta</option>
                    </select>
                  </div>

                  <div className="inc-contestacion">
                    <label>Contestación:</label>
                    <textarea
                      value={inc.contestacion || ""}
                      onChange={(e) => handleContestacionChange(inc.id, e.target.value)}
                      placeholder="Escribe el resumen de la conversación con la clienta..."
                    />
                  </div>

                  <div className="inc-footer">
                    <span>Asignada a: {inc.assigned_name || "—"}</span>
                    <span>
                      Última actualización:{" "}
                      {inc.fecha_actualizacion ? new Date(inc.fecha_actualizacion).toLocaleString() : "—"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* GRÁFICO DERECHA */}
        <div className="incidencias-right">
          <h3>📊 Estadísticas</h3>
          <PieChart width={260} height={260}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </section>
  );
}
