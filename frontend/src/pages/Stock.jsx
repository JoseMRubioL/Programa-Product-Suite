// En tu página Stock.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function StockUploader() {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Selecciona un archivo Excel primero");

    const formData = new FormData();
    formData.append("file", archivo);

    try {
      const res = await api.post("/stock/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensaje(res.data.message);
    } catch (err) {
      console.error("❌ Error al importar:", err);
      setMensaje("⚠️ Error al importar el archivo");
    }
  };

  return (
    <div className="importador-stock">
      <h3>📥 Importar Stock desde Excel</h3>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx" onChange={(e) => setArchivo(e.target.files[0])} />
        <button type="submit">📤 Subir archivo</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
