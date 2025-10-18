import React from "react";
// import CSS depuis src/styles/components
import "../styles/components/Header.css";

export default function Header({
  image = { src: "/assets/header.png", alt: "Sabrina Abbaci" },
  variant = "default", // "default" | "compact"
  align = "center",    // "left" | "center" | "right"
}) {
   // support image.src (imported) or image.base (string base without extension)
  const src = image.src || (image.base ? `${image.base}.png` : "/assets/header.png");
  const alt = image.alt || "Sabrina Abbaci";

  return (
    <header className={`header header--${variant} header--${align}`}>
      {/* simple PNG only — taille contrôlée via CSS (.header img) */}
      <img src={src} alt={alt} draggable="false" />
    </header>
  );
}
