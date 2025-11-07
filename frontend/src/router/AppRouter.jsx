// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Pedidos from "../pages/Pedidos";
import Vales from "../pages/Vales";
import Paneles from "../pages/Paneles";  // ✅ ESTA IMPORTACIÓN
import Dashboard from "../pages/Dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import PedidosForm from "../pages/PedidosForm"; 
import IncidenciasPanel from "../components/IncidenciasPanel";


export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Header />}

      <main>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Login />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/vales" element={<Vales />} />
              <Route path="/paneles" element={<Paneles />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pedidos/introducir" element={<PedidosForm />} />
              <Route path="/dashboard/paneles/incidencias/:username" element={<IncidenciasPanel />} />
            </>
          )}
        </Routes>
      </main>

      {user && <Footer />}
    </Router>
  );
}
