// src/App.jsx
import React from "react";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  console.log("🧩 Cargando App principal"); // 👈 agrega esto

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
