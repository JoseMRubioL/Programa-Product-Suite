// src/pages/IntroducirPedidos.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api"; // ✅ usamos nuestro cliente con Render + JWT
import "../styles/introducirPedidos.css";

export default function IntroducirPedidos() {
  const [pedido, setPedido] = useState({
    telefono: "",
    tipo_prenda: "",
    talla: "",
    color: "",
    codigo: "",
    precio: "",
    metodo_pago: "",
    notas: "",
    fecha_envio: "",
  });

  const [pedidos, setPedidos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // 🔁 Cargar pedidos al inicio
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await api.get("/pedidos");
      setPedidos(res.data || []);
    } catch (error) {
      console.error("❌ Error al cargar los pedidos:", error);
      setPedidos([]);
    }
  };

  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pedido.metodo_pago) {
      setMensaje("⚠️ El método de pago es obligatorio.");
      return;
    }

    try {
      await api.post("/pedidos", pedido);
      setMensaje("✅ Pedido registrado correctamente.");
      setPedido({
        telefono: "",
        tipo_prenda: "",
        talla: "",
        color: "",
        codigo: "",
        precio: "",
        metodo_pago: "",
        notas: "",
        fecha_envio: "",
      });
      fetchPedidos();
    } catch (error) {
      console.error("❌ Error al registrar el pedido:", error);
      setMensaje("❌ Error al registrar el pedido.");
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
      fetchPedidos();
    } catch (error) {
      console.error("❌ Error al cambiar el estado del pedido:", error);
    }
  };

  const exportarExcel = async () => {
    try {
      const res = await api.get("/pedidos/export/excel", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedidos.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("❌ Error al exportar pedidos:", error);
    }
  };

  return (
    <section className="introducir-container">
      <h2>Introducir nuevo pedido</h2>
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="pedido-form">
        <div className="form-grid">
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={pedido.telefono}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tipo_prenda"
            placeholder="Tipo de prenda"
            value={pedido.tipo_prenda}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="talla"
            placeholder="Talla"
            value={pedido.talla}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={pedido.color}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="codigo"
            placeholder="Código"
            value={pedido.codigo}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio (€)"
            value={pedido.precio}
            onChange={handleChange}
            required
          />
          <select
            name="metodo_pago"
            value={pedido.metodo_pago}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar método de pago</option>
            <option value="contrareembolso">Contrareembolso</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="paypal">PayPal</option>
            <option value="bizum">Bizum</option>
            <option value="efectivo">Efectivo</option>
          </select>

          <textarea
            name="notas"
            placeholder="Notas"
            value={pedido.notas}
            onChange={handleChange}
          ></textarea>

          <input
            type="date"
            name="fecha_envio"
            placeholder="Fecha de recogida/envío (opcional)"
            value={pedido.fecha_envio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="guardar-btn">
          💾 Guardar Pedido
        </button>
      </form>

      <h3>Pedidos registrados</h3>
      <div className="lista-pedidos">
        {pedidos.length === 0 ? (
          <p>No hay pedidos registrados.</p>
        ) : (
          pedidos.map((p) => (
            <div key={p.id} className="pedido-card">
              <div>
                <strong>{p.tipo_prenda}</strong> — {p.color} ({p.talla})
                <br />
                <span>📞 {p.telefono}</span> | 💶 {p.precio} €
              </div>
              <div className="estado-container">
                <select
                  value={p.estado}
                  onChange={(e) => handleEstadoChange(p.id, e.target.value)}
                >
                  <option value="activo">Activo</option>
                  <option value="anulado">Anulado</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {pedidos.length > 0 && (
        <button onClick={exportarExcel} className="exportar-btn">
          📤 Exportar a Excel
        </button>
      )}
    </section>
  );
}
