import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="ps-footer">
      <div className="ps-footer__inner">
        <span>© {new Date().getFullYear()} ProductSuite</span>
        <span>Desarrollado por Jose Miguel Rubio Laguna — LAKAMODA SPAIN</span>
      </div>
    </footer>
  );
}
