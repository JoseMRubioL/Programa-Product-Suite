import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/header.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="ps-header">
      <div className="ps-header__inner">
        <Link to="/home" className="brand">
          <img src={logo} alt="ProductSuite logo" className="brand__logo" />
          <span className="brand__name">ProductSuite</span>
        </Link>

        <nav className="nav">
          <NavLink to="/home" className="nav__link">Inicio</NavLink>
          <NavLink to="/pedidos" className="nav__link">Pedidos</NavLink>
          <NavLink to="/dashboard" className="nav__link">Paneles</NavLink>
        </nav>

        <div className="user">
          {user && <span className="user__name">Bienvenido, {user.fullname}</span>}
          <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
    </header>
  );
}
