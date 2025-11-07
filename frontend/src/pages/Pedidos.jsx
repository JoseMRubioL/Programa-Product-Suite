// src/pages/Pedidos.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pedidosMenu.css";

export default function Pedidos() {
  const navigate = useNavigate();

  return (
    <section className="pedidos-menu">
      <h2>Gestión de Pedidos</h2>
      <p className="pedidos-subtitle">
        Selecciona una de las opciones para gestionar tus pedidos y recursos.
      </p>

      <div className="pedidos-buttons">
        <button onClick={() => navigate("/pedidos/introducir")}>
          📦 Introducir pedidos
        </button>
        <button onClick={() => navigate("/pedidos/estado")}>
          📋 Estado de pedidos
        </button>
        <button onClick={() => navigate("/stock")}>
          🏷️ Stock
        </button>
        <button onClick={() => navigate("/clientes")}>
          👥 Panel de clientes
        </button>
      </div>
    </section>
  );
}
