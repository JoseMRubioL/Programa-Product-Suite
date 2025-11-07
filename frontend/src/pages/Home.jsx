// src/pages/Home.jsx
import React from "react";
import "../styles/home.css";
import Carousel from "../components/Carousel.jsx";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

export default function Home() {
  const slides = [
    { src: slide1, alt: "Gestión de pedidos" },
    { src: slide2, alt: "Panel de vales" },
    { src: slide3, alt: "Control administrativo", objectPosition: "center 25%" },
  ];

  console.log("🧠 Renderizando Home PRINCIPAL (pages/Home.jsx)");

  return (
    <section className="home-wrapper">
      <div className="hero-section">
        <h1 className="hero-title">Bienvenido a ProductSuite</h1>
        <p className="hero-subtitle">
          La herramienta integral de <strong>gestión de pedidos y vales</strong> diseñada
          para optimizar tu negocio con una interfaz moderna, intuitiva y eficiente.
        </p>
      </div>

      <div className="carousel-wrapper">
        <Carousel images={slides} interval={3000} />
      </div>

      <div className="home-content">
        <p>
          <strong>ProductSuite</strong> centraliza el control de pedidos, usuarios y procesos,
          ofreciendo una experiencia fluida tanto en escritorio como en dispositivos móviles.
        </p>

        <div className="signature">
          <p>Desarrollado por <strong>José Miguel Rubio Laguna</strong></p>
          <p><em>Equipo de LAKAMODA SPAIN</em></p>
        </div>
      </div>
    </section>
  );
}
