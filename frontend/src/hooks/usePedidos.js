// src/hooks/usePedidos.js
import { useState, useEffect, useCallback } from "react";
import {
  obtenerPedidos,
  crearPedido,
  eliminarPedido,
  exportarPedidosExcel,
} from "../services/pedidosService.js";

export default function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // 🟢 Obtener todos los pedidos
  const cargarPedidos = useCallback(async () => {
    try {
      setCargando(true);
      const data = await obtenerPedidos();
      setPedidos(data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  }, []);

  // 🟢 Crear nuevo pedido
  const agregarPedido = async (nuevoPedido) => {
    try {
      setCargando(true);
      const creado = await crearPedido(nuevoPedido);
      setPedidos((prev) => [creado.datos ? creado.datos : nuevoPedido, ...prev]);
      return { success: true, data: creado };
    } catch (err) {
      console.error("Error creando pedido:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Error al crear pedido",
      };
    } finally {
      setCargando(false);
    }
  };

  // 🟢 Eliminar pedido (requiere clave admin)
  const borrarPedido = async (pedidoId, adminKey) => {
    try {
      await eliminarPedido(pedidoId, adminKey);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      return { success: true };
    } catch (err) {
      console.error("Error eliminando pedido:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Error al eliminar pedido",
      };
    }
  };

  // 🟢 Exportar pedidos
  const exportarExcel = async (adminKey) => {
    try {
      await exportarPedidosExcel(adminKey);
      return { success: true };
    } catch (err) {
      console.error("Error exportando pedidos:", err);
      return {
        success: false,
        error: "No se pudo exportar el archivo Excel.",
      };
    }
  };

  // Cargar pedidos al inicio
  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  return {
    pedidos,
    cargando,
    error,
    cargarPedidos,
    agregarPedido,
    borrarPedido,
    exportarExcel,
  };
}
