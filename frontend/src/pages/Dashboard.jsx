import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/paneles.css";

// ✅ Importar imágenes estáticas (Render las servirá desde /assets/)
import taniaImg from "../assets/tania.jpg";
import mariaImg from "../assets/maria.jpg";
import chariImg from "../assets/chari.jpg";
import lourdesImg from "../assets/lourdes.jpg";
import evaImg from "../assets/eva.jpg";
import curroImg from "../assets/curro.jpg";
import joseImg from "../assets/josemiguel.jpg";
import defaultAvatar from "../assets/default-avatar.jpg";

const usuarios = [
  { nombre: "Tania", imagen: taniaImg },
  { nombre: "Maria", imagen: mariaImg },
  { nombre: "Chari", imagen: chariImg },
  { nombre: "Lourdes", imagen: lourdesImg },
  { nombre: "Eva", imagen: evaImg },
  { nombre: "Curro", imagen: curroImg },
  { nombre: "José Miguel", imagen: joseImg },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isCurro = user?.username === "curro";

  const visibleUsers =
    isAdmin || isCurro
      ? usuarios
      : usuarios.filter(
          (u) =>
            u.nombre.toLowerCase().replace(/\s+/g, "") ===
            user?.username?.toLowerCase()
        );

  return (
    <section className="paneles-container">
      <h1 className="paneles-title">Panel de Control de Personal</h1>
      <p className="paneles-subtitle">
        Supervisa el estado del equipo, gestiona incidencias y accede a la información de cada empleado.
      </p>

      <div className="paneles-grid">
        {visibleUsers.map((userData, i) => (
          <div key={i} className="panel-card">
            <img
              src={userData.imagen}
              alt={userData.nombre}
              className="panel-avatar"
              loading="lazy"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
            <h3>{userData.nombre}</h3>
            <button
              className="btn-incidencias"
              onClick={() =>
                navigate(
                  `/dashboard/paneles/incidencias/${userData.nombre
                    .toLowerCase()
                    .replace(/\s+/g, "")}`
                )
              }
            >
              🧾 Control de Incidencias
            </button>
          </div>
        ))}
      </div>

      {visibleUsers.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#777" }}>
          No tienes acceso a otros paneles.
        </p>
      )}
    </section>
  );
}
