// src/components/Carousel.jsx
import React, { useState, useEffect } from "react";
import "../styles/carousel.css";

export default function Carousel({ images = [], interval = 3000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="carousel-slide">
            <img
              src={img.src}
              alt={img.alt}
              style={{ objectPosition: img.objectPosition || "center" }}
            />
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={i === current ? "active" : ""}
            onClick={() => setCurrent(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
