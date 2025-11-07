// src/context/PedidosContext.jsx
import React, { createContext, useContext } from "react";
import usePedidos from "../hooks/usePedidos.js";

// Crear contexto
const PedidosContext = createContext();

// Hook para acceder fácilmente al contexto
export const usePedidosContext = () => useContext(PedidosContext);

// Proveedor del contexto
export const PedidosProvider = ({ children }) => {
  const pedidos = usePedidos(); // Contiene pedidos, cargarPedidos, agregarPedido, borrarPedido, etc.

  return (
    <PedidosContext.Provider value={pedidos}>
      {children}
    </PedidosContext.Provider>
  );
};
