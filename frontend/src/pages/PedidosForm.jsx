import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/pedidos.css";

export default function PedidosForm() {
  const [pedidos, setPedidos] = useState([]);
  const [nuevoPedido, setNuevoPedido] = useState({
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
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState(""); // 🔍 filtro por teléfono o código

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    try {
      const res = await api.get("/pedidos");
      setPedidos(res.data || []);
    } catch (err) {
      console.error("❌ Error al cargar pedidos:", err);
      setPedidos([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/pedidos", nuevoPedido);
      setMensaje("✅ Pedido registrado correctamente.");
      setNuevoPedido({
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
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("❌ Error al guardar pedido:", err);
      setMensaje("⚠️ Error al guardar el pedido.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await api.delete(`/pedidos/${id}`);
      fetchPedidos();
    } catch (err) {
      console.error("❌ Error al eliminar pedido:", err);
    }
  }

  // 🗑️ Eliminar todos los pedidos
  async function handleEliminarTodo() {
    if (!window.confirm("⚠️ ¿Seguro que quieres eliminar TODOS los pedidos? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete("/pedidos/eliminar-todo");
      setPedidos([]);
      setMensaje("🗑️ Todos los pedidos han sido eliminados.");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("❌ Error al eliminar todos los pedidos:", err);
      setMensaje("⚠️ Error al eliminar todos los pedidos.");
    }
  }

  // 📤 Exportar pedidos a Excel
  async function handleExportarExcel() {
    try {
      const res = await api.get("/pedidos/export/excel", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedidos.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error al exportar Excel:", err);
      setMensaje("⚠️ Error al exportar pedidos a Excel.");
    }
  }

  // 🔍 Filtrar pedidos por número de teléfono o código de prenda
  const pedidosFiltrados = pedidos.filter((p) => {
    const texto = busqueda.toLowerCase();
    return (
      p.telefono.toLowerCase().includes(texto) ||
      p.codigo.toLowerCase().includes(texto)
    );
  });

  return (
    <section className="pedidos-container">
      <h2>📋 Gestión de Pedidos</h2>
      {mensaje && <div className="mensaje">{mensaje}</div>}

      {/* FORMULARIO DE NUEVO PEDIDO */}
      <form className="pedido-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono *"
          value={nuevoPedido.telefono}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, telefono: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="tipo_prenda"
          placeholder="Tipo de prenda *"
          value={nuevoPedido.tipo_prenda}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, tipo_prenda: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="talla"
          placeholder="Talla *"
          value={nuevoPedido.talla}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, talla: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Color *"
          value={nuevoPedido.color}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, color: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="codigo"
          placeholder="Código *"
          value={nuevoPedido.codigo}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, codigo: e.target.value })
          }
          required
        />
        <input
          type="number"
          name="precio"
          step="0.01"
          placeholder="Precio (€) *"
          value={nuevoPedido.precio}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, precio: e.target.value })
          }
          required
        />
        <select
          name="metodo_pago"
          value={nuevoPedido.metodo_pago}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, metodo_pago: e.target.value })
          }
          required
        >
          <option value="">Método de pago *</option>
          <option value="contrareembolso">Contrareembolso</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
          <option value="paypal">PayPal</option>
          <option value="bizum">Bizum</option>
          <option value="efectivo">Efectivo</option>
        </select>
        <textarea
          name="notas"
          placeholder="Notas adicionales (opcional)"
          value={nuevoPedido.notas}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, notas: e.target.value })
          }
        />
        <input
          type="date"
          name="fecha_envio"
          value={nuevoPedido.fecha_envio}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, fecha_envio: e.target.value })
          }
        />
        <button type="submit" className="btn-save">
          ➕ Guardar pedido
        </button>
      </form>

      {/* 🔍 BUSCADOR Y BOTONES DE ACCIÓN */}
      <div className="busqueda-box">
        <input
          type="text"
          placeholder="Buscar por teléfono o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
        {busqueda && (
          <button className="btn-limpiar" onClick={() => setBusqueda("")}>
            ❌ Limpiar
          </button>
        )}
        <button className="btn-exportar" onClick={handleExportarExcel}>
          📤 Exportar a Excel
        </button>
        <button className="btn-eliminar-todo" onClick={handleEliminarTodo}>
          🗑️ Eliminar todos
        </button>
      </div>

      {/* LISTADO DE PEDIDOS */}
      <h3>📦 Lista de Pedidos</h3>
      <div className="pedidos-grid">
        {pedidosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>
            No hay pedidos que coincidan con la búsqueda
          </p>
        ) : (
          pedidosFiltrados.map((p) => (
            <div key={p.id} className="pedido-card">
              <p><strong>Teléfono:</strong> {p.telefono}</p>
              <p><strong>Prenda:</strong> {p.tipo_prenda}</p>
              <p><strong>Talla:</strong> {p.talla}</p>
              <p><strong>Color:</strong> {p.color}</p>
              <p><strong>Código:</strong> {p.codigo}</p>
              <p><strong>Precio:</strong> {p.precio} €</p>
              <p><strong>Pago:</strong> {p.metodo_pago}</p>
              <p><strong>Notas:</strong> {p.notas || "—"}</p>
              <p><strong>Fecha envío:</strong> {p.fecha_envio || "—"}</p>
              <button
                className="btn-delete"
                onClick={() => handleDelete(p.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
