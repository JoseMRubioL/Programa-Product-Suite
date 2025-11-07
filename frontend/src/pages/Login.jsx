// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(form.username.trim(), form.password);
      console.log("✅ Usuario logueado:", user);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("❌ Error login:", err);
      setError(err.message || "No se pudo iniciar sesión");
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Acceso a ProductSuite</h1>
        <label>Usuario</label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="usuario"
        />
        <label>Contraseña</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </div>
  );
}
