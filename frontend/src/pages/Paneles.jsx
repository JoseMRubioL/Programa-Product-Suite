import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/paneles.css";

export default function IncidenciasPanel() {
  const { user } = useAuth();
  const { usuario } = useParams();
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const res = await api.get("/incidencias");
        let data = res.data;

        if (user && user.role !== "admin" && user.username !== "curro") {
          data = data.filter(
            (i) =>
              i.assigned_name?.toLowerCase() === user.fullname.toLowerCase() ||
              i.assigned_to === user.id
          );
        }

        setIncidencias(data);
      } catch (err) {
        console.error("❌ Error al cargar incidencias:", err);
        setError("No se pudieron cargar las incidencias");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, [user]);

  const handleExportPDF = async () => {
    try {
      const response = await api.get("/incidencias/export/pdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "incidencias.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error al exportar PDF:", error);
      alert("Error al generar el PDF de incidencias");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando incidencias...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <section className="paneles-container">
      <h1 className="paneles-title">
        Panel de Incidencias de{" "}
        {usuario ? usuario.charAt(0).toUpperCase() + usuario.slice(1) : ""}
      </h1>
      <p className="paneles-subtitle">
        Aquí puedes ver y gestionar las incidencias asignadas.
      </p>

      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button className="btn-export" onClick={handleExportPDF}>
          📄 Exportar PDF
        </button>
      </div>

      {incidencias.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", marginTop: "1rem" }}>
          No hay incidencias registradas.
        </p>
      ) : (
        <div className="paneles-grid">
          {incidencias.map((i) => (
            <div key={i.id} className="panel-card">
              <h3>{i.titulo}</h3>
              <p>
                <strong>Descripción:</strong>{" "}
                {i.descripcion || "Sin descripción"}
              </p>
              <p>
                <strong>Estado:</strong> {i.estado}
              </p>
              <p>
                <strong>Asignada a:</strong> {i.assigned_name || "Sin asignar"}
              </p>
              {i.contestacion && (
                <p>
                  <strong>Contestación:</strong> {i.contestacion}
                </p>
              )}
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                Creada: {new Date(i.fecha_creacion).toLocaleString("es-ES")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
