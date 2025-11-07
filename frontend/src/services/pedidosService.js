// src/services/pedidosService.js
import api from "./api.js";

/**
 * Obtener todos los pedidos
 */
export async function obtenerPedidos() {
  const res = await api.get("/pedidos");
  return res.data;
}

/**
 * Crear un nuevo pedido
 */
export async function crearPedido(pedido) {
  const res = await api.post("/pedidos", pedido);
  return res.data;
}

/**
 * Actualizar un pedido existente
 */
export async function actualizarPedido(id, datos) {
  const res = await api.put(`/pedidos/${id}`, datos);
  return res.data;
}

/**
 * Actualizar el estado del pedido (ej: completado, cancelado)
 */
export async function actualizarEstado(id, estado) {
  const res = await api.put(`/pedidos/${id}/estado`, { estado });
  return res.data;
}

/**
 * Eliminar un pedido (requiere clave de administrador)
 */
export async function eliminarPedido(id, adminKey) {
  const res = await api.delete(`/pedidos/${id}`, {
    headers: { "x-admin-key": adminKey },
  });
  return res.data;
}

/**
 * Eliminar todos los pedidos (requiere clave de administrador)
 */
export async function eliminarTodos(adminKey) {
  const res = await api.delete("/pedidos", {
    headers: { "x-admin-key": adminKey },
  });
  return res.data;
}

/**
 * Exportar pedidos a Excel (requiere clave de administrador)
 */
export async function exportarPedidosExcel(adminKey) {
  const res = await api.get("/pedidos/export/excel", {
    headers: { "x-admin-key": adminKey },
    responseType: "blob",
  });

  // Crear archivo descargable
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "pedidos.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
}
