import React from "react";
import "./ThreeSpans.css";

/**
 * ThreeSpans.jsx — composant de texte multi-paragraphes réutilisable
 *
 * Props :
 *  - texts (string[]) : tableau de paragraphes à afficher (obligatoire)
 *  - gap (string|number) : espace vertical entre les paragraphes (défaut "1.5rem")
 *  - paddingTop / paddingBottom (string|number) : marges internes haut/bas
 *  - maxWidth (string|number) : largeur max du bloc texte (défaut "90%")
 *  - color (string) : couleur du texte (CSS var ou code direct)
 *  - fontSize (string|number) : taille de police (ex: "1.125rem" ou 18)
 *  - weight (string|number) : poids de la police (ex: 400, 600, "bold")
 *  - align (string) : alignement du texte ("center" | "left" | "right")
 *  - className (string) : classes additionnelles
 */

export default function ThreeSpans({
  texts = [],
  gap = "1.5rem",
  paddingTop = "2rem",
  paddingBottom = "3rem",
  maxWidth = "90%",
  color = "var(--rose, #f19fd3)",
  fontSize = "1rem",
  weight = 400,
  align = "center",
  className = "",
}) {
  if (!Array.isArray(texts) || texts.length === 0) return null;

  return (
    <section
      className={`three-spans ${className}`}
      style={{
        "--three-gap": typeof gap === "number" ? `${gap}px` : gap,
        "--three-pt": typeof paddingTop === "number" ? `${paddingTop}px` : paddingTop,
        "--three-pb": typeof paddingBottom === "number" ? `${paddingBottom}px` : paddingBottom,
        "--three-max-width": typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        "--three-color": color,
        "--three-font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize,
        "--three-font-weight": weight,
        "--three-align": align,
      }}
      aria-label="Bloc de texte"
      role="region"
    >
      {texts.map((text, index) => (
        <p key={index} className="three-spans__paragraph">
          {text}
        </p>
      ))}
    </section>
  );
}
