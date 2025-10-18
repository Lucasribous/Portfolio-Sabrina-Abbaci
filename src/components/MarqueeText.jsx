import React from "react";
// correction : CSS component dans src/styles/components
import "../styles/components/MarqueeText.css";

/**
 * MarqueeText.jsx — composant de texte défilant réutilisable
 *
 * Props :
 *  - text (string) : texte à afficher
 *  - speed (number) : durée complète du cycle en secondes (défaut 30)
 *  - repeat (number) : nombre de répétitions du texte (défaut 4)
 *  - color (string) : couleur personnalisée (CSS var ou code direct)
 *  - weight (string|number) : poids de la police
 *  - size (string) : taille de la police (ex: "1.5rem" ou "text-xl")
 *  - gap (string|number) : espace horizontal entre les blocs
 *  - className (string) : classes additionnelles
 *
 * 💡 Design pensé pour :
 *  - être indépendant de Tailwind (utilisable dans d’autres contextes)
 *  - s’adapter via CSS variables (thèmes, responsive, etc.)
 */

export default function MarqueeText({
  text = "Défilement — ",
  speed = 30,
  repeat = 4,
  color = "var(--color-rose, #f19fd3)",
  weight = 700,
  size = "1.5rem",
  gap = "2rem",
  className = "",
}) {
  const repeatedText = Array.from({ length: Math.max(2, repeat) }).map((_, i) => (
    <span key={i} className="marquee__item">
      {text}
    </span>
  ));

  return (
    <div
      className={`marquee ${className}`}
      style={{
        "--marquee-color": color,
        "--marquee-speed": `${speed}s`,
        "--marquee-font-size": size,
        "--marquee-font-weight": weight,
        "--marquee-gap": gap,
      }}
      aria-label="Texte défilant"
    >
      <div className="marquee__track">
        {repeatedText}
        {repeatedText}
      </div>
    </div>
  );
}
